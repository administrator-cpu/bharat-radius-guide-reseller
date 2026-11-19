import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AUDIENCES, audience } from '@/lib/content';

export const dynamicParams = false;
export const generateStaticParams = () => AUDIENCES.filter((a) => a.ready).map((a) => ({ audience: a.id }));

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }) {
  const a = audience((await params).audience);
  return { title: a ? `${a.label} guide` : 'Guide' };
}

export default async function AudienceHome({ params }: { params: Promise<{ audience: string }> }) {
  const a = audience((await params).audience);
  if (!a) notFound();
  return (
    <div className="index">
      <h1>{a.label} guide</h1>
      {a.sections.map((s) => (
        <section key={s.id}>
          <h2>{s.title}</h2>
          <ul>
            {s.topics.map((t) => (
              <li key={t.id}>
                <Link href={`/${a.id}/${t.id}/`}>{t.title}</Link>
                <span>{t.short}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
