import { notFound } from "next/navigation";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import { commissionCents, eur, maskEmail, saleStatus } from "@/lib/commission";
import CopyButton from "../../CopyButton";
import Tour from "./Tour";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function PartnerPage({ params }: { params: { token: string } }) {
  const supa = db();
  const { data: partner } = await supa.from("partners").select("*").eq("token", params.token).maybeSingle();
  if (!partner) notFound();

  const [{ data: sales }, { data: leads }, { data: clicks }, { data: payouts }] = await Promise.all([
    supa.from("sales").select("*").eq("partner_id", partner.id).order("paid_at", { ascending: false }),
    supa.from("leads").select("id, site_key, email, created_at").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(200),
    supa.from("clicks").select("site_key").eq("partner_id", partner.id),
    supa.from("payouts").select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }),
  ]);

  const mine = sales ?? [];
  const tot = (st: string) => mine.filter((s) => saleStatus(s) === st).reduce((a, s) => a + commissionCents(s), 0);
  const base = (process.env.APP_URL || "").replace(/\/$/, "");
  const perSite = SITES.map((s) => ({
    ...s,
    clicks: (clicks ?? []).filter((c) => c.site_key === s.key).length,
    leads: (leads ?? []).filter((l) => l.site_key === s.key).length,
  }));

  return (
    <div className="wrap">
      <div className="helpbar">
        <h1>Ciao {partner.name}</h1>
        <Tour />
      </div>
      <p className="lead" style={{ marginTop: 10 }}>
        Il tuo compenso è del {Number(partner.commission_pct)}% su ogni vendita generata dai clienti che arrivano dai tuoi link. Matura 30 giorni dopo la vendita, se non c&apos;è rimborso.
      </p>

      <div className="grid" data-tour="stats" style={{ marginTop: 18 }}>
        <div className="card stat" style={{ ["--stat" as string]: "var(--lib)", margin: 0 }}><span>In attesa</span><b>{eur(tot("in attesa"))}</b><small>maturano entro 30 giorni</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--seo)", margin: 0 }}><span>Maturato da pagare</span><b>{eur(tot("maturata"))}</b><small>lo paghiamo a fine mese</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--soft)", margin: 0 }}><span>Già pagato</span><b>{eur(tot("pagata"))}</b></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--boost)", margin: 0 }}><span>Vendite</span><b>{mine.filter((s) => saleStatus(s) !== "annullata").length}</b></div>
      </div>

      <h2>I tuoi link</h2>
      <div className="card" data-tour="links" style={{ paddingTop: 8, paddingBottom: 8 }}>
        {perSite.map((s) => {
          const url = `${base}/go/${partner.code}/${s.key}`;
          return (
            <div className="linkrow" key={s.key} style={{ ["--c" as string]: s.color }}>
              <span className="dot" />
              <span className="nm">{s.name}<div className="muted" style={{ fontWeight: 400 }}>{s.clicks} click · {s.leads} email</div></span>
              <code>{url}</code>
              <CopyButton text={url} />
            </div>
          );
        })}
      </div>

      <div className="card flat" data-tour="how">
        <h3>Come colleghiamo le vendite a te</h3>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Chi apre il tuo link lascia la sua email e viene portato sul sito. Quando acquista con quella email, la vendita compare qui sotto.
          Se un cliente usa un&apos;email diversa, scrivici e controlliamo a mano.
        </p>
      </div>

      <h2>Vendite attribuite</h2>
      <div className="scroll" data-tour="sales">
        <table>
          <thead><tr><th>Data</th><th>Cliente</th><th>Descrizione</th><th>Compenso</th><th>Stato</th></tr></thead>
          <tbody>
            {mine.map((s) => {
              const st = saleStatus(s);
              return (
                <tr key={s.id}>
                  <td>{new Date(s.paid_at).toLocaleDateString("it-IT")}</td>
                  <td>{maskEmail(s.email)}</td>
                  <td>{s.description ?? "—"}</td>
                  <td>{eur(commissionCents(s))}</td>
                  <td><span className={`pill ${st === "in attesa" ? "attesa" : st}`}>{st}</span></td>
                </tr>
              );
            })}
            {mine.length === 0 && <tr><td colSpan={5} className="muted">Ancora nessuna vendita.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>Pagamenti ricevuti</h2>
      <div className="scroll" data-tour="payouts">
        <table>
          <thead><tr><th>Periodo</th><th>Importo</th><th>Stato</th></tr></thead>
          <tbody>
            {(payouts ?? []).map((x) => (
              <tr key={x.id}><td>{x.period}</td><td>{eur(x.amount_cents, x.currency)}</td><td>{x.status.replace("_", " ")}{x.paid_at ? ` il ${new Date(x.paid_at).toLocaleDateString("it-IT")}` : ""}</td></tr>
            ))}
            {(payouts ?? []).length === 0 && <tr><td colSpan={3} className="muted">Nessun pagamento ancora.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
