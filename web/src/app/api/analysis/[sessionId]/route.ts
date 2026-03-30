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
      "id,status,weight_kg,city,polymer_composition,r_value,recycling_score,polymer_purity_score,recommended_use,carbon_saved_kg,analysis_description,created_at",
    )
    .eq("id", sessionId)
    .maybeSingle()

  if (error) {
    return new Response(
      JSON.stringify({ error: "INTERNAL_ERROR", message: "Analiz yüklenemedi." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: "NOT_FOUND", message: "Analiz bulunamadı." }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    )
  }

  return Response.json(data)
}

