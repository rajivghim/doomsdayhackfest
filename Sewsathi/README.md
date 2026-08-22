# SewaSathi (\u0938\u0947\u0935\u093e\u0938\u093e\u0925\u0940)

AI-powered civic issue reporting for Nepal \u2014 snap a photo of a pothole, exposed wire,
or blocked drain, let Gemini 1.5 Flash estimate the repair budget and crew needed,
pin the exact spot on the map, and rally your neighbors with "I'm Affected Too" upvotes.

## Stack
- **Frontend:** Vite + Vanilla JavaScript
- **Maps:** Leaflet.js + OpenStreetMap tiles
- **AI:** Google Gemini 1.5 Flash (structured JSON output)
- **Backend:** Supabase (PostgreSQL + RPC stored procedure)
- **Voice:** Web Speech API (`ne-NP` \u2192 `en-US` fallback)

## 1. Install

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard \u2192 Project Settings \u2192 API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard \u2192 Project Settings \u2192 API |
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

**No keys? No problem.** SewaSathi detects missing/placeholder keys automatically
and runs entirely on local demo data (mock reports + a heuristic offline AI
estimate), so the whole UI stays functional for a demo or hackathon judge round.

## 3. Set up the database

Open the Supabase SQL Editor and run `schema.sql`. This creates:
- the `reports` table with RLS policies (public read + insert)
- the `increment_upvote(report_id uuid)` stored procedure (SECURITY DEFINER,
  so upvotes are race-safe and can't be abused via raw UPDATE statements)
- a realtime publication + four seed rows so the map isn't empty on first load

## 4. Run it

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
npm run preview
```

## Notes
- The AI estimate card ("stamp") shows `AWAITING PHOTO \u2192 ANALYZING\u2026 \u2192 VERIFIED \u2713`
  as Gemini processes the image, and pre-fills the report's category/severity/title.
- The mic button defaults to Nepali (`ne-NP`) speech recognition and automatically
  falls back to English (`en-US`) if the browser/OS doesn't support Nepali.
- Reports with 20+ upvotes are flagged as a "\ud83d\udd25 HIGH-IMPACT CLUSTER" in the feed and
  rendered as larger markers on the live map.
