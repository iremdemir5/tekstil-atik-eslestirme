type Props = {
  params: { sessionId: string };
};

export default function MatchesSessionPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md">
        <h1 className="text-2xl font-semibold">Eşleşmeler</h1>
        <p className="mt-2 text-sm text-foreground/70">
          sessionId: <span className="font-mono">{params.sessionId}</span>
        </p>
        <p className="mt-4 text-sm text-foreground/70">
          Match listesi ve rota önizlemesi Faz 6’da eklenecek.
        </p>
      </div>
    </div>
  );
}

