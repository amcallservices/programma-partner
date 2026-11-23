export default function Brand() {
  return (
    <a className="brand" href="/" aria-label="Programma partner, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.svg" alt="" width={44} height={44} />
      <span>Programma <b>partner</b></span>
    </a>
  );
}
