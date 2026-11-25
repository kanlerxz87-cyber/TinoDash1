# COORDINATION.md — Shared task board

Board for parallel agent sessions working on this repository.
Sessions write their claim (session ID + file scope) here, commit and push immediately,
and never start a task another session has claimed.

- **Current branch (integration branch):** `arena/62714618-tinodash1`
- **Default branch / publish target:** `main` (GitHub Pages served from `main` root)
- **Session ID for this board's claims:** `arena-62714618-tinodash1` (single active session as of 2026-11-25)
- **Policy:** work happens on the integration branch; a PR from it to `main` is created at the end by the integration session; all other sessions read-only or claim non-overlapping scopes.

## Privacy-first rules (all sessions)

1. No personal names, addresses, parcel numbers, account numbers, employer names, or exact unrounded figures may appear in tracked files or on the site.
2. Property A = inherited Cupertino (ZIP 95014). Property B = inheritor-owned San Francisco Outer Sunset (ZIP 94122). Use these placeholders only.
3. All figures shown publicly are rounded to the nearest $10 (see Assumptions & Method page for the method).
4. Any discovered personal data must be removed from the site immediately, logged in **Flagged for Review**, and — if it ever reaches git history — scrubbed (history is currently clean: see "History audit" below).

## History audit (privacy)

- 2026-11-25: Reviewed full git history (1 prior commit, `8f95825` "Initial commit", files: `README.md` only, content `# TinoDash1`). **No personal information found. No rounding violations. No scrub required.**
- 2026-11-25: Repo is public on GitHub. Pages is enabled from `main` root after the final integration PR merges. The site contains no PII by construction and by review.
- `.gitignore` added to block accidental commits of secrets/env files.

## Task board

Status legend: `unclaimed` → `in progress` → `done` | `needs review` (published on Flagged for Review; does not block)

