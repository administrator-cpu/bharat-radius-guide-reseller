import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Prose } from '@/components/Prose';
import { Shot } from '@/components/Shot';
import { AUDIENCES, audience, flatTopics, neighbours, shotFor, type Audience } from '@/lib/content';

type Params = { params: Promise<{ audience: string; topic: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  AUDIENCES.filter((a) => a.ready).flatMap((a) => flatTopics(a).map((t) => ({ audience: a.id, topic: t.id })));

export async function generateMetadata({ params }: Params) {
  const p = await params;
  const a = audience(p.audience);
  const t = a && neighbours(a, p.topic).topic;
  return t ? { title: t.title, description: t.short } : {};
}

export default async function TopicPage({ params }: Params) {
  const p = await params;
  const a = audience(p.audience);
  if (!a) notFound();
  const { topic: t, prev, next } = neighbours(a, p.topic);
  if (!t) notFound();
  const shot = shotFor(t.id);

  return (
    <div className="doc">
      <aside className="side">
        <nav aria-label="Topics" className="side-desk">
          <TopicList a={a} current={t.id} />
        </nav>
        <details className="side-mob">
          <summary>
            All topics <span>· {t.section.title}</span>
          </summary>
          <TopicList a={a} current={t.id} />
        </details>
      </aside>

      <article className="topic">
        <p className="crumb">
          {a.label} · {t.section.title}
        </p>
        <h1>{t.title}</h1>
        {shot ? <Shot shot={shot} labels={t.marks} title={t.title} priority /> : null}
        <div className="explain">
          <p className="d-short">{t.short}</p>
          <p className="d-mid">{t.mid}</p>
          <div className="d-detailed">
            <Prose text={t.detailed} />
          </div>
        </div>
        <nav className="pager" aria-label="Next and previous">
          {prev ? (
            <Link href={`/${a.id}/${prev.id}/`} className="pg-prev">
              <small>Previous</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/${a.id}/${next.id}/`} className="pg-next">
              <small>Next</small>
              {next.title}
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}

function TopicList({ a, current }: { a: Audience; current: string }) {
  return a.sections.map((s) => (
    <div key={s.id} className="side-group">
      <span className="side-label">{s.title}</span>
      {s.topics.map((x) => (
        <Link key={x.id} href={`/${a.id}/${x.id}/`} aria-current={x.id === current ? 'page' : undefined}>
          {x.title}
        </Link>
      ))}
    </div>
  ));
}
