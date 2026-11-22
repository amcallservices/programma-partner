export const PROMO_BUCKET = "promo";
export const MAX_BYTES = 500 * 1024 * 1024;
export const ALLOWED_MIME = [
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "video/mp4", "video/quicktime", "video/webm",
  "application/pdf",
];

export type PromoKind = "testo" | "immagine" | "video" | "file";

export function kindFromMime(mime: string | null | undefined): PromoKind {
  if (!mime) return "testo";
  if (mime.startsWith("image/")) return "immagine";
  if (mime.startsWith("video/")) return "video";
  return "file";
}

/** Sostituisce {LINK} con il link del partner; se manca il segnaposto, il link va in fondo. */
export function withLink(body: string | null | undefined, link: string): string {
  const t = (body ?? "").trim();
  if (!t) return link;
  return /\{LINK\}/i.test(t) ? t.replace(/\{LINK\}/gi, link) : `${t}\n\n${link}`;
}

export function safeFileName(name: string): string {
  const base = name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return (base || "file").slice(-80);
}

export function mb(bytes: number | null | undefined): string {
  if (!bytes) return "";
  return `${(bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0)} MB`;
}
