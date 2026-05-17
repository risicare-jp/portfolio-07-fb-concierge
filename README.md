# Customer-Facing AI Concierge for a Japanese Izakaya

**A guest-facing AI concierge for HINOKAMI Toronto — a pre-opening landing for a Japanese izakaya opening Spring 2027. Three languages auto-detected. Menu, allergens, sake pairings, reservations — all answered inside one chat panel, all grounded in what the venue actually knows. Built in two days end to end.**

▶︎ **[Watch the 90-second demo on Loom](https://www.loom.com/share/904e3b32958441808d047092798896c4)** — see a multilingual guest browse the menu, run an allergen check, and book a private room without ever leaving the chat panel.

▶︎ **[Try the live site](https://hinokami-toronto-launch.lovable.app)** — pre-opening landing for HINOKAMI Toronto, fully interactive.

> *As a former heavy-industry QA welder in nuclear power plant maintenance and a Vancouver front-of-house manager, I bring a zero-defect mindset to bilingual F&B operations. A guest who asks about a dress code, a peanut allergy, or a private room for six on Friday is asking three completely different questions — but they expect one calm voice. This concierge is built to be that voice.*

This is the fourth project in a Portfolio sequence aimed at Japanese F&B groups operating in North America. See also:

- [Portfolio 01 — Bilingual Restaurant SOP Generator](https://github.com/risicare-jp/portfolio-01-sop-generator) — back-office bilingual documentation
- [Portfolio 02 — Real-time Allergen Decision Support](https://github.com/risicare-jp/portfolio-02-realtime-allergen) — service-floor allergen decisions
- [Portfolio 03 — Multi-location Daily Report Automation](https://github.com/risicare-jp/portfolio-03-daily-report-automation) — multi-location oversight

This one is the customer-facing tier: a guest-facing AI concierge integrated into the venue's landing site, fluent in English / 日本語 / 简体中文, grounded in the operator's actual menu, sake list, allergen matrix, and house rules.

---

## What it does

**Conversational Q&A** in three languages, with locale auto-detection:

- Hours, location, transit access
- Menu (17 dishes across 4 counters), sake (24 labels), drinks
- Payment methods, gratuity, budget (with live JPY / CNY conversion in chat)
- Dress code, manners, photo policy, time limits
- **Cancellation policy by seat type** (Counter 24-hour vs Private room 72-hour)
- Occasion suitability (date / business hosting / kanreki / buyout with $4,500 minimum)

**Inline Order Assistant** — 4-step allergen check, deterministic verdict per dish:

1. Party size (1-8)
2. Per-person allergens (14 dimensions: Soy / Egg / Fish Eggs / Seafood / Shellfish / Dairy / Gluten / Sesame / Pork / Beef / Onion / Garlic / Alcohol / Nuts)
3. Dish selection across 4 counters
4. Verdict per dish: ○ Safe / △ Trace risk / × Contains — with cross-counter substitution suggestions using `balance_partners` data structure

**Inline Reservation Assistant** — 7-step flow with venue-specific rules:

1. Date (next 14 days)
2. Time slot (5pm-9:30pm)
3. Party size
4. **Seating cards filtered by party size** (Counter hidden for party of 6+; Private hidden for party of 1-3)
5. Contact (name / email / phone)
6. Special requests (skippable)
7. Confirmation summary with **cancellation policy text auto-swapped** based on seating choice (24-hour for Counter / Table, 72-hour for Private room)

Mock confirmation number: `HNK-{YYMMDD}-{4-char hash}`, deterministic per `name+email`.

**Sake Pairing + Chef's Recommendation** — additional inline flows for dish-to-sake matching and party-size-to-course suggestions.

**Currency conversion in chat** — live FX from open.er-api.com (24-hour cached, with bundled fallback), locale-driven defaults (EN → CAD, JA → JPY, CN → CNY).

---

## See it in action

Hero — HINOKAMI wordmark with floating Concierge button　<img width="2846" height="1626" alt="01-hero-with-concierge png " src="https://github.com/user-attachments/assets/4569e08b-169c-4d1d-8ad2-b60e4d43a2aa" />

Multilingual Concierge — Japanese reply with JPY conversion<img width="2844" height="1624" alt="02-concierge-multilingual" src="https://github.com/user-attachments/assets/f8100fc2-3aac-4f6a-b4b5-a451bf8039fb" />

Order Assistant — Step 4 verdict report with allergen badges<img width="2858" height="1624" alt="03-order-assistant-verdict" src="https://github.com/user-attachments/assets/4ad75407-47a2-4341-a584-7f798c12a28e" />

Reservation Assistant — confirmation card returned in chat<img width="2846" height="1624" alt="04-reservation-confirmation" src="https://github.com/user-attachments/assets/3de5c08a-70d7-41ac-a2b7-bc3dbba9c805" />



The site:

- 8 homepage sections: Hero / Story / Menu (with Seasonal carousel + 4 counters in zig-zag layout + counter theme photos) / Room / Visit / Reserve (with OpenTable-style tab switcher) / About this site / Footer
- `/gallery` page: 21-image grid with filter tabs (Cuisine / Atmosphere / The Chef) + lightbox + sticky `← Back` to home
- `/menu` page: 5-tab full menu (All / Robata / Counter / Donabe / Drinks) + sticky `← Back` to Menu section

Visual language: Sumi (墨) #15110E background, amber #D4A574 accent, Cormorant Garamond serif headlines, white serif heading split into 2 colored lines per JA layout pattern.

---

## The Concierge KB — operator knowledge as a system prompt

Generic chatbots answer "what time do you open?". This one answers what F&B operators are actually asked. The system prompt embeds:

**Menu data** (17 dishes × 14 allergen dimensions, 3 locales each)
- Counter assignment (`robata` / `sashimi` / `donabe_sake`)
- Per-allergen verdicts: `safe` / `contains` / `trace`
- Cross-counter `balance_partners` (`mode_balance` / `mode_echo`) for substitution suggestions

**Sake data** (6 featured labels × prefecture × tasting notes × pairing recommendations × glass/bottle pricing)

**Drinks data** (18 entries × category × pairing dishes)

**Payment & cost**: per-seat-type price ranges, accepted methods, gratuity rules

**Dress code & manners**: smart casual specifics, photo policy, time limits, cancellation policy by seat type, children policy

**Occasion suitability**: Counter (date / solo / tourist) vs Table (business / casual / 2-6) vs Private (family / birthday / kanreki / 4-8) vs Buyout (30-64 / $4,500 minimum)

Three locales in parallel, no post-hoc translation. The current implementation does not enable prompt caching; the cost section below explains the trade-off and the one-line upgrade path.

---

## The language detection fix — simplified Chinese vs Japanese

Haiku 4.5's default language detection defaults to Japanese for inputs like 「电话号码是多少?」 because of shared kanji. The system prompt fortifies this with:

- An explicit list of **simplified-Chinese unique characters** (`电 / 码 / 号 / 与 / 点 / 们 / 这 / 国 / 这 / 们 / 应 / 个`) that disambiguate from Japanese
- A **per-message independent re-detect rule** so multi-turn conversations don't bleed language assumptions between turns
- A **traditional Chinese fallback** that nudges responses to simplified Chinese (Toronto Chinese community demographic)

Verified end-to-end: "电话号码是多少?" → simplified Chinese response. "電話番号は?" → Japanese response. "What's your phone number?" → English response. No language bleed across multi-turn conversations.

---

## Architecture

```
[Lovable preview / production deploy]
        │  guest browses Hero / Story / Menu / Reserve / Gallery / Full Menu
        │  guest taps the floating Concierge button (bottom-right, amber, 56px)
        ▼
[Concierge chat panel — 380×560 desktop / fullscreen mobile]
        │  guest types or speaks
        ▼
[Locale auto-detect + per-message language check]
        │  EN / JA / CN — with simplified-Chinese unique-character fortification
        ▼
[TanStack Start server-side route handler]
        │  forwards to Anthropic Messages API; key never reaches the browser
        ▼
[Anthropic Messages API — claude-haiku-4-5]
        │  system prompt: KB (menu / sake / drinks / payment / dress code / cancellation / occasion)
        │  user message + conversation history
        │  max_tokens 1024, non-streaming
        ▼
[Concierge response — locale-matched]
   ├─ Q&A inline (1-3 sentences)
   ├─ [INTENT: ORDER_ASSISTANT]       → opens 4-step allergen flow (inline in chat panel)
   ├─ [INTENT: RESERVATION_ASSISTANT] → opens 7-step reservation flow (inline in chat panel)
   ├─ Sake Pairing / Chef's Recommendation → opens additional inline flows
   └─ Currency conversion: live FX from open.er-api.com (24h cached + bundled fallback)
        ▼
[Inline flow result — verdict / confirmation # — rendered inside the chat panel]
```

Five design choices that distinguish this from a generic "restaurant chatbot":

- **Operator knowledge sits in the system prompt, not in a vector store.** The kitchen's menu / sake / cancellation / dress code / occasion suitability all live in one Claude Haiku system prompt. Three locales in parallel. (The current implementation does not enable prompt caching; the [Cost profile](#cost-profile) section explains the one-line upgrade.)
- **Language detection is fortified for simplified Chinese.** Explicit unique-character whitelist + per-message independent re-detect (see [The language detection fix](#the-language-detection-fix-simplified-chinese-vs-japanese)).
- **Allergen verdicts are matrix lookups, not model judgment.** The 17 × 14 allergen matrix lives as structured data in `src/data/menu.json`. The model translates intent ("I have a peanut allergy") into the Order Assistant flow; the deterministic per-person, per-dish lookup delivers the verdict. **The model translates; the data delivers.**
- **Reservation flow respects the venue's actual rules.** Seating cards filter by party size. Cancellation note text swaps between 24-hour and 72-hour variants based on the chosen seating. Mock confirmation # is deterministic per `name+email` for reproducible portfolio demos.
- **Server-side proxy, no client-side keys.** TanStack Start's route handlers proxy every Anthropic call. The `ANTHROPIC_API_KEY` never reaches the browser. Same posture is production-deployable as is.

The model ID is a single constant. It can be swapped to `claude-sonnet-4-6` for higher-nuance conversation, or downgraded as cheaper Haiku revisions ship — without any other code change.

---

## Tech stack

- **Frontend / hosting**: [Lovable](https://lovable.dev) (TanStack Start TypeScript template `tanstack_start_ts_2026-05-12`)
- **AI**: Anthropic Messages API, model `claude-haiku-4-5`
- **FX rates**: [open.er-api.com](https://open.er-api.com) — free tier, 24-hour cached in `localStorage`, with bundled fallback
- **Image assets**: Google ImageFX (Imagen 3) — 10 photographic atmosphere shots
- **Icons**: Lucide React (`Menu`, `Instagram`, `Facebook`, `Twitter`, etc.)
- **Typography**: Cormorant Garamond (serif heading) / Hiragino Mincho ProN / Yu Mincho (JA serif) / system sans-serif body

Production deploy: Lovable's built-in hosting (or fork the project and deploy to Vercel / Netlify / your own infrastructure).

---

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/routes/` | TanStack Start route files (homepage, /gallery, /menu) |
| `src/components/` | Concierge widget, Order Assistant, Reservation Assistant, Hero, Menu sections, Footer, etc. |
| `src/data/menu.json` | 17-dish seed: counter / names (EN/JA/CN) / price_cad / descriptions / 14 allergen dimensions / balance_partners / signature flags |
| `src/data/sake.json` | 6 sake labels: prefecture / tasting notes / pairing dishes / glass/bottle pricing |
| `src/data/drinks.json` | 18 drinks: category / pairing dishes / price_cad |
| `src/data/concierge-system-prompt.ts` | Canonical Claude system prompt (KB embedded inline, 3 locales, language detection rules) |
| `src/lib/locale.ts` | Locale state + persisted localStorage (`tomokos_locale_v1`) |
| `src/lib/fx.ts` | open.er-api.com fetcher + 24-hour cache + bundled fallback |
| `src/api/concierge.ts` | TanStack Start route handler — server-side Anthropic proxy |
| `src/assets/menu/` | 4 counter theme photographs (Robata / Counter / Donabe / Drinks — ImageFX Imagen 3) |
| `src/assets/seasonal/` | 3 spring seasonal dish photographs (ImageFX Imagen 3) |
| `src/assets/room/` | 2 room photographs (counter view + private tatami — ImageFX Imagen 3) |
| `src/assets/reserve/` | Reserve section interior photograph (ImageFX Imagen 3) |
| `docs/concept.md` | Locked spec from Day 1 |
| `docs/day1-2-3-worklog.md` | Day 1-3 build worklog |
| `docs/day4-worklog.md` | Day 4 build worklog (Pass 1-11 + inline + Phase B) |
| `docs/loom-shot-list.md` | 90-second Loom narration + screen action shot list |
| `docs/notion-case-study.md` | Source of truth for the Notion case study |

The runtime lives in Lovable. The git-tracked source is the Lovable-synced project — read it as a reference, fork it via Lovable's GitHub integration, or clone and run locally with TanStack Start's dev server.

---

## Setup

### Option A — Fork via Lovable (recommended)

1. Sign up at [lovable.dev](https://lovable.dev)
2. Use Lovable's "Import from GitHub" feature to fork this repository as a new Lovable project
3. In Lovable Project settings → Secrets, add `ANTHROPIC_API_KEY` (get one from [console.anthropic.com](https://console.anthropic.com))
4. Customize: edit menu / sake / drinks data, update the system prompt KB for your venue's rules, swap counter theme photos, change brand name and colors
5. Publish to Lovable's hosting, or connect to your own domain

### Option B — Clone and run locally

```bash
git clone https://github.com/risicare-jp/portfolio-07-fb-concierge.git
cd portfolio-07-fb-concierge
npm install
cp .env.example .env
# edit .env: ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Visit `http://localhost:3000`. The site reloads on file change.

### Customizing for your venue

The Concierge is built to be a template. The honest list of what you need to swap:

- **`src/data/menu.json`**: replace 17 dishes with your menu (keep schema: counter / names per locale / price_cad / allergen verdicts × 14 dimensions / balance_partners)
- **`src/data/sake.json`** & **`drinks.json`**: replace with your drink list
- **`src/data/concierge-system-prompt.ts`**: rewrite the KB section for your venue's actual rules (dress code specifics, cancellation policy by seat type, occasion suitability, payment methods)
- **Brand**: name, logo wordmark, brand color, opening date, address, contact email
- **Photographs**: replace counter theme photos and atmosphere shots with your venue's actual photography (or commission ImageFX / a photographer)
- **Languages**: if you don't need 3 locales, simplify the i18n keys. If you need a different language pair, replace the simplified-Chinese fortification rules with your pair's analog.

A full venue customization is roughly **half a day** if you have your menu and rules ready.

---

## Cost profile

`claude-haiku-4-5` at $1 / $5 per million tokens (input / output). Numbers below reflect the current implementation, **measured** against actual Anthropic console usage during the build window.

| Scenario | Input | Output | Cost per interaction |
| --- | --- | --- | --- |
| Any Q&A turn (current implementation, uncached) | ~3,500 tokens | ~150 tokens | **~$0.0042** |
| Order Assistant verdict (deterministic, no model call) | **0** | **0** | **$0.00** |
| Reservation Assistant confirmation (deterministic, no model call) | **0** | **0** | **$0.00** |
| Currency conversion in chat (FX cached locally, no model call) | **0** | **0** | **$0.00** |
| Typical guest journey (≈ 6 Q&A turns) | — | — | **~$0.025** |
| Same journey *with* prompt caching enabled (1-line change) | — | — | **~$0.006** (4× cheaper) |

A venue running thousands of guest interactions per month sits at single-digit dollars of API cost. Total operating cost — hosting + AI + FX + domain — rounds to **~$35-50/month** in steady state.

For comparison: agency-built guest-facing AI for hospitality is in the $5,000-15,000 initial range plus $200-500/month maintenance. This sits at roughly **1/100 of the build cost and 1/10 of the monthly**.

**Prompt caching is the obvious production upgrade.** The current implementation does not enable Anthropic's prompt caching — every API call sends the full system prompt fresh. Adding a `cache_control: { type: "ephemeral" }` marker to the system block in `src/api/concierge.ts` reduces multi-turn cost by approximately 4× (Anthropic prices cache reads at 10% of regular input, with a 5-minute TTL). Skipped intentionally on the Day 3 build to keep the first Anthropic integration simple; documented in [What's deliberately not in scope](#whats-deliberately-not-in-scope).

**Build cost reality check**: the entire two-day build — including ~30 prompt iterations, exhaustive multilingual testing, and four AI flow validations — cost approximately **$0.10 USD** total at Anthropic (measured at `console.anthropic.com`: 83,406 input tokens + 2,384 output tokens across the build window, no caching).

---

## What's deliberately not in scope

This is a two-day build with a hard scope. What's deferred (and the reason):

- **Prompt caching is not enabled.** Every API call sends the full system prompt fresh — the `cache_control: { type: "ephemeral" }` marker was deliberately omitted from the Day 3 build to keep the first Anthropic integration simple. Adding it is a one-line change in `src/api/concierge.ts` that cuts multi-turn cost by approximately 4× (Anthropic prices cache reads at 10% of regular input, 5-minute TTL). Documented in [Cost profile](#cost-profile); the obvious first production upgrade.
- **Real reservation backend.** Confirmations are mocked client-side; no DB record, no email sent. Production path: Supabase (Lovable native integration) + Resend API + a small staff dashboard — ~3 days of focused dev.
- **POS / OpenTable / Resy integration.** None of the major reservation platforms or POS systems are wired in. Per-vendor integration is custom, typically 2-5 days per integration.
- **Multi-venue support.** Single-venue today. Multi-venue requires schema changes for venue selection in menu / reservation / KB — estimated +1 day.
- **Chat improvement loop.** Conversations aren't captured, reviewed, or fed back into the KB. A weekly-batch flag → human review → KB update loop is the natural next phase — the kind of work that supports a monthly retainer subscription, deliberately out of scope for the demo build.
- **Voice input on the guest side.** Typed input only. Voice (Web Speech API) is ~half a day to add and is already proven in [Portfolio 02](https://github.com/risicare-jp/portfolio-02-realtime-allergen).
- **Cross-browser QA on edge devices.** Tested on Safari Mac, Chrome Mac, iPhone Safari. Older Android browsers, low-bandwidth conditions, and full screen-reader accessibility have not been exhaustively verified.

These are deliberate cuts, not oversights. Each is one PR — or one conversation — away from being added.

---

## Known limitations

**Reservation flow is a mock.** Clicking `Confirm reservation →` returns a deterministic confirmation number but does not write a DB record or send an email. The "(Demo only — no actual reservation is recorded)" notice is visible on the result card. Production wiring is documented above.

**Concierge can hallucinate on out-of-KB questions.** If a guest asks something not in the system prompt (e.g., "Do you have a parking validation deal with the lot across the street?"), the model is instructed to defer to "Let me connect you to our team at reserve@hinokami.to" and stop. This is a `prompt instruction` defense, not a `tool use` validation — the right production-grade fix is to switch the architecture to retrieval-augmented generation against a curated source of truth, which is out of scope for this build.

**Language detection on multilingual greetings.** A single-message input like "Hi, 你好, こんにちは" gets handled as whichever language Haiku 4.5 ranks first. The system prompt nudges toward the previously-active locale in this case, but it's an edge condition worth noting.

---

## Licensing & usage

MIT-licensed for reference and adaptation. Your menu, sake, allergen matrix, and house rules — and any chat content generated against them — remain entirely yours. The only third party in the data path is Anthropic (the Messages API call) and open.er-api.com (the FX rate fetch).

---

## Hire me

If you run a Japanese restaurant in North America, or you are scoping guest-facing AI for an F&B group expanding here — *multilingual concierges, allergen-aware menus, inline reservation flows, occasion-routed recommendations, customer-facing surfaces grounded in real operator knowledge* — I take this on as freelance work on Upwork.

- **Upwork**: https://www.upwork.com/freelancers/~011e69140153120f93
- **Email**: risicare929@gmail.com
- **Notion case study**: https://leeward-yard-638.notion.site/Customer-facing-AI-Concierge-for-a-Japanese-Izakaya-Portfolio-Case-Study-363061344956801c99bdd05b924304d8
- **Live site**: https://hinokami-toronto-launch.lovable.app
- **Demo video**: https://www.loom.com/share/904e3b32958441808d047092798896c4

The code is yours to read, fork, and adapt. If you want it tailored to your menu, your venue rules, and your language pairs, say hello.
