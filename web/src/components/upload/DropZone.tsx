"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const MIN_FILE_SIZE_BYTES = 50 * 1024 // 50 KB
const DEFAULT_MAX_FILES = 3

export type DropZoneFileErrorCode =
  | "INVALID_TYPE"
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"

export type DropZoneProps = {
  value: File[]
  onChange: (next: File[]) => void
  disabled?: boolean
  maxFiles?: number
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = bytes / 1024
  return `${kb.toFixed(0)} KB`
}

export default function DropZone({
  value,
  onChange,
  disabled = false,
  maxFiles = DEFAULT_MAX_FILES,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<DropZoneFileErrorCode | null>(null)
  const [errorDetail, setErrorDetail] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const previewUrls = React.useMemo(() => {
    return value.map((f) => URL.createObjectURL(f))
  }, [value])

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const setFilesFromIncoming = (incoming: File[]) => {
    if (disabled) return

    const remaining = Math.max(0, maxFiles - value.length)
    if (remaining === 0) {
      setError("TOO_MANY_FILES")
      setErrorDetail(`Maksimum ${maxFiles} fotoğraf yükleyebilirsiniz.`)
      return
    }

    // Kullanıcı aynı anda daha fazla dosya getirse bile, kalan kapasite kadar kabul ediyoruz.
    const trimmed = incoming.slice(0, remaining)

    for (const file of trimmed) {
      if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
        setError("INVALID_TYPE")
        setErrorDetail("Sadece JPEG, PNG ve WebP formatları kabul edilir.")
        return
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError("FILE_TOO_LARGE")
        setErrorDetail(`Görsel boyutu en fazla 10 MB olmalı. (Seçilen: ${formatBytes(file.size)})`)
        return
      }

      if (file.size < MIN_FILE_SIZE_BYTES) {
        setError("FILE_TOO_SMALL")
        setErrorDetail(`Görsel çok küçük. En az 50 KB olmalıdır. (Seçilen: ${formatBytes(file.size)})`)
        return
      }
    }

    setError(null)
    setErrorDetail(null)
    onChange([...value, ...trimmed])
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const fileList = Array.from(e.dataTransfer.files || [])
    if (fileList.length > 0) setFilesFromIncoming(fileList)
  }

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || [])
    if (fileList.length > 0) setFilesFromIncoming(fileList)
    // Aynı dosyayı tekrar seçebilmek için input'u resetliyoruz
    e.target.value = ""
  }

  const errorText =
    errorDetail ??
    (error === "TOO_MANY_FILES"
      ? `Maksimum ${maxFiles} fotoğraf yükleyebilirsiniz.`
      : error === "INVALID_TYPE"
        ? "Sadece JPEG, PNG ve WebP formatları kabul edilir."
        : error === "FILE_TOO_LARGE"
          ? "Görsel boyutu en fazla 10 MB olmalı."
          : error === "FILE_TOO_SMALL"
            ? "Görsel çok küçük. En az 50 KB olmalıdır."
            : null)

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative rounded-3xl border-2 border-dashed p-6 transition-colors",
          disabled
            ? "cursor-not-allowed border-white/20 bg-white/10"
            : isDragging
              ? "border-emerald-600/60 bg-emerald-600/10"
              : "border-white/40 bg-white/25 hover:bg-white/35"
        )}
        onDragEnter={() => !disabled && setIsDragging(true)}
        onDragOver={(e) => {
          if (disabled) return
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label="Tekstil atık görseli yükleme alanı"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/15">
            <UploadCloud size={24} className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              {isDragging ? "Bırakın" : "Sürükle-Bırak veya Seçin"}
            </h3>
            <p className="text-sm text-foreground/70">
              {`JPEG, PNG, WebP • Maks. ${maxFiles} görsel • Her biri 10 MB`}
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={onPickFiles}
          disabled={disabled}
        />

        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              inputRef.current?.click()
            }}
            className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Fotoğraf Seç
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Önizleme</div>
            <div className="text-sm text-foreground/70">
              {value.length}/{maxFiles}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {value.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrls[idx]}
                  alt={`${file.name} önizleme`}
                  className="aspect-square h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  disabled={disabled}
                  aria-label="Fotoğrafı kaldır"
                >
                  <X size={16} className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorText && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorText}
        </div>
      )}
    </div>
  )
}

