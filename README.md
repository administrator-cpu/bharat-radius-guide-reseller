# Bharat Radius Guide — Reseller

User guide for the Bharat Radius panel. Every topic has a real screenshot with numbered marks
(orange = click/type, dashed blue = look here), a direct heading, and three lengths of explanation
the reader switches between at the top: **Short** (10–20 words), **Mid** (20–70), **Detailed** (70–500).

Light and dark themes follow the browser/OS setting automatically (and switch live when it changes). The moon/sun
button in the top bar overrides it; flipping back to what the browser wants returns to automatic. Theme and depth
choices are applied by an inline script before first paint, so there is no flash.

```
site/       Next.js 16 static site (deploy this folder to Vercel)
capture/    Screenshot robot: mock API + Playwright script that regenerates every screenshot and mark
```

## Deploy to Vercel

1. Push this folder to a Git repo (or keep it in the monorepo, e.g. `apps/guide`).
2. In Vercel: New Project → import → **Root Directory = `site`**. Framework preset: Next.js. No env vars.
3. Deploy. Build runs `scripts/check-content.mjs` first and fails if any text is outside its word range or a
   screenshot's marks don't match its labels.

Local: `cd site && npm i && npm run dev` → http://localhost:3100

The site is fully static (`output: 'export'`): no server, no database, served from Vercel's CDN.

## Edit text

All copy lives in `site/content/reseller.ts`. Each topic:

| field | what it is |
|---|---|
| `title` | Heading |
| `marks` | One label per numbered mark on the screenshot, in order |
| `short` / `mid` / `detailed` | The three explanations. `detailed` supports blank-line paragraphs, `1.` and `-` lists, and `Tip:` callouts |

Run `npm run check` after editing.

## Refresh screenshots (after the panel UI changes)

Needs the product repo checked out next to this folder, Node 22 and Google Chrome.

```bash
# 1. mock API with sample data (no Mongo/Postgres needed)
cd capture && npm i && node mock/server.mjs &          # :4100

# 2. the real panel, pointed at the mock
cd ../../bharat-radius/apps/web
API_ORIGIN=http://127.0.0.1:4100 npx next build && npx next start -p 3000 &

# 3. capture (all topics, or name some)
cd ../../../guide/capture
node capture.mjs                  # writes site/public/shots/*.webp + site/content/shots.json
node capture.mjs recharge kyc     # just these
node review.mjs                   # optional: contact sheets with marks drawn, in /tmp/review
```

If a button is renamed or removed, `capture.mjs` prints `FAIL <topic>` and exits non-zero instead of saving a
wrong picture. Fix the locator in `capture/topics.reseller.mjs`.

`mock/openapi.json` is copied from `apps/web/openapi.json`; copy it again when the API changes.
Sample data lives in `mock/server.mjs` (fictional ISP "Mithila Fibernet", reseller R-0012).

## Add a topic

1. Add an entry in `capture/topics.reseller.mjs`: page to `open`, optional `prepare` clicks, `marks` to point at.
2. Add the copy in `site/content/reseller.ts` with the same `id` and one `marks` label per mark.
3. `node capture.mjs <id>` then `npm run check`.

## Next audiences

`site/lib/content.ts` already lists *ISP Admin & Staff* and *Customer* (shown as "soon"). Add
`content/admin.ts` + `capture/topics.admin.mjs` (with a staff `/auth/me` in the mock), set `ready: true`.
The same `content/*.ts` files are the knowledge base for the planned AI help chat.
