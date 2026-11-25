# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy & Repo Policy:** This repository is public. **Zero** unrounded source figures, personal names, street addresses, trust names, or Assessor Parcel Numbers (APNs) may ever be written to any file, commit, or log. All property-level financial inputs are anonymized (`Property A` in Cupertino `95014`, `Property B` in San Francisco Outer Sunset `94122`) and rounded to the nearest **$10** increment or presented as ranges/placeholders.

## Session Registry & Active Branch
- **Active Branch:** `arena/fec96e14-tinodash1` (integrating & reconciling `origin/main` at `d889203`)
- **Active Session ID:** `fec96e14`
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
  - California Form 540 & Nov 2026 Ballot: Top rate `12.3%` + `1.0% >$1M` (`13.3%`), ordinary-rate LTCG; Prop 40 billionaire wealth tax **defeated** (`52.1%` No); Prop 3 high-income extension **passed** (`~60.7%` Yes); Prop 19 `$1,044,586` (2025–2027) remains law (repeal failed to qualify).
  - Cupertino (Property A): TRA prefix `013-xxx` (`1.1671%–1.1786%` + `0.0039%` SCVWD + `$98` FUHSD; CUSD Measure A expired June 30, 2023); SCC DTT `$0.55/$500` (`$0` city tax); 95014 SFH comps `$4,990–$8,000/mo` vs FY26 SAFMR `$5,870–$6,390/mo`.
  - San Francisco (Property B): FY26–27 `1.18162182%`; Nov 2026 Prop H Muni Parcel Tax **passed** (`74.42%` Yes, eff. 7/1/2027); Regional Measure RTM **passed**; Rent Board `1.6%` cap & 2006 Prop H OMI (`$8,245–$24,733/unit + $5,497`); Empty Homes Tax invalidated (`A172067`).
- **Flagged for Review (`pages/flagged.html`):** `$1,500/yr` insurance guesses (A & B), Property A exact `013-xxx` TRA subcode & 2026 tax bill, Property A beds/sqft/land ratio/solar PTO date, Property B pre-1979 status/total sqft/tenant ages, trust A/B vs survivor terms & Form 709 gifts, physical CapEx bids, SF 2018/2021 historical tax variance.
- **PR Link:** [PR #9](https://github.com/kanlerxz87-cyber/TinoDash1/pull/9) (`arena/fec96e14-tinodash1` -> `main`)
- **Merge Result:** _Merging PR #9 & verifying live `https://kanlerxz87-cyber.github.io/TinoDash1/`_
