# COORDINATION.md — Shared Task Board & Verification Log

> **Privacy Rule (Highest Priority):** All personal dollar figures must be rounded to the nearest **$10** increment (or represented as anonymized Low/Base/High ranges), using placeholders only (**Property A** — Inherited Cupertino-Area SFR; **Property B** — Owned San Francisco 3-Unit Property; `[Trustor]`; `[Heir]`; `[Family Revocable Trust]`). Private estate inventory stays strictly local/offline (`.gitignore`d). Never commit unrounded property tax/assessment figures, street addresses, APNs, or personal names.

## Session Registry

| Session ID | Branch | Role / Scope | Status | Last Updated (UTC) |
| :--- | :--- | :--- | :--- | :--- |
| `arena/914b57ba-tinodash1` | `arena/914b57ba-tinodash1` | Reproducible Python model + `docs/` legacy build | `merged` | 2026-11-25 (PR #3 → `6dc4068`) |
| `arena/ef80c5c0-tinodash1` | `arena/ef80c5c0-tinodash1` | 2026 law verification + `assets/` root build | `merged` | 2026-11-25 (PR #4 → `2009903`) |
| `arena-43f9846f` | `arena/43f9846f-tinodash1` | 17-page root dashboard + CSS/JS | `merged` | 2026-11-25 (PR #5 → `ac92995`) |
| `arena/f83e6979-tinodash1` | `arena/f83e6979-tinodash1` | `property-a.html`, `property-b.html`, `costs.html`, `tax-law.html` | `merged` | 2026-11-25 (PR #6 → `a86cb5d`) |
| `arena-51f65152` | `arena/51f65152-tinodash1` | `model/run_model.py` + `site/` build + `pages.yml` | `merged` | 2026-11-25 (PR #8 → `d889203`) |
| `ddd5451c` | `arena/ddd5451c-tinodash1` | **Final Integration, Conflict Repair & Line-by-Line Official Verification** | `in progress` | 2026-11-25 |

---

## Prior Session Task Board (Preserved)

| # | Task | Status | Prior Owner(s) | Files / Scope |
| :--- | :--- | :--- | :--- | :--- |
| `T01` | Scrub pre-rounding Git history / keep repo privacy-first | `done` | `43f9846f`, `914b57ba` | `.gitignore`, `.nojekyll`, `docs/.nojekyll` |
| `T02` | Site scaffold + design system + navigation + Pages config | `done` | `43f9846f`, `51f65152` | Root HTML, `docs/*`, `site/*` |
| `T03`–`T17` | Executive summary, mixed paths, Black Swan phased Treasuries, What-Ifs, Prop 19 / Prop H, 5-yr plan, Legislation tracker, Briefing sheet, Flagged review | `done` | `914b57ba`, `ef80c5c0`, `43f9846f`, `f83e6979`, `51f65152` | Root HTML, `docs/*`, `site/*`, `model/*` |

---

## Final Verification & Integration Tasks (`ddd5451c` — Active)

During line-by-line repo verification of `origin/main` (`d889203`), session `ddd5451c` identified critical defects introduced by concurrent merges and claimed the final integration & verification scope:

| Task ID | Task Description | Status | Owner | Scope | Findings & Verification Plan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `INT-01` | **Repair Unresolved Git Conflict Markers & Pages Deployment Mismatch** | `in progress` | `ddd5451c` | `index.html`, `briefing.html`, `flagged.html`, `.github/workflows/pages.yml`, `model/__pycache__/` | `origin/main` had raw `<<<<<<< HEAD` conflict markers in `index.html`, `briefing.html`, and `flagged.html`, tracked binary `engine.cpython-311.pyc`, and `.github/workflows/pages.yml` uploading `site/` instead of `/` while repo Pages `build_type` is `legacy` (`/`). |
| `INT-02` | **Line-by-Line Official `.gov` Source Verification & Non-Official Link Purge** | `in progress` | `ddd5451c` | All root `.html` tables, `sources.html`, `flagged.html`, `scripts/verify_repo.py` | Replace non-official/blog links (`baysano.com`, `gavop.com`, `gethomeinsurancequotes.com`, `lendingtree.com`, `opelon.com`, `taxstra.com`, `reedcorp.tax`, `lawvex.com`, `soferadvisors.com`, `calculatorhub.com`, `rentometer.com`, `santaclara.org`, `lacity.org`, `sce.com`) and 404 SCC/SF URLs with verified official `.gov` URLs; ensure 100% of `<tbody><tr>` rows link to an official source and leave unconfirmed private values blank & flagged. |
| `INT-03` | **Reconcile Tax, TRA, Prop 19, Prop H & CPUC Solar Rules Against 2026 Official Publications** | `in progress` | `ddd5451c` | `scripts/build_verified_model.py`, `data/model.json`, `property-tax.html`, `estate.html`, `sf-property.html`, `legislation.html`, `insurance-maintenance.html` | Verify IRS Rev. Proc. 2025-32 & Form 706 (07/2026) `$15,000,000` exclusion (P.L. 119-21 §70106); CA BOE LTA 2025/009 `$1,044,586` & LTA 2026/026; CA BOE LTA 2026/002 CCPI series (2014–2026); SCC FY2025–26 Tax Rate Book (`1.16360%` Cupertino TRA `013-003` + fixed parcel assessments vs `0.11%` transfer tax); SF BOS Res. 447-25 (`1.18268325%`), SF Prop H Nov 3, 2026 (`$249` multifamily / `$65` passthrough cap / 2027–2042) + SF Prop H 2006 §37.9C relocation (`$8,245`/`$24,733`/`+$5,497`), SF Prop M Empty Homes Tax injunction (`CGC-23-604600`); HUD FY2026 SAFMR `95014` (`$5,870` 3BR / `$6,390` 4BR floor); CPUC 20-yr NEM legacy sunset (`D.14-03-041`); US Treasury 2026 par yields (`3M–2Y`). |
| `INT-04` | **Unified Multi-Page Dashboard, Pure + Mixed Paths, Range/Distribution Engine, Black Swan Phased Treasuries & 1-Page Printable Brief** | `in progress` | `ddd5451c` | All root `.html` pages, `css/style.css`, `js/app.js`, `data/model.json` | Unify all root pages (including legacy filenames `black-swan.html`, `property-a.html`, `property-b.html`, `costs.html`, `tax-law.html`, `tax-legal.html`, `decisions.html`, `properties.html`) under one clean, interactive dashboard while preserving `docs/` and `site/` archives intact. |
| `INT-05` | **Final Audit, PR to `main`, Merge & Live GitHub Pages Verification** | `unclaimed` | `ddd5451c` | `COORDINATION.md`, `README.md` | Run `scripts/verify_repo.py` (0 conflict markers, 0 unrounded leaks, 0 broken links, 100% official row citations), open PR to `main`, merge, verify GitHub Pages live deployment. |

---

## Coordination Log

- **2026-11-25 (`914b57ba`, `ef80c5c0`, `43f9846f`, `f83e6979`, `51f65152`)**: Prior parallel sessions merged PRs #3, #4, #5, #6, #8 onto `main`.
- **2026-11-25 (`ddd5451c`)**: Merged `origin/main` (`d889203`) into `arena/ddd5451c-tinodash1` without discarding prior `docs/`, `site/`, or `model/` files. Removed tracked `model/__pycache__/engine.cpython-311.pyc` binary and logged `INT-01`–`INT-05` to repair raw conflict markers on `index.html`/`briefing.html`/`flagged.html` and complete line-by-line official verification.
