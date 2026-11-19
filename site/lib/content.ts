import { customer } from '@/content/customer';
import { reseller } from '@/content/reseller';
import shotsJson from '@/content/shots.json';
import type { Section, Shot, Topic } from '@/content/types';

export type Audience = { id: string; label: string; ready: boolean; sections: Section[] };

export const AUDIENCES: Audience[] = [
  { id: 'reseller', label: 'Reseller', ready: true, sections: reseller },
  { id: 'admin', label: 'ISP Admin & Staff', ready: false, sections: [] },
  { id: 'customer', label: 'Customer', ready: true, sections: customer },
];

export const DEFAULT_AUDIENCE = 'reseller';

const shots = shotsJson as Record<string, Shot>;
export const shotFor = (id: string): Shot | undefined => shots[id];
export const isPhone = (shot: Shot) => shot.width < 600;

export function audience(id: string) {
  return AUDIENCES.find((a) => a.id === id && a.ready);
}

export function flatTopics(a: Audience) {
  return a.sections.flatMap((s) => s.topics.map((t) => ({ ...t, section: s })));
}

export function neighbours(a: Audience, id: string) {
  const all = flatTopics(a);
  const i = all.findIndex((t) => t.id === id);
  return { prev: all[i - 1], next: all[i + 1], topic: all[i] as (Topic & { section: Section }) | undefined };
}

export type SearchEntry = { a: string; audience: string; id: string; title: string; section: string; text: string };

export function searchIndex(): SearchEntry[] {
  return AUDIENCES.filter((a) => a.ready).flatMap((a) =>
    flatTopics(a).map((t) => ({ a: a.id, audience: a.label, id: t.id, title: t.title, section: t.section.title, text: `${t.short} ${t.marks.join(' ')}` })),
  );
}
