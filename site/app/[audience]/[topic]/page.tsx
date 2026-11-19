import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DepthToggle } from '@/components/DepthToggle';
import { Prose } from '@/components/Prose';
import { MarkList, Shot } from '@/components/Shot';
import { Sidebar } from '@/components/Sidebar';
import { Toc, type TocItem } from '@/components/Toc';
import { AUDIENCES, audience, flatTopics, neighbours, shotFor } from '@/lib/content';

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

const TOC: TocItem[] = [
  { id: 'where-to-click', label: 'Where to click' },
  { id: 'what-to-do', label: 'What to do' },
  { id: 'up-next', label: 'Up next' },
];

export default async function TopicPage({ params }: Params) {
  const p = await params;
  const a = audience(p.audience);
  if (!a) notFound();
  const { topic: t, prev, next } = neighbours(a, p.topic);
  if (!t) notFound();
  const shot = shotFor(t.id);

  return (
    <div className="docs">
      <Sidebar a={a} current={t.id} currentSection={t.section.title} />

      <article className="content">
        <div className="content-head">
          <p className="crumb">{t.section.title}</p>
          <DepthToggle />
        </div>
        <h1>{t.title}</h1>

        <section id="where-to-click" aria-labelledby="h-where">
          <h2 id="h-where">Where to click</h2>
          {shot ? (
            <>
              <Shot shot={shot} labels={t.marks} title={t.title} priority />
              <MarkList shot={shot} labels={t.marks} />
            </>
          ) : null}
        </section>

        <section id="what-to-do" aria-labelledby="h-what">
          <h2 id="h-what">What to do</h2>
          <div className="explain">
            <p className="d-short">{t.short}</p>
            <p className="d-mid">{t.mid}</p>
            <div className="d-detailed">
              <Prose text={t.detailed} />
            </div>
          </div>
        </section>

        <section id="up-next" aria-labelledby="h-next">
          <h2 id="h-next">Up next</h2>
          <nav className="pager" aria-label="Next and previous">
            {prev ? (
              <Link href={`/${a.id}/${prev.id}/`} className="pg-prev">
                <small>← Previous</small>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/${a.id}/${next.id}/`} className="pg-next">
                <small>Next →</small>
                {next.title}
              </Link>
            ) : null}
          </nav>
        </section>
      </article>

      <aside className="rail">
        <Toc items={TOC} />
      </aside>
    </div>
  );
}
