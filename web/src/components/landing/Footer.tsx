export default function Footer() {
  return (
    <footer className="border-t border-white/40 bg-white/30 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-foreground/70">
            © {new Date().getFullYear()} Tekstil Atık Eşleştirme
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Hakkımızda
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              KVKK
            </a>
            <a
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              İletişim
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

