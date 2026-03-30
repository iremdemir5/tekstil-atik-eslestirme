import { calculateMatchScore } from "@/lib/matching-score";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

type SessionRow = {
  id: string;
  weight_kg: number | null;
  recommended_use: string | null;
  latitude: number | null;
  longitude: number | null;
};

type BuyerProfileRow = {
  company_id: string;
  accepted_materials: string[] | null;
  accepts_recommended_uses: string[] | null;
  monthly_capacity_kg: number | null;
  min_lot_kg: number | null;
  max_lot_kg: number | null;
  service_radius_km: number | null;
  quality_score: number | null;
  compliance_score: number | null;
  reliability_score: number | null;
  is_verified: boolean | null;
  companies: {
    id: string;
    legal_name: string;
    city: string | null;
    is_active: boolean | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

export async function GET(_request: Request, context: { params: { sessionId: string } }) {
  const { sessionId } = context.params;
  const supabase = createSupabaseAdminClient();

  const sessionQuery = await supabase
    .from("analysis_sessions")
    .select("id,weight_kg,recommended_use,latitude,longitude")
    .eq("id", sessionId)
    .maybeSingle<SessionRow>();

  if (sessionQuery.error) {
    return new Response(
      JSON.stringify({ error: "INTERNAL_ERROR", message: "Analiz oturumu okunamadi.", details: sessionQuery.error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!sessionQuery.data) {
    return new Response(JSON.stringify({ error: "NOT_FOUND", message: "Analiz oturumu bulunamadi." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buyersQuery = await supabase
    .from("buyer_profiles")
    .select(
      "company_id,accepted_materials,accepts_recommended_uses,monthly_capacity_kg,min_lot_kg,max_lot_kg,service_radius_km,quality_score,compliance_score,reliability_score,is_verified,companies(id,legal_name,city,is_active,latitude,longitude)",
    )
    .returns<BuyerProfileRow[]>();

  if (buyersQuery.error) {
    return new Response(
      JSON.stringify({
        error: "SCHEMA_NOT_READY",
        message: "Alici firma tablolari hazir degil veya okunamiyor.",
        details: buyersQuery.error.message,
      }),
      { status: 501, headers: { "Content-Type": "application/json" } },
    );
  }

  const session = sessionQuery.data;
  const buyers = buyersQuery.data ?? [];

  const scoredMatches = buyers
    .filter((buyer) => buyer.companies?.is_active !== false)
    .map((buyer) => {
      const breakdown = calculateMatchScore(
        {
          weightKg: session.weight_kg ?? 0,
          recommendedUse: session.recommended_use,
          latitude: session.latitude,
          longitude: session.longitude,
        },
        {
          acceptsRecommendedUses: buyer.accepts_recommended_uses ?? [],
          monthlyCapacityKg: buyer.monthly_capacity_kg ?? 0,
          minLotKg: buyer.min_lot_kg ?? 0,
          maxLotKg: buyer.max_lot_kg,
          serviceRadiusKm: buyer.service_radius_km ?? 50,
          latitude: buyer.companies?.latitude ?? null,
          longitude: buyer.companies?.longitude ?? null,
          qualityScore: buyer.quality_score ?? 50,
          complianceScore: buyer.compliance_score ?? 50,
          reliabilityScore: buyer.reliability_score ?? 50,
          isVerified: buyer.is_verified ?? false,
        },
      );

      return {
        company_id: buyer.company_id,
        company_name: buyer.companies?.legal_name ?? "Isimsiz Firma",
        city: buyer.companies?.city ?? null,
        ...breakdown,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  return Response.json({
    session_id: session.id,
    matches: scoredMatches,
  });
}

