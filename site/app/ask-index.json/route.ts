import { toDocs } from '@/lib/ask/docs';
import { AUDIENCES, shotFor } from '@/lib/content';

export const dynamic = 'force-static';

/** Everything the Ask box needs, built once at deploy time and fetched only when someone opens it. */
export function GET() {
  const ready = AUDIENCES.filter((a) => a.ready);
  const docs = ready.flatMap((a) => toDocs(a.id, a.sections));
  const shots = Object.fromEntries(docs.flatMap((d) => (shotFor(d.id) ? [[d.id, shotFor(d.id)!]] : [])));
  return Response.json({ audiences: ready.map(({ id, label }) => ({ id, label })), docs, shots });
}
