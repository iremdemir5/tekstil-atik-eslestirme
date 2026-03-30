export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Nasıl çalışır?</h2>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Analizden eşleşmeye kadar akışı 3 adımda tamamlayın.
          </p>
        </div>
        <div className="hidden text-sm text-foreground/60 sm:block">
          50.000+ tekstil KOBİ’si için tasarlandı
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-emerald-700"
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
            <div className="text-lg font-semibold">1. Fotoğraf Yükle</div>
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            En fazla 3 açıdan yükleyerek polimer analizi için en iyi veriyi
            yakalayın.
          </p>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-amber-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 2l3.5 7H21l-6 5 2 8-5-3-5 3 2-8-6-5h5.5z" />
              </svg>
            </div>
            <div className="text-lg font-semibold">2. AI Analiz Eder</div>
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            Gemini Vision ile polimer kompozisyonu ve metrikler hesaplanır.
          </p>
        </div>

        <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-emerald-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="text-lg font-semibold">3. Fabrikayla Eşleş</div>
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            İhtiyaç profilleriyle skorlanıp doğru alıcılar listeye gelir.
          </p>
        </div>
      </div>
    </section>
  );
}

