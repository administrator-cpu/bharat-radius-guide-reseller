import { GuideHome } from '@/components/GuideHome';
import { audience, DEFAULT_AUDIENCE } from '@/lib/content';

export default function Home() {
  return <GuideHome a={audience(DEFAULT_AUDIENCE)!} />;
}
