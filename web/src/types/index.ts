export type PolymerComposition = Record<string, number>;

export type GeminiAnalysis = {
  polymer_composition: PolymerComposition;
  confidence?: number;
  primary_polymer?: string;
  texture_description?: string;
  analysis_description?: string;
  recommended_use?: "insulation" | "yarn_recycling" | "filling_material";
  quality_notes?: string | null;
};

export type user_role = "producer" | "buyer" | "admin";
export type deal_status = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

