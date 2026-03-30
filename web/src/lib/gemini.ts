export type GeminiSimulatedAnalysis = {
  polymer_composition: Record<
    "cotton" | "polyester" | "nylon" | "acrylic" | "viscose" | "other",
    number
  >
  confidence: number
  analysis_description: string
  recommended_use: "insulation" | "yarn_recycling" | "filling_material"
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

