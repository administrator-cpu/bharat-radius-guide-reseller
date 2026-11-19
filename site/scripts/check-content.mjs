// Fails the build if any explanation is outside its word range, a topic id repeats, or a topic has no
// screenshot / a different number of labels than marks. Checks every content/<audience>.ts file.
import { readdirSync, readFileSync } from 'node:fs';

const LIMITS = { short: [10, 20], mid: [20, 70], detailed: [70, 500] };
const dir = new URL('../content/', import.meta.url);
const shots = JSON.parse(readFileSync(new URL('shots.json', dir), 'utf8'));
const words = (s) => s.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}₹]/u.test(w)).length;
const topicRe = /id: '([\w-]+)',\s*title: '([^']+)',\s*marks: \[([^\]]*)\],\s*short: '((?:[^'\\]|\\.)*)',\s*mid: '((?:[^'\\]|\\.)*)',\s*detailed: `([^`]*)`/g;

const seen = new Set();
let n = 0, bad = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'types.ts')) {
  console.log(`\n${file}`);
  for (const m of readFileSync(new URL(file, dir), 'utf8').matchAll(topicRe)) {
    n++;
    const [, id, , marks, short, mid, detailed] = m;
    const counts = { short: words(short), mid: words(mid), detailed: words(detailed) };
    const issues = [];
    for (const [k, [lo, hi]] of Object.entries(LIMITS)) if (counts[k] < lo || counts[k] > hi) issues.push(`${k}=${counts[k]} (want ${lo}-${hi})`);
    if (seen.has(id)) issues.push('duplicate id');
    seen.add(id);
    const markCount = (marks.match(/'/g) ?? []).length / 2;
    if (!shots[id]) issues.push('no screenshot');
    else if (shots[id].marks.length !== markCount) issues.push(`marks: ${markCount} labels vs ${shots[id].marks.length} on screenshot`);
    if (issues.length) bad++;
    console.log(`${issues.length ? 'FAIL' : 'ok  '} ${id.padEnd(28)} short ${counts.short}  mid ${counts.mid}  detailed ${counts.detailed}  ${issues.join('; ')}`);
  }
}
if (!n) { console.error('No topics parsed'); process.exit(1); }
console.log(`\n${n} topics, ${bad} with problems`);
process.exit(bad ? 1 : 0);
