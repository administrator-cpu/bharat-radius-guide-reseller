import { readFileSync } from 'node:fs';

const spec = JSON.parse(readFileSync(new URL('./openapi.json', import.meta.url), 'utf8'));
export const NOW = Date.parse('2026-11-20T11:30:00+05:30');

const FIRST = ['Ramesh', 'Sunita', 'Arif', 'Priya', 'Vikram', 'Anjali', 'Deepak', 'Kavita', 'Imran', 'Neha', 'Suresh', 'Pooja', 'Manoj', 'Rekha', 'Sanjay', 'Farah'];
const LAST = ['Kumar', 'Sharma', 'Khan', 'Verma', 'Singh', 'Gupta', 'Yadav', 'Mishra', 'Ansari', 'Patel', 'Jha', 'Thakur'];

function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export const oid = (n) => (0x6720000000 + n).toString(16).padStart(24, 'a');

const NULLY = /reason|locked|error|deleted|blocked|frozen|until|override|note|gstin|altPhone|staticIp|macLock|viewAs|closedAt|resolvedAt|assignee|parentWalletId|parentId|refund|creditNote|failure|cause/i;

function resolve(s) {
  while (s && s.$ref) s = s.$ref.split('/').slice(1).reduce((o, k) => o[k], spec);
  return s;
}

export function fake(schema, name = '', seed = 'x', depth = 0) {
  const s = resolve(schema);
  if (!s || depth > 9) return null;
  const r = rng(seed + name);
  if (s.anyOf || s.oneOf) {
    const opts = (s.anyOf || s.oneOf).map(resolve);
    const nonNull = opts.filter((o) => o.type !== 'null');
    if (NULLY.test(name) && opts.some((o) => o.type === 'null')) return null;
    return fake(nonNull[0] ?? opts[0], name, seed, depth + 1);
  }
  if (s.const !== undefined) return s.const;
  if (s.enum) return s.enum[0];
  let t = s.type;
  if (Array.isArray(t)) {
    if (t.includes('null') && NULLY.test(name)) return null;
    t = t.find((x) => x !== 'null') ?? 'null';
  }
  switch (t) {
    case 'object': {
      const out = {};
      for (const [k, v] of Object.entries(s.properties ?? {})) out[k] = fake(v, k, `${seed}.${k}`, depth + 1);
      return out;
    }
    case 'array': {
      const n = name === 'items' ? 8 : /permissions/.test(name) ? 0 : 2;
      return Array.from({ length: n }, (_, i) => fake(s.items, name.replace(/s$/, ''), `${seed}[${i}]`, depth + 1));
    }
    case 'string':
      return str(name, r, s);
    case 'integer':
    case 'number':
      return num(name, r);
    case 'boolean':
      return /enabled|active|can|ok|has/i.test(name);
    case 'null':
      return null;
    default:
      return null;
  }
}

function str(name, r, s) {
  const n = name.toLowerCase();
  const pick = (a) => a[Math.floor(r() * a.length)];
  if (s.format === 'date-time' || /at$|date|time|since|from|to$|day$|expires/.test(n)) {
    if (/day$/.test(n)) return new Date(NOW - Math.floor(r() * 30) * 864e5).toISOString().slice(0, 10);
    return new Date(NOW - Math.floor(r() * 30 * 864e5)).toISOString();
  }
  if (n === 'id' || n.endsWith('id')) return oid(Math.floor(r() * 1e6));
  if (n.includes('customerno')) return `C${String(100000 + Math.floor(r() * 900)).slice(1)}`;
  if (n.includes('phone') || n === 'mobile') return `+9198${Math.floor(10000000 + r() * 89999999)}`;
  if (n.includes('email')) return `${pick(FIRST).toLowerCase()}@example.in`;
  if (n.includes('username') || n === 'login') return `${pick(FIRST).toLowerCase()}${Math.floor(r() * 900 + 100)}`;
  if (n === 'code') return `R-${String(Math.floor(r() * 90 + 10)).padStart(4, '0')}`;
  if (n.includes('owner') || n === 'name' || n.endsWith('name') || n === 'by') return `${pick(FIRST)} ${pick(LAST)}`;
  if (n.includes('ip') || n.includes('address')) return `10.20.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}`;
  if (n.includes('mac')) return 'D4:CA:6D:3A:91:0F';
  if (n.includes('city')) return 'Darbhanga';
  if (n.includes('state')) return 'Bihar';
  if (n.includes('pincode')) return '846004';
  if (n.includes('url')) return null;
  if (n.includes('subject') || n.includes('title')) return 'Internet slow since morning';
  if (n.includes('message') || n.includes('body') || n.includes('text') || n.includes('description')) return 'Speed is dropping in the evening, please check.';
  if (n.includes('plan')) return '50 Mbps Unlimited';
  return pick(['Darbhanga', 'Laheriasarai', 'Benta', 'Kadirabad', 'Donar']);
}

function num(name, r) {
  const n = name.toLowerCase();
  if (n.includes('paise')) return Math.round((200 + r() * 1800) * 100);
  if (n.includes('bytes') || n === 'down' || n === 'up') return Math.floor(r() * 8e9);
  if (n.includes('mbps') || n.includes('speed') || n.includes('rate')) return [20, 30, 50, 100][Math.floor(r() * 4)];
  if (n.includes('total') || n.includes('count')) return Math.floor(20 + r() * 300);
  if (n.includes('days')) return 30;
  if (n.includes('level')) return 1;
  return Math.floor(r() * 50);
}

const routes = Object.entries(spec.paths).map(([p, ops]) => ({
  p,
  re: new RegExp('^' + p.replace(/\{[^}]+\}/g, '([^/]+)') + '$'),
  ops,
}));

export function match(method, path) {
  for (const r of routes) {
    const m = r.re.exec(path);
    if (m && r.ops[method.toLowerCase()]) return { route: r.p, params: m.slice(1), op: r.ops[method.toLowerCase()] };
  }
  return null;
}

export function responseSchema(op) {
  const res = op.responses?.['200'] ?? op.responses?.['201'];
  return res?.content?.['application/json']?.schema ?? null;
}

/** Deep merge override onto generated base so every required field exists. */
export function merge(base, over) {
  if (over === undefined) return base;
  if (over === null || typeof over !== 'object' || Array.isArray(over)) return over;
  if (base === null || typeof base !== 'object' || Array.isArray(base)) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
  return out;
}

export function itemSchema(schema) {
  const s = resolve(schema);
  return s?.properties?.items?.items ?? null;
}
