"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LangSwitch({ lang, label }: { lang: "it" | "en"; label: string }) {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  function set(l: "it" | "en") {
    try { document.cookie = `pp-lang=${l}; path=/; max-age=31536000; samesite=lax`; } catch {}
    router.replace(`${path}?lang=${l}`);
  }
  return (
    <div role="group" aria-label={label} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <span className="muted">{label}</span>
      {(["it", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={`small ${lang === l ? "" : "ghost"}`}
          aria-pressed={lang === l}
          onClick={() => set(l)}
        >
          {l === "it" ? "Italiano" : "English"}
        </button>
      ))}
    </div>
  );
}
