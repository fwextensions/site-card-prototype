# CareConnect Client (Vite + React 19 + Tailwind v4)

Client-only prototype replicating the Street Team cards with Icon vs Chip variants.

## Structure
- index.html (loads PapaParse CDN and mounts React)
- vite.config.ts
- tsconfig.json
- tailwind.config.ts
- src/
  - index.css (Tailwind + theme variables; phone single-column)
  - main.tsx
  - App.tsx
  - types.ts
  - utils/
    - csv.ts (PapaParse wrappers)
    - mapping.ts (icon/labels mapping & helpers)
  - components/
    - Icon.tsx
    - IconCard.tsx
    - ChipCard.tsx

## CSV loading
- Put `Street_Team_View.csv` in `client/public/` and click "Load CSV in public". It will be served as `/Street_Team_View.csv`.
- Or click "Choose CSV…" and select any CSV file locally.

## Running
- npm install
- npm run dev
- open http://localhost:5173

Note: per request, modules are not installed yet; this is just the scaffold + code.

## Overall project goals / context
- **street-team routing aid**: enable field staff to quickly match a client to an appropriate site while in motion. Minimize reading and cognitive load by using a fixed-order lane and recognizable hospital/EMS iconography.
- **curated schema as source**: the UI is driven by `Street_Team_View.csv` which captures routing-critical fields (admission, security, drop-in/off, accepted-from, intake complexity, medical clearance, LOS, hours, transport, capacity signals, addresses). Intentionally excludes "Open Now" which will be handled by the live app.
- **phone-first, low friction**: single-column cards, large tap targets, consistent placement. Designed for fast skimming, one-handed use, and noisy environments.
- **safe semantics**: show capacity signals as guidance (not live availability). Use neutral, non-stigmatizing visuals. Only render ADA negatively when not compliant to reduce noise.
- **test → standardize**: start with mixed icon sets (Material Symbols, svgrepo) to test comprehension. If successful, evolve into a custom icon set and design system.
- **path to production**: add quick filters, integrate live data streams for availability/transport as appropriate, and embed in the broader CareConnect app. Keep accessibility and performance as first-class constraints.

## Design and testing approach (cards)
- **Goals**
  - Rapid skim in motion, minimal reading, consistent placement.
  - Encode routing-critical decisions: admission type, lock status, drop-in/off, accepted-from, intake complexity, medical clearance, LOS, transport, ADA, capacity signals.

- **Information architecture**
  - Fixed order lane renders in the same sequence across cards: admission → lock → drop-in → drop-off → accepted-from → complexity → medical → LOS → transport in/out (+support) → ADA.
  - Top: `nickname` title, `serviceCategory`/`servicePopulation` as a colored bar.
  - Facts row: `LOS`, `hoursIntake` (or `hoursOperation`), capacity signals (`bedsDph`, `pitCapacity`, `capacityConstraints`).

- **Icon semantics & colors**
  - Category color bar: MH (indigo), Respite (teal), SUD WM (purple), SUD Subacute (magenta).
  - Admission: volunteer/open-hand (voluntary), compare-arrows (both).
  - Security: lock / lock_open / both.
  - Drop-in/out: door arrow; person pin circle.
  - Accepted-from chips: self/person, community/groups, street team/diversity_3, police/local_police, EMS/emergency, hospital/local_hospital, BHAC/badge.
  - Complexity meter via tone: walk-through (ok), full assessment (warn), pre-auth (err).
  - Medical: vaccines (TB), local_hospital (ED), check_circle (none/basic).
  - LOS: wb_sunny (<24h), nights_stay (>24h).
  - Transport: emergency/police/taxi/airport_shuttle stacks; support via volunteer_activism.
  - ADA only shown negatively: not_accessible when not compliant.

- **Variants to A/B test**
  - IconCard: compact pictogram lane.
    - Pros: fastest once learned, high information density, minimal reading.
    - Cons: learning curve; relies on tooltips or a legend for new users.
  - ChipCard: labeled chips alongside icons.
    - Pros: clearer for first-time users, self-explanatory.
    - Cons: taller cards, more scanning time, potential clutter on small screens.

- **User testing plan (10–15 min sessions)**
  1. Warm-up: show legend for 30–60 seconds.
  2. Task 1 (IconCard): “Find a site that accepts Police drop-off, voluntary, no pre-auth, <24h.” Measure time and errors.
  3. Task 2 (ChipCard): Similar difficulty but different target (e.g., EMS accepted, brief screen, TB required).
  4. Ask preference: which helped you decide faster, and why?
  5. Note ambiguous items (e.g., drop-in notes like “call ahead”) and confusion hotspots.

- **Metrics**
  - Time-to-first-viable-site, error rate (wrong criterion), backtracks, subjective confidence (1–5).
  - Learnability delta: improvement from Task 1 → Task 2 within same variant.

- **Accessibility**
  - Icons + shapes + color redundancies; 14px base text; tooltips on hover/long-press.
  - Fixed order reduces cognitive load; tap targets ≥40px.

- **Tradeoffs & next steps**
  - If IconCard is faster post-legend, keep it default and offer a collapsible legend.
  - If ChipCard wins, trim labels and group chips to reduce vertical space; keep fixed order.
  - Add quick filters (category, accepted-from, complexity, medical) to reduce scrolling.

## TODO (optional follow-ups)
- Filters for category/intake/accepted-from
- Persist view choice
- Add lightweight legend component toggle
