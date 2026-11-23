import { LOCK, PANEL, type Lang } from "@/lib/i18n";
import LangSwitch from "../../LangSwitch";
import { unlock } from "./actions";

/** Schermata di accesso: password richiesta, oppure accesso non ancora attivo (nessuna password impostata). */
export default function Gate({ token, lang, hasPw, next = "", err }: { token: string; lang: Lang; hasPw: boolean; next?: string; err?: string }) {
  const L = LOCK[lang];
  return (
    <div className="wrap" style={{ maxWidth: 480 }}>
      <div style={{ textAlign: "right" }}><LangSwitch lang={lang} label={PANEL[lang].langLabel} /></div>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 26 }}>{L.title}</h1>
        {hasPw ? (
          <form action={unlock}>
            <p className="muted">{L.intro}</p>
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="lang" value={lang} />
            <label htmlFor="pw">{L.label}</label>
            <input id="pw" name="password" type="password" required autoComplete="current-password" autoFocus />
            {err === "pw" && <p className="notice bad" role="alert">{L.err}</p>}
            {err === "locked" && <p className="notice bad" role="alert">{L.locked}</p>}
            <p style={{ marginTop: 14 }}><button type="submit">{L.go}</button></p>
          </form>
        ) : (
          <>
            <p className="muted">{L.nopw}</p>
            <p><a className="btn wa" href={`https://wa.me/393282693777?text=${encodeURIComponent(L.waMsg)}`} target="_blank" rel="noopener noreferrer">{L.wa}</a></p>
          </>
        )}
      </div>
      <p style={{ textAlign: "center" }}><a href="/">{L.home}</a></p>
    </div>
  );
}
