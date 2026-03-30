import { createSupabaseAdminClient } from "@/lib/supabase"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: { sessionId: string } },
) {
  const { sessionId } = context.params
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from("analysis_sessions")
    .select(
      // Not: `polymer_composition` kolonu bazı DB şemalarında olmayabiliyor.
      // Bu yüzden `gemini_raw_response` içinden türetmeye çalışıyoruz.
      "id,status,weight_kg,city,r_value,recycling_score,polymer_purity_score,recommended_use,carbon_saved_kg,analysis_description,created_at,gemini_raw_response",
    )
    .eq("id", sessionId)
    .maybeSingle()

  if (error) {
    const details =
      process.env.NODE_ENV === "development" ? (error as Error).message : undefined
    return new Response(
      JSON.stringify({
        error: "INTERNAL_ERROR",
        message: "Analiz yüklenemedi.",
        ...(details ? { details } : {}),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: "NOT_FOUND", message: "Analiz bulunamadı." }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    )
  }

  const geminiRaw = data.gemini_raw_response as
    | { polymer_composition?: Record<string, number>; polymer_purity_score?: number; recommended_use?: string }
    | null

  const polymer_composition = geminiRaw?.polymer_composition ?? {}
  const polymer_purity_score =
    typeof data.polymer_purity_score === "number"
      ? data.polymer_purity_score
      : Math.max(...Object.values(polymer_composition))

  return Response.json({
    ...data,
    polymer_composition,
    polymer_purity_score,
  })
}

