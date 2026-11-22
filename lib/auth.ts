import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 giorni

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET mancante o troppo corto (min 16 caratteri)");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkLogin(email: string, password: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPw) return false;
  // Si confrontano sempre entrambi i valori, per non rivelare quale dei due è sbagliato.
  const okEmail = safeEqual(email.trim().toLowerCase(), adminEmail);
  const okPw = safeEqual(password, adminPw);
  return okEmail && okPw;
}

export function createSession(): void {
  const exp = String(Date.now() + TTL_MS);
  cookies().set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export function destroySession(): void {
  cookies().delete(COOKIE);
}

export function isAdmin(): boolean {
  const v = cookies().get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

export function requireAdmin(): void {
  if (!isAdmin()) redirect("/admin/login");
}
