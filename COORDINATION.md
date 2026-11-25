# COORDINATION — Shared Task Board

> Privacy-first: no personal information in this repo or on the site.
> Placeholders only: **Property A** (Cupertino 95014, inherited), **Property B**
> (San Francisco 94122, already owned by the heir), **Decedent**, **Heir**,
> **Trustee**. All dollar figures rounded to the nearest **$10**.

Session ID for this work: `f58323fd` · Branch: `arena/f58323fd-tinodash1`

## Task board

| # | Task | Status | Owner | Files touched | Sources / verification | Irregularities |
|---|------|--------|-------|---------------|------------------------|----------------|
| 1 | Repo setup, COORDINATION.md, README, Pages workflow | **done** | f58323fd | COORDINATION.md, README.md, .github/workflows/pages.yml, .gitignore, scripts/check_links.py | build/link/privacy check passes | — |
| 2 | Landing dashboard + executive summary + "what would change the answer" | **done** | f58323fd | index.html | IRS/FTB/BOE links on every row | — |
| 3 | Interactive model: what-if controls, mixed paths, distribution chart, break-even thresholds | **done** | f58323fd | model.html, assets/model.js | 7 paths, symmetric imputed rent, bisection thresholds | rent A still placeholder (F-11) |
| 4 | Black Swan + phased-investing (Treasury parking) test | **done** | f58323fd | black-swan.html | Treasury FiscalData, Fed/BLS links | historical magnitudes approx (F-09) |
| 5 | Taxes page: estate/income/property-tax separation, Form 540, Prop 19/H, 1031, 121 | **done** | f58323fd | taxes.html | irs.gov, ftb.ca.gov, boe.ca.gov, sf.gov | TRA rate unknown (F-02) |
| 6 | Properties page: projections, tax tables, 5-yr plans, utilities, insurance | **done** | f58323fd | properties.html | county/assessor links | implied-rate anomalies F-06/F-07 |
| 7 | Process page: step-by-step inheritance by trust + deadlines timeline | **done** | f58323fd | process.html | IRS 706/8971/1041, BOE-19-P, Prob. Code | — |
| 8 | Questions / information / answers + discovery plan | **done** | f58323fd | questions.html | — | 10 blocking items open |
| 9 | Suggestions section (review & choose before implementing) | **done** | f58323fd | suggestions.html | — | — |
| 10 | Attorney & CPA Briefing Sheet (one-page printable export) | **done** | f58323fd | briefing.html | sources listed on the sheet | — |
| 11 | Flagged for Review page | **done** | f58323fd | flagged.html | 15 open flags, 10 verified items | — |
| 12 | Glossary + grouped menu | **done** | f58323fd | glossary.html, all pages | — | — |
| 13 | Final integration: re-verify, build check, PR to main, merge, Pages deploy | unclaimed | — | all | — | — |

## Rules (agreed)

- Never edit a file owned by another session. If a change is needed, log the request here.
- Small, frequent commits. `git pull --rebase` before every push.
- Never mark anything verified without an official source link. Unverifiable = blank + flagged.
- Shared outputs (index/nav/data) are changed only by the final integration session.
- If a claim is >60 min old with no commits, another session may take over and note the handoff.

## Log

- 2026-11-25 — Session `f58323fd` claimed tasks 1–13 (single-session build on
  `arena/f58323fd-tinodash1`). Repo was empty except README. Starting build.
- 2026-11-25 — Session `f58323fd` completed tasks 1–12 on branch `arena/f58323fd-tinodash1`.
  Verification performed: `python3 scripts/check_links.py` → 11 pages, 0 broken internal links,
  0 identifier leaks (email/phone/street-address patterns), 0 un-rounded dollar amounts in table cells
  (statutory constant $1,044,586 exempted by rule — it is a published legal figure, not a traced sum).
  Model executed headlessly (jsdom): 7 paths render, no console errors, distribution table populates.
  All 11 pages return HTTP 200 from a local static server.

### Sources relied on (official only)
- IRS: 2025/2026 inflation adjustments (Rev. Proc. 2025-32), Pubs 544/523/527/559, Form 706 + instructions,
  Form 8971, Form 1041, Form 8824, NIIT page, Topic 409.
- California: BOE Prop 19 page + BOE-19-P/BOE-266, BOE Pub. 800-10, BOE Pub. 800-3 (base-year transfer);
  FTB 2025 Form 540 booklet / 540-ES instructions (1% BHST above $1,000,000); CA LegInfo.
- Local: Santa Clara County (DTT/tax bills), SF Assessor-Recorder, SF Treasurer & Tax Collector transfer-tax
  digest + approved Prop H digest, SF Rent Board, City of Cupertino, SFPUC, CPUC, CA Dept. of Insurance.
- Federal context: Congress.gov (P.L. 119-21 / OBBBA §70106), Treasury FiscalData, FRED, HUD User FMR.

### Irregularities carried to `flagged.html`
F-01 future exclusion · F-02 TRA/exact rate · F-03 selling costs · F-04 Cupertino transfer tax ·
F-05 proposals only · **F-06 Property A implied rate 1.33–1.41% vs typical 1.16%** ·
**F-07 Property B implied rate 1.7–2.1% + unexplained 2018 +18.4% tax jump** · F-08 insurance blank ·
F-09 historical magnitudes · F-10 Treasury yield placeholder · F-11 market rent for A ·
F-12 debt unverified · F-13 capital budgets · F-14 Prop 19 cap window · F-15 rent-control status.

### Model finding recorded for the household
Mid case: live-5-then-sell leads (~$13,650,000 net wealth at the horizon), then sell-year-1 (~$12,760,000),
phased (~$12,060,000), rent-5 (~$11,970,000), pure live (~$8,500,000), rent-A (~$6,920,000),
§1031 (~$6,910,000). Leadership reverses if home growth < ~1.32%/yr, horizon < ~15.2 years, or housing
benefit is valued at zero for every dwelling. Rent path needs ~$17,800/mo to beat an immediate sale.
**No path should be chosen while F-08 and F-11 are blank.**

- 2026-11-25 — Task 13 (integration) claimed by `f58323fd`: re-verify, PR → `main`, merge, confirm Pages.
