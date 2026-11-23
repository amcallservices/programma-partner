import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/lib/supabase";
import { PANEL, PROFILE, dateFmt, pickLang } from "@/lib/i18n";
import { isPartnerUnlocked } from "@/lib/partnerAuth";
import LangSwitch from "../../../LangSwitch";
import Gate from "../Gate";
import { partnerLogout, saveProfile } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ProfilePage({ params, searchParams }: { params: { token: string }; searchParams: { lang?: string; err?: string; saved?: string } }) {
  const lang = pickLang(searchParams.lang, cookies().get("pp-lang")?.value);
  const supa = db();
  const { data: partner } = await supa.from("partners").select("id, token, name, pw_hash").eq("token", params.token).maybeSingle();
  if (!partner) notFound();
  if (!isPartnerUnlocked(partner)) return <Gate token={partner.token} lang={lang} hasPw={!!partner.pw_hash} next="profilo" err={searchParams.err} />;

  const P = PROFILE[lang];
  const { data: pr } = await supa.from("partner_profiles").select("*").eq("partner_id", partner.id).maybeSingle();
  const q = lang === "en" ? "?lang=en" : "";

  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <div className="helpbar">
        <Link href={`/p/${partner.token}${q}`}>{P.back}</Link>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <LangSwitch lang={lang} label={PANEL[lang].langLabel} />
          <form action={partnerLogout} style={{ display: "inline" }}>
            <input type="hidden" name="token" value={partner.token} />
            <input type="hidden" name="lang" value={lang} />
            <button type="submit" className="ghost small">{P.logout}</button>
          </form>
        </div>
      </div>
      <h1>{P.title}</h1>
      <p className="lead">{P.intro}</p>
      {searchParams.saved && <p className="notice" role="status">{P.saved}</p>}
      {searchParams.err && <p className="notice bad" role="alert">{P.errors[searchParams.err] ?? P.errors.save}</p>}

      <form action={saveProfile} className="card" data-tour="profile-form">
        <input type="hidden" name="token" value={partner.token} />
        <input type="hidden" name="lang" value={lang} />
        <div className="row">
          <div><label htmlFor="first_name">{P.first}</label><input id="first_name" name="first_name" required maxLength={60} autoComplete="given-name" defaultValue={pr?.first_name ?? ""} /></div>
          <div><label htmlFor="last_name">{P.last}</label><input id="last_name" name="last_name" required maxLength={60} autoComplete="family-name" defaultValue={pr?.last_name ?? ""} /></div>
        </div>
        <label htmlFor="iban">{P.iban}</label>
        <input id="iban" name="iban" required maxLength={40} autoComplete="off" spellCheck={false} placeholder="IT00 X000 0000 0000 0000 0000 000" defaultValue={pr?.iban ?? ""} />
        <small className="muted">{P.ibanHelp}</small>
        <label htmlFor="bank">{P.bank}</label>
        <input id="bank" name="bank" required maxLength={80} autoComplete="off" defaultValue={pr?.bank ?? ""} />
        <label htmlFor="phone">{P.phone}</label>
        <input id="phone" name="phone" type="tel" required maxLength={25} autoComplete="tel" placeholder="+39 ..." defaultValue={pr?.phone ?? ""} />
        <label htmlFor="address">{P.address}</label>
        <input id="address" name="address" required maxLength={200} autoComplete="street-address" defaultValue={pr?.address ?? ""} />
        <small className="muted">{P.addressHelp}</small>
        <p style={{ marginTop: 16 }}><button type="submit">{P.save}</button></p>
        {pr?.updated_at && <p className="muted" style={{ margin: 0 }}>{P.updated}: {dateFmt(pr.updated_at, lang)}</p>}
      </form>
    </div>
  );
}
