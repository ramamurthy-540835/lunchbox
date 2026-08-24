import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { mealAudiencePrice, isMealAudience } from "@/lib/pricing";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json() as { items?: unknown; audience?: unknown; amount?: unknown; total?: unknown };
  const catalog = await getCatalog();
  if (!isMealAudience(body.audience) || !Array.isArray(body.items) || body.items.length === 0) return NextResponse.json({ error: "Choose a lunch plan and at least one delivery day." }, { status: 400 });
  let total = 0; const lines: Array<{ mealId: string; name: string; quantity: number; unitPriceInr: number; lineTotalInr: number }> = [];
  for (const raw of body.items) { const item = raw as { mealId?: unknown; quantity?: unknown }; const meal = catalog.meals.find((candidate) => candidate.id === item.mealId); const quantity = Number(item.quantity); if (!meal || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) return NextResponse.json({ error: "Choose valid delivery days and quantities." }, { status: 400 }); const unitPriceInr = mealAudiencePrice(body.audience); const lineTotalInr = unitPriceInr * quantity; total += lineTotalInr; lines.push({ mealId: meal.id, name: meal.name, quantity, unitPriceInr, lineTotalInr }); }
  return NextResponse.json({ lines, totalInr: total, totalPaise: total * 100 });
}
