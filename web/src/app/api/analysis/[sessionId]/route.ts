export async function GET(
  _request: Request,
  context: { params: { sessionId: string } },
) {
  const { sessionId } = context.params;
  return Response.json({
    id: sessionId,
    status: "pending",
    weight_kg: 0,
    city: "—",
    polymer_composition: {},
    r_value: 0,
    recycling_score: 0,
    polymer_purity_score: 0,
    recommended_use: "insulation",
    carbon_saved_kg: 0,
    analysis_description: "MVP iskelet placeholder.",
    created_at: new Date().toISOString(),
  });
}

