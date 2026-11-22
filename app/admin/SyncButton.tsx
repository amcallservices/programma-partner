"use client";

import { useFormStatus } from "react-dom";

export default function SyncButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-live="polite">
      {pending ? "Sincronizzo con Stripe… (può volerci un minuto)" : "Sincronizza ora"}
    </button>
  );
}
