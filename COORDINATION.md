# COORDINATION.md — TinoDash1 Shared Task Board

> **Privacy Rule**: Zero personally identifiable information (PII). All property tax and assessed values are rounded to the nearest $10 increment. Placeholders `Property A` (Cupertino, 95014) and `Property B` (San Francisco Outer Sunset, 94122) are used throughout.

## Active Session
- **Session ID**: `arena-51f65152`
- **Branch**: `arena/51f65152-tinodash1`
- **Date**: 2026-11-25

## Task Board

| Task ID | Task Description | Status | Owning Session | File Scope |
|---|---|---|---|---|
| T1 | Official Source Research & Verification (IRS Form 706/Pub 523, CA BOE Prop 19, CA FTB Form 540, SCC Clerk-Recorder, SF Assessor/Rent Board, SF Prop H, CA Dept of Insurance) | done | `arena-51f65152` | `COORDINATION.md`, `model/run_model.py` |
| T2 | Deterministic Financial & Tax Projection Model (pure & mixed paths, ranges, Prop 19, §1014, §121, §1031, §1250, Prop H, Black Swan + 24–36M Treasury phased investing) | done | `arena-51f65152` | `model/run_model.py`, `site/data/model_data.json` |
| T3 | GitHub Pages Multi-Page Dashboard UI (Overview/What-If, Properties & Projections, Taxes & Laws, Black Swan & Phased Investing, Process & Timeline, Questions & Suggestions, One-Page Printable Attorney & CPA Brief, Flagged for Review & Glossary) | done | `arena-51f65152` | `site/**` |
| T4 | Verification, Link Check, GitHub Pages Workflow, PR & Merge | done | `arena-51f65152` | `.github/workflows/pages.yml`, `COORDINATION.md` |

## Official Sources Log
1. IRS Form 706 Instructions (Rev. July 2026) — Basic Exclusion Amount $15,000,000 (2026): https://www.irs.gov/instructions/i706
2. IRS Newsroom — Working Families Tax Cuts (2026 Estate Tax Exclusion $15,000,000): https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers
3. IRS Publication 523 (2025) — Selling Your Home (IRC §121 $250k/$500k exclusion, §1014 basis, depreciation recapture): https://www.irs.gov/pub/irs-pdf/p523.pdf
4. CA State Board of Equalization (BOE) — Prop 19 Biennial Adjustment ($1,044,586 for Feb 16, 2025 – Feb 15, 2027): https://www.boe.ca.gov/news/2025/nr-25-02.htm
5. CA BOE Publication 801 — Proposition 19 Fact Sheet: https://www.boe.ca.gov/pdf/pub801.pdf
6. CA Franchise Tax Board (FTB) — Form 540 Booklet (1% Mental Health Services Tax >$1M; capital gains taxed as ordinary income): https://www.ftb.ca.gov/forms/2021/2021-540-booklet.pdf
7. Santa Clara County Clerk-Recorder — Record Fees & Documentary Transfer Tax ($0.55/$500; no Cupertino city conveyance tax): https://clerkrecorder.sccgov.org/record-fees
8. Santa Clara County — Tax Allocation / TRA Lookup (Cupertino TRA prefix 013): https://payments.sccgov.org/propertytax/TaxAllocation/SearchByAddress
9. San Francisco Assessor-Recorder — Transfer Tax Rate Schedule ($3.75/$500 for $1M–<$5M): https://www.sfassessor.org/recorder-information/recording-document/transfer-tax
10. San Francisco Rent Board — Annual Allowable Rent Increase (1.6% for Mar 1, 2026 – Feb 28, 2027) & AB 1482: https://www.sf.gov/news--annual-rent-increase-3126-22827-announced
11. California Department of Insurance — Sustainable Insurance Strategy ($1,655 CA avg homeowner premium): https://www.insurance.ca.gov/01-consumers/180-climate-change/sustainable-insurance-strategy.Cfm
12. San Francisco Proposition H (Nov 2026 Enacted) — 15-year SFMTA parcel tax with 50% landlord pass-through cap: https://www.sfpublicpress.org/proposition-h-and-regional-transit-measure-sf-seeks-add-parcel-and-sales-taxes-to-keep-muni-moving/

## Flagged Irregularities / Unverified Items
- Exact Santa Clara County Tax Rate Area (TRA) for Property A requires APN lookup (implied 2025 effective rate ~1.34% from rounded tax/assessed value).
- Cupertino (95014) market rent comparables for Property A are not yet obtained; rent path uses range ($5,200–$6,800/mo) flagged for independent CMA verification.
- Bay Area high-value homeowners insurance (Property A) and 3-unit landlord/owner-occupied policy (Property B) require custom underwriting quotes beyond the $1,660 CA statewide average.
- Property B tenant lease terms, rent-control status (pre-1979), and exact Prop H parcel tax tier require local lease/assessor verification.
- Grantor's total estate value, prior taxable gifts (Form 709), and predeceased spouse DSUE portability status are unknown and require private estate inventory.
