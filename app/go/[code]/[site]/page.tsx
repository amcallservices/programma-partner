import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { getSite, SITE_EN } from "@/lib/sites";
import { LANDING, pickLang } from "@/lib/i18n";
import LangSwitch from "../../../LangSwitch";
import Glow from "../../../Glow";

const COVER: Record<string, string> = { com: "#4f46c8" };
const LIGHT: Record<string, string> = { seo: "#2dd4bf", soft: "#60a5fa", lib: "#fb923c", com: "#a5a0ff", boost: "#c4b5fd" };
import { submitLead } from "./actions";

export const dynamic = "force-dynamic";

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

  // Registra il click (anche se poi il visitatore non lascia l'email).
  await supa.from("clicks").insert({ partner_id: partner.id, site_key: site.key });

  return (
    <div className="stage">
    <div className="backdrop" aria-hidden="true" style={{ ["--c" as string]: COVER[site.key] ?? site.color }}>
      <iframe
        src={site.key === "soft" ? `${site.url}?embed=true` : site.url}
        title=""
        tabIndex={-1}
        loading="eager"
        referrerPolicy="no-referrer"
        {...({ inert: "" } as object)}
      />
    </div>
    <Glow />
    <div className="entry" data-glow style={{ ["--c" as string]: COVER[site.key] ?? site.color, ["--glow" as string]: LIGHT[site.key] }}>
      <div className="entry-top"><span className="entry-brand">Self Publishing</span><LangSwitch lang={lang} label={L.langLabel} /></div>
      <div className="book">
        <div className="name">{site.name}</div>
        <h1>{txt.headline}</h1>
        <p>{txt.pitch}</p>
        <ul>
          {txt.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <form action={submitLead} className="card" style={{ margin: 0 }}>
        <input type="hidden" name="code" value={params.code} />
        <input type="hidden" name="site" value={site.key} />
        <input type="hidden" name="lang" value={lang} />
        <h2 style={{ margin: 0, fontSize: 24 }}>{L.continueTo(site.name)}</h2>
        <p className="muted" style={{ marginTop: 8 }}>{L.intro}</p>
        <label htmlFor="name">{L.name}</label>
        <input id="name" name="name" autoComplete="name" />
        <label htmlFor="email">{L.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label className="check" style={{ marginTop: 16 }}>
          <input type="checkbox" name="consent" required />
          <span>
            {L.consent}
            <Link href={`/privacy?lang=${lang}`} target="_blank">{L.privacy}</Link>.
          </span>
        </label>
        {searchParams.err === "email" && <p className="notice bad" role="alert" style={{ marginTop: 14 }}>{L.errEmail}</p>}
        {searchParams.err === "consenso" && <p className="notice bad" role="alert" style={{ marginTop: 14 }}>{L.errConsent}</p>}
        <p style={{ marginTop: 18, marginBottom: 0 }}>
          <button type="submit" className="go" style={{ background: COVER[site.key] ?? site.color, borderColor: COVER[site.key] ?? site.color }}>{L.go(site.name)}</button>
        </p>
      </form>

      <ol className="flow" aria-label={L.flowLabel}>
        <li><b>1</b> {L.flow[0]}</li>
        <li><b>2</b> {L.flow[1]}</li>
        <li className="note">{L.note}</li>
      </ol>
    </div>
    </div>
  );
}
