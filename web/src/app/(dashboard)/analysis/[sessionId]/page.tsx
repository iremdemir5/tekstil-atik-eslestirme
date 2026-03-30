"use client"

import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { TooltipContentProps, TooltipValueType } from "recharts"
import { ShieldCheck, Recycle, DatabaseZap, Leaf, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Props = {
  params: { sessionId: string }
}

type RecommendedUse = "insulation" | "yarn_recycling" | "filling_material"

type AnalysisData = {
  id: string
  status: string
  weight_kg: number
  city?: string | null
  polymer_composition: Record<string, number>
  r_value: number
  recycling_score: number
  polymer_purity_score: number
  recommended_use?: RecommendedUse
  carbon_saved_kg: number
  analysis_description?: string | null
  created_at?: string
}

const RECOMMENDED_USE_LABELS: Record<RecommendedUse, string> = {
  insulation: "Yalıtım (dolgu/kaplama)",
  yarn_recycling: "İplik Geri Dönüşümü",
  filling_material: "Dolgu Malzemesi",
}

function formatKg(value: number) {
  return `${value.toLocaleString("tr-TR")} kg`
}

function formatPercent(value: number) {
  return `${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}%`
}

type PolymerTooltipProps = Partial<TooltipContentProps<TooltipValueType, string>>

function PolymerTooltip({ active, payload }: PolymerTooltipProps) {
  if (!active || !payload?.length) return null

  const datum = payload[0]?.payload as { name?: string; percent?: number; kg?: number } | undefined
  const name = datum?.name ?? ""
  const percent = typeof datum?.percent === "number" ? datum.percent : 0
  const kg = typeof datum?.kg === "number" ? datum.kg : 0

  return (
    <div className="rounded-2xl border border-white/40 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-md">
      <div className="text-sm font-semibold text-foreground">{name}</div>
      <div className="mt-1 text-sm text-foreground/70">
        {formatPercent(percent)} • {formatKg(kg)}
      </div>
    </div>
  )
}

export default function AnalysisSessionPage({ params }: Props) {
  const router = useRouter()

  // API'den veri gelmesini beklemeden UI'yi hemen gerçekçi mock verilerle dolduruyoruz.
  const mockAnalysis = React.useMemo<AnalysisData>(() => {
    const sessionId = params.sessionId
    const weightKg = 500
    const polymer_composition: Record<string, number> = {
      cotton: 70,
      polyester: 20,
      other: 10,
    }

    const carbonSavedKg = Math.round(weightKg * 0.5 * 100) / 100
    const polymer_purity_score = Math.max(...Object.values(polymer_composition))

    return {
      id: sessionId,
      status: "completed",
      weight_kg: weightKg,
      city: "İstanbul",
      polymer_composition,
      r_value: 1.42,
      recycling_score: 82,
      polymer_purity_score,
      recommended_use: "yarn_recycling",
      carbon_saved_kg: carbonSavedKg,
      analysis_description:
        "Kompozisyonun yüksek pamuk oranı iplik geri dönüşümünü destekler. Polyester fraksiyonu da süreç verimini artırır. Bu karışım, kontrollü ayırma sonrası yeniden iplik üretiminde uygun görünmektedir.",
      created_at: new Date().toISOString(),
    }
  }, [params.sessionId])

  const [analysis, setAnalysis] = React.useState<AnalysisData>(mockAnalysis)
  const [isFetching, setIsFetching] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function run() {
      setIsFetching(true)
      setFetchError(null)

      try {
        const res = await fetch(`/api/analysis/${params.sessionId}`)
        if (!res.ok) {
          // Mock veriler ile devam edeceğiz.
          return
        }

        const data = (await res.json()) as Omit<AnalysisData, "id"> & { id: string }
        if (!isMounted) return

        setAnalysis(data)
      } catch {
        // Ağ yok / API hatası durumunda mock ile kalıyoruz.
        if (!isMounted) return
        setFetchError("Canlı analiz çekilemedi. Demo veriler gösteriliyor.")
      } finally {
        if (!isMounted) return
        setIsFetching(false)
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [params.sessionId])

  const compositionData = React.useMemo(() => {
    const total = analysis.weight_kg
    const entries = Object.entries(analysis.polymer_composition)

    // Recharts için sabit, profesyonel renk paleti.
    const palette: Record<string, string> = {
      cotton: "rgb(16 185 129)", // emerald-500
      polyester: "rgb(59 130 246)", // blue-500
      other: "rgb(148 163 184)", // slate-400
    }

    const nameMap: Record<string, string> = {
      cotton: "Pamuk",
      polyester: "Polyester",
      other: "Diğer",
    }

    // Total %100 değilse yine de kg'ye oranlayarak gerçekçi bir dağılım veriyoruz.
    const sumPercent = entries.reduce((acc, [, v]) => acc + (typeof v === "number" ? v : 0), 0) || 100

    return entries.map(([name, percent]) => {
      const p = typeof percent === "number" ? percent : 0
      const normalizedPercent = (p / sumPercent) * 100
      const kg = (total * normalizedPercent) / 100
      return {
        name: nameMap[name] ?? name[0].toUpperCase() + name.slice(1),
        percent: normalizedPercent,
        kg,
        color: palette[name] ?? "rgb(148 163 184)",
      }
    })
  }, [analysis.polymer_composition, analysis.weight_kg])

  const recommendedUseLabel = analysis.recommended_use
    ? RECOMMENDED_USE_LABELS[analysis.recommended_use]
    : "—"

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/50 bg-white/35 p-6 shadow-sm backdrop-blur-md">
        <div className="absolute inset-0 -z-10" />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-800">
              <DatabaseZap size={16} className="h-4 w-4" />
              AI Analiz Paneli
            </div>
            <h1 className="text-2xl font-semibold">Sonuçlar (Demo + Canlı Güncelleme)</h1>
            <p className="text-sm text-foreground/70">
              sessionId: <span className="font-mono">{params.sessionId}</span>
              {isFetching ? " • Canlı veri çekiliyor..." : null}
            </p>
            {fetchError ? <p className="mt-2 text-sm text-destructive">{fetchError}</p> : null}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-4 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:bg-white/15"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Yeni Analiz
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Polimer Oranları</h2>
                  <p className="mt-1 text-sm text-foreground/70">
                    Pasta grafik (oransal). Tooltip ile yüzde & kg detayları.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/10 px-3 py-2 text-right">
                  <div className="text-xs font-semibold text-foreground/70">R-value</div>
                  <div className="text-lg font-semibold text-foreground">{analysis.r_value.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-4">
              <div className="relative w-full" style={{ height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<PolymerTooltip />} />
                    <Pie
                      data={compositionData}
                      dataKey="percent"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={2}
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth={1}
                    >
                      {compositionData.map((entry) => (
                        <React.Fragment key={entry.name}>
                          <Cell fill={entry.color} />
                        </React.Fragment>
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-semibold text-foreground/70">Toplam Atık</div>
                  <div className="text-3xl font-semibold">{analysis.weight_kg.toFixed(0)}</div>
                  <div className="mt-0.5 text-sm text-foreground/70">kg</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {compositionData.map((d) => (
                  <div key={d.name} className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-3 py-2">
                    <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <div className="text-sm font-semibold text-foreground/90">{d.name}</div>
                    <div className="text-sm font-semibold text-foreground/60">{formatPercent(d.percent)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground/70">Güven Skoru</div>
                    <div className="mt-1 text-3xl font-semibold">{analysis.polymer_purity_score.toFixed(0)}</div>
                    <div className="mt-1 text-sm text-foreground/70">/ 100</div>
                  </div>
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground/70">Atık Miktarı</div>
                    <div className="mt-1 text-3xl font-semibold">{analysis.weight_kg.toFixed(0)}</div>
                    <div className="mt-1 text-sm text-foreground/70">kg</div>
                  </div>
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                    <Recycle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md sm:col-span-2">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground/70">Önerilen Kullanım Alanı</div>
                    <div className="mt-1 text-2xl font-semibold">{recommendedUseLabel}</div>
                    <div className="mt-2 text-sm text-foreground/70">
                      Bu öneri, polimer oranları ve geri dönüşüm/uygunluk metriklerine göre üretilir.
                    </div>
                  </div>
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-slate-600/10 text-slate-700">
                    <Leaf className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground/70">Karbon Kazancı</div>
                    <div className="mt-1 text-3xl font-semibold">
                      {analysis.carbon_saved_kg.toFixed(0)}
                    </div>
                    <div className="mt-1 text-sm text-foreground/70">kg CO2e</div>
                  </div>
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
                    <Recycle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-white/50 bg-white/15 shadow-sm backdrop-blur-md">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground/70">Geri Dönüşüm Skoru</div>
                    <div className="mt-1 text-3xl font-semibold">{analysis.recycling_score.toFixed(0)}</div>
                    <div className="mt-1 text-sm text-foreground/70">/ 100</div>
                  </div>
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-amber-600/10 text-amber-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Accordion type="single" collapsible className="rounded-3xl border border-white/40 bg-white/10 px-4 py-2">
              <AccordionItem value="composition">
                <AccordionTrigger>Detaylar: Polimer Dağılımı</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {compositionData.map((d) => (
                      <div
                        key={d.name}
                        className="rounded-2xl border border-white/30 bg-white/10 p-3"
                      >
                        <div className="text-sm font-semibold text-foreground">{d.name}</div>
                        <div className="mt-1 text-sm text-foreground/70">{formatPercent(d.percent)}</div>
                        <div className="mt-1 text-sm text-foreground/70">{formatKg(d.kg)}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="recommendation">
                <AccordionTrigger>Detaylar: Analiz Açıklaması</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-foreground/70">
                    {analysis.analysis_description ?? "—"}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

