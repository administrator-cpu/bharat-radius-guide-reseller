import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Toc } from '@/components/Toc';
import { isPhone, shotFor, type Audience } from '@/lib/content';

const INTRO: Record<string, { title: string; lead: string }> = {
  reseller: { title: 'Bharat Radius for resellers', lead: 'Run your customers, wallet and sub-resellers from one panel.' },
  customer: { title: 'Your internet account', lead: 'Recharge, check your data and get help from your phone.' },
};

/** Landing page for one audience: intro plus every topic as a card, grouped by section. */
export function GuideHome({ a }: { a: Audience }) {
  const first = a.sections[0]!.topics[0]!;
  return (
    <div className="docs">
      <Sidebar a={a} />
      <article className="content">
        <div className="content-head">
          <p className="crumb">{a.label} guide</p>
        </div>
        <h1>{INTRO[a.id]?.title ?? `${a.label} guide`}</h1>
        <p className="lead">
          {INTRO[a.id]?.lead} Every page shows the real screen with numbered marks on exactly what to tap. Choose{' '}
          <strong>Short</strong>, <strong>Mid</strong> or <strong>Detailed</strong> on any page to read as much as you
          need.
        </p>
        <p>
          <Link className="cta" href={`/${a.id}/${first.id}/`}>
            Start with “{first.title}” →
          </Link>
        </p>
        <hr />
        {a.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`}>
            <h2 id={`h-${s.id}`}>{s.title}</h2>
            <ul className="cards">
              {s.topics.map((t) => {
                const shot = shotFor(t.id);
                return (
                  <li key={t.id}>
                    <Link href={`/${a.id}/${t.id}/`} className={shot && isPhone(shot) ? 'card card-phone' : 'card'}>
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
      </article>
      <aside className="rail">
        <Toc items={a.sections.map((s) => ({ id: s.id, label: s.title }))} />
      </aside>
    </div>
  );
}
