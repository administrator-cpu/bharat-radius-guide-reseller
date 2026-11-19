// Draws the marks onto each shot (for checking only) and builds 2x2 contact sheets in /tmp/review.
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
const db = JSON.parse(readFileSync(new URL('../site/content/shots.json', import.meta.url), 'utf8'));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(db);
mkdirSync('/tmp/review', { recursive: true });
const tiles = [];
for (const id of ids) {
  const s = db[id];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}">${s.marks.map((m) => `<rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" fill="none" stroke="${m.kind === 'click' ? '#e11d48' : '#2563eb'}" stroke-width="3" rx="6"/><circle cx="${m.x}" cy="${m.y}" r="14" fill="#e11d48"/><text x="${m.x}" y="${m.y + 5}" font-size="15" font-family="sans-serif" fill="#fff" text-anchor="middle">${m.n}</text>`).join('')}<text x="10" y="${s.height - 12}" font-size="28" font-family="sans-serif" fill="#e11d48">${id}</text></svg>`;
  const buf = await sharp(new URL('../site/public' + s.src, import.meta.url).pathname).resize(s.width, s.height).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  tiles.push(await sharp(buf).resize(720, 450).png().toBuffer());
}
for (let k = 0; k < tiles.length; k += 4) {
  await sharp({ create: { width: 1440, height: 900, channels: 3, background: '#fff' } })
    .composite(tiles.slice(k, k + 4).map((input, j) => ({ input, left: (j % 2) * 720, top: Math.floor(j / 2) * 450 })))
    .png().toFile(`/tmp/review/sheet${k / 4}.png`);
}
console.log(Math.ceil(tiles.length / 4), 'sheets');
