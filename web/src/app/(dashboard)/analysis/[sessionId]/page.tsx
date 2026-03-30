type Props = {
  params: { sessionId: string };
};

export default function AnalysisSessionPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-semibold">AI Analiz Sonuçları</h1>
        <p className="mt-2 text-sm text-foreground/70">
          sessionId: <span className="font-mono">{params.sessionId}</span>
        </p>
        <p className="mt-4 text-sm text-foreground/70">
          Bu sayfa MVP iskeleti için placeholder’dır. Faz 6’da Recharts ve
          metrik kartları eklenecek.
        </p>
      </div>
    </div>
  );
}

