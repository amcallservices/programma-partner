"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import type { PanelText } from "@/lib/i18n";

const KEY = "pp-tour-done";

export default function Tour({ steps: STEPS, ui, label }: { steps: PanelText["steps"]; ui: PanelText["tourUi"]; label: string }) {
  const [i, setI] = useState<number | null>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setI(0);
    } catch {
      setI(0);
    }
  }, []);

  const close = useCallback(() => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setI(null);
  }, []);

  const measure = useCallback(() => {
    if (i === null) return;
    const t = STEPS[i].target;
    const el = t ? document.querySelector<HTMLElement>(`[data-tour="${t}"]`) : null;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
  }, [i]);

  useLayoutEffect(() => {
    if (i === null) return;
    const t = STEPS[i].target;
    const el = t ? document.querySelector<HTMLElement>(`[data-tour="${t}"]`) : null;
    if (el) el.scrollIntoView({ block: "center", behavior: "auto" });
    measure();
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [i, measure]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setI((v) => (v === null ? v : Math.min(v + 1, STEPS.length - 1)));
      if (e.key === "ArrowLeft") setI((v) => (v === null ? v : Math.max(v - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, close]);

  const start = () => setI(0);

  const step = i === null ? null : STEPS[i];
  let popStyle: React.CSSProperties = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  if (rect) {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
    const vh = typeof window !== "undefined" ? window.innerHeight : 700;
    const w = Math.min(360, vw - 24);
    const left = Math.max(12, Math.min(rect.left, vw - w - 12));
    const below = rect.top + rect.height + 12;
    const top = below + 200 < vh ? below : Math.max(12, rect.top - 200);
    popStyle = { top, left };
  }

  return (
    <>
      <button type="button" className="ghost small" onClick={start}>{label}</button>
      {step && i !== null && (
        <>
          <div className="tour-shade" onClick={close} aria-hidden="true" />
          {rect ? (
            <div className="tour-spot" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />
          ) : (
            <div className="tour-spot" style={{ top: "50%", left: "50%", width: 0, height: 0 }} />
          )}
          <div className="tour-pop" style={popStyle} role="dialog" aria-modal="true" aria-label={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="bar">
              <span className="prog">{ui.of.replace("{a}", String(i + 1)).replace("{b}", String(STEPS.length))}</span>
              <span className="sp" />
              {i < STEPS.length - 1 && <button type="button" className="ghost small" onClick={close}>{ui.skip}</button>}
              {i > 0 && <button type="button" className="ghost small" onClick={() => setI(i - 1)}>{ui.back}</button>}
              {i < STEPS.length - 1 ? (
                <button type="button" className="small" onClick={() => setI(i + 1)} autoFocus>{ui.next}</button>
              ) : (
                <button type="button" className="small" onClick={close} autoFocus>{ui.close}</button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
