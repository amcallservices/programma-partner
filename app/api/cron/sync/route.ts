import { NextResponse } from "next/server";
import { syncStripe } from "@/lib/sync";
import { safeEqual } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Chiamata automaticamente da Vercel Cron (vedi vercel.json).
// Vercel invia l'intestazione "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "non autorizzato" }, { status: 401 });
  }
  const result = await syncStripe(45);
  return NextResponse.json(result);
}
