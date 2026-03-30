import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
              aria-label="Tekstil Atık Eşleştirme ana sayfa"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-8.72 6.5" />
                  <polyline points="3 3 3 10 10 10" />
                  <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 8.72-6.5" />
                  <polyline points="21 21 21 14 14 14" />
                </svg>
              </span>
              <span className="text-sm sm:text-base">Tekstil Atık Eşleştirme</span>
            </Link>

            <nav className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium border border-emerald-600/25 hover:bg-emerald-50 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Kayıt Ol
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

