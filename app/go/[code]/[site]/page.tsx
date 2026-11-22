import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { getSite } from "@/lib/sites";
import { submitLead } from "./actions";

export const dynamic = "force-dynamic";

export default async function Landing({
  params,
  searchParams,
}: {
  params: { code: string; site: string };
  searchParams: { err?: string };
}) {
  const site = getSite(params.site);
  if (!site) notFound();

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
    <div className="wrap narrow">
      <div className="hero" style={{ background: site.color }}>
        <div style={{ opacity: 0.85, fontWeight: 700 }}>{site.name}</div>
        <h1>{site.headline}</h1>
        <p>{site.pitch}</p>
        <ul>
          {site.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <form action={submitLead} className="card">
        <input type="hidden" name="code" value={params.code} />
        <input type="hidden" name="site" value={site.key} />
        <h2 style={{ marginTop: 0 }}>Continua verso {site.name}</h2>
        <p className="muted">
          Inserisci la tua email: ci serve solo per riconoscere chi ti ha segnalato il sito. Poi ti portiamo subito sul sito.
          Usa la stessa email quando ti iscrivi o acquisti.
        </p>
        <label htmlFor="name">Nome (facoltativo)</label>
        <input id="name" name="name" autoComplete="name" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label style={{ fontWeight: 400, marginTop: 14 }}>
          <input type="checkbox" name="consent" required />
          Acconsento al trattamento di nome ed email per attribuire la segnalazione a chi mi ha inviato il sito. Leggi l'{" "}
          <Link href="/privacy" target="_blank">informativa privacy</Link>.
        </label>
        {searchParams.err === "email" && <p className="err">Inserisci un indirizzo email valido.</p>}
        {searchParams.err === "consenso" && <p className="err">Per continuare serve il consenso.</p>}
        <p style={{ marginTop: 16 }}>
          <button type="submit" style={{ background: site.color }}>Vai a {site.name}</button>
        </p>
      </form>
    </div>
  );
}
