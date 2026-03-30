export async function GET() {
  return new Response(
    JSON.stringify({
      error: "NOT_IMPLEMENTED",
      message:
        "Supabase auth proxy/entegrasyonu Faz 3'te eklenecek.",
    }),
    { status: 501, headers: { "Content-Type": "application/json" } },
  );
}

