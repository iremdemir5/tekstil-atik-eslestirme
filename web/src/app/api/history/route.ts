export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  return Response.json({
    sessions: [],
    total: 0,
    page: Number.isFinite(page) ? page : 1,
  });
}

