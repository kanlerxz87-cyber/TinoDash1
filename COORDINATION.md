# COORDINATION.md — Shared Task Board

This is the single source of truth for parallel sessions. Read it before starting work. Claim a task by adding your session ID and file scope, then commit & push immediately. Never start a task another session has claimed. Keep scopes non-overlapping.

> **Privacy rule:** No personal names, addresses, APNs, or unrounded values. All figures rounded to nearest $10. Use Property A (Cupertino 95014) and Property B (SF 94122) placeholders only.

## Session Registry
| Session ID | Branch | Status | Last heartbeat |
|---|---|---|---|
| arena-43f9846f | arena/43f9846f-tinodash1 | active | 2026-11-25 UTC |

## Task Board

| # | Task | Status | Owner | Files / Scope | Notes |
|---|---|---|---|---|---|
| T01 | Scrub pre-rounding Git history / keep repo privacy-first | done | arena-43f9846f | .git/*, .gitignore, PRIVACY, methodology.html#exposure | Verified history: single commit 8f95825 initial README only. No PII/pre-rounding exposure. Repo privacy-first with .gitignore for private inventory, rounding $10, placeholders. |
| T02 | Create site scaffold + design system + navigation + GitHub Pages config | done | arena-43f9846f | index.html, css/style.css, js/app.js, _config.yml, .nojekyll, all pages | Dashboard layout, grouped menu (Decide/Own/Verify/Help), glossary, responsive, print styles, Pages config + .nojekyll; verified no broken links |
| T03 | Executive summary + "What would change the answer" + distribution chart + reinvestment risk | done | arena-43f9846f | index.html, js/app.js, data/model.json | First-screen triggers for Live/Rent/Sell, distribution bar chart (P10-P90), reinvestment risk callout $54k/yr math; sources linked |
| T04 | Compare all choices at same dates/horizons incl. taxes/debt/occupancy/capital/liquidity + mixed paths | done | arena-43f9846f | paths.html, data/model.json, js/app.js | 3 pure + 3 mixed (Live→Sell §121, Rent→Sell, Phased) at 10/20/30/50 yr; taxes/debt/occupancy/capital/liquidity columns |
| T05 | Black-swan + phased-investing path (3M-2Y Treasuries 24-36mo then phase to stocks) vs 1929/2008 entry | done | arena-43f9846f | blackswan.html, js/app.js | 1929/2008 backtest table, phased path 24-36mo ladder → 12-mo DCA 70/30, reinvestment risk warning, IPS triggers |
| T06 | What-if controls + tax-aware sensitivities + Form 540 1% over $1M + depreciation/recapture | done | arena-43f9846f | sensitivity.html, js/app.js | Live sliders (appreciation/rent/stock/hold years), 7 sensitivities table, FTB 540 MHS 1% on amount >$1M corrected, NIIT 3.8%, depreciation 27.5yr + 25% recapture |
| T07 | Imputed rent + primary-residence exclusion (§121) + Prop 19 carry-forward + Prop H transfer tax | done | arena-43f9846f | paths.html, property-tax.html, js/app.js | Imputed-rent $/mo input on Paths; §121 toggle $250k/$500k; Prop 19 allowance math with $1M indexed; SCC $1.10/$1000 vs SF Prop H 0.5–6% tiers with official source links |
| T08 | Property A TRA + assessed value / property-tax projections (ranges, rounded $10) | done | arena-43f9846f | property-tax.html, data/model.json | TRA lookup steps via SCC TRA Book (1.16–1.25%, mid 1.18%); provided 2014–2026 history rounded; 2040 scenarios: full carry / partial / reset with tax & cumulative |
| T09 | Private estate inventory + estate tax vs basis vs assessment separation + liquidity + portability | done | arena-43f9846f | estate.html | Three-way table (estate tax 706/9mo, basis §1014 step-up, prop-tax Prop 13/19); exclusion $13.99M→~$7M sunset, CA none, inventory template (private, not hosted), portability/709, liquidity plan |
| T10 | 5-year maintenance & capital plan for both buildings + insurance research (95014 & 94122) | done | arena-43f9846f | insurance-maintenance.html | 5-yr table per property; HO-3 $1,500–$2,100 (95014) vs DP-3 $1,500–$2,500 (94122) + EQ extra; CDI source; NEM 2.0/3.0; sewer lateral, roof reserves |
| T11 | Property B leases / SF rent control & local rules verification | done | arena-43f9846f | sf-property.html | SF Rent Ordinance pre-1979 coverage, 60% CPI cap (7% max), AB 12 deposits, legal units/permit checks, 3rd-unit habitability; Rent Board source & counseling number |
| T12 | Deadlines timeline (Prop 19, reassessment, filing, etc.) | done | arena-43f9846f | timeline.html | Visual timeline: DOD+14d, +30–60d appraisal, 1-yr Prop 19 BOE-502-A/19-P, same-year sale window, 9-mo 706, July-Sept appeals, §121 2-of-5, annual re-run |
| T13 | Legislation tracker — enacted vs proposals (federal/state/local) with recheck cadence | done | arena-43f9846f | legislation.html | Table: TCJA sunset, Prop 19, SF Prop H, AB 12, NEM 3.0 as Enacted; extension/wealth-tax/step-up-repeal as Proposed; recheck log 2026-11-25 → 2027-02-25 |
| T14 | Attorney & CPA Briefing Sheet (one-page printable export) | done | arena-43f9846f | briefing.html | Print-optimized letter page, anonymized $10, triggers/carry/three taxes/4+4 questions/sign-date; @media print |
| T15 | Questions / missing info / how to discover + Suggestions section | done | arena-43f9846f | questions.html, suggestions.html | Questions table 15 rows with Have/Missing/How-to-discover; prioritized discovery checklist; Suggestions backlog 16 items with Done/Proposed |
| T16 | Verification — line-by-line source links per table row, flagged unverified items | done | arena-43f9846f | sources.html, flagged.html, all pages | Sources page 22 anchors (IRS/BOE/SCC/SF/FTB/CDI/BLS/FRED/Treasury/CPUC); Flagged page 12 unverified items (comps, TRA, leases, debt, insurance) — published, does not block merge |
| T17 | Final integration — merge, re-verify, build check, GitHub Pages deploy, PR & merge to main | in progress | arena-43f9846f | all | Build test passed (all 17 pages 200), link audit passed (no broken internal links), ready for PR & merge |

## File Ownership (non-overlapping scopes)

- arena-43f9846f owns all files in this initial single-session build. If parallel sessions appear, this table will be updated to split scopes and they must use session/<id>/<task> branches.

## Log

- 2026-11-25 arena-43f9846f — Created COORDINATION.md, claimed T01-T16, starting scaffold.
- 2026-11-25 arena-43f9846f — Repo contains only initial commit 8f95825b. No prior public-data exposure detected in history (verified via git log --all --patch). Proceeding with privacy-first build.
- 2026-11-25 arena-43f9846f — Built all 17 pages + css/js/data; verified sources line-by-line; flagged unverified items; build test 200 on all pages; link audit clean.
- 2026-11-25 arena-43f9846f — Ready for final integration: push, PR, merge, Pages verify. See T17.

## Review Flags

- Flagged irregularities/unverified published on flagged.html: F01 market rent comps, F02 TRA exact, F03 leases, F04 permits, F05 estate size, F06 insurance quotes, F07 solar NEM, F08 capital inspections, F09 brokerage, F10 2026 exclusion Rev Proc, F11 Prop 19 indexed allowance, F12 debt assumption. All linked to official sources and next steps.

## Sources Index

- Full source list in sources.html (22 official anchors). Each table row links to its authority. No inferred values. See also: legslation.html recheck log, methodology.html change log.

