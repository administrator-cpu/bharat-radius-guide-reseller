# Bharat Radius Guide

User guide for Bharat Radius: the **Reseller** panel and the **Customer** portal (plus the expired-plan pay page). Every topic has a real screenshot with numbered marks
(orange = click/type, dashed blue = look here), a direct heading, and three lengths of explanation
the reader switches between at the top: **Short** (10–20 words), **Mid** (20–70), **Detailed** (70–500).

Light and dark themes follow the browser/OS setting automatically (and switch live when it changes). The moon/sun
button in the top bar overrides it; flipping back to what the browser wants returns to automatic. Theme and depth
choices are applied by an inline script before first paint, so there is no flash.

```
site/       Next.js 16 static site (deploy this folder to Vercel)
capture/    Screenshot robot: mock API + Playwright script that regenerates every screenshot and mark
```

## Ask box (free, no AI service)

Two ways in: type in the top search box with the **Ask** toggle on and press Enter, or use the **Ask** button
(bottom right, or press `?`). The chat opens as a column on the left and pushes the guide over (full screen on
phones); it stays open while you move between pages. With the toggle off, Enter in search opens the first result.
The toggle choice is remembered per browser. It answers questions typed in English, Hinglish or Hindi
("customer ka recharge kaise kare", "net nahi chal raha", "रिचार्ज कैसे करें") with the matching topic, its marked
screenshot and links. It runs entirely in the reader's browser: no server, no API key, no cost, and it can only
show text that is already in the guide.

| file | what it is |
|---|---|
| `site/lib/ask/engine.ts` | Matcher: synonyms → filler-word removal → typo correction → weighted scoring + phrase intents |
| `site/lib/ask/lexicon.ts` | Word lists (English / Hinglish / Hindi), extra keywords per topic, phrase intents. Edit this to teach it new words |
| `site/lib/ask/store.ts` | Shared state between the search box and the chat column (open, toggle, question handed over) |
| `site/lib/ask/config.ts` | Optional support phone / WhatsApp / email shown when nothing matches |
| `site/scripts/check-ask.mjs` | ~85 real-style questions with the expected topic. Run `npm run check:ask` after editing |

The index (`/ask-index.json`, ~30 KB) and the chat code are downloaded only when someone opens the box.

When a question fails: add the missing word as a synonym or topic keyword in `lexicon.ts`, add the question to
`check-ask.mjs`, and re-run the check.

## Deploy to Vercel

1. Push this folder to a Git repo (or keep it in the monorepo, e.g. `apps/guide`).
2. In Vercel: New Project → import → **Root Directory = `site`**. Framework preset: Next.js. No env vars.
3. Deploy. Build runs `scripts/check-content.mjs` first and fails if any text is outside its word range or a
   screenshot's marks don't match its labels.

Local: `cd site && npm i && npm run dev` → http://localhost:3100

The site is fully static (`output: 'export'`): no server, no database, served from Vercel's CDN.

## Edit text

Copy lives in `site/content/reseller.ts` and `site/content/customer.ts`. Each topic:

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
node capture.mjs                          # every audience → site/public/shots/*.webp + site/content/shots.json
node capture.mjs --audience customer      # one audience
node capture.mjs recharge portal-kyc      # just these topics
node review.mjs                   # optional: contact sheets with marks drawn, in /tmp/review
```

If a button is renamed or removed, `capture.mjs` prints `FAIL <topic>` and exits non-zero instead of saving a
wrong picture. Fix the locator in `capture/topics.<audience>.mjs`.

`mock/openapi.json` is copied from `apps/web/openapi.json`; copy it again when the API changes.
Sample data lives in `mock/server.mjs` (fictional ISP "Mithila Fibernet", reseller R-0012, customer Priya Jha C010252).

Topic options in `topics.<audience>.mjs`: `device: 'phone'` (390×844, used for every customer screen),
`session: 'staff' | 'customer' | 'none'`, `signedOut: true`, `height` for a taller shot.

## Add a topic

1. Add an entry in `capture/topics.<audience>.mjs`: page to `open`, optional `prepare` clicks, `marks` to point at.
2. Add the copy in `site/content/<audience>.ts` with the same `id` (unique across all audiences) and one `marks` label per mark.
3. `node capture.mjs <id>` then `npm run check`.

## Next audiences

`site/lib/content.ts` lists *ISP Admin & Staff* as "soon". Add `content/admin.ts` + `capture/topics.admin.mjs`
(with an ISP-admin `/auth/me` in the mock), add `'admin'` to `AUDIENCES` in `capture.mjs`, set `ready: true`.
The same `content/*.ts` files are the knowledge base for the planned AI help chat.
