import { notFound } from "next/navigation";
import { db } from "@/lib/supabase";
import { SITES } from "@/lib/sites";
import { commissionCents, eur, maskEmail, saleStatus } from "@/lib/commission";

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
      <h1>Ciao {partner.name}</h1>
      <p className="muted">Il tuo compenso è del {Number(partner.commission_pct)}% su ogni vendita generata dai clienti che arrivano dai tuoi link. Il compenso matura 30 giorni dopo la vendita, se non c'è rimborso.</p>

      <div className="grid">
        <div className="card stat"><span className="muted">In attesa</span><b>{eur(tot("in attesa"))}</b></div>
        <div className="card stat"><span className="muted">Maturato da pagare</span><b>{eur(tot("maturata"))}</b></div>
        <div className="card stat"><span className="muted">Già pagato</span><b>{eur(tot("pagata"))}</b></div>
        <div className="card stat"><span className="muted">Vendite</span><b>{mine.filter((s) => saleStatus(s) !== "annullata").length}</b></div>
      </div>

      <h2>I tuoi link</h2>
      <div className="scroll">
        <table>
          <thead><tr><th>Sito</th><th>Link da condividere</th><th>Click</th><th>Email raccolte</th></tr></thead>
          <tbody>
            {perSite.map((s) => (
              <tr key={s.key}>
                <td>{s.name}</td>
                <td><code>{base}/go/{partner.code}/{s.key}</code></td>
                <td>{s.clicks}</td>
                <td>{s.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Vendite attribuite</h2>
      <div className="scroll">
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
      <div className="scroll">
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
      <p className="muted" style={{ marginTop: 20 }}>
        Nota: le vendite vengono collegate al tuo link tramite l'email che il cliente lascia nella pagina d'ingresso. Se un cliente usa
        un'email diversa, scrivici e verifichiamo l'attribuzione a mano.
      </p>
    </div>
  );
}
