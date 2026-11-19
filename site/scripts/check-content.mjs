// Fails the build if any explanation is outside its word range or a topic has no screenshot / mismatched marks.
import { readFileSync } from 'node:fs';

const LIMITS = { short: [10, 20], mid: [20, 70], detailed: [70, 500] };
const src = readFileSync(new URL('../content/reseller.ts', import.meta.url), 'utf8');
const shots = JSON.parse(readFileSync(new URL('../content/shots.json', import.meta.url), 'utf8'));
const words = (s) => s.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}₹]/u.test(w)).length;

const topicRe = /id: '([\w-]+)',\s*title: '([^']+)',\s*marks: \[([^\]]*)\],\s*short: '((?:[^'\\]|\\.)*)',\s*mid: '((?:[^'\\]|\\.)*)',\s*detailed: `([^`]*)`/g;
let n = 0, bad = 0;
for (const m of src.matchAll(topicRe)) {
  n++;
  const [, id, , marks, short, mid, detailed] = m;
  const counts = { short: words(short), mid: words(mid), detailed: words(detailed) };
  const issues = [];
  for (const [k, [lo, hi]] of Object.entries(LIMITS)) if (counts[k] < lo || counts[k] > hi) issues.push(`${k}=${counts[k]} (want ${lo}-${hi})`);
  const markCount = (marks.match(/'/g) ?? []).length / 2;
  if (!shots[id]) issues.push('no screenshot');
  else if (shots[id].marks.length !== markCount) issues.push(`marks: ${markCount} labels vs ${shots[id].marks.length} on screenshot`);
  if (issues.length) bad++;
  console.log(`${issues.length ? 'FAIL' : 'ok  '} ${id.padEnd(18)} short ${counts.short}  mid ${counts.mid}  detailed ${counts.detailed}  ${issues.join('; ')}`);
}
if (!n) { console.error('No topics parsed'); process.exit(1); }
console.log(`${n} topics, ${bad} with problems`);
process.exit(bad ? 1 : 0);
