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
