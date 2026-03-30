export async function POST() {
  return new Response(
    JSON.stringify({
      error: "NOT_IMPLEMENTED",
      message: "Teklif gönderme endpoint’i Faz 6’da eklenecek.",
    }),
    { status: 501, headers: { "Content-Type": "application/json" } },
  );
}

