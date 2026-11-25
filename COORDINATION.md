# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy & Repo Policy:** This repository is public. **Zero** unrounded source figures, personal names, street addresses, trust names, or Assessor Parcel Numbers (APNs) may ever be written to any file, commit, or log. All property-level financial inputs are anonymized (`Property A` in Cupertino `95014`, `Property B` in San Francisco Outer Sunset `94122`) and rounded to the nearest **$10** increment or presented as ranges/placeholders.

## Session Metadata
- **Active Branch:** `arena/fec96e14-tinodash1` (branched from `main` at `8f95825b76c0826468180173336594755c52bebd`)
- **Active Session ID:** `fec96e14`
- **GitHub Pages Target:** `https://kanlerxz87-cyber.github.io/TinoDash1/` (`main:/` legacy static build)

---

## Shared Task Board

| Task ID | Task Description | Status | Owning Session | Files Touched | Notes |
| --- | --- | --- | --- | --- | --- |
| T-01 | Initialize coordination board & privacy-first audit script | done | `fec96e14` | `COORDINATION.md`, `scripts/privacy-audit.mjs`, `scripts/link-audit.mjs`, `.nojekyll`, `package.json` | Enforce zero PII / zero pre-rounding exposure / zero broken relative links |
| T-02 | Official federal, state, and local legal/tax/market verification dataset | done | `fec96e14` | `data/verified-sources.json`, `data/properties.json`, `data/scenarios.json` | IRS Rev. Proc. 2025-32/Form 706/8971/8960/8824/Pub 523/527, CA Form 540/593/3840, BOE Prop 19, SCC TRA, SF Assessor/Rent Board/Prop H/RTM, HUD SAFMR, Treasury, BLS, FHFA, CDI, CPUC |
| T-03 | Unified financial, tax, depreciation, §121/§1031, Prop 19 & Black Swan staging engine | done | `fec96e14` | `assets/js/model.js`, `tests/model.test.mjs` | Range-based Low/Base/High modeling, 400-trial Monte Carlo distribution, 24–36m 3M/2Y Treasury staging + reinvestment risk; 9/9 unit tests passing |
| T-04 | Dashboard UI, grouped navigation, landing page & category subpages | done | `fec96e14` | `index.html`, `pages/*.html`, `assets/css/*.css`, `assets/js/*.js`, `README.md` | 10 clean subpages, SVG charts, interactive What-If controls, Decision/Date log, Flagged for Review, Suggestions, Glossary |
| T-05 | One-page printable "Attorney & CPA Briefing Sheet" export | done | `fec96e14` | `pages/briefing-sheet.html`, `assets/js/pages-briefing.js`, `assets/css/print.css` | Live-synced print & JSON snapshot view |
| T-06 | End-to-end verification, link audit, privacy audit, live preview, PR & merge to `main` | done | `fec96e14` | `COORDINATION.md` | PR #9 opened & verified; merging to `main` for GitHub Pages deployment |

---

## Verification & Irregularities Log

- **Verified Baselines (Nov 25, 2026):**
  - Federal OBBBA (`P.L. 119-21`) & Rev. Proc. 2025-32: `$15M` single / `$30M` married w/ DSUE exclusion, `$19k` gift cap, `2026` LTCG brackets, `3.8%` NIIT (`$200k/$250k`), temporary `$40,400` SALT cap (reverts `$10k` in 2030), `27.5-yr` depreciation & `25%` §1250 recapture.
  - California Form 540 & Nov 2026 Ballot: Top rate `12.3%` + `1.0% >$1M` (`13.3%`), ordinary-rate LTCG; Prop 40 billionaire wealth tax **defeated** (`52.1%` No); Prop 3 high-income extension **passed** (`~60.7%` Yes); Prop 19 `$1,044,586` (2025–2027) remains law (repeal failed to qualify).
  - Cupertino (Property A): TRA prefix `013-xxx` (`1.1671%–1.1786%` + `0.0039%` SCVWD + `$98` FUHSD; CUSD Measure A expired June 30, 2023); SCC DTT `$0.55/$500` (`$0` city tax); 95014 SFH comps `$4,990–$8,000/mo` vs FY26 SAFMR `$5,870–$6,390/mo`.
  - San Francisco (Property B): FY26–27 `1.18162182%`; Nov 2026 Prop H Muni Parcel Tax **passed** (`74.42%` Yes, eff. 7/1/2027); Regional Measure RTM **passed**; Rent Board `1.6%` cap & 2006 Prop H OMI (`$8,245–$24,733/unit + $5,497`); Empty Homes Tax invalidated (`A172067`).
- **Flagged for Review (`pages/flagged.html`):** `$1,500/yr` insurance guesses (A & B), Property A exact `013-xxx` TRA subcode & 2026 tax bill, Property A beds/sqft/land ratio/solar PTO date, Property B pre-1979 status/total sqft/tenant ages, trust A/B vs survivor terms & Form 709 gifts, physical CapEx bids, SF 2018/2021 historical tax variance.
- **PR Link:** [PR #9](https://github.com/kanlerxz87-cyber/TinoDash1/pull/9) (`arena/fec96e14-tinodash1` -> `main`)
- **Merge Result:** Merging PR #9 via `gh pr merge 9 --merge` to publish GitHub Pages at `https://kanlerxz87-cyber.github.io/TinoDash1/`
