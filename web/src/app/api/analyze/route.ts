import { createSupabaseAdminClient } from "@/lib/supabase"
import { analyzeTextileWasteWithGeminiVision } from "@/lib/gemini"

export const runtime = "nodejs"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const MIN_FILE_SIZE_BYTES = 50 * 1024 // 50KB

function jsonError(
  status: number,
  payload: { error: string; message: string },
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function parseNumber(value: FormDataEntryValue | null) {
  if (!value) return null
  const num = typeof value === "string" ? Number(value) : Number.NaN
  return Number.isFinite(num) ? num : null
}

async function ensureDemoProducerId(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  const email = "demo@local"

  const existing = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existing.error) throw existing.error
  if (existing.data?.id) return existing.data.id as string

  const authId = crypto.randomUUID()
  const inserted = await supabase
    .from("users")
    .insert({
      auth_id: authId,
      email,
      role: "producer",
      status: "active",
      company_name: "Demo Üretici",
      city: "İstanbul",
      district: "Kadıköy",
      latitude: 40.9919,
      longitude: 29.0287,
    })
    .select("id")
    .single()

  if (inserted.error) throw inserted.error
  return inserted.data.id as string
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient()
  const apiKey = process.env.GEMINI_API_KEY

  let sessionId: string | null = null

  try {
    if (!apiKey) {
      return jsonError(500, {
        error: "MISSING_GEMINI_API_KEY",
        message: "GEMINI_API_KEY bulunamadı. .env.local dosyanızı kontrol edin.",
      })
    }

    const form = await request.formData()

    const images = form.getAll("images").filter((v): v is File => v instanceof File)
    const fallbackImage = form.get("image")
    const normalizedImages =
      images.length > 0
        ? images
        : fallbackImage instanceof File
          ? [fallbackImage]
          : []

    if (normalizedImages.length === 0) {
      return jsonError(400, {
        error: "NO_IMAGES",
        message: "En az bir fotoğraf yükleyin.",
      })
    }

    if (normalizedImages.length > 3) {
      return jsonError(400, {
        error: "TOO_MANY_FILES",
        message: "En fazla 3 fotoğraf yükleyebilirsiniz.",
      })
    }

    for (const file of normalizedImages) {
      if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
        return jsonError(400, {
          error: "INVALID_FILE_TYPE",
          message: "Sadece JPEG, PNG ve WebP desteklenir",
        })
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return jsonError(400, {
          error: "FILE_TOO_LARGE",
          message: "Maksimum dosya boyutu 10 MB'dır",
        })
      }
      if (file.size < MIN_FILE_SIZE_BYTES) {
        return jsonError(400, {
          error: "FILE_TOO_SMALL",
          message: "Görsel en az 50 KB olmalıdır",
        })
      }
    }

    const weightKg = parseNumber(form.get("weight_kg")) ?? 100
    const city = (form.get("city") as string | null) ?? "İstanbul"
    const district = (form.get("district") as string | null) ?? "Kadıköy"
    const latitude = parseNumber(form.get("latitude")) ?? 40.9919
    const longitude = parseNumber(form.get("longitude")) ?? 29.0287

    const producerId = await ensureDemoProducerId(supabase)

    sessionId = crypto.randomUUID()
    const imagePaths: string[] = []

    for (let i = 0; i < normalizedImages.length; i += 1) {
      const file = normalizedImages[i]
      const ext =
        file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
      const path = `uploads/demo/${sessionId}/image_${i + 1}.${ext}`

      const uploaded = await supabase.storage
        .from("waste-images")
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploaded.error) {
        return jsonError(500, {
          error: "STORAGE_UPLOAD_FAILED",
          message: "Görsel yüklenemedi. Lütfen tekrar deneyin.",
        })
      }

      imagePaths.push(path)
    }

    const created = await supabase
      .from("analysis_sessions")
      .insert({
        id: sessionId,
        producer_id: producerId,
        weight_kg: weightKg,
        city,
        district,
        latitude,
        longitude,
        image_paths: imagePaths,
        status: "processing",
        processing_started_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (created.error) {
      return jsonError(500, {
        error: "DB_INSERT_FAILED",
        message: "Analiz kaydı oluşturulamadı. Lütfen tekrar deneyin.",
      })
    }

    const gemini = await analyzeTextileWasteWithGeminiVision({
      apiKey,
      images: normalizedImages,
      context: { weight_kg: weightKg, city, district },
      model: "gemini-1.5-flash",
    })

    // MVP: temel skor/hesaplar (gerçek hesaplama Faz 6 — lib/carbon.ts ile)
    const rValue = 1.42
    const thermalConductivity = 0.035
    const recyclingScore = 74
    const polymerPurityScore = Math.max(...Object.values(gemini.polymer_composition))
    const carbonSavedKg = Math.round(weightKg * 0.5 * 100) / 100

    const updated = await supabase
      .from("analysis_sessions")
      .update({
        status: "completed",
        gemini_raw_response: gemini,
        polymer_composition: gemini.polymer_composition,
        r_value: rValue,
        thermal_conductivity: thermalConductivity,
        recycling_score: recyclingScore,
        polymer_purity_score: polymerPurityScore,
        recommended_use: gemini.recommended_use,
        carbon_saved_kg: carbonSavedKg,
        analysis_description: gemini.analysis_description,
        processing_finished_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    if (updated.error) {
      return jsonError(500, {
        error: "DB_UPDATE_FAILED",
        message: "Analiz sonucu kaydedilemedi. Lütfen tekrar deneyin.",
      })
    }

    return Response.json({ sessionId, status: "completed", analysis: gemini })
  } catch {
    if (sessionId) {
      // En iyi çaba: session oluşturulduysa fail'e çek.
      await supabase
        .from("analysis_sessions")
        .update({ status: "failed", error_message: "INTERNAL_ERROR" })
        .eq("id", sessionId)
    }

    return jsonError(500, {
      error: "INTERNAL_ERROR",
      message: "Bir hata oluştu, lütfen tekrar deneyin",
    })
  }
}

