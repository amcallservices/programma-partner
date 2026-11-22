import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/supabase";
import { SITES, TIPS } from "@/lib/sites";
import { commissionCents, saleStatus } from "@/lib/commission";
import { PANEL, dateFmt, money, pickLang } from "@/lib/i18n";
import LangSwitch from "../../LangSwitch";
import CopyButton from "../../CopyButton";
import Tour from "./Tour";
import NoCopyLink from "./NoCopyLink";
import Gallery, { type GItem } from "./Gallery";
import { PROMO_BUCKET, withLink, mb } from "@/lib/promo";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function PartnerPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { lang?: string };
}) {
  const lang = pickLang(searchParams.lang, cookies().get("pp-lang")?.value);
  const T = PANEL[lang];
  const eur = (c: number, cur = "eur") => money(c, cur, lang);
  const supa = db();
  const { data: partner } = await supa.from("partners").select("*").eq("token", params.token).maybeSingle();
  if (!partner) notFound();

  const [{ data: sales }, { data: leads }, { data: clicks }, { data: payouts }, { data: promo }] = await Promise.all([
    supa.from("sales").select("*").eq("partner_id", partner.id).order("paid_at", { ascending: false }),
    supa.from("leads").select("id, site_key, email, created_at").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(200),
    supa.from("clicks").select("site_key").eq("partner_id", partner.id),
    supa.from("payouts").select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }),
    supa.from("promo_items").select("*").order("created_at", { ascending: false }),
  ]);

  const mine = sales ?? [];
  const tot = (st: string) => mine.filter((s) => saleStatus(s) === st).reduce((a, s) => a + commissionCents(s), 0);
  const buyers = new Set(mine.filter((s) => saleStatus(s) !== "annullata" && s.email).map((s) => String(s.email).toLowerCase()));
  const base = (process.env.APP_URL || "").replace(/\/$/, "");
  const perSite = SITES.map((s) => ({
    ...s,
    clicks: (clicks ?? []).filter((c) => c.site_key === s.key).length,
    leads: (leads ?? []).filter((l) => l.site_key === s.key).length,
  }));

  return (
    <div className="wrap">
      <div className="helpbar">
        <h1>{T.hello(partner.name)}</h1>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <LangSwitch lang={lang} label={T.langLabel} />
          <a className="btn wa" data-tour="wa" href={`https://wa.me/393282693777?text=${encodeURIComponent(T.waMsg(partner.name))}`} target="_blank" rel="noopener noreferrer">{T.waLabel}</a>
          <Tour steps={T.steps} ui={T.tourUi} label={T.tour} />
        </div>
      </div>
      <section className="welcome-hl">
        <b>{T.welcomeSlogan}</b>
        <p>{T.welcomeText}</p>
      </section>
      <p className="lead" style={{ marginTop: 10 }}>{T.intro(Number(partner.commission_pct))}</p>

      <div className="grid" data-tour="stats" style={{ marginTop: 18 }}>
        <div className="card stat" style={{ ["--stat" as string]: "var(--lib)", margin: 0 }}><span>{T.stats.pending}</span><b>{eur(tot("in attesa"))}</b><small>{T.stats.pendingNote}</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--seo)", margin: 0 }}><span>{T.stats.vested}</span><b>{eur(tot("maturata"))}</b><small>{T.stats.vestedNote}</small></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--soft)", margin: 0 }}><span>{T.stats.paid}</span><b>{eur(tot("pagata"))}</b></div>
        <div className="card stat" style={{ ["--stat" as string]: "var(--boost)", margin: 0 }}><span>{T.stats.sales}</span><b>{mine.filter((s) => saleStatus(s) !== "annullata").length}</b></div>
      </div>

      <h2>{T.links}</h2>
      <div className="card" data-tour="links" style={{ paddingTop: 8, paddingBottom: 8 }}>
        {perSite.map((s) => {
          const url = `${base}/go/${partner.code}/${s.key}`;
          return (
            <div className="linkrow" key={s.key} style={{ ["--c" as string]: s.color }}>
              <span className="dot" />
              <span className="nm">{s.name}<div className="muted" style={{ fontWeight: 400 }}>{T.clicksEmails(s.clicks, s.leads)}</div></span>
              <code>{url}</code>
              <CopyButton text={url} label={T.copy} doneLabel={T.copied} />
            </div>
          );
        })}
      </div>

      <aside className="how-hl" data-tour="how" role="note">
        <span className="how-ic" aria-hidden="true">i</span>
        <div>
          <h3>{T.howTitle}</h3>
          <p>{T.howText}</p>
        </div>
      </aside>

      <h2>{T.mediaTitle}</h2>
      <p className="muted" style={{ margin: "0 0 12px" }}>{T.mediaIntro}</p>
      <div data-tour="media">
        <nav className="media-jump" aria-label={T.mediaTitle}>
          {SITES.map((s) => {
            const n = (promo ?? []).filter((i) => i.site_key === s.key && i.lang === lang).length;
            return <a key={s.key} href={`#media-${s.key}`} style={{ ["--c" as string]: s.color }}><i />{s.name}<b>{n}</b></a>;
          })}
        </nav>
        {perSite.map((s) => {
          const link = `${base}/go/${partner.code}/${s.key}`;
          const list = (promo ?? []).filter((i) => i.site_key === s.key && i.lang === lang);
          const pub = (p: string) => supa.storage.from(PROMO_BUCKET).getPublicUrl(p).data.publicUrl;
          const gitems: GItem[] = list.map((i) => {
            const file = i.file_path ? pub(i.file_path) : null;
            return {
              id: i.id, title: i.title, kind: i.kind, fileUrl: file,
              dl: file ? `${file}?download=${encodeURIComponent(i.file_name ?? "file")}` : null,
              fileName: i.file_name ?? null, size: mb(i.size_bytes),
              text: i.body ? withLink(i.body, link) : null, link,
            };
          });
          return (
            <section className="msite" id={`media-${s.key}`} key={s.key} style={{ ["--c" as string]: s.color }}>
              <header className="msite-head"><h3>{s.name}</h3><span>{list.length}</span></header>
              {list.length === 0 ? <p className="muted msite-empty">{T.mediaEmpty}</p> : (
                <Gallery items={gitems} labels={{ download: T.mediaDownload, copyText: T.mediaCopyText, copyLink: T.mediaCopyLink, copied: T.copied, textOnly: T.mediaTextOnly, close: T.mediaClose, description: T.mediaRead }} />
              )}
            </section>
          );
        })}
      </div>

      <h2>{T.tipsTitle}</h2>
      <p className="muted" style={{ margin: "0 0 12px" }}>{T.tipsIntro}</p>
      <div className="tips" data-tour="tips">
        {SITES.map((s) => {
          const t = TIPS[lang][s.key];
          return (
            <details className="tip" key={s.key} style={{ ["--c" as string]: s.color }}>
              <summary><i />{s.name}</summary>
              <div className="tip-body">
                <p><b>{T.tipsFor}:</b> {t.who}</p>
                <p className="tip-link"><b>{T.tipsLink}:</b>{" "}<NoCopyLink href={`${base}/go/${partner.code}/${s.key}`}>{T.tipsOpen} {s.name}</NoCopyLink></p>
                <ul>{t.ideas.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </details>
          );
        })}
      </div>

      <h2>{T.contactsTitle} ({(leads ?? []).length})</h2>
      <p className="muted" style={{ margin: "0 0 10px" }}>{T.contactsIntro}</p>
      <div className="scroll" data-tour="contacts">
        <table>
          <thead><tr>{T.contactsCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id}>
                <td>{dateFmt(l.created_at, lang)}</td>
                <td>{SITES.find((x) => x.key === l.site_key)?.name ?? l.site_key}</td>
                <td>{l.email}</td>
                <td>{buyers.has(String(l.email).toLowerCase()) ? T.contactsBought.yes : T.contactsBought.no}</td>
              </tr>
            ))}
            {(leads ?? []).length === 0 && <tr><td colSpan={4} className="muted">{T.contactsEmpty}</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>{T.salesTitle}</h2>
      <div className="scroll" data-tour="sales">
        <table>
          <thead><tr>{T.salesCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {mine.map((s) => {
              const st = saleStatus(s);
              return (
                <tr key={s.id}>
                  <td>{dateFmt(s.paid_at, lang)}</td>
                  <td>{s.email ?? "—"}</td>
                  <td>{s.description ?? "—"}</td>
                  <td>{eur(commissionCents(s))}</td>
                  <td><span className={`pill ${st === "in attesa" ? "attesa" : st}`}>{T.statusLabel[st] ?? st}</span></td>
                </tr>
              );
            })}
            {mine.length === 0 && <tr><td colSpan={5} className="muted">{T.salesEmpty}</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>{T.payoutsTitle}</h2>
      <div className="scroll" data-tour="payouts">
        <table>
          <thead><tr>{T.payoutsCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {(payouts ?? []).map((x) => (
              <tr key={x.id}>
                <td>{x.period}</td>
                <td>{eur(x.amount_cents, x.currency)}</td>
                <td>{T.payoutStatus(x.status === "pagato" ? "pagato" : "da_pagare", x.paid_at ? dateFmt(x.paid_at, lang) : null)}</td>
              </tr>
            ))}
            {(payouts ?? []).length === 0 && <tr><td colSpan={3} className="muted">{T.payoutsEmpty}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
