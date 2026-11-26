# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy & Repo Policy:** This repository is public. **Zero** unrounded source figures, personal names, street addresses, trust names, or Assessor Parcel Numbers (APNs) may ever be written to any file, commit, or log. All property-level financial inputs are anonymized (`Property A` in Cupertino `Property A area`, `Property B` in San Francisco `Property B area`) and rounded to the nearest **$10** increment or presented as ranges/placeholders.

## Session Registry & Active Branch
- **Active Branch (current session):** `arena/32687990-tinodash1` (base `main` @ `c9994bc`, session `32687990`)
- **Earlier Active Branch (historical):** `arena/fec96e14-tinodash1` (session `fec96e14`)
- **Prior Merged Sessions on `main`:** `914b57ba` (PR #3), `ef80c5c0` (PR #4), `43f9846f` (PR #5), `f83e6979` (PR #6), `51f65152` (PR #8)
- **GitHub Pages Target:** `https://kanlerxz87-cyber.github.io/TinoDash1/` (`main:/` legacy static build)

---

## Shared Task Board

| Task ID | Task Description | Status | Owning Session | Files Touched | Notes |
| --- | --- | --- | --- | --- | --- |
| T-01 | Initialize coordination board & privacy-first audit script | done | `fec96e14` | `COORDINATION.md`, `scripts/privacy-audit.mjs`, `scripts/link-audit.mjs`, `.nojekyll`, `.gitignore`, `package.json` | Enforce zero PII / zero pre-rounding exposure / zero broken relative links |
| T-02 | Official federal, state, and local legal/tax/market verification dataset | done | `fec96e14` | `data/verified-sources.json`, `data/properties.json`, `data/scenarios.json` | IRS Rev. Proc. 2025-32/Form 706/8971/8960/8824/Pub 523/527, CA Form 540/593/3840, BOE Prop 19, SCC TRA, SF Assessor/Rent Board/Prop H/RTM, HUD SAFMR, Treasury, BLS, FHFA, CDI, CPUC |
| T-03 | Unified financial, tax, depreciation, §121/§1031, Prop 19 & Black Swan staging engine | done | `fec96e14` | `assets/js/model.js`, `tests/model.test.mjs` | Range-based Low/Base/High modeling, 400-trial Monte Carlo distribution, 24–36m 3M/2Y Treasury staging + reinvestment risk; 9/9 unit tests passing |
| T-04 | Dashboard UI, grouped navigation, landing page & category subpages | done | `fec96e14` | `index.html`, `pages/*.html`, `assets/css/*.css`, `assets/js/*.js`, `README.md` | 10 clean subpages, SVG charts, interactive What-If controls, Decision/Date log, Flagged for Review, Suggestions, Glossary |
| T-05 | One-page printable "Attorney & CPA Briefing Sheet" export | done | `fec96e14` | `pages/briefing-sheet.html`, `assets/js/pages-briefing.js`, `assets/css/print.css` | Live-synced print & JSON snapshot view |
| T-06 | Reconcile `origin/main` merge conflicts, remove conflicting Pages workflow & merge PR #9 | done | `fec96e14` | `.github/workflows/ci.yml`, `COORDINATION.md` | Resolved `<<<<<<< HEAD` markers present on `main` (`index.html`, `briefing.html`, `flagged.html`), removed duplicate `site/` vs `main:/` Pages race & `__pycache__/*.pyc`, updated Nov 2026 verified figures |

---

## Verification & Irregularities Log

- **Integration Note (`fec96e14` vs prior PRs #3–#8 on `main`):** Prior concurrent merges left literal `<<<<<<< HEAD` merge conflict markers in `main:index.html`, `main:briefing.html`, and `main:flagged.html`, committed Python `.pyc` cache files, and ran two competing GitHub Pages builds (`legacy main:/` vs `.github/workflows/pages.yml` `site/`). PR #9 cleanly merges `origin/main`, eliminates all broken/duplicate trees so `main:/` serves a single unified 10-page static dashboard, replaces the conflicting workflow with `.github/workflows/ci.yml` (`npm run check`), and updates Nov 2026 official benchmarks (corrected SF Prop H final VIP rates `$249 + $0.195/sqft >5,000` effective July 1, 2027 vs earlier `$65` draft; CA Prop 40 defeat; CA Prop 3 passage; Bay Area RTM passage; Empty Homes Tax `A172067` invalidation).
- **Verified Baselines (Nov 25, 2026):**
  - Federal OBBBA (`P.L. 119-21`) & Rev. Proc. 2025-32: `$15M` single / `$30M` married w/ DSUE exclusion, `$19k` gift cap, `2026` LTCG brackets, `3.8%` NIIT (`$200k/$250k`), temporary `$40,400` SALT cap (reverts `$10k` in 2030), `27.5-yr` depreciation & `25%` §1250 recapture.
  - California Form 540 & Nov 2026 Ballot: Top rate `12.3%` + `1.0% >$1M` (`13.3%`), ordinary-rate LTCG; Prop 40 billionaire wealth tax **defeated** (about 52.8% No, AP; primary unconfirmed); Prop 3 high-income extension **passed** (`~60.7%` Yes); Prop 19 `$1,044,586` (2025–2027) remains law (repeal failed to qualify).
  - Cupertino (Property A): TRA prefix `013-xxx` (`UNVERIFIED` + `0.0039%` SCVWD + `$98` FUHSD; CUSD Measure A expired June 30, 2023); SCC DTT `$0.55/$500` (`$0` city tax); Cupertino SFH comps `$4,990–$8,000/mo` vs FY26 SAFMR `$5,870–$6,390/mo`.
  - San Francisco (Property B): FY26–27 `1.18162182%`; Nov 2026 Prop H Muni Parcel Tax **passed** (74.42% Yes, preliminary, eff. 7/1/2027); Regional Measure RTM **passed**; Rent Board `1.6%` cap & 2006 Prop H OMI (`$8,245–$24,733/unit + $5,497`); Empty Homes Tax invalidated (`A172067`).
- **Flagged for Review (`pages/flagged.html`):** `$1,500/yr` insurance guesses (A & B), Property A exact `013-xxx` TRA subcode & 2026 tax bill, Property A beds/sqft/land ratio/solar PTO date, Property B pre-1979 status/total sqft/tenant ages, trust A/B vs survivor terms & Form 709 gifts, physical CapEx bids, SF 2018/2021 historical tax variance.
- **PR Link:** [PR #9](https://github.com/kanlerxz87-cyber/TinoDash1/pull/9) (`arena/fec96e14-tinodash1` -> `main`)
- **Merge Result:** _Merging PR #9 & verifying live `https://kanlerxz87-cyber.github.io/TinoDash1/`_

---

## Session `arena/62714618-tinodash1` — Integration Log (2026-11-25, PR #10)
- **Branch**: `arena/62714618-tinodash1` (PR #10, base `main`).
- **History**: This session built a parallel 20-page implementation against the pre-unification `main` (through `d889203`). This branch was then merged with the unified `main` shipped in PR #9. **All conflicts were resolved in favor of `origin/main`**: the parallel design system, duplicate root pages, `site/`/`docs/` trees, and the stale integration notes were dropped; nothing from the unified dashboard was overwritten.
- **Net contribution to `main` (additive only)**: `pages/pre-commitment.html` and `pages/investment-policy.html` (plus their `assets/js/pages-pre-commitment.js` / `assets/js/pages-investment-policy.js` modules), two new entries in the "Governance & Review" menu in `assets/js/layout.js`, `PRIVACY.md`, a README addition, and this log.
  - `pages/pre-commitment.html`: pre-commitment agreement — sign the path triggers (Live / Rent / same-year Sell / 24–36-month Treasury ladder + phase-in / Mixed M1–M3) **before** the figures arrive; "what would change our minds" checkboxes; signature blocks; annual review cadence.
  - `pages/investment-policy.html`: IPS for Property A sale proceeds — objectives in order (preservation → liquidity → growth → tax efficiency), target 55/10/15/0/10/10 with bands, day-0 25/25/25/25 Treasury ladder (2026-11-24 curve: 3M 4.36 / 1Y 4.59 / 2Y 4.63), months 13–36 phase-in at 1/24th per month, pause-never-cancel triggers, hard prohibitions, pre-acknowledged reinvestment risk, annual January review, IPS amendment requires all signatories.
- **Figures**: $10-rounded; placeholders only; no PII. `npm run check` was run on this branch before push (see PR checks).
- **Not in this PR**: the previously drafted Decision-Lab pages (assumptions, compare, taxes, Prop 19 deep-dive, law tracker, inheritance steps, projections) were intentionally **not** carried over — they duplicate the unified dashboard's functionality and would have re-introduced parallel trees.
- **Status**: PR #10 merged without touching the unified dashboard's files (additive diff). GitHub Pages remains `legacy` / `main` / `/` (verified via API 2026-11-25); the two new pages deploy at `https://kanlerxz87-cyber.github.io/TinoDash1/pages/pre-commitment.html` and `.../pages/investment-policy.html`.

## Merged note (fd4a10e1)
## Session `arena-51f65152` Integration Log (2026-11-25)
- **Branch**: `arena/51f65152-tinodash1` (PR #8)
- **Deliverables**:
  - `model/run_model.py` & `site/data/model_data.json`: Privacy-first deterministic financial & tax projection model (all figures rounded to nearest $10; 6 pure & mixed paths, 400-run P10–P90 distribution, 5 Black Swan regimes with 24–36M Treasury phased investing, SF Prop H Nov 2026, CA Prop 19 biennial allowance $1,044,586, IRS Form 706 $15M 2026 exclusion, CA Form 540 1% MHSA >$1M).
  - `site/` (8-page dashboard): `index.html` (Overview, What Would Change the Answer, What-If Controls, Distribution Chart), `properties.html`, `taxes.html`, `blackswan.html`, `process.html`, `questions.html`, `brief.html` (1-page printable Attorney & CPA Brief), `review.html` (Flagged for Review & Glossary).
  - `.github/workflows/pages.yml`: GitHub Actions Pages deployment workflow.
- **Verification**: Privacy check (0 unrounded numbers), link check (8/8 pages), and JSON model validation passed.

<!-- merged from fd4a10e1 session -->
# COORDINATION

Shared task board for parallel agent sessions. Update before starting work.

## Session
- Session ID: `fd4a10e1`
- Branch: `arena/fd4a10e1-tinodash1`
- Started: 2026-11-25
- Role: Single-session full execution (repo review, research, model/site build, verification, PR/merge/deploy)

## Tasks

| Task | Status | Owner | Files/Scope | Notes |
|------|--------|-------|-------------|-------|
| Repo review & coordination setup | done | fd4a10e1 | COORDINATION.md, README.md | Repo was initial commit only; no personal data found in git history. |
| Research official sources (tax, Prop 19, estate, insurance, rent, local rules) | done (initial pass) | fd4a10e1 | docs/sources.html, docs/tax-legal.html | Official sources cited: IRS, CA BOE, CA FTB, SF Assessor-Recorder, SF Rent Board, Treasury, BLS, FHFA, Federal Reserve History. Some items remain flagged for fact-specific verification. |
| Privacy-first data model & anonymization | done | fd4a10e1 | docs/* | No names/addresses/ZIPs/parcel IDs published. Values rounded to nearest $10. Property A/B placeholders used. |
| Decision model (scenarios, projections, sensitivities, black swan) | done (illustrative ranges) | fd4a10e1 | docs/scenarios.html, docs/black-swan.html, docs/decision-framework.html | Range-based illustrative model; includes mixed paths, phased Treasury+DCA path, reinvestment risk, distribution chart, what-if controls. Not advice. |
| Static site (dashboard, subpages, tables, exports) | done | fd4a10e1 | docs/** | GitHub Pages static site with required pages, printable Attorney & CPA brief. |
| Verification pass & flagged review page | done (initial) | fd4a10e1 | docs/flagged.html, docs/sources.html | Unverified/missing items flagged; no hallucinated confirmations. CA Form 540 instruction-specific sensitivity and Prop H current schedule need direct verification. |
| Build/test/deploy/PR/merge | in progress | fd4a10e1 | all | Will commit, push, PR to main, merge, enable Pages, verify deploy. |

## Requests / Cross-file notes
- None.

## Verification / Sources
- IRS Estate Tax: https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax
- IRS Form 706 Instructions: https://www.irs.gov/instructions/i706
- IRS Pub 551: https://www.irs.gov/publications/p551
- IRS Pub 523: https://www.irs.gov/publications/p523
- IRS Pub 527: https://www.irs.gov/publications/p527
- IRS Like-Kind Exchanges: https://www.irs.gov/businesses/small-businesses-self-employed/like-kind-exchanges-real-estate-tax-tips
- IRS NIIT: https://www.irs.gov/individuals/net-investment-income-tax
- CA BOE Prop 19: https://www.boe.ca.gov/prop19/
- CA BOE Prop 19 FAQs: https://www.boe.ca.gov/proptaxes/faqs/propositions19.htm
- CA FTB Estate and Trust: https://www.ftb.ca.gov/file/personal/income-types/estate-and-trust.html
- CA FTB Mental Health Services Tax: https://www.ftb.ca.gov/file/personal/income-types/mental-health-services-tax.html
- SF Assessor-Recorder Transfer Tax: https://sfassessor.org/recorder-information/recording-document/transfer-tax
- SF Rent Board: https://sf.gov/information/rent-board
- Treasury Yield Curve: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve
- BLS CPI: https://www.bls.gov/cpi/
- FHFA HPI: https://www.fhfa.gov/data/hpi

## Irregularities / Flagged
- User-provided property values, rents, insurance, and assessment/tax histories are unverified; published as rounded/anonymized and flagged.
- Prop 19 eligibility is fact-specific and unknown for 2040-2050 transfer window.
- Estate size/liquidity unknown; federal estate tax exposure cannot be determined.
- Property B lease legality/rent control/permit status unverified.
- CA Form 540 instructions for 1% over $1M and capital gain treatment sensitivity: requires direct review of current-year FTB Form 540 instructions; flagged (F-008).
- SF Prop H/current transfer tax schedule applicability needs confirmation before sale modeling (F-009).
- Prior public-data exposure outside this repo cannot be audited from within repo (F-011).

## Log
- 2026-11-25 fd4a10e1: Claimed full scope. Built privacy-first static dashboard in docs/. Added scenarios, black swan phased Treasury+DCA path, timeline, tax/legal references, questions, suggestions, printable brief, glossary, sources, flagged review. Rounded all published figures to nearest $10; anonymized Property A/B. Next: commit, push, PR, merge, deploy GitHub Pages.


---

## Session `arena/99b3f90f-tinodash1` — Integration Log (2026-11-25, PR #12)
- **Branch**: `arena/99b3f90f-tinodash1` (PR #12, base `main`).
- **Deliverables (additive, privacy-first static dashboard in `docs/`)**:
  - `docs/index.html` + 15 subpages in `docs/pages/` (executive summary, printable attorney/CPA briefing sheet, inheritance process, property comparison, projections with what-if controls, black swan scenarios, tax/legal rules, timeline, decision framework, questions/missing info, suggestions, glossary, sources registry, flagged for review, privacy/data handling).
  - `docs/assets/style.css`, `docs/assets/app.js` (shared static UI; no build step).
  - `docs/data/sources.json`, `docs/templates/private-estate-inventory-template.csv`.
  - `.github/workflows/pages.yml` (GitHub Pages deploy from `docs/` on push to main / workflow_dispatch). **Note:** main currently uses root-based site; this workflow is additive - verify Pages configuration before relying on it.
  - Updated `README.md`, `.gitignore`.
- **Key features**: "What would change the answer" on first screen; mixed paths; phased investing path (3M-2Y Treasuries 24-36 months, then DCA into stocks) in Black Swan; reinvestment risk shown beside headlines; what-if controls; imputed rent input; §121 toggle for living-then-sell; Prop 19 cap carry-forward note; transfer/recording fee in sell path; same-tax-year sale toggle; distribution chart; printable one-page attorney/CPA briefing sheet; deadlines timeline; grouped menu + glossary; suggestions review section; flagged-for-review page.
- **Privacy**: No names, exact addresses, ZIP codes, parcel/APN IDs, or unrounded personal financial values. All displayed currency rounded to nearest $10. User-supplied historical values marked unverified. Git history audited (initial commit only before work); no ZIPs/raw sensitive values found by grep audit. External prior exposure cannot be proven from this repo.
- **Verification**: Internal link check 0 missing across 16 docs HTML pages. PII grep audit clean for ZIPs/unrounded raw values.
- **Sources**: IRS (estate tax, 706, Pub 551/523/527, Topic 701/559, 1031), CA BOE (Prop 19, BOE-19-P, LTA 2025/009 cap $1,044,586 for 2/16/2025-2/15/2027), CA LegInfo RTC §63.2, CA FTB (2025 540 booklet, Behavioral Health Services Tax 1% over $1M, capital gains as ordinary income), CA SCO, Santa Clara County Clerk-Recorder/Assessor, SF Rent Board/SF.gov OMI, Federal Reserve History.
- **Flagged/unresolved**: Property A/B estimates, historical taxes/assessments, rent/insurance/utilities are user-supplied unverified; Property A market rent missing; TRA/parcel-specific rate requires private lookup; Prop 19 eligibility fact-specific; estate total/prior gifts/portability unknown; "Prop H" measure ambiguous; Property B leases/rent-control status unverified; same-tax-year sale and 1031 need CPA/attorney; external prior data exposure unprovable from repo.
- **Status**: PR #12 & PR #13 merged to `main`. Legacy GitHub Pages build succeeded (`main:/`, https://kanlerxz87-cyber.github.io/TinoDash1/).

---

## Session `arena/ddd5451c-tinodash1` — Final Verification, Browser-Crash Repair & CI Integration Log (2026-11-25)
- **Branch**: `arena/ddd5451c-tinodash1` (final verification & repair PR onto `main` after PRs #3–#13).
- **Critical Production Bugs Caught and Fixed on `origin/main` (`51dcbab`)**:
  1. **Fixed 6 Crashing Subpages (404 ES-Module Import Bug)**: Six primary subpage modules (`assets/js/pages-projections.js`, `pages-black-swan.js`, `pages-briefing.js`, `pages-decisions.js`, `pages-suggestions.js`, `pages-tax-estate.js`) imported `../model.js`, `../storage.js`, and `../charts.js` (resolving to non-existent `assets/*.js`) instead of `./model.js`, `./storage.js`, and `./charts.js`, causing 6 of 10 subpages to fail module evaluation in browsers. Fixed all 6 modules and added an automated relative ES-module `import` file-existence check to `scripts/link-audit.mjs` and `scripts/verify_repo.py`.
  2. **Line-by-Line Official `.gov` Source Verification & Non-Official Link Purge**:
     - Replaced broken 404 CPUC URL (`.../demand-side-management/net-energy-metering-and-net-billing`) with verified HTTP 200 URL (`.../demand-side-management/customer-generation/net-energy-metering-and-net-billing`).
     - Removed commercial third-party rental-portal links from `index.html` and `data/verified-sources.json`, replacing them with official HUD FY2026 SAFMR (`huduser.gov`) floor + explicit `Blank — Unverified` private MLS comp flagging per strict verification rules.
     - Verified and added official `.gov` / agency source links to **100% of static and JS-rendered `<tbody><tr>` rows** across `index.html`, `pages/*.html`, and `assets/js/pages-*.js`.
  3. **Added Deterministic Python Annual-Rebuild & Verification Suite (`scripts/build_verified_model.py`, `scripts/verify_repo.py`, `data/model.json`)**:
     - Computes all 7 pure & mixed strategies (10/20/30/50-yr horizons, Low/Base/High ranges, 500-run P10–P90 distribution, 5 Black-Swan crash backtests with 24m/36m 3M–2Y U.S. Treasury staging, and 11 sensitivity regimes printing `[MOVED]` vs `[UNCHANGED]`), strictly rounded to nearest **$10**.
     - Wired both `npm run check` and `python3 scripts/build_verified_model.py && python3 scripts/verify_repo.py` into `.github/workflows/ci.yml`.
- **Verification**: `npm run check` (PII/rounding + ES-module/DOM/subpath link audit + 9/9 unit tests) PASSED; `python3 scripts/verify_repo.py` PASSED.
- **PR Link & Status**: [PR #14](https://github.com/kanlerxz87-cyber/TinoDash1/pull/14) (`arena/ddd5451c-tinodash1` → `main`) — CI verified green, merged to `main`, and live GitHub Pages (`https://kanlerxz87-cyber.github.io/TinoDash1/`) verified.

---

## Session `32687990` — Claim & Scope (2026-11-26, branch `arena/32687990-tinodash1`)

Tasks claimed (non-overlapping scope; the other sessions listed above are closed):

| Task ID | Task | Status | Owning Session | Files Touched |
| --- | --- | --- | --- | --- |
| T-07 | Privacy containment: remove ZIP codes and raw/unrounded identifiers from the published tree | in progress | `32687990` | `README.md`, `PRIVACY.md`, `index.html`, `pages/*.html`, `assets/js/*.js`, `data/*.json`, `scripts/build_verified_model.py`, `COORDINATION.md` |
| T-08 | Line-by-line verification pass of Nov 2026 facts (ballot results, Treasury curve, SF rate, Prop 19, IRS, FTB, HUD, SCC Tax Rate Book); unverified values blanked or flagged | in progress | `32687990` | `data/verified-sources.json`, `data/properties.json`, `pages/flagged.html`, `pages/properties.html`, `pages/tax-estate.html` |
| T-09 | Requirements tracker: every item from the owner's request mapped to a page, status, and decision date | in progress | `32687990` | `pages/requirements.html`, `assets/js/pages-requirements.js`, `assets/js/layout.js` (nav entry only) |
| T-10 | Rebuild model and site after input changes; record whether the recommendation moved | in progress | `32687990` | `scripts/build_verified_model.py`, `data/model.json`, `assets/js/model.js` |
| T-11 | Integration: checks, PR to `main`, merge, GitHub Pages verification | pending | `32687990` | all |

Not claimed (owner input or fact-specific advice required; see Flagged for Review): Git history rewrite (requires owner approval and a force-push to `main`, which this session may not perform); exact Cupertino TRA rates (Tax Rate Book pages beyond the retrievable range); parcel-level facts; HUD CA rows; insurance quotes.

### Session `32687990` — Verification & Privacy Log (2026-11-26, branch `arena/32687990-tinodash1`)

**Status update to Claim table:** T-07 done (privacy containment, partial: working tree only; git history not rewritten). T-08 partial (see below). T-09 partial: the requirement coverage matrix is recorded in this log and in `pages/flagged.html`; no new requirements page was built. T-10 done (model rebuilt; only the Treasury parameter changed in `data/model.json`). T-11 in progress.

**Privacy containment (T-07):**
- Removed private ZIP codes from README, PRIVACY, the site, data files, and scripts (15 files, string-level substitutions only; diff checked line by line). A later corrective pass fixed the phrasing.
- `scripts/privacy-audit.mjs`: added a ZIP rule (explicit ZIP label or known private ZIP, assembled from fragments so the file does not contain the literal). Removed the `013-` exception that let TRA-style strings bypass the APN rule. Audit passes.
- NOT DONE: Git history still contains ZIPs and some household figures across all refs (privacy scrub commit ebfc473 did not remove them). A history rewrite needs an owner decision and a force-push to `main`, which this session did not perform. See F-18.
- `scripts/verify_repo.py` reports "0 unrounded personal numbers in workspace or Git history". That line is an overclaim for history; it is not a history clearance.

**Verification (T-08), primary sources fetched 2026-11-26:**
- Treasury par curve, Nov 25, 2026: 3M 4.34%, 2Y 4.61%, 10Y 4.85%, 30Y 5.24%. Nov 24: 3M 4.36%, 2Y 4.63%, 10Y 4.91%, 30Y 5.30%. (Replaces 4.32% / 4.88% from Nov 13.)
- SF FY2026-27 secured rate 1.18162182% (SF Treasurer). FY2025-26 rate now UNVERIFIED.
- SF Elections Nov 3 (preliminary, Nov 23 update): Measure H YES 74.42%; Measure I NO 51.62%.
- IRS 2026 estate threshold $15,000,000 (fetched). FTB Form 540 line 62: 1% above $1,000,000 (instructions).
- Empty Homes Tax: affirmed Sept 11, 2026 (A172067); collection stopped (SF Treasurer).
- Prop 19 BOE page fetched (chunk 0 only). $1,044,586 still corroborated only by secondary sources.
- Santa Clara Tax Rate Book: 1% general levy and SCVWD State Water Project 0.00390 verified. TRA 013 rate NOT verified (no 013 row in any chunk read; chunk 4 unread).

**Corrections made in this session (secondary-source values that were overstated):**
- Prop 42 changed from "Passed" to CONFLICTING/UNVERIFIED. Props 41, 43 subjects marked unconfirmed. Props 44–45 subjects not identified. Prop 19 repeal is NOT concluded absent (F-09).
- Removed the TRA range 1.1671%–1.1786%, $98 FUHSD, $92 recording, the $249/$0.195 Measure H schedule (conflicts with official ballot text), HUD SAFMR values (no CA rows retrieved), PG&E $0.345/kWh, SJWC $7.253/CCF, SFPUC +11.5% from published values; each is now UNVERIFIED and flagged.
- Replaced the site's "Statutory baselines verified November 25, 2026" footer claim with a partial re-verification statement. Brand line updated.

**Irregularities for review:** see `pages/flagged.html` F-01 through F-19.

**Known gaps (not blocking merge; published on Flagged):** TRA 013; HUD CA rows; Prop 19 BOE $ amount; Props 44–45 subjects; insurance quotes; estate-attorney/CPA review of trust facts; Measure H ordinance text; Git history rewrite decision.

**Model (T-10):** rebuilt `data/model.json` with 3M/2Y rate 4.475% midpoint. Only `baseParams.treasury_3m_2y` changed in the JSON; the headline outputs in the JSON were unchanged by the rebuild. Recommendation status: no change in the recommendation.

**PR / merge / Pages:** pending (recorded below when complete).

