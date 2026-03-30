export async function GET(
  _request: Request,
  context: { params: { sessionId: string } },
) {
  void context;
  return Response.json({ matches: [] });
}

