# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy & Repo Policy:** This repository is public. **Zero** personal names, street addresses, postal codes, trust names, or Assessor Parcel Numbers (APNs) may appear in current site/repository files. Property labels use Property A/B and city-level descriptions only. Financial inputs are rounded to the nearest **$10** increment or presented as ranges/placeholders.

## Current Session Claim — `arena/8fbf68e6-tinodash1` (2026-11-26)
- **Status**: done (historical exposure needs review)
- **Scope**: Current-site privacy containment, stale archive retirement, FTB source/model correction, and full verification.
- **Initial finding**: Superseded public pages and earlier commits included postal-location identifiers; files in the current tree are scrubbed, but reachable Git history still contains old commits.

## Session Registry & Active Branch

- **Active Branch:** `arena/8fbf68e6-tinodash1` (working from `origin/main` at `a95a1ac`; contains pending privacy, source, and model updates)
- **Active Session ID:** `8fbf68e6`
- **Prior Merged Sessions on `main`:** `914b57ba` (PR #3), `ef80c5c0` (PR #4), `43f9846f` (PR #5), `f83e6979` (PR #6), `51f65152` (PR #8), `fec96e14` (PR #9), `62714618` (PR #10), `99b3f90f` (PR #12), `ddd5451c` (PR #14)
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
| T-07 | Privacy containment, retire stale duplicate pages, update FTB rates and disclose history exposure | needs review (history) | `arena/8fbf68e6-tinodash1` | `docs/**`, `pages/flagged.html`, `assets/js/model.js`, `scripts/build_verified_model.py`, `data/**`, `scripts/privacy-audit.mjs` | Current tree scrubbed and tested; older public commits remain reachable (F-09); 2026 Form 540 Line 62 instructions remain flagged (F-10). |

---

## Verification & Irregularities Log

- **Integration Note (`fec96e14` vs prior PRs #3–#8 on `main`):** Prior concurrent merges left literal `<<<<<<< HEAD` merge conflict markers in `main:index.html`, `main:briefing.html`, and `main:flagged.html`, committed Python `.pyc` cache files, and ran two competing GitHub Pages builds (`legacy main:/` vs `.github/workflows/pages.yml` `site/`). PR #9 cleanly merges `origin/main`, eliminates all broken/duplicate trees so `main:/` serves a single unified 10-page static dashboard, replaces the conflicting workflow with `.github/workflows/ci.yml` (`npm run check`), and updates Nov 2026 official benchmarks (corrected SF Prop H final VIP rates `$249 + $0.195/sqft >5,000` effective July 1, 2027 vs earlier `$65` draft; CA Prop 40 defeat; CA Prop 3 passage; Bay Area RTM passage; Empty Homes Tax `A172067` invalidation).
- **Verified Baselines (Nov 25, 2026):**
  - Federal OBBBA (`P.L. 119-21`) & Rev. Proc. 2025-32: `$15M` single / `$30M` married w/ DSUE exclusion, `$19k` gift cap, `2026` LTCG brackets, `3.8%` NIIT (`$200k/$250k`), temporary `$40,400` SALT cap (reverts `$10k` in 2030), `27.5-yr` depreciation & `25%` §1250 recapture.
  - California Form 540 & Nov 2026 Ballot: Top rate `12.3%` + `1.0% >$1M` (`13.3%`), ordinary-rate LTCG; Prop 40 billionaire wealth tax **defeated** (`52.1%` No); Prop 3 high-income extension **passed** (`~60.7%` Yes); Prop 19 `$1,044,586` (2025–2027) remains law (repeal failed to qualify).
  - Cupertino (Property A): TRA prefix `013-xxx` (`1.1671%–1.1786%` + `0.0039%` SCVWD + `$98` FUHSD; CUSD Measure A expired June 30, 2023); SCC DTT `$0.55/$500` (`$0` city tax); Cupertino-area SFH comps `$4,990–$8,000/mo` vs FY26 SAFMR `$5,870–$6,390/mo`.
  - San Francisco (Property B): FY26–27 `1.18162182%`; Nov 2026 Prop H Muni Parcel Tax **passed** (`74.42%` Yes, eff. 7/1/2027); Regional Measure RTM **passed**; Rent Board `1.6%` cap & 2006 Prop H OMI (`$8,245–$24,733/unit + $5,497`); Empty Homes Tax invalidated (`A172067`).
- **Flagged for Review (`pages/flagged.html`):** `$1,500/yr` insurance guesses (A & B), Property A exact `013-xxx` TRA subcode & 2026 tax bill, Property A beds/sqft/land ratio/solar PTO date, Property B pre-1979 status/total sqft/tenant ages, trust A/B vs survivor terms & Form 709 gifts, physical CapEx bids, SF 2018/2021 historical tax variance.
- **PR Link:** [PR #9](https://github.com/kanlerxz87-cyber/TinoDash1/pull/9) (`arena/fec96e14-tinodash1` -> `main`)
- **Merge Result:** Merged to `main`; live GitHub Pages (`https://kanlerxz87-cyber.github.io/TinoDash1/`) verified.

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
  - `model/run_model.py` & `site/data/model_data.json`: Privacy-first deterministic financial & tax projection model (all figures rounded to nearest $10; 6 pure & mixed paths, 400-run P10–P90 distribution, 5 Black Swan regimes with 24–36M Treasury phased investing, SF Prop H Nov 2026, CA Prop 19 biennial allowance $1,044,586, IRS Form 706 $15M 2026 exclusion, CA Form 540 Line 62 Behavioral Health Services Tax 1% >$1M).
  - `site/` (8-page dashboard): `index.html` (Overview, What Would Change the Answer, What-If Controls, Distribution Chart), `properties.html`, `taxes.html`, `blackswan.html`, `process.html`, `questions.html`, `brief.html` (1-page printable Attorney & CPA Brief), `review.html` (Flagged for Review & Glossary).
  - `.github/workflows/pages.yml`: GitHub Actions Pages deployment workflow.
- **Verification**: Privacy check (0 unrounded numbers), link check (8/8 pages), and JSON model validation passed.

## Session `arena/99b3f90f-tinodash1` — Integration Log (2026-11-25, PR #12)

- **Branch**: `arena/99b3f90f-tinodash1` (PR #12, base `main`).
- **Deliverables (additive, privacy-first static dashboard in `docs/`)**: `docs/index.html` + 15 subpages in `docs/pages/` (executive summary, printable attorney/CPA briefing sheet, inheritance process, property comparison, projections with what-if controls, black swan scenarios, tax/legal rules, timeline, decision framework, questions/missing info, suggestions, glossary, sources registry, flagged for review, privacy/data handling). `docs/assets/style.css`, `docs/assets/app.js` (shared static UI; no build step). `docs/data/sources.json`, `docs/templates/private-estate-inventory-template.csv`. `.github/workflows/pages.yml` (GitHub Pages deploy from `docs/` on push to main / workflow_dispatch). Updated `README.md`, `.gitignore`.
- **Key features**: "What would change the answer" on first screen; mixed paths; phased investing path (3M-2Y Treasuries 24-36 months, then DCA into stocks) in Black Swan; reinvestment risk shown beside headlines; what-if controls; imputed rent input; §121 toggle for living-then-sell; Prop 19 cap carry-forward note; transfer/recording fee in sell path; same-tax-year sale toggle; distribution chart; printable one-page attorney/CPA briefing sheet; deadlines timeline; grouped menu + glossary; suggestions review section; flagged-for-review page.
- **Privacy (original audit corrected 2026-11-26)**: Earlier public commits retain postal-location identifiers in superseded copies. Current files omit them and `/docs/` is retired, but commit history has not been rewritten; see current F-09. Current product figures are rounded to $10 or presented as ranges.
- **Verification (audit correction 2026-11-26)**: The original grep audit was incomplete; it missed postal-location identifiers in prior commits. The `/docs/` tree is now retired from current files, but those historical commits remain reachable (F-09).
- **Sources**: IRS (estate tax, 706, Pub 551/523/527, Topic 701/559, 1031), CA BOE (Prop 19, BOE-19-P, LTA 2025/009 cap $1,044,586 for 2/16/2025-2/15/2027), CA LegInfo RTC §63.2, CA FTB (2025 540 booklet, Behavioral Health Services Tax 1% over $1M, capital gains as ordinary income), CA SCO, Santa Clara County Clerk-Recorder/Assessor, SF Rent Board/SF.gov OMI, Federal Reserve History.
- **Flagged/unresolved**: Property A/B estimates, historical taxes/assessments, rent/insurance/utilities are user-supplied unverified; Property A market rent missing; TRA/parcel-specific rate requires private lookup; Prop 19 eligibility fact-specific; estate total/prior gifts/portability unknown; "Prop H" measure ambiguous; Property B leases/rent-control status unverified; same-tax-year sale and 1031 need CPA/attorney; external prior data exposure unprovable from repo.
- **Status**: PR #12 & PR #13 merged to `main`. Legacy GitHub Pages build succeeded (`main:/`, https://kanlerxz87-cyber.github.io/TinoDash1/).

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

## Session `arena/f9c7f2d1-tinodash1` — Final Verification & Integration Record (2026-11-26)

- **Branch**: `arena/f9c7f2d1-tinodash1` (base `main` at `c9994bc`; branch is identical to `main` — no divergent working tree, all prior session work already integrated).
- **Scope**: End-to-end repo review, line-by-line official-source verification, and GitHub Pages live-site confirmation for the Bay Area Inheritance Decision Dashboard.
- **Verification performed**:
  - `npm run check` PASSED — Privacy & $10-Rounding Audit (0 leaks, all user asset figures $10-rounded); Link/DOM Binding/Subpath Audit across 37 HTML pages (0 broken links, 100% official `.gov`/agency row links); 9/9 model unit tests passing.
  - `python3 scripts/build_verified_model.py` PASSED — deterministic annual rebuild of `data/model.json`; 11 sensitivity regimes reported ([MOVED] in 2 regimes: High Cupertino Appreciation → P3 live-Prop19; Low Equity Return → P3 live-Prop19; all others [UNCHANGED] → P1 sell-lump).
  - `python3 scripts/verify_repo.py` PASSED — 23 primary HTML/JS modules, 51 static+dynamic `<tr>` templates all linked to official sources, 0 broken ES-module imports, 0 conflict markers, 0 commercial links, 0 unrounded personal numbers in workspace or Git history.
- **GitHub Pages**: Live at `https://kanlerxz87-cyber.github.io/TinoDash1/` (legacy build, source `main:/`, status `built`, HTTPS enforced).
- **Branch pushed**: `git push origin arena/f9c7f2d1-tinodash1` completed (branch exists on origin; identical to `main`, so no mergeable delta to PR).
- **Privacy (audit correction, 2026-11-26)**: The prior statement that history contained no PII was inaccurate. Earlier public commits include postal-location identifiers in superseded pages; the current tree omits them, while historical commits remain reachable. See F-09; a complete repository-wide history rewrite is unresolved.
- **Status**: All requirements implemented and verified. Site live. No further integration delta required on this branch.

## Session `arena/ff8e68dc-tinodash1` — Claim & Log (2026-11-26, started ~13:00 UTC)

**Why a narrow claim:** At claim time at least eight other `arena/*` sessions had open claims on overlapping scopes (final integration `a11dfc9d` T-07; privacy containment `9f552e20` T18 and `8fbf68e6`; verification `3a8491c5`/`9976f73d` on `verification/**`; integration `43f9846f`). To avoid duplicate work and conflicting edits, this session claims only the two items below. Shared site pages, `index.html`, `data/**`, `assets/**`, and navigation are **not** edited here; required corrections are logged as requests for the final integration session.

| Task ID | Task | Status | Owning Session | Files Touched | Notes |
| --- | --- | --- | --- | --- | --- |
| T-08 | Official-source verification register: Nov 2026 ballot outcomes (Prop 3, Prop 40, Prop 43, SF Prop H, SF Measure I), Prop 19 repeal status, SF Empty Homes Tax, federal enacted vs proposed estate-tax law, CA MHSA surtax | in progress | `ff8e68dc` | `research/**` | Each row links an official source or is flagged unverified |
| T-09 | Privacy containment (surgical): remove plain-text raw-figure list from `scripts/verify_repo.py`, move list to a file outside the repo, make the history scan exhaustive | in progress | `ff8e68dc` | `scripts/verify_repo.py`, `COORDINATION.md` | Surgical only; logged so `a11dfc9d` / `8fbf68e6` can rebase |

### ff8e68dc — T-08 / T-09 results (2026-11-26)

| Task ID | Status | Result |
| --- | --- | --- |
| T-08 Official-source register | **done** (flags open) | `research/official-source-register.md`. Confirmed from official pages: Prop 19 repeal failed to qualify (SOS CC/ROV Memo #26138, May 18, 2026); H.R. 1301 and S.4196 are introduced only (Congress.gov); 2026 IRS brackets and LTCG thresholds re-checked; Prop 19 exclusion (BOE NR 25-02); CA MHSA 1% surtax (FTB instructions excerpt). Eleven shared-file corrections requested in §5 (R-01 to R-11) for `a11dfc9d` (T-07). |
| T-09 Privacy containment | **needs review** (history scrub awaiting owner approval) | Working tree: raw-figure list removed from `scripts/verify_repo.py`; list now loaded from `TINODASH_PRIVATE_FIGURES_FILE` (file outside the repo). History scan now covers every reachable commit, merge diffs included. Owner run flags 3 paths in history (`flagged.html`, `.snippets/pages/flagged.html`, `scripts/verify_repo.py`); exposure map in register §6, values not reproduced. |

**Irregularities logged (no values):**
- `verify_repo.py` PASS line previously claimed "0 unrounded personal numbers in Git history" while history contained them. That claim was wrong and has been corrected in the script.
- Repo-scan coverage gap: the earlier history check used `git log -p`, which omits merge diffs. Fixed by scanning every commit.
- Registry errors (R-01 to R-05, R-11): Prop 40 and Prop 43 are early counts; Prop 3 "~60.7%" and "up to 13.3% permanently" unsupported; Prop 19 repeal citation (LAO) not confirmed; Prop H $249 senior deduction and $249/$0.195/$50,000 multifamily structure unverified; SF Measure I missing.
- FTB MHSA link fetch failed; FTB estate-and-trust page fetch failed; sf.gov Controller PDF fetch failed. Prop H $1.99 vs $1.19 rate conflict is unresolved.
- Estate sensitivity label "~$7.14M" in `model.json` and build script has no official source (R-07).

**Requests to other sessions (not edited here):**
1. Owner (PRIVACY.md §3): approve or decline a `git filter-repo` rewrite for the paths in register §6, then force-update `main` and the listed session branches. Not done by this session.
2. Owner / CI: the raw-figure scan in `verify_repo.py` now SKIPS in CI unless the secret is supplied. Recommended: add a repository secret and pass it to the workflow as `TINODASH_PRIVATE_FIGURES_FILE` (the file's contents written at runtime, not printed). `.github/workflows/ci.yml` is not claimed by this session.
3. Integration (`a11dfc9d`, T-07): apply R-01 to R-11 from the register to the shared site and data files.

---

## Session `arena/8fbf68e6-tinodash1` — Privacy Containment & FTB Review (2026-11-26)
- **Branch**: `arena/8fbf68e6-tinodash1`; rebased onto the latest `origin/main` session update before push.
- **Scope**: Removed postal identifiers from current tracked site/data; retired the divergent duplicate `/docs/` archive while preserving the blank offline inventory template; added F-09/F-10 and current/history audit output.
- **History**: Full local main history was fetched. Earlier public commits retain postal-location identifiers. A standard PR cannot delete prior commit objects; no force-push/history rewrite was attempted. F-09 remains for repository-owner coordination.
- **FTB correction**: Directly retrieved FTB 2026 Form 540 rate schedules; 2025 Form 540 Line 62 instructions; and FTB capital-gains guidance. Updated JS/Python brackets by filing status and modeled the separate 1% threshold only above $1M, not doubled for MFJ. The 2026 Line 62 instruction page was not independently retrievable, flagged F-10. Sources: https://www.ftb.ca.gov/forms/2026/2026-540-tax-rate-schedules.pdf ; https://www.ftb.ca.gov/forms/2025/2025-540-instructions.html ; https://www.ftb.ca.gov/file/personal/income-types/capital-gains-and-losses.html .
- **Source-register reconciliation**: Updated the merged T-08 register (`research/official-source-register.md`, C-02, C-03, §7) so its prior “2026 rate schedule not fetched” note is superseded by the retrieved 2026 schedules, while keeping 2026 Line 62 instructions and post-2030 rate permanence explicitly unverified.
- **Prop 19 spot-check**: Re-read CA BOE official guidance distinguishing the one-year homeowners exemption filing from the three-year claim window, subject to transfer-to-third-party timing: https://www.boe.ca.gov/prop19/ .
- **Verification**: `npm run check` passed (current-file privacy/rounding audit, 13-page link/DOM/subpath audit, 9/9 unit tests); Python rebuild and `verify_repo.py` passed. Baseline winner unchanged; two sensitivity cases move.
- **Status**: Current-tree work complete; historical Git scrub and 2026 Line 62 instruction confirmation remain flagged.
