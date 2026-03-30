"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEMO_AUTH_FLAG_KEY = "tae_demo_authed";

export default function HeroSection() {
  const router = useRouter();

  const onStartFreeAnalysis = React.useCallback(() => {
    const isAuthed =
      typeof window !== "undefined" &&
      window.localStorage?.getItem(DEMO_AUTH_FLAG_KEY) === "1";

    router.push(isAuthed ? "/upload" : "/register");
  }, [router]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 heroGradient" aria-hidden />
      <div className="absolute inset-0 -z-9 heroTexture" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:pt-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-4 py-2 text-sm shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span>AI destekli eşleştirme</span>
            </div>

            <h1 className="mt-6 whitespace-pre-line text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Tekstil Atığınızı
              <br />
              Sürdürülebilir Değere Dönüştürün
            </h1>

            <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-foreground/80 sm:text-lg">
              AI destekli analiz ile kumaş kırpıntılarınızın polimer yapısını
              öğrenin, sizi bekleyen fabrikalara anında ulaşın.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStartFreeAnalysis}
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Ücretsiz Analiz Başlat
              </button>

              <Link
                href="#how"
                className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-600/25 bg-white/40 px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/60"
              >
                Nasıl çalışır?
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/70">
              <div className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                1-3 fotoğraf ile analiz
              </div>
              <div className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 17l-5 2 1-6-4-4 6-1 2-5 2 5 6 1-4 4 1 6-5-2Z" />
                </svg>
                Karbon etkisi hesaplaması
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 hidden h-24 w-24 rounded-3xl bg-emerald-500/15 blur-2xl lg:block" />
            <div className="rounded-3xl border border-white/50 bg-white/40 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground/80">
                  Hızlı Başlangıç
                </div>
                <div className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  MVP
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/50 p-4">
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-emerald-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Fotoğraf yükle</div>
                    <div className="text-sm text-foreground/70">
                      JPEG, PNG veya WebP.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/50 p-4">
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-amber-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 2 9 9l-7 3 7 3 3 8 3-8 7-3-7-3-3-7Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      AI polimer analizi
                    </div>
                    <div className="text-sm text-foreground/70">
                      Güven skoru + metrikler.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/50 p-4">
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-sky-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10.81 19.8 19.8 0 0 1 0 2.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72 12.2 12.2 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 10 10l1.27-1.27a2 2 0 0 1 2.11-.45 12.2 12.2 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      Fabrikalarla eşleş
                    </div>
                    <div className="text-sm text-foreground/70">
                      Rota + teklif akışı.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-foreground/60">
                Not: Bu sayfa ilk iskelet için hazırlandı. Auth, API ve
                istatistikler daha sonra bağlanacak.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

