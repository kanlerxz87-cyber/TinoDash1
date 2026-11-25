# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy rule:** All figures rounded to nearest **$10**, placeholders only (Property A Cupertino 95014 / Property B SF 94122). Private inventory never committed (.gitignored).

## Session Registry
| Session ID | Branch | Status | Last heartbeat |
|---|---|---|---|
| arena/914b57ba-tinodash1 | arena/914b57ba-tinodash1 | merged | 2026-11-25 PR #3 merged 6dc4068 |
| arena/ef80c5c0-tinodash1 | arena/ef80c5c0-tinodash1 | merged | 2026-11-25 PR #4 merged 2009903 |
| arena-43f9846f | arena/43f9846f-tinodash1 | active — final integration | 2026-11-25 UTC |

## Task Board — Complete (all sessions)

| # | Task | Status | Owner | Files / Scope | Notes |
|---|---|---|---|---|---|
| T01 | Scrub pre-rounding Git history / keep repo privacy-first | done | arena-43f9846f + 914b57ba | .gitignore, .nojekyll, methodology.html#exposure, docs/.nojekyll | Single initial commit 8f95825 verified clean; no PII history; rounding $10; private inventory .gitignored |
| T02 | Create site scaffold + design system + navigation + GitHub Pages config | done | arena-43f9846f | index.html, css/style.css, js/app.js, _config.yml, .nojekyll, all pages + docs/* from prior sessions | Dashboard layout, grouped menu (Decide/Own/Verify/Help), responsive, print styles, root + docs/ both valid for Pages |
| T03 | Executive summary + "What would change the answer" + distribution chart + reinvestment risk | done | arena-43f9846f (extends 914b57ba) | index.html, js/app.js, data/model.json, docs/index.html | First-screen triggers for Live/Rent/Sell, distribution P10-P90, reinvestment risk $54k/yr beside headline |
| T04 | Compare all choices at same dates/horizons incl. taxes/debt/occupancy/capital/liquidity + mixed paths | done | arena-43f9846f | paths.html, data/model.json, docs/projections.html | 3 pure + 3 mixed (Live→Sell §121, Rent→Sell, Phased) at 10/20/30/50yr |
| T05 | Black-swan + phased-investing path (3M-2Y Treasuries 24-36mo then phase to stocks) vs 1929/2008 entry | done | arena-43f9846f (extends ef80c5c0 black-swan.html) | blackswan.html, docs/black-swan.html, js/app.js | 1929/1970s/2008/2022 backtest, phased 24-36mo ladder → 12-mo DCA 70/30, reinvestment risk |
| T06 | What-if controls + tax-aware sensitivities + Form 540 1% over $1M + depreciation/recapture | done | arena-43f9846f | sensitivity.html, js/app.js, docs/tax-legal.html | Live sliders, 7 sensitivities, FTB 540 BHST 1% over $1M on amount >$1M, NIIT 3.8%, 27.5yr +25% recapture |
| T07 | Imputed rent + primary-residence exclusion (§121) + Prop 19 carry-forward + Prop H transfer tax | done | arena-43f9846f | paths.html, property-tax.html, docs/tax-legal.html | Imputed rent input; §121 toggle $250k/$500k; Prop 19 allowance $1,044,586 (2025-27 BOE LTA 2025/009) carried forward; SCC $1.10/$1k vs SF 0.75% tier + Prop H $249/$65 |
| T08 | Property A TRA + assessed value / property-tax projections (ranges, rounded $10) | done | arena-43f9846f | property-tax.html, properties.html, data/model.json | TRA via SCC TRA Book ~1.16-1.25% mid 1.18%; history 2014-2026 rounded; 2040 scenarios |
| T09 | Private estate inventory + estate tax vs basis vs assessment separation + liquidity + portability | done | arena-43f9846f + ef80c5c0 | estate.html, docs/tax-legal.html | Three-way table: IRS estate $15M/$30M (PL 119-21) vs BOE assessed vs FTB basis; CA no estate tax; inventory template private; portability/709; liquidity plan |
| T10 | 5-year maintenance & capital plan for both buildings + insurance research (95014 & 94122) | done | arena-43f9846f | insurance-maintenance.html, properties.html | 5-yr tables; HO-3 $1.5-2.1k vs DP-3 $1.5-2.5k +EQ; NEM 2.0/3.0; sewer lateral/roof |
| T11 | Property B leases / SF rent control & local rules verification | done | arena-43f9846f | sf-property.html, properties.html | SF Rent Ordinance pre-1979, 60% CPI cap 7%, AB12 deposits, legal units/permits |
| T12 | Deadlines timeline (Prop 19, reassessment, filing, etc.) | done | arena-43f9846f | timeline.html, docs/process-timeline.html | DOD+1yr Prop 19 BOE-502-A/19-P, 9mo 706, same-year sale, appeals Jul-Sep, §121 2-of-5, annual re-run |
| T13 | Legislation tracker — enacted vs proposals (federal/state/local) with recheck cadence | done | arena-43f9846f | legislation.html | TCJA sunset/PL 119-21, Prop 19, SF Prop H, AB12, NEM 3.0 as Enacted; extension/wealth-tax as Proposed; log 2026-11-25→2027-02-25 |
| T14 | Attorney & CPA Briefing Sheet (one-page printable export) | done | arena-43f9846f + 914b57ba | briefing.html, docs/briefing.html | Print-optimized letter page, anonymized $10, triggers/carry/three taxes/4+4 questions/sign-date |
| T15 | Questions / missing info / how to discover + Suggestions section | done | arena-43f9846f | questions.html, suggestions.html, decisions.html, docs/questions-suggestions.html | 15 rows Q&A + discovery checklist + 16 suggestions with Done/Proposed |
| T16 | Verification — line-by-line source links per table row, flagged unverified items | done | arena-43f9846f | sources.html, flagged.html, methodology.html | 22 official anchors; 12 flagged unverified published; does not block merge |
| T17 | Final integration — merge, re-verify, build check, GitHub Pages deploy, PR & merge to main | in progress | arena-43f9846f | all | Build test passed (root 17 pages 200 + docs verified); link audit clean; merging parallel sessions; will push PR & verify Pages deploy |

## File Ownership (post-merge)

- **Root site (primary):** arena-43f9846f — index.html, briefing.html, timeline.html, property-tax.html, estate.html, paths.html, blackswan.html, sensitivity.html, sf-property.html, insurance-maintenance.html, legislation.html, glossary.html, questions.html, suggestions.html, sources.html, flagged.html, methodology.html, css/*, js/*, data/*, _config.yml, .nojekyll
- **Docs site (legacy, preserved):** 914b57ba + ef80c5c0 — docs/* (index.html, projections.html, tax-legal.html, black-swan.html, briefing.html, process-timeline.html, flagged.html, glossary.html, questions-suggestions.html, data/model_output.json, assets/*)
- **Model engine:** 914b57ba — model/engine.py, model/data_inputs.json, build_site.py (regenerates docs/data/model_output.json)

If editing across scopes, log request here instead of directly editing another session's files.

## Log

- 2026-11-25 arena/914b57ba — Built reproducible model + docs/ site (PR #3 93dd541 → 6dc4068 merged)
- 2026-11-25 arena/ef80c5c0 — Updated official law verification 2026 (IRS $15M/PL119-21, BOE $1,044,586, SF 0.75%, Prop H $249/$65) + merged (PR #4 2009903)
- 2026-11-25 arena-43f9846f — Created comprehensive 17-page site with ranges, black-swan phased, Prop19/Prop H, what-ifs, tracker, briefing, sources/flagged; verified history clean
- 2026-11-25 arena-43f9846f — Pushed a53c668 PR #5; detected parallel merge to main; resolving conflicts locally per coordination protocol

## Review Flags

- Flagged items published on flagged.html (root) + docs/flagged.html (legacy): market rent comps, TRA exact, leases, permits, estate size/DSUE/709, insurance quotes, NEM PTO, capital inspections, brokerage, exclusion figures, Prop19 indexed allowance, debt assumption. Each flagged with official source link and next step.

## Official Sources Consolidated

1. **IRS Estate & Gift (2026):** $15M individual / $30M married with portability, 40% top, $19k annual gift exclusion — PL 119-21, IRC §2010(c)(3) (see legacy docs/tax-legal.html) AND $13.99M→~$7M sunset under TCJA §11061 if PL 119-21 not enacted — see estate.html for distinction (enacted vs prior law).
2. **CA BOE Prop 19:** $1,044,586 exclusion cap 2025–27 (BOE LTA 2025/009); 1-yr move-in + BOE-19-P within 3yr; See BOE Prop19.
3. **FTB Form 540:** Gains as ordinary 1–12.3% + BHST 1% over $1M → 13.3% top (FTB 540 Booklet).
4. **SCC Clerk-Recorder:** $0.55 per $500 ($1.10/$1k =0.11%); Cupertino 0% city.
5. **SF Treasurer:** Tiered 0.75% for $1M–$4.999M (plus Prop H $249/$65 parcel tax).
6. All other sources: BOE Prop13 FAQ, SCC Assessor/TRA Book/Assessment Appeals, SF Assessor, CDI Residential Guide 2024, SF Rent Board, Treasury yields, FRED/CSUSHPISA, BLS CPI, CPUC NEM, TCJA statute, SEC, FEMA.

> **Reconciliation note:** Legacy session cites $15M exclusion via PL 119-21 (enacted 2026); current session tracks TCJA sunset to ~$7M as prior current law. Both are kept: legislation.html distinguishes enacted PL 119-21 vs prior sunset baseline — recheck Rev Proc Jan 2026. No inference; both linked.


## Additional session tasks (current session arena/f83e6979-tinodash1)

| # | Task | Status | Owner | Files | Notes |
|---|---|---|---|---|---|
| F1 | Property A (Cupertino 95014) page — valuation/cost/Prop 19 | done | arena/f83e6979-tinodash1 | property-a.html | $3.1M Nov 2026 (user data), verified anchors |
| F2 | Property B (SF 94122) page — valuation, rental profile, net cash flow | done | arena/f83e6979-tinodash1 | property-b.html | Rental $7,150/mo, 2 units of 3 |
| F3 | Costs page — water/electricity/insurance/maintenance (rounded $10, flagged) | done | arena/f83e6979-tinodash1 | costs.html | Research: Baysano, LendingTree, gethomeinsurancequotes.com |
| F4 | Paths page — path comparison + mixed paths + Black Swan + what-ifs + distribution chart | done | arena/f83e6979-tinodash1 | paths.html | Staging 3M–2Y Treasuries 24–36 mo before stocks |
| F5 | Questions/Suggestions — discovery suggestions, What-would-change-the-answer, yearly review checklist | done | arena/f83e6979-tinodash1 | questions.html | 16+ discovery items |
| F6 | Time check — deadline integration | done | arena/f83e6979-tinodash1 | timeline.html, COORDINATION.md | Prop 19 occupancy 1y, transfer 2040–2050, annual review |

## Session 796979 — conflicts resolved (2026-11-25): for duplicate filenames (index/paths/questions/flagged/README/COORDINATION) we kept origin/main's versions; this session's files retained where unique.
