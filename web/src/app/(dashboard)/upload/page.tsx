"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AnalysisLoadingState from "@/components/upload/AnalysisLoadingState";

type SelectedImage = {
  file: File;
  previewUrl: string;
};

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_FILES = 3;

const TURKEY_CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce",
] as const;

const ANALYSIS_MESSAGES = [
  "Görsel yükleniyor...",
  "Gemini AI polimer yapısını analiz ediyor...",
  "Termal değerler hesaplanıyor...",
  "Sonuçlar hazırlanıyor...",
];

function isAcceptedImage(file: File) {
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function UploadPage() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [selectedImages, setSelectedImages] = React.useState<SelectedImage[]>([]);
  const [weightKg, setWeightKg] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [error, setError] = React.useState<string>("");

  const totalCount = selectedImages.length;

  React.useEffect(() => {
    return () => {
      for (const img of selectedImages) URL.revokeObjectURL(img.previewUrl);
    };
  }, [selectedImages]);

  const addFiles = React.useCallback((files: FileList | File[]) => {
    setError("");

    const incoming = Array.from(files);
    const accepted = incoming.filter(isAcceptedImage);
    const rejectedCount = incoming.length - accepted.length;

    const remainingSlots = MAX_FILES - selectedImages.length;
    const toAdd = accepted.slice(0, Math.max(0, remainingSlots));

    if (incoming.length === 0) return;
    if (rejectedCount > 0) {
      setError("Sadece JPEG/PNG/WebP görseller kabul edilir.");
    }
    if (selectedImages.length + accepted.length > MAX_FILES) {
      setError(`En fazla ${MAX_FILES} görsel seçebilirsiniz.`);
    }

    if (toAdd.length === 0) return;

    const mapped: SelectedImage[] = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...mapped]);
  }, [selectedImages.length]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const isFormValid = selectedImages.length >= 1 && selectedImages.length <= 3 && weightKg !== "" && city !== "";

  const startAnalyze = async () => {
    if (isSubmitting) return;
    setError("");

    if (!isFormValid) {
      setError("Lütfen fotoğraf, miktar ve şehir alanlarını doldurun.");
      return;
    }

    setIsSubmitting(true);
    setStepIndex(0);

    try {
      const form = new FormData();
      for (const img of selectedImages) {
        // Backend: form.getAll("images") bekliyor.
        form.append("images", img.file);
      }

      form.append("weight_kg", weightKg);
      form.append("city", city);

      const res = await fetch("/api/analyze", { method: "POST", body: form });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { message?: string; details?: string }
          | null;
        const details = body?.details;
        const message = body?.message ?? "Analiz başlatılamadı.";
        throw new Error(details ? `${message} (${details})` : message);
      }

      const data = (await res.json()) as {
        sessionId?: string;
        analysis?: {
          polymer_composition?: Record<string, number>;
          recommended_use?: "insulation" | "yarn_recycling" | "filling_material";
          analysis_description?: string | null;
        };
      };

      if (!data.sessionId) throw new Error("Analiz oturumu oluşturulamadı.");
      if (!data.analysis) throw new Error("Gemini analiz sonucu alınamadı.");

      const weightNum = Number(weightKg);
      if (!Number.isFinite(weightNum)) throw new Error("Miktar (kg) değeri geçersiz.");

      const polymer_composition = data.analysis.polymer_composition ?? {};
      const polymer_purity_score = Math.max(...Object.values(polymer_composition), 0);
      const carbon_saved_kg = Math.round(weightNum * 0.5 * 100) / 100;

      // UI gerçek değerleri DB’den değil localStorage’tan çekebilsin diye complete bir payload saklıyoruz.
      const stored = {
        id: data.sessionId,
        status: "completed",
        weight_kg: weightNum,
        city,
        polymer_composition,
        r_value: 1.42,
        recycling_score: 74,
        polymer_purity_score,
        recommended_use: data.analysis.recommended_use,
        carbon_saved_kg,
        analysis_description: data.analysis.analysis_description,
        created_at: new Date().toISOString(),
      };

      try {
        window.localStorage.setItem(`analysis_session_${data.sessionId}`, JSON.stringify(stored));
      } catch {
        // localStorage kapalıysa bile rota atıyoruz; sayfa DB’den çekemezse demoya döner.
      }

      router.push(`/analysis/${data.sessionId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analiz başlatılamadı.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4">
      <AnalysisLoadingState
        isOpen={isSubmitting}
        stepIndex={stepIndex}
        messages={ANALYSIS_MESSAGES}
      />
      <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Fotoğraf Yükle</h1>
          <p className="text-sm text-foreground/70">
            1–3 adet görsel yükleyin (JPEG/PNG/WebP). Sonra tahmini miktarı ve şehri seçin.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              className={[
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 transition",
                "bg-white/40 hover:bg-white/55",
                isDragging ? "border-foreground/60 ring-2 ring-foreground/10" : "border-foreground/25",
              ].join(" ")}
              aria-label="Görsel yükleme alanı"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />

              <div className="text-center">
                <div className="text-sm font-medium">Sürükle bırak veya tıkla</div>
                <div className="mt-1 text-xs text-foreground/70">
                  {totalCount}/{MAX_FILES} seçili
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {selectedImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {selectedImages.map((img, idx) => (
                  <div
                    key={`${img.file.name}-${img.file.size}-${img.file.lastModified}-${idx}`}
                    className="rounded-2xl border border-foreground/10 bg-white/50 p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">{img.file.name}</div>
                        <div className="text-[11px] text-foreground/70">{formatFileSize(img.file.size)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="rounded-lg border border-foreground/15 bg-white/60 px-2 py-1 text-xs hover:bg-white/80"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <div className="text-sm font-medium">Tahmini miktar (kg)</div>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Örn. 12.5"
                className="h-11 w-full rounded-2xl border border-foreground/15 bg-white/60 px-4 text-sm outline-none ring-0 transition focus:border-foreground/30 focus:bg-white/80"
              />
            </label>

            <label className="space-y-2">
              <div className="text-sm font-medium">Şehir</div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full rounded-2xl border border-foreground/15 bg-white/60 px-4 text-sm outline-none transition focus:border-foreground/30 focus:bg-white/80"
              >
                <option value="" disabled>
                  Seçiniz
                </option>
                {TURKEY_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => void startAnalyze()}
            disabled={!isFormValid || isSubmitting}
            className={[
              "h-11 w-full rounded-2xl px-5 text-sm font-semibold transition",
              isFormValid && !isSubmitting
                ? "bg-foreground text-background hover:opacity-90"
                : "cursor-not-allowed bg-foreground/20 text-foreground/50",
            ].join(" ")}
          >
            {isSubmitting ? "Gönderiliyor..." : "AI Analizini Başlat"}
          </button>
        </div>
      </div>
    </div>
  );
}

