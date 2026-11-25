# TinoDash — Cupertino (95014) Inheritance Decision Dashboard

Private, anonymized decision lab for **Property A (Cupertino 95014)** inherited via trust ~2040–2050 vs **Property B (SF 94122, already owned)**.

🔗 **Live site (GitHub Pages):** `https://kanlerxz87-cyber.github.io/TinoDash1/` (after Pages deploy — see `_config.yml`)

## What this is

- **Executive Summary** with *What would change the answer* on the first screen — pre-commit triggers before the appraisal arrives.
- **Pure + Mixed paths** compared at same transfer dates/horizons (10/20/30/50 yr) with taxes, debt, occupancy, capital, liquidity.
- **Black-Swan phased path** — park sale proceeds in 3M–2Y Treasuries 24–36 mo then DCA into stocks; 1929/2008 crash-entry stress; reinvestment risk beside headline.
- **Prop 13/19, TRA, Prop H transfer tax, §121 exclusion, MHS 1% over $1M, NIIT, depreciation/recapture** — each with official sources.
- **What-if controls, distribution chart, 5-yr capital plan, insurance research by ZIP, deadlines timeline, legislation tracker (enacted vs proposed).**
- **One-page Attorney & CPA Briefing Sheet** (printable, rounded $10, no PII).
- **Flagged for Review** — every unverified assumption published; no hallucinated filling.

## Privacy

- No names, addresses, APNs, or exact ledgers on site. All figures rounded to nearest **$10** per request to prevent search traceability.
- Private estate inventory is a *local encrypted file* — never committed (`.gitignored`). Site is anonymized placeholders only.
- Git history verified clean (single initial commit, no prior public-data exposure) — see `methodology.html#exposure`.

## Structure

```
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
```

## How to use

1. Start at **Executive Summary** — read *What would change the answer* and agree in writing with date.
2. Check **Flagged** — clear red items (rent comps, TRA, leases, estate size, debt) before deciding.
3. Run **What-Ifs** — move sliders; see if recommendation moves.
4. Print **Briefing Sheet** for attorney/CPA meeting.
5. Re-run **annually** with updated inputs (see Timeline + Legislation tracker).

## Verification

Every table row links to an official authority (IRS, FTB, BOE, SCC/SF Assessor/Recorder/Treasurer, CDI, BLS, FRED, Treasury, CPUC, SF Rent Board). If unverified, blank + flagged. See `sources.html`, `flagged.html`, `COORDINATION.md`.

## GitHub Pages

- `_config.yml` + `.nojekyll` present. Pages source = main branch (or deploy via Actions if enabled).
- After merge to `main`, verify deploy at `https://kanlerxz87-cyber.github.io/TinoDash1/` — no broken links (checked via link audit pre-merge).

## Re-check cadence

Quarterly (Feb/May/Aug/Nov) — IRS Rev. Proc., FTB 540 booklet, SCC TRA Book, SF Treasurer transfer tax, SF Rent Board limits, insurance filings. Logged in `legislation.html`.

---

*Educational only — not legal, tax, or investment advice. Verify with licensed attorney/CPA/financial adviser. Official sources outrank this site.*
