// Usage: node capture.mjs [--audience reseller|customer|all] [topicId…]   (BASE_URL defaults to http://localhost:3000)
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT_IMG = new URL('../site/public/shots/', import.meta.url).pathname;
const OUT_JSON = new URL('../site/content/shots.json', import.meta.url).pathname;
const DEVICES = {
  desktop: { width: 1440, height: 900, mobile: false },
  phone: { width: 390, height: 844, mobile: true },
};
const DPR = 2;
mkdirSync(OUT_IMG, { recursive: true });

const args = process.argv.slice(2);
const ai = args.indexOf('--audience');
const which = ai >= 0 ? args.splice(ai, 2)[1] : 'all';
const AUDIENCES = ['reseller', 'customer'];
const topics = [];
for (const a of which === 'all' ? AUDIENCES : [which]) topics.push(...(await import(`./topics.${a}.mjs`)).default);
const only = new Set(args);
const COOKIES = {
  staff: [{ name: 'isp_csrf', value: 'demo' }, { name: 'isp_at', value: 'demo' }],
  customer: [{ name: 'isp_pcsrf', value: 'demo' }, { name: 'isp_pt', value: 'demo' }],
  none: [],
};
const db = existsSync(OUT_JSON) ? JSON.parse(readFileSync(OUT_JSON, 'utf8')) : {};
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });

async function boxOf(loc, mode) {
  await loc.waitFor({ state: 'visible', timeout: 8000 });
  return loc.evaluate((el, mode) => {
    const up = (test) => { let n = el; while (n && n !== document.body) { if (test(n)) return n; n = n.parentElement; } return el; };
    const cs = (n) => getComputedStyle(n);
    let t = el;
    if (mode === 'row') t = up((n) => n.tagName === 'TR' || n.getAttribute('role') === 'row');
    else if (mode === 'cell') t = up((n) => n.tagName === 'TD' || n.getAttribute('role') === 'cell');
    else if (mode === 'card') t = up((n) => n !== el && parseFloat(cs(n).borderTopWidth) > 0 && parseFloat(cs(n).borderRadius) >= 8);
    else if (mode === 'parent2') t = el.parentElement?.parentElement ?? el;
    else if (mode === 'section') t = up((n) => n.tagName === 'SECTION') ;
    const r = t.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, mode ?? null);
}

let failed = 0;
for (const t of topics) {
  if (only.size && !only.has(t.id)) continue;
  const dev = DEVICES[t.device ?? 'desktop'];
  const W = dev.width, H = t.height ?? dev.height;
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: dev.mobile, hasTouch: dev.mobile, reducedMotion: 'reduce', locale: 'en-IN', timezoneId: 'Asia/Kolkata' });
  const session = t.signedOut ? 'none' : (t.session ?? 'staff');
  await ctx.addCookies(COOKIES[session].map((c) => ({ ...c, url: BASE })));
  const p = await ctx.newPage();
  try {
    await p.goto(BASE + t.open, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
    await p.waitForTimeout(500);
    if (t.prepare) await t.prepare(p);
    if (t.scrollTo) { await t.scrollTo(p).scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -24)); }
    await p.mouse.move(0, 0);
    await p.waitForTimeout(400);
    const marks = [];
    for (const [i, m] of t.marks.entries()) {
      const b = await boxOf(m.at(p), m.box);
      const pad = 6;
      marks.push({ n: i + 1, kind: m.kind, x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), w: Math.min(W - Math.max(0, b.x - pad), b.w + pad * 2), h: b.h + pad * 2 });
    }
    const png = await p.screenshot({ animations: 'disabled' });
    await sharp(png).webp({ quality: 80 }).toFile(`${OUT_IMG}${t.id}.webp`);
    db[t.id] = { src: `/shots/${t.id}.webp`, width: W, height: H, marks, capturedAt: new Date().toISOString() };
    console.log('ok  ', t.id, marks.length, 'marks');
  } catch (e) {
    failed++;
    console.log('FAIL', t.id, String(e.message).split('\n')[0]);
    await p.screenshot({ path: `/tmp/fail-${t.id}.png` }).catch(() => {});
  }
  await ctx.close();
}
await browser.close();
mkdirSync(new URL('../site/content/', import.meta.url).pathname, { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(db, null, 2));
process.exit(failed ? 1 : 0);
