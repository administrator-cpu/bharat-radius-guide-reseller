// Offline question → topic matcher. Runs in the browser; no server, no API, no cost.
// Pipeline: normalise → tokenise → map synonyms (English / Hinglish / Hindi) → drop filler words →
// light stemming → fuzzy-correct typos against the guide's vocabulary → weighted, IDF-scaled field
// scoring + phrase intents → ranked topics.

export type AskDoc = {
  a: string;
  id: string;
  title: string;
  section: string;
  short: string;
  mid: string;
  marks: string[];
  keywords: string[];
};

export type Intent = { audience?: string; pattern: RegExp; boost: Record<string, number> };
export type Lexicon = { synonyms: Record<string, string[]>; stopwords: string[]; intents: Intent[] };
export type Match = { doc: AskDoc; score: number };
export type Answer = { matches: Match[]; confident: boolean; elsewhere?: Match };

type Field = 'keywords' | 'title' | 'marks' | 'short' | 'mid';
const WEIGHTS: Record<Field, number> = { title: 4, keywords: 3, marks: 2, short: 1.5, mid: 1 };
const MIN_SCORE = 3;

type Prepared = { doc: AskDoc; fields: Record<Field, Set<string>>; phrases: Set<string> };
export type Index = {
  docs: Prepared[];
  df: Map<string, number>;
  vocab: string[];
  syn: Map<string, string>;
  stop: Set<string>;
  intents: Intent[];
};

export const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ')
    .trim();

function stem(t: string) {
  if (!/^[a-z]+$/.test(t) || t.length < 5) return t;
  return t.replace(/(ing|ed|es|s)$/, '').replace(/e$/, '');
}

function tokens(text: string, ix: Pick<Index, 'syn' | 'stop'>) {
  const out: string[] = [];
  const words = normalise(text).split(' ').filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const two = i + 1 < words.length ? `${words[i]} ${words[i + 1]}` : '';
    if (two && ix.syn.has(two)) {
      out.push(ix.syn.get(two)!);
      i++;
      continue;
    }
    const w = words[i]!;
    const mapped = ix.syn.get(w) ?? ix.syn.get(stem(w)) ?? w;
    if (ix.stop.has(w) || ix.stop.has(mapped)) continue;
    out.push(ix.syn.has(w) || ix.syn.has(stem(w)) ? mapped : stem(mapped));
  }
  return out;
}

export function buildIndex(docs: AskDoc[], lex: Lexicon): Index {
  const syn = new Map<string, string>();
  for (const [canon, variants] of Object.entries(lex.synonyms)) {
    for (const v of [canon, ...variants]) {
      const n = normalise(v);
      syn.set(n, canon);
      if (!n.includes(' ')) syn.set(stem(n), canon);
    }
  }
  const base = { syn, stop: new Set(lex.stopwords.map(normalise)) };
  const df = new Map<string, number>();
  const prepared = docs.map((doc) => {
    const fields = {
      keywords: new Set(doc.keywords.flatMap((k) => tokens(k, base))),
      title: new Set(tokens(doc.title, base)),
      marks: new Set(doc.marks.flatMap((m) => tokens(m, base))),
      short: new Set(tokens(doc.short, base)),
      mid: new Set(tokens(doc.mid, base)),
    } satisfies Record<Field, Set<string>>;
    const all = new Set(Object.values(fields).flatMap((s) => [...s]));
    for (const t of all) df.set(t, (df.get(t) ?? 0) + 1);
    const phrases = new Set(doc.keywords.map((k) => tokens(k, base).join(' ')).filter((p) => p.includes(' ')));
    return { doc, fields, phrases };
  });
  return { docs: prepared, df, vocab: [...df.keys()], ...base, intents: lex.intents };
}

/** Damerau–Levenshtein distance with an early exit once it exceeds `max`. */
function distance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2]![j - 2]! + 1);
      d[i]![j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length]![b.length]!;
}

function correct(t: string, ix: Index) {
  if (ix.df.has(t) || t.length < 4 || !/^[a-z]+$/.test(t)) return t;
  const max = t.length >= 7 ? 2 : 1;
  let best = t;
  let bestD = max + 1;
  for (const v of ix.vocab) {
    if (v[0] !== t[0] && max === 1) continue;
    const dist = distance(t, v, max);
    if (dist < bestD || (dist === bestD && (ix.df.get(v) ?? 0) > (ix.df.get(best) ?? 0))) {
      best = v;
      bestD = dist;
    }
  }
  return bestD <= max ? best : t;
}

function rank(ix: Index, query: string, qt: string[], audience?: string): Match[] {
  const n = ix.docs.length;
  const raw = ` ${normalise(query)} `;
  const scored: Match[] = [];
  for (const p of ix.docs) {
    if (audience && p.doc.a !== audience) continue;
    let score = 0;
    for (const t of new Set(qt)) {
      let w = 0;
      for (const f of Object.keys(WEIGHTS) as Field[]) if (p.fields[f].has(t)) w = Math.max(w, WEIGHTS[f]);
      if (w) score += w * Math.log(1 + n / (ix.df.get(t) ?? 1));
    }
    for (let i = 0; i + 1 < qt.length; i++) if (p.phrases.has(`${qt[i]} ${qt[i + 1]}`)) score += 4;
    for (const it of ix.intents) {
      if ((!it.audience || it.audience === p.doc.a) && it.pattern.test(raw)) score += it.boost[p.doc.id] ?? 0;
    }
    if (score > 0) scored.push({ doc: p.doc, score });
  }
  return scored.sort((a, b) => b.score - a.score);
}

export function ask(ix: Index, query: string, audience?: string): Answer {
  const qt = tokens(query, ix).map((t) => correct(t, ix));
  const mine = rank(ix, query, qt, audience);
  const top = mine[0];
  const confident = !!top && top.score >= MIN_SCORE;
  const matches = confident ? mine.filter((m) => m.score >= Math.max(MIN_SCORE, top.score * 0.45)).slice(0, 3) : [];
  let elsewhere: Match | undefined;
  if (audience) {
    const other = rank(ix, query, qt).find((m) => m.doc.a !== audience);
    if (other && other.score >= MIN_SCORE * 1.5 && (!top || other.score > top.score * 1.6)) elsewhere = other;
  }
  return { matches, confident, elsewhere };
}
