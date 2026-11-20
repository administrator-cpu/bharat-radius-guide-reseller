import type { Section } from '../../content/types';
import type { AskDoc } from './engine';
import { KEYWORDS } from './lexicon.ts';

export function toDocs(a: string, sections: Section[]): AskDoc[] {
  return sections.flatMap((s) =>
    s.topics.map((t) => ({ a, id: t.id, title: t.title, section: s.title, short: t.short, mid: t.mid, marks: t.marks, keywords: KEYWORDS[t.id] ?? [] })),
  );
}
