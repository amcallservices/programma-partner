"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { getSite } from "@/lib/sites";
import { ALLOWED_MIME, MAX_BYTES, PROMO_BUCKET, kindFromMime, safeFileName } from "@/lib/promo";

/** Passo 1 del caricamento: un indirizzo temporaneo con cui il browser invia il file direttamente allo spazio file. */
export async function prepareUpload(input: { siteKey: string; fileName: string; mime: string; size: number }) {
  requireAdmin();
  if (!getSite(input.siteKey)) return { error: "Sito non valido." };
  if (!ALLOWED_MIME.includes(input.mime)) return { error: "Formato non ammesso. Usa PNG, JPG, WebP, GIF, MP4, MOV, WebM o PDF." };
  if (input.size > MAX_BYTES) return { error: "Il file supera 500 MB." };
  const path = `${input.siteKey}/${randomUUID()}-${safeFileName(input.fileName)}`;
  const { data, error } = await db().storage.from(PROMO_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { error: "Non riesco a preparare il caricamento." };
  return { path, signedUrl: data.signedUrl };
}

/** Passo 2: salva la scheda (testo e/o file già caricato). */
export async function createItem(input: {
  siteKey: string; lang: string; title: string; body: string;
  file?: { path: string; name: string; mime: string; size: number } | null;
}) {
  requireAdmin();
  const title = input.title.trim().slice(0, 140);
  const body = input.body.trim().slice(0, 8000);
  if (!getSite(input.siteKey)) return { error: "Sito non valido." };
  if (!title) return { error: "Scrivi un titolo." };
  if (!input.file && !body) return { error: "Aggiungi un testo o un file." };
  if (input.file && !input.file.path.startsWith(`${input.siteKey}/`)) return { error: "File non valido." };
  const { error } = await db().from("promo_items").insert({
    site_key: input.siteKey,
    lang: input.lang === "en" ? "en" : "it",
    kind: input.file ? kindFromMime(input.file.mime) : "testo",
    title,
    body: body || null,
    file_path: input.file?.path ?? null,
    file_name: input.file?.name ?? null,
    mime: input.file?.mime ?? null,
    size_bytes: input.file?.size ?? null,
  });
  if (error) return { error: "Salvataggio non riuscito." };
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function updateItem(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 140);
  const body = String(formData.get("body") ?? "").trim().slice(0, 8000);
  const lang = String(formData.get("lang") ?? "it") === "en" ? "en" : "it";
  if (!id || !title) redirect("/admin/media?err=titolo");
  await db().from("promo_items").update({ title, body: body || null, lang }).eq("id", id);
  redirect("/admin/media?ok=salvato");
}

export async function deleteItem(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const supa = db();
  const { data: it } = await supa.from("promo_items").select("file_path").eq("id", id).maybeSingle();
  if (it?.file_path) await supa.storage.from(PROMO_BUCKET).remove([it.file_path]);
  await supa.from("promo_items").delete().eq("id", id);
  redirect("/admin/media?ok=eliminato");
}
