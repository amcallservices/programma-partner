import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { isBot } from "@/lib/bots";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { getSite, SITE_EN } from "@/lib/sites";
import { LANDING, pickLang } from "@/lib/i18n";
import LangSwitch from "../../../LangSwitch";

const COVER: Record<string, string> = { com: "#4f46c8" };
import { submitLead } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Landing({
  params,
  searchParams,
}: {
  params: { code: string; site: string };
  searchParams: { err?: string; lang?: string };
}) {
  const site = getSite(params.site);
  if (!site) notFound();

  const lang = pickLang(searchParams.lang, cookies().get("pp-lang")?.value);
  const L = LANDING[lang];
  const txt = lang === "en" ? SITE_EN[site.key] : site;
  const supa = db();
  const { data: partner } = await supa
    .from("partners")
    .select("id, active")
    .eq("code", params.code)
    .maybeSingle();
  if (!partner || !partner.active) notFound();

  // Registra il click (anche se poi il visitatore non lascia l'email), ma non quello delle anteprime
  // automatiche di WhatsApp, Facebook, Telegram e dei motori di ricerca.
  if (!isBot(headers().get("user-agent"))) {
    const { error } = await supa.from("clicks").insert({ partner_id: partner.id, site_key: site.key });
    if (error) console.error("[programma-partner] click non registrato:", error.message);
  }

  const color = COVER[site.key] ?? site.color;
  return (
    <div className="stage">
      {/* Il sito di destinazione si vede dietro, ma è inerte (non cliccabile né selezionabile): resta visibile solo il pop-up, che non si chiude. */}
      <div className="backdrop" aria-hidden="true" style={{ ["--c" as string]: color }}>
        <iframe
          src={site.key === "soft" ? `${site.url}?embed=true` : site.url}
          title=""
          tabIndex={-1}
          loading="eager"
          referrerPolicy="no-referrer"
          {...({ inert: "" } as object)}
        />
      </div>
      <form action={submitLead} className="pop" role="dialog" aria-modal="true" aria-labelledby="pop-title" style={{ ["--c" as string]: color }}>
        <input type="hidden" name="code" value={params.code} />
        <input type="hidden" name="site" value={site.key} />
        <input type="hidden" name="lang" value={lang} />
        <div className="pop-top">
          <span className="pop-site" style={{ color }}>{site.name}</span>
          <LangSwitch lang={lang} label={L.langLabel} />
        </div>
        <h1 id="pop-title">{L.continueTo(site.name)}</h1>
        <p className="pop-why">{L.why}</p>
        <label htmlFor="email" className="sr">{L.email}</label>
        <input id="email" name="email" type="email" required autoFocus autoComplete="email" placeholder={L.email} />
        <label className="check" style={{ marginTop: 14 }}>
          <input type="checkbox" name="consent" required />
          <span>
            {L.consent}
            <Link href={`/privacy?lang=${lang}`} target="_blank">{L.privacy}</Link>.
          </span>
        </label>
        {searchParams.err === "email" && <p className="notice bad" role="alert" style={{ marginTop: 12 }}>{L.errEmail}</p>}
        {searchParams.err === "salvataggio" && <p className="notice bad" role="alert" style={{ marginTop: 12 }}>{L.errSave}</p>}
        {searchParams.err === "consenso" && <p className="notice bad" role="alert" style={{ marginTop: 12 }}>{L.errConsent}</p>}
        <button type="submit" className="go" style={{ background: color, borderColor: color }}>{L.go(site.name)}</button>
      </form>
    </div>
  );
}
