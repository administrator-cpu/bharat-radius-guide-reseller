import Link from 'next/link';
import { audience, DEFAULT_AUDIENCE, shotFor } from '@/lib/content';

export default function Home() {
  const a = audience(DEFAULT_AUDIENCE)!;
  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Help for resellers</p>
        <h1>Find it, click it, done.</h1>
        <p className="lede">
          Every page shows the real screen with numbered marks on what to click. Pick how much you want to read with{' '}
          <strong>Short · Mid · Detailed</strong> at the top.
        </p>
        <Link className="cta" href={`/${a.id}/${a.sections[0]!.topics[0]!.id}/`}>
          Start with signing in →
        </Link>
      </section>
      {a.sections.map((s) => (
        <section key={s.id} className="home-section">
          <h2>{s.title}</h2>
          <ul className="cards">
            {s.topics.map((t) => {
              const shot = shotFor(t.id);
              return (
                <li key={t.id}>
                  <Link href={`/${a.id}/${t.id}/`} className="card">
                    {shot ? <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async" /> : null}
                    <span className="card-title">{t.title}</span>
                    <span className="card-text">{t.short}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
