import { notFound } from 'next/navigation';
import { GuideHome } from '@/components/GuideHome';
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
  return <GuideHome a={a} />;
}
