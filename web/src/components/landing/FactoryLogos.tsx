const LOGOS: { name: string; color: string }[] = [
  { name: "Anadolu Yalıtım", color: "text-emerald-700" },
  { name: "Kuzey İzolasyon", color: "text-emerald-800" },
  { name: "Ege Yalıtım", color: "text-emerald-700" },
  { name: "Marma İzolasyon", color: "text-emerald-800" },
  { name: "Trakya Fiber", color: "text-emerald-700" },
  { name: "İplik Geri Dönüşüm A.Ş.", color: "text-emerald-800" },
  { name: "Kömürsüz Dolgu", color: "text-emerald-700" },
];

export default function FactoryLogos() {
  // Not: Şimdilik placeholder. PRD’ye göre buyer tablosundan show_on_landing = true çekilecek.
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="text-xl font-semibold text-foreground/90">
        Platformdaki Alıcılar
      </h2>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-sm backdrop-blur-md">
        <div className="py-6">
          <div className="marqueeTrack px-6" aria-hidden>
            {items.map((l, idx) => (
              <div
                key={`${l.name}-${idx}`}
                className="mx-6 inline-flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                  <svg
                    className={`h-5 w-5 ${l.color}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M3 12l2-2 4 4 12-12 2 2-14 14-6-6z" />
                  </svg>
                </div>
                <div className="whitespace-nowrap text-sm font-semibold text-foreground/80">
                  {l.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

