"use client"

import * as React from "react"
import { Loader2, Leaf } from "lucide-react"

export type AnalysisLoadingStateProps = {
  isOpen: boolean
  stepIndex: number
  messages: string[]
}

export default function AnalysisLoadingState({
  isOpen,
  stepIndex,
  messages,
}: AnalysisLoadingStateProps) {
  const safeMessages = messages.length > 0 ? messages : ["Analiz başlatılıyor..."]
  const clampedIndex = Math.min(
    Math.max(stepIndex, 0),
    safeMessages.length - 1
  )
  const progressPct =
    safeMessages.length <= 1
      ? 20
      : Math.round((clampedIndex / (safeMessages.length - 1)) * 100)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-xl rounded-3xl border border-white/40 bg-white/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15">
            <Leaf size={24} className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">AI analizi sürüyor...</h2>
              <Loader2 size={20} className="h-5 w-5 animate-spin text-emerald-700" />
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              {safeMessages[clampedIndex]}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-foreground/60">
            <span>Demo ilerleme</span>
            <span>{progressPct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
