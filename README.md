# TinoDash — Privacy-First Inheritance Decision Dashboard

**Property A (Cupertino 95014)** inherited via trust ~2040–2050 vs **Property B (SF 94122, Outer Sunset, 3-unit, already owned)**

🔗 **Live Dashboard (GitHub Pages):** `https://kanlerxz87-cyber.github.io/TinoDash1/` — served from both **root** (primary 17-page site) and **`docs/`** (legacy 9-page docs) for compatibility.

## What this is

**Executive Summary** with *What would change the answer* on the first screen — pre-commit triggers before the appraisal arrives. **Pure + Mixed paths** compared at same transfer dates/horizons (10/20/30/50 yr) with taxes, debt, occupancy, capital, liquidity. **Black-Swan phased path** — park sale proceeds in 3M–2Y Treasuries 24–36 mo then DCA into stocks; 1929/1970s/2008/2022 crash-entry stress; **reinvestment risk** labeled beside every staging headline.

**Taxes fully separated:** Prop 13/19 + TRA (~1.18% Cupertino), Prop H transfer tax (SCC $1.10/$1k vs SF 0.75% + $249/$65 parcel tax), §121 exclusion ($250k/$500k), FTB 540 BHST 1% over $1M (gains as ordinary), NIIT 3.8%, depreciation 27.5yr + 25% recapture — each with official sources.

Includes what-if sliders, distribution chart (P10–P90), 5-yr capital plan, insurance research by ZIP, deadlines timeline, legislation tracker (enacted vs proposed), **one-page Attorney & CPA Briefing Sheet** (printable, rounded $10, no PII), and **Flagged for Review** (no hallucinated filling).

## Privacy

- No names, addresses, APNs, or exact ledgers on site. All figures rounded to nearest **$10** per request to prevent search traceability.
- Private estate inventory is a *local encrypted file* — never committed (`.gitignored` root `private/` + `docs/private`).
- Git history verified clean (initial commit 8f95825 only) — see `methodology.html#exposure` + legacy `docs/flagged.html`.

## Structure — two complementary sites

```
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
