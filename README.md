# TinoDash1 — Inheritance Decision Lab (Property A: Cupertino, CA 95014 · Property B: Outer Sunset, SF 94122)

A privacy-first, source-verified decision dashboard for the question: **when Property A (inherited by trust, circa 2040–2050) is received, should the heir live in it, rent it out, or sell it and reinvest — and how does Property B factor in?**

**Live site:** published via GitHub Pages from `main` (root). See the repo's Pages settings.

## Privacy-first

This repo and the site contain **no personal information**. Placeholders only (Property A / Property B). Figures are rounded to the nearest $10 and shown as ranges. See [PRIVACY.md](PRIVACY.md) and [COORDINATION.md](COORDINATION.md) (shared task board for parallel agent sessions).

## What's inside

- Executive summary with "what would change the answer" on the first screen
- Attorney & CPA one-page briefing sheet (printable)
- Both properties analyzed: historical bills/assessments (rounded), 2% Prop 13 cap, Prop 19 reassessment math, projections by year (2030–2050)
- Path comparison at identical transfer dates and horizons (live / rent / sell / phased Treasury-ladder / mixed paths), with taxes, reassessment, occupancy constraints, capital costs and liquidity
- Interactive projections with what-if controls, inflation/appreciation ranges, a distribution-of-outcomes chart, and a Black Swan lab re-running 1929 / 1973–74 / 2000–02 / 2008-style conditions and a 24–36-month 3M–2Y Treasury ladder before phasing into equities
- Tax worksheet: federal 2026 (Rev. Proc. 2025-32), CA (top 13.3% incl. the 1% BHSA tax on income >$1M), step-up in basis, IRC §121 exclusion, unrecaptured §1250 gain, Form 706 / portability
- Deadlines as a timeline, a Q&A of missing information, a suggestions board (nothing auto-implements), a pre-commitment agreement, law tracker (enacted vs proposed), glossary, sources index, and a Flagged for Review page

## Method

Every published figure is rounded to the nearest $10 and is either (a) supplied by the owner (rounded), or (b) from an official source linked on the Sources page. Unverifiable values are left blank and flagged — never filled in by inference. This is **not legal, tax, or financial advice**; all decisions require licensed counsel. See `assumptions.html` on the site for the full method.

## Build / serve locally

Static site, no build step. Any static file server works, e.g.:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080/

## Status

See [COORDINATION.md](COORDINATION.md) for the task board, sources, verification log, and flagged irregularities.
