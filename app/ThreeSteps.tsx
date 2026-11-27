export default function ThreeSteps({ title, steps }: { title: string; steps: { t: string; d: string }[] }) {
  return (
    <section className="t3" aria-label={title}>
      <h2>{title}</h2>
      <ol>
        {steps.map((s, n) => (
          <li key={s.t}><span className="t3-n" aria-hidden="true">{n + 1}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>
        ))}
      </ol>
    </section>
  );
}