| # | Task | Status | Owner | Files |
|---|------|--------|-------|-------|
| T1 | Repo review & history privacy audit; COORDINATION board | done | arena-62714618-tinodash1 | COORDINATION.md, .gitignore, README.md, PRIVACY.md |
| T2 | Research & source verification (federal/state/local tax, property tax, transfer taxes, rent law, Prop 19, insurance estimates) | done | arena-62714618-tinodash1 | sources.html |
| T3 | Site scaffolding (CSS, nav, footer, print styles, homepage/executive summary) | in progress | arena-62714618-tinodash1 | index.html, assets/*, all pages |
| T4 | Property A (Cupertino) analysis + projections | in progress | arena-62714618-tinodash1 | property-a.html |
| T5 | Property B (SF) analysis + Prop H model | in progress | arena-62714618-tinodash1 | property-b.html |
| T6 | Inheritance process step-by-step + deadlines timeline | in progress | arena-62714618-tinodash1 | inheritance.html, timeline.html |
| T7 | Compare-all-paths matrix (same dates/horizons, taxes/debt/occupancy/capital/liquidity) | in progress | arena-62714618-tinodash1 | compare.html |
| T8 | Interactive projections + distribution chart + what-if controls | in progress | arena-62714618-tinodash1 | projections.html |
| T9 | Black Swan lab (1929/1973/2000/2008 stress paths, phased Treasury-ladder investing) | in progress | arena-62714618-tinodash1 | blackswan.html |
| T10 | Tax worksheet (federal 2026, CA incl. BHSA 1% >$1M, step-up, IRC 121, §1250) | in progress | arena-62714618-tinodash1 | taxes.html |
| T11 | Proposition 19 deep-dive (eligibility, math, forms, allowance carry-forward) | in progress | arena-62714618-tinodash1 | prop19.html |
| T12 | Law tracker (enacted vs proposed; recheck cadence) | in progress | arena-62714618-tinodash1 | law-tracker.html |
| T13 | Questions & missing-information list with discovery methods | in progress | arena-62714618-tinodash1 | questions.html |
| T14 | Pre-commitment (written agreement) + investing policy statement | in progress | arena-62714618-tinodash1 | precommit.html, investing-policy.html |
| T15 | Suggestions & review board (selectable; no auto-implementation) | in progress | arena-62714618-tinodash1 | suggestions.html |
| T16 | Glossary + grouped menu | in progress | arena-62714618-tinodash1 | glossary.html |
| T17 | Flagged for Review page + sources index | in progress | arena-62714618-tinodash1 | flagged.html, sources.html |
| T18 | Assumptions & method (rounding $10, ranges over points) | in progress | arena-62714618-tinodash1 | assumptions.html |
| T19 | Build verification, integration, PR → main, GitHub Pages enable + verify | unclaimed | — | — |
| T20 | Attorney & CPA one-page briefing sheet (print) | in progress | arena-62714618-tinodash1 | briefing.html |

## Log

- 2026-11-25 — arena-62714618-tinodash1 — Booted session. Read repo (empty except README). Audited git history: single commit, no PII. Created this board; claimed T1–T20 (single-session run; no other sessions found claiming scopes). Research completed via official sources (IRS Rev. Proc. 2025-32; IRS newsroom OBBBA page; U.S. Treasury daily yield curve 2026-11-24; CA BOE Prop 19 hub; FTB Form 540/540-ES instructions & analyses; SF Dept. of Elections 2026-11-03 results (Prop H passed 74.42%, Prop I failed 51.62%, Prop RTM passed 79.19%); SF Transfer Tax schedule (sf.gov); Santa Clara County TRA search + controller-treasurer rate book; CA Attorney General rent-cap page; leginfo AB 1482). Full source list + verification status on the Sources page.
- 2026-11-25 — arena-62714618-tinodash1 — Findings to carry into build:
  - **Federal estate exemption 2026 = $15,000,000/decedent** (OBBBA §70106; indexed from 2027; 2027 ≈ $15,480,000). Annual gift exclusion 2026 = $19,000. GST = $15,000,000. CA has NO estate/inheritance tax; CA "pick-up" tax is $0.
  - **Prop 19** (RTC §63.2): parent→child exclusion now principal-residence-only; child must occupy within 1 year; claim BOE-19-P within 3 years (and before third-party transfer); value limit = taxable value + $1,044,586 (Feb 16, 2025–Feb 15, 2027 window; biennially adjusted). FMV−base gap above the allowance is reassessed. Property A at FMV ≈ $3,100,000 cannot carry its $550,540-ish base fully — partial reassessment applies even with the exclusion.
  - **Selling same tax year as death:** step-up in basis (IRC §1014) ⇒ ~$0 gain ⇒ federal/CA income tax ≈ $0 on the pre-death appreciation; NIIT unlikely to apply. Highest-certainty, lowest-risk path on the numbers.
  - **Renting Property A fails on current numbers** once full reassessment applies (Prop 19 unavailable without occupancy): tax ≈ 1.16–1.34% of FMV vs thin rent margin; Cupertino has no local rent-control/stability ordinance; AB 1482 cap (Santa Clara CPI 8.6% for 2026-27) applies only if covered.
  - **Property B:** SF pre-6/13/1979 units (if applicable) capped at 1.6% allowable increase (2026-27); otherwise AB 1482 (SF area 8.8%, 2026-27). Prop H (Nov 2026, passed) adds ~$250/yr parcel tax from 2027-07-01 (multifamily; <5,000 sqft assumption — sqft unverified) with possible 50%/$65-per-unit pass-through to rent-controlled tenants.
  - **SF transfer tax** $1M–$5M tier = $3.75 per $500 (0.75%), bracket rate applies to ENTIRE price; seller customarily pays; Prop I (Nov 2026, revenue split) FAILED so rates stand ($5M+ = 5.5%/6.0% event risk only if price re-tiers).
  - **Treasury curve 2026-11-24:** 3M 4.36% · 1Y 4.59% · 2Y 4.63% · 3Y 4.67% · 5Y 4.69% · 10Y 4.91% · 20Y 5.33% · 30Y 5.30%. Treasury interest: federal ordinary income, exempt from CA/local.
  - **CA BHSA (f/k/a MHSA) 1% tax** on CA taxable income over $1,000,000 (Form 540; whole dollars). CA taxes capital gains as ordinary income (top 13.3% incl. BHSA). Federal LTCG 2026: 0% ≤ $49,450 / 15% ≤ $545,500 / 20% above (single); +3.8% NIIT over $200k MAGI single / $250k MFJ.
  - **Insurance:** NAIC 2023 CA HO-3 avg ≈ $1,655 (not representative of a ~$3.1M high-value home; expect $5,000–$12,000/yr — get quotes). 94122 HO ≈ $1,235 (Policygenius, unverified); landlord policy for 3-unit est. $2,000–$5,500/yr — unverified.
  - **Internal inconsistency flagged:** effective tax rate on Property B's bill ($2,440 ÷ $114,250 ≈ 2.14%) exceeds SF's published 1.18% secured rate ⇒ direct levies included; needs the actual bill to decompose (Flagged for Review).
- 2026-11-25 — Handoff rules: if this session crashes, any session may take over tasks whose last commit is >60 min old; note the handoff here. Integration/publish is T19 and is executed last, by the final session only.
