"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { getSite } from "@/lib/sites";
import { normalizeEmail } from "@/lib/commission";

export async function submitLead(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const siteKey = String(formData.get("site") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const consent = formData.get("consent") === "on";
  const lang = String(formData.get("lang") ?? "") === "en" ? "en" : "it";
  const site = getSite(siteKey);

  if (!site) redirect("/");
  if (!email || !consent) {
    redirect(`/go/${encodeURIComponent(code)}/${siteKey}?err=${!email ? "email" : "consenso"}&lang=${lang}`);
  }

  const supa = db();
  const { data: partner } = await supa
    .from("partners")
    .select("id, active")
    .eq("code", code)
    .maybeSingle();

  if (partner?.active) {
    // Evita doppioni dello stesso contatto nelle ultime 24 ore.
    const dayAgo = new Date(Date.now() - 86400000).toISOString();
    const { data: dup } = await supa
      .from("leads")
      .select("id")
      .eq("partner_id", partner.id)
      .eq("email", email)
      .eq("site_key", siteKey)
      .gte("created_at", dayAgo)
      .limit(1);
    if (!dup || dup.length === 0) {
      await supa.from("leads").insert({
        partner_id: partner.id,
        site_key: siteKey,
        email,
        name: name || null,
        consent: true,
        consent_at: new Date().toISOString(),
      });
    }
  }
  redirect(site.url);
}
