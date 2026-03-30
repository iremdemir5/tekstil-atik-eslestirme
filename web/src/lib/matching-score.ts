type SessionInput = {
  weightKg: number;
  recommendedUse: string | null;
  latitude: number | null;
  longitude: number | null;
};

type BuyerInput = {
  acceptsRecommendedUses: string[];
  monthlyCapacityKg: number;
  minLotKg: number;
  maxLotKg: number | null;
  serviceRadiusKm: number;
  latitude: number | null;
  longitude: number | null;
  qualityScore: number;
  complianceScore: number;
  reliabilityScore: number;
  isVerified: boolean;
};

export type MatchBreakdown = {
  totalScore: number;
  distanceKm: number | null;
  materialScore: number;
  capacityScore: number;
  distanceScore: number;
  complianceScore: number;
  trustScore: number;
  reasons: string[];
};

const WEIGHTS = {
  material: 0.3,
  capacity: 0.25,
  distance: 0.2,
  compliance: 0.15,
  trust: 0.1,
} as const;

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function normalizeScore(value: number) {
  return clamp01(value / 100);
}

export function calculateMatchScore(session: SessionInput, buyer: BuyerInput): MatchBreakdown {
  const reasons: string[] = [];

  const materialScore =
    session.recommendedUse && buyer.acceptsRecommendedUses.includes(session.recommendedUse) ? 100 : 0;
  if (materialScore > 0) reasons.push("Tavsiye edilen kullanim alici profiliyle uyumlu.");
  else reasons.push("Tavsiye edilen kullanim alici profilinde tanimli degil.");

  const minLotPass = session.weightKg >= buyer.minLotKg;
  const maxLotPass = buyer.maxLotKg === null || session.weightKg <= buyer.maxLotKg;
  const monthlyRatio = clamp01(session.weightKg / Math.max(1, buyer.monthlyCapacityKg));
  const capacityScore = minLotPass && maxLotPass ? Math.round((1 - monthlyRatio) * 100) : 0;
  reasons.push(
    capacityScore > 0
      ? "Parti miktari alici kapasitesi icin uygun."
      : "Parti miktari minimum/maksimum kapasite kosullarini karsilamiyor.",
  );

  let distanceKm: number | null = null;
  let distanceScore = 40;
  if (
    session.latitude !== null &&
    session.longitude !== null &&
    buyer.latitude !== null &&
    buyer.longitude !== null
  ) {
    distanceKm = haversineKm(session.latitude, session.longitude, buyer.latitude, buyer.longitude);
    const radius = Math.max(1, buyer.serviceRadiusKm);
    const ratio = clamp01(distanceKm / radius);
    distanceScore = Math.round((1 - ratio) * 100);
    if (distanceKm <= radius) reasons.push("Lojistik mesafe servis yaricapi icinde.");
    else reasons.push("Lojistik mesafe servis yaricapinin disinda.");
  } else {
    reasons.push("Konum verisi eksik oldugu icin mesafe puani varsayilan degerden hesaplandi.");
  }

  const complianceBase = normalizeScore(buyer.complianceScore);
  const complianceMultiplier = buyer.isVerified ? 1 : 0.6;
  const complianceScore = Math.round(complianceBase * complianceMultiplier * 100);
  reasons.push(buyer.isVerified ? "Alici firma dogrulanmis durumda." : "Alici firma henuz tam dogrulanmamis.");

  const trustMean =
    (normalizeScore(buyer.qualityScore) + normalizeScore(buyer.reliabilityScore) + normalizeScore(buyer.complianceScore)) / 3;
  const trustScore = Math.round(trustMean * 100);

  const totalScore = Math.round(
    materialScore * WEIGHTS.material +
      capacityScore * WEIGHTS.capacity +
      distanceScore * WEIGHTS.distance +
      complianceScore * WEIGHTS.compliance +
      trustScore * WEIGHTS.trust,
  );

  return {
    totalScore,
    distanceKm: distanceKm === null ? null : Math.round(distanceKm * 100) / 100,
    materialScore,
    capacityScore,
    distanceScore,
    complianceScore,
    trustScore,
    reasons,
  };
}
