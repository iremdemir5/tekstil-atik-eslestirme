"use client"

import * as React from "react"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import DropZone from "@/features/analysis/components/DropZone"
import AnalysisLoadingState from "@/features/analysis/components/AnalysisLoadingState"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

console.log("Dashboard yüklendi")

const ANALYSIS_MESSAGES = [
  "Görsel yükleniyor...",
  "Gemini AI polimer yapısını analiz ediyor...",
  "Termal değerler hesaplanıyor...",
  "Sonuçlar hazırlanıyor...",
]

export default function AtikUploadDashboard() {
  const router = useRouter()
  const [files, setFiles] = React.useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [isDemoResultReady, setIsDemoResultReady] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const reset = () => {
    if (isAnalyzing) return
    setFiles([])
    setStepIndex(0)
    setIsDemoResultReady(false)
    setErrorMessage(null)
  }

  const startAnalysis = async () => {
    if (isAnalyzing) return
    if (files.length === 0) {
      setErrorMessage("Lütfen en az 1 görsel yükleyin.")
      return
    }

    setIsDemoResultReady(false)
    setErrorMessage(null)
    setIsAnalyzing(true)
    setStepIndex(0)

    try {
      const form = new FormData()
      for (const file of files) {
        form.append("images", file)
      }

      // Bu eski dashboard ekranında şehir/miktar girişi yok.
      // Backend konteksti için sabit değerler kullanıyoruz.
      form.append("weight_kg", "100")
      form.append("city", "İstanbul")

      const res = await fetch("/api/analyze", { method: "POST", body: form })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string; details?: string } | null
        const details = body?.details
        const message = body?.message ?? "Analiz başlatılamadı."
        throw new Error(details ? `${message} (${details})` : message)
      }

      const data = (await res.json()) as {
        sessionId?: string
        analysis?: {
          polymer_composition?: Record<string, number>
          recommended_use?: "insulation" | "yarn_recycling" | "filling_material"
          analysis_description?: string | null
        }
      }

      if (!data.sessionId) throw new Error("Analiz oturumu oluşturulamadı.")
      if (!data.analysis) throw new Error("Gemini analiz sonucu alınamadı.")

      const weightNum = 100
      const polymer_composition = data.analysis.polymer_composition ?? {}
      const polymer_purity_score = Math.max(...Object.values(polymer_composition), 0)
      const carbon_saved_kg = Math.round(weightNum * 0.5 * 100) / 100

      const stored = {
        id: data.sessionId,
        status: "completed",
        weight_kg: weightNum,
        city: "İstanbul",
        polymer_composition,
        r_value: 1.42,
        recycling_score: 74,
        polymer_purity_score,
        recommended_use: data.analysis.recommended_use,
        carbon_saved_kg,
        analysis_description: data.analysis.analysis_description,
        created_at: new Date().toISOString(),
      }

      try {
        window.localStorage.setItem(`analysis_session_${data.sessionId}`, JSON.stringify(stored))
      } catch {
        // localStorage kapalıysa bile sayfaya yönlendiriyoruz.
      }

      router.push(`/analysis/${data.sessionId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analiz başlatılamadı."
      setErrorMessage(message)
      setIsDemoResultReady(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/50 bg-white/35 p-6 shadow-sm backdrop-blur-md">
        <div className="absolute inset-0 -z-10">
          <div className="heroGradient h-full w-full" />
          <div className="heroTexture h-full w-full" />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-800">
              <Sparkles size={16} className="h-4 w-4" />
              Dashboard
            </div>
            <h1 className="text-2xl font-semibold">Atık Fotoğraflarınızı Yükleyin</h1>
            <p className="text-sm text-foreground/70">
              Yüklenen görseller (şimdilik demo) analiz ediliyor. Ardından panelde
              sonuç hazırlığı simüle edilecek.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <Card className="rounded-3xl border-white/40 bg-white/20 shadow-sm backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Yükleme Kuralları</CardTitle>
                <CardDescription>
                  PRD’ye uygun format ve limitlerle çalışır.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/80">
                <div className="rounded-2xl border border-white/30 bg-white/15 p-3">
                  <div className="font-medium">Kabul edilen formatlar</div>
                  <div className="mt-1 text-foreground/70">JPEG, PNG, WebP</div>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/15 p-3">
                  <div className="font-medium">Maksimum görsel</div>
                  <div className="mt-1 text-foreground/70">En fazla 3 fotoğraf</div>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/15 p-3">
                  <div className="font-medium">Boyut limiti</div>
                  <div className="mt-1 text-foreground/70">Her biri 10 MB</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-8">
          <Card className="rounded-3xl border-white/50 bg-white/25 p-4 shadow-sm backdrop-blur-md">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-lg">Sürükle-Bırak Upload</CardTitle>
              <CardDescription>
                Önizleme görünür. Analizi başlatınca demo yükleme durumu
                ekranda belirecek.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DropZone value={files} onChange={setFiles} disabled={isAnalyzing} />

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    console.log('"AI Analizini Başlat" tıklandı')
                    void startAnalysis()
                  }}
                  className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="mr-2 h-4 w-4 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    "AI Analizini Başlat"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  disabled={isAnalyzing || (files.length === 0 && !isDemoResultReady)}
                  className="h-11 rounded-xl border-white/40 bg-white/10 text-sm"
                >
                  Sıfırla
                </Button>
              </div>
            </CardContent>
          </Card>

          {isDemoResultReady && (
            <div className="mt-6 rounded-3xl border border-white/40 bg-white/20 p-5 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Analiz Tamamlandı</h2>
                  <p className="mt-1 text-sm text-foreground/70">
                    Bu aşamada Gemini entegrasyonu simüle edilerek sonuçlar Supabase’e kaydedildi.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={reset}
                  variant="secondary"
                  className="mt-3 h-11 rounded-xl sm:mt-0"
                >
                  Yeni yükleme
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/40 bg-white/20 p-5 shadow-sm backdrop-blur-md">
              <h2 className="text-sm font-semibold text-foreground/90">
                Sonraki adım (taslak)
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Gerçek entegrasyonda görseller Supabase Storage’a yüklenip
                `/api/analyze` ile Gemini Vision çağrılacak; ardından
                `/analysis/[sessionId]` sayfasında sonuçlar görüntülenecek.
              </p>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/20 p-5 shadow-sm backdrop-blur-md">
              <h2 className="text-sm font-semibold text-foreground/90">
                Neler gösteriliyor?
              </h2>
              <div className="mt-2 space-y-2 text-sm text-foreground/70">
                <div>• Dosya format/limitleri</div>
                <div>• Thumbnail önizleme</div>
                <div>• Demo loading state (2 sn mesaj değişimi)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnalysisLoadingState
        isOpen={isAnalyzing}
        stepIndex={stepIndex}
        messages={ANALYSIS_MESSAGES}
      />
    </div>
  )
}
