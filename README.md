# Bay Area Inheritance & Real Estate Decision Dashboard (`TinoDash1`)

**Live GitHub Pages Site:** [https://kanlerxz87-cyber.github.io/TinoDash1/](https://kanlerxz87-cyber.github.io/TinoDash1/)

Privacy-first, primary-source-verified decision dashboard analyzing trust inheritance of **Property A (Cupertino, ZIP 95014)** alongside already-owned **Property B (San Francisco Outer Sunset, ZIP 94122)** and potential liquid trust assets.

## Privacy & Verification Standards
- **Strict Anonymization:** Zero personal names, street addresses, trust titles, emails, or Assessor Parcel Numbers (APNs).
- **$10-Increment Rounding:** Every property-level dollar input and historical assessment/tax figure in `data/properties.json` is rounded to the nearest **$10** increment and enforced by `scripts/privacy-audit.mjs`.
- **Verified Official Citations Only:** Statutory, ballot, tax-rate, rental, utility, insurance, and macroeconomic figures link directly to primary official sources (`irs.gov`, `ftb.ca.gov`, `boe.ca.gov`, `santaclaracounty.gov`, `sf.gov`, `sfelections.org`, `huduser.gov`, `home.treasury.gov`, `bls.gov`, `fhfa.gov`, `insurance.ca.gov`, `cpuc.ca.gov`). Unconfirmed assumptions are explicitly listed on [`pages/flagged.html`](./pages/flagged.html).

## Dashboard Structure
- [`index.html`](./index.html) — Executive Summary, *"What Would Change the Answer"* triggers, Pure + Mixed 6-path comparison, and Pre-Commitment Decision Criteria Charter
- [`pages/projections.html`](./pages/projections.html) — Interactive What-If Lab, Low/Base/High range sensitivity, Monte Carlo distribution chart, and 2026–2055 assessment projections
- [`pages/black-swan.html`](./pages/black-swan.html) — Non-constant macro regimes (1929, 1973–82, 2000–09, 2020–23) and 24–36 month Treasury staging with Reinvestment Risk
- [`pages/properties.html`](./pages/properties.html) — Property A vs B profiles, $10-rounded historical tax tables, SCC TRA `013-xxx`, SF Prop H & OMI rules, 95014 rental comps vs HUD SAFMR, utilities/solar, and 5-year CapEx plans
- [`pages/tax-estate.html`](./pages/tax-estate.html) — Separation of Estate Tax vs §1014 Basis vs Prop 19, DSUE liquidity check, inheritance deadline timeline, Nov 2026 legislative watchlist, and IPS template
- [`pages/decisions.html`](./pages/decisions.html) — Action Checklist with recorded Decision & Date log + 7 Missing-Info Discovery Q&As
- [`pages/flagged.html`](./pages/flagged.html) — Flagged for Review (unverified parameters & anomalies)
- [`pages/suggestions.html`](./pages/suggestions.html) — Improvement suggestions to evaluate before implementation
- [`pages/briefing-sheet.html`](./pages/briefing-sheet.html) — One-page printable Attorney & CPA Briefing Sheet
- [`pages/glossary.html`](./pages/glossary.html) — Searchable glossary & repository privacy governance

## Local Checks & Running Locally
```bash
npm run check
# Runs:
# 1. node scripts/privacy-audit.mjs   (PII scan + strict $10 rounding check)
# 2. node scripts/link-audit.mjs      (Relative subpath, DOM binding & HTTPS link audit)
# 3. node --test tests/*.test.mjs     (Financial, tax, Prop 19 & Black Swan unit tests)

python3 -m http.server 4173 --bind 0.0.0.0
```


---
## Merged note (fd4a10e1)
# Primary site (root) — 17 pages — arena-43f9846f
index.html                  — Executive Summary + What would change the answer + distribution chart
briefing.html               — One-page Attorney & CPA Briefing Sheet (print)
timeline.html               — Deadlines as visual timeline
property-tax.html           — TRA lookup, assessed/tax tables, Prop 19 carry-forward, transfer tax + Prop H
estate.html                 — Estate tax vs Basis vs Assessment + private inventory + IPS
paths.html                  — Pure & mixed paths + imputed rent + §121 + same-year sale + what-if sliders
blackswan.html              — Black-swan economics + phased Treasuries→DCA + 1929/2008 backtest
sensitivity.html            — What-if controls + Form 540 MHS 1% + 7 tax-aware sensitivities
sf-property.html            — Property B leases + SF rent control
insurance-maintenance.html  — Insurance by ZIP + 5-yr maintenance & capital plan
legislation.html            — Enacted vs Proposed tracker + recheck log
glossary.html               — Grouped menu + glossary
questions.html              — Questions & missing info → how to discover
suggestions.html            — Suggestions backlog (vote before building)
sources.html                — Every official source line-by-line
flagged.html                — Flagged for Review (unverified)
methodology.html            — Methodology + privacy + change log
css/style.css, js/app.js, data/model.json

# Legacy docs site — preserved (914b57ba + ef80c5c0)
docs/index.html, docs/projections.html, docs/tax-legal.html, docs/black-swan.html,
docs/briefing.html, docs/process-timeline.html, docs/flagged.html, docs/glossary.html,
docs/questions-suggestions.html, docs/data/model_output.json, docs/assets/*

# Reproducible model (914b57ba)
model/data_inputs.json, model/engine.py, build_site.py → regenerates docs/data/model_output.json
  python3 build_site.py
```

## How to use

1. Start at **Executive Summary** (root `index.html`) — read *What would change the answer* and agree in writing with date.
2. Check **Flagged** — clear red items (rent comps, TRA, leases, estate size, debt) before deciding.
3. Run **What-Ifs** — move sliders; see if recommendation moves; see `docs/projections.html` for the legacy model's full projection table.
4. Print **Briefing Sheet** for attorney/CPA meeting (root `briefing.html` or `docs/briefing.html`).
5. Re-run **annually** with updated inputs (see Timeline + Legislation tracker). For docs site, edit `model/data_inputs.json` + `python3 build_site.py`.

## Verification

Every table row links to an official authority (IRS PL 119-21/TCJA, FTB 540, BOE P13/19 LTA 2025/009, SCC/SF Assessor/Recorder/Treasurer, CDI, BLS, FRED, Treasury, CPUC, SF Rent Board, SPUR). If unverified, blank + flagged. See `sources.html` + `docs/flagged.html` + `COORDINATION.md`.

- **Official Law Verification (2026):** IRS $15M/$30M (PL 119-21), BOE Prop 19 $1,044,586 (2025–27), FTB 540 13.3% top (1% BHST >$1M), SCC 0.11% ($1.10/$1k), SF 0.75% ($1M–$4.99M), SF Prop H $249/$65.
- **Prior baseline also tracked:** TCJA sunset ~$7M if PL 119-21 not extended — see `legislation.html` enacted vs proposed distinction.

## GitHub Pages

- `_config.yml` + `.nojekyll` (root) and `docs/.nojekyll` present. Pages can serve from **root** or **`docs/`** — both contain valid sites; `_config.yml` includes `css, js, data, assets` and excludes `private/`.
- After merge to `main`, verify deploy at `https://kanlerxz87-cyber.github.io/TinoDash1/` — no broken links (both sites audited pre-merge).

## Re-check cadence

Quarterly (Feb/May/Aug/Nov) — IRS Rev. Proc., FTB 540 booklet, SCC TRA Book, SF Treasurer transfer tax, SF Rent Board limits, insurance filings. Logged in `legislation.html` + legacy `docs/tax-legal.html`.

---

*Educational only — not legal, tax, or investment advice. Verify with licensed attorney/CPA/financial adviser. Official sources outrank this site.*

<!-- merged from fd4a10e1 session -->
# TinoDash1 — Estate Decision Dashboard (Privacy-First)

Static decision-support dashboard for anonymized California property planning. This repository publishes a privacy-first GitHub Pages site with scenarios, timelines, tax/legal references, questions, flagged review items, and a printable Attorney & CPA briefing sheet.

## Privacy

- **No personal information published.** No names, addresses, ZIP codes, parcel IDs, account numbers, or personal identifiers are included in the site or repository artifacts.
- Properties are anonymized as **Property A** (Cupertino, Santa Clara County, CA; future trust inheritance) and **Property B** (San Francisco, CA; already owned).
- Published dollar figures are **rounded to the nearest $10**.
- Sensitive inputs (estate inventory, trust documents, appraisals, tax returns, leases) should be kept in a private, access-controlled location outside this public repo.

## Site

- Source: `docs/`
- Main pages: Dashboard, Executive Summary, Decision Framework, Scenarios & Projections, Black Swan, Timeline & Deadlines, Property Details, Tax & Legal, Questions & Missing Info, Suggestions, Attorney & CPA Brief, Glossary, Sources, Flagged for Review.

## Verification

- Official-source links are included where available.
- Unverified or missing values are left unverified and listed on **Flagged for Review**.
- This is decision support, not legal, tax, or investment advice.

## Local preview

Open `docs/index.html` in a browser, or run a simple static server from `docs/`.
