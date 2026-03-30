export const revalidate = 60;

export async function GET() {
  // PRD’deki örnek landing page sayaç değerleri (şimdilik stub)
  return Response.json({
    total_waste_kg: 1247 * 1000,
    registered_buyers: 89,
    total_carbon_saved_kg: 3421,
  });
}

