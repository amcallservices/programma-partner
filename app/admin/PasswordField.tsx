"use client";

import { useState } from "react";

const ABC = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Campo password in chiaro (la scegli tu e la comunichi al partner) con pulsante per generarne una. */
export default function PasswordField({ id, name = "password", label = "Password" }: { id: string; name?: string; label?: string }) {
  const [v, setV] = useState("");
  function gen() {
    const a = new Uint32Array(12);
    crypto.getRandomValues(a);
    setV(Array.from(a, (x) => ABC[x % ABC.length]).join(""));
  }
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input id={id} name={name} value={v} onChange={(e) => setV(e.target.value)} required minLength={8} autoComplete="off" spellCheck={false} style={{ flex: 1 }} />
        <button type="button" className="ghost small" onClick={gen}>Genera</button>
      </div>
    </div>
  );
}
