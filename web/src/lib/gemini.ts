export type GeminiSimulatedAnalysis = {
  polymer_composition: Record<
    "cotton" | "polyester" | "nylon" | "acrylic" | "viscose" | "other",
    number
  >
  confidence: number
  analysis_description: string
  recommended_use: "insulation" | "yarn_recycling" | "filling_material"
}

export type GeminiVisionPolymerAnalysis = GeminiSimulatedAnalysis & {
  detected_items?: string[]
  notes?: string
}

function normalizeTo100(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  const scaled = values.map((v) => Math.round((v / total) * 100))
  const drift = 100 - scaled.reduce((a, b) => a + b, 0)
  scaled[0] = scaled[0] + drift
  return scaled
}

export async function simulateGeminiVisionAnalysis(images: File[]): Promise<GeminiSimulatedAnalysis> {
  // Şimdilik deterministik bir "demo" üretelim (gerçek Gemini çağrısı Faz 6).
  const [cotton, polyester, nylon, acrylic, viscose, other] = normalizeTo100([62, 23, 5, 3, 5, 2])

  const confidence = images.length >= 2 ? 82 : 78

  return {
    polymer_composition: {
      cotton,
      polyester,
      nylon,
      acrylic,
      viscose,
      other,
    },
    confidence,
    recommended_use: "insulation",
    analysis_description:
      "Görseldeki tekstil atığı pamuk ağırlıklı bir karışım gibi görünüyor. Yalıtım paneli hammaddesi olarak değerlendirilmeye uygun olabilir. Daha net ve iyi aydınlatılmış bir fotoğraf, analiz doğruluğunu artırır.",
  }
}

function extractFirstJsonObject(text: string) {
  const start = text.indexOf("{")
  if (start === -1) return null

  let depth = 0
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i]
    if (ch === "{") depth += 1
    if (ch === "}") depth -= 1
    if (depth === 0) return text.slice(start, i + 1)
  }

  return null
}

function coerceToAnalysis(value: unknown): GeminiVisionPolymerAnalysis | null {
  if (!value || typeof value !== "object") return null

  const obj = value as Record<string, unknown>
  const pc = obj.polymer_composition as Record<string, unknown> | undefined
  if (!pc || typeof pc !== "object") return null

  const requiredKeys = ["cotton", "polyester", "nylon", "acrylic", "viscose", "other"] as const
  const polymer_composition = Object.fromEntries(
    requiredKeys.map((k) => [k, typeof pc[k] === "number" ? pc[k] : 0]),
  ) as GeminiVisionPolymerAnalysis["polymer_composition"]

  const confidence = typeof obj.confidence === "number" ? obj.confidence : 0
  const analysis_description = typeof obj.analysis_description === "string" ? obj.analysis_description : ""
  const recommended_use =
    obj.recommended_use === "insulation" ||
    obj.recommended_use === "yarn_recycling" ||
    obj.recommended_use === "filling_material"
      ? obj.recommended_use
      : "insulation"

  const detected_items = Array.isArray(obj.detected_items)
    ? obj.detected_items.filter((x): x is string => typeof x === "string").slice(0, 12)
    : undefined

  const notes = typeof obj.notes === "string" ? obj.notes : undefined

  const normalized = normalizeTo100(requiredKeys.map((k) => polymer_composition[k]))
  const normalizedPc = Object.fromEntries(requiredKeys.map((k, i) => [k, normalized[i]])) as typeof polymer_composition

  return {
    polymer_composition: normalizedPc,
    confidence: Math.max(0, Math.min(100, Math.round(confidence))),
    analysis_description,
    recommended_use,
    detected_items,
    notes,
  }
}

export async function analyzeTextileWasteWithGeminiVision(params: {
  apiKey: string
  images: File[]
  context?: { weight_kg?: number | null; city?: string | null; district?: string | null }
  model?: string
}): Promise<GeminiVisionPolymerAnalysis> {
  const { apiKey, images, context } = params
  const primaryModel = params.model ?? "gemini-1.5-flash"
  const modelCandidates = [primaryModel, "gemini-1.5-pro"]
  const apiVersions: Array<"v1beta" | "v1"> = ["v1beta", "v1"]

  const prompt = [
    "Sen bir tekstil malzeme uzmanısın. Fotoğraflardaki tekstil atığının polimer/lif yapısını tahmin et.",
    "ÇIKTIYI SADECE JSON olarak ver. Markdown/fence kullanma. Ek açıklama yazma.",
    "Şema:",
    "{",
    '  "polymer_composition": { "cotton": number, "polyester": number, "nylon": number, "acrylic": number, "viscose": number, "other": number },',
    '  "confidence": number,',
    '  "analysis_description": string,',
    '  "recommended_use": "insulation" | "yarn_recycling" | "filling_material",',
    '  "detected_items"?: string[],',
    '  "notes"?: string',
    "}",
    "polymer_composition yüzdeleri toplamı 100 olacak şekilde ver.",
    context?.city || context?.district || typeof context?.weight_kg === "number"
      ? `Bağlam: weight_kg=${context?.weight_kg ?? "?"}, city=${context?.city ?? "?"}, district=${context?.district ?? "?"}`
      : "",
  ]
    .filter(Boolean)
    .join("\n")

  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }]

  for (const img of images) {
    const ab = await img.arrayBuffer()
    const data = Buffer.from(ab).toString("base64")
    parts.push({ inlineData: { mimeType: img.type || "image/jpeg", data } })
  }

  let lastError: unknown = null

  // Bazı modeller/anahtarlar `v1beta` altında bulunmayabiliyor (404).
  // Böyle durumda önce `v1` ile, sonra da alternatif model ile deniyoruz.
  for (const candidateModel of modelCandidates) {
    for (const apiVersion of apiVersions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${candidateModel}:generateContent?key=${encodeURIComponent(apiKey)}`

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 512,
              // v1 endpoint snake_case bekler.
              ...(apiVersion === "v1"
                ? { response_mime_type: "application/json" }
                : { responseMimeType: "application/json" }),
            },
          }),
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(`GEMINI_HTTP_${res.status}:${text.slice(0, 500)}`)
        }

        const payloadUnknown: unknown = await res.json()
        const textOut: string = (() => {
          const typed = payloadUnknown as {
            candidates?: Array<{
              content?: {
                parts?: unknown[]
              }
            }>
          }

          const parts = typed?.candidates?.[0]?.content?.parts ?? []
          const texts: string[] = []

          for (const part of parts) {
            if (
              part &&
              typeof part === "object" &&
              "text" in part &&
              typeof (part as { text?: unknown }).text === "string"
            ) {
              texts.push((part as { text: string }).text)
            }
          }

          return texts.join("\n")
        })()

        const direct = (() => {
          try {
            return JSON.parse(textOut)
          } catch {
            return null
          }
        })()

        const extracted = direct ?? (() => {
          const jsonText = extractFirstJsonObject(textOut)
          if (!jsonText) return null
          try {
            return JSON.parse(jsonText)
          } catch {
            return null
          }
        })()

        const coerced = coerceToAnalysis(extracted)
        if (!coerced) {
          throw new Error("GEMINI_PARSE_ERROR")
        }

        return coerced
      } catch (err) {
        lastError = err

        // 404'i yakalayıp diğer kombinasyonları denemeye devam ediyoruz.
        const message = err instanceof Error ? err.message : ""
        const isNotFound = message.includes("GEMINI_HTTP_404")
        if (!isNotFound) throw err
      }
    }
  }

  throw lastError ?? new Error("GEMINI_HTTP_FAILED")
}

