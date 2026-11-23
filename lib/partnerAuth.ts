import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const TTL_S = 60 * 60 * 24 * 30; // 30 giorni

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET mancante o troppo corto (min 16 caratteri)");
  return s;
}

export const MIN_PW = 8;

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const h = scryptSync(pw, salt, 32).toString("hex");
  return `s1$${salt}$${h}`;
}

export function verifyPassword(pw: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [v, salt, h] = stored.split("$");
  if (v !== "s1" || !salt || !h) return false;
  const a = Buffer.from(scryptSync(pw, salt, 32).toString("hex"));
  const b = Buffer.from(h);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Password casuale leggibile (senza caratteri ambigui come 0/O, 1/l/I). */
export function generatePassword(len = 12): string {
  const abc = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += abc[bytes[i] % abc.length];
  return out;
}

export function cookieName(token: string): string {
  return `pps_${token.slice(0, 16)}`;
}

function proof(partner: { id: string; pw_hash: string | null }): string {
  // Cambiando la password cambia pw_hash, quindi le sessioni aperte decadono.
  return createHmac("sha256", secret()).update(`${partner.id}:${partner.pw_hash}`).digest("hex");
}

export function openPartnerSession(partner: { id: string; token: string; pw_hash: string | null }): void {
  cookies().set(cookieName(partner.token), proof(partner), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/p/${partner.token}`,
    maxAge: TTL_S,
  });
}

export function isPartnerUnlocked(partner: { id: string; token: string; pw_hash: string | null }): boolean {
  if (!partner.pw_hash) return false;
  const v = cookies().get(cookieName(partner.token))?.value;
  if (!v) return false;
  const p = proof(partner);
  const a = Buffer.from(v);
  const b = Buffer.from(p);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Controllo IBAN (formato + modulo 97). Restituisce l'IBAN normalizzato o null. */
export function normalizeIban(raw: string): string | null {
  const s = raw.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return null;
  const moved = s.slice(4) + s.slice(0, 4);
  let rem = 0;
  for (const ch of moved) {
    const v = ch >= "A" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of v) rem = (rem * 10 + Number(d)) % 97;
  }
  return rem === 1 ? s : null;
}
