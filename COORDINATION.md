# COORDINATION.md — Shared Task Board & Verification Log

## Active Session
- **Session ID**: `arena/ef80c5c0-tinodash1`
- **Branch**: `arena/ef80c5c0-tinodash1`
- **Status**: `in progress` -> `ready for PR`
- **Privacy Rule**: All historical property tax and assessed value figures are rounded to the nearest **$10** increment. No personal names, street addresses, or unrounded identifying figures are committed to this repository.

## Task Board
| Task | Status | Owner | Files | Notes |
| --- | --- | --- | --- | --- |
| Official Law & Tax Verification (2026) | done | `arena/ef80c5c0-tinodash1` | `assets/data.js`, `tax-legal.html` | Verified IRS $15M/$30M (PL 119-21), BOE Prop 19 $1,044,586 (2025–2027), FTB Form 540 1% BHST >$1M, SF Transfer Tax 0.75%, SCC Transfer Tax 0.11%, SF Prop H ($249/$65). |
| Privacy-First Rounded Data & Projections | done | `arena/ef80c5c0-tinodash1` | `assets/data.js`, `properties.html` | All historical tax & assessment tables rounded to nearest $10. |
| Interactive Dashboard & Mixed Paths Model | done | `arena/ef80c5c0-tinodash1` | `index.html`, `assets/app.js` | Includes "What Would Change the Answer", What-If controls, Pure + Mixed paths, Reinvestment Risk, Distribution & Projection charts. |
| Black Swan & Phased-Investing (3M–2Y Treasuries) | done | `arena/ef80c5c0-tinodash1` | `black-swan.html` | Models 1929, 1970s Stagflation, 2008 GFC, 2022 Rate Shock + 24–36 mo Treasury staging. |
| Attorney & CPA One-Page Briefing Sheet | done | `arena/ef80c5c0-tinodash1` | `briefing.html` | Print-ready (`@media print`) one-page brief. |
| Decision Log, Missing Info, Suggestions & Glossary | done | `arena/ef80c5c0-tinodash1` | `decisions.html` | Pre-agreed criteria, discovery questions, improvement suggestions, glossary. |
| Flagged for Review Page | done | `arena/ef80c5c0-tinodash1` | `flagged.html` | Lists unverified/estimated items (exact TRA rate, exact SF landlord insurance quote, Property A sq ft/comps) with official links. |

## Official Sources Used
1. **IRS Estate & Gift Tax (2026)**: $15,000,000 individual / $30,000,000 married with portability, 40% top rate, $19,000 annual gift exclusion (Public Law 119-21, IRC § 2010(c)(3)).
2. **California BOE Prop 19**: $1,044,586 exclusion cap for Feb 16, 2025 – Feb 15, 2027 (BOE Letter to Assessors No. 2025/009); 1-year principal residence move-in + BOE-19-P within 3 years.
3. **California FTB Form 540**: Capital gains taxed as ordinary income (1%–12.3%) + 1% Behavioral Health Services Tax (formerly Mental Health Services Tax) on taxable income > $1,000,000 (13.3% top marginal rate).
4. **Santa Clara County Clerk-Recorder**: Documentary Transfer Tax $0.55 per $500 ($1.10 per $1,000 = 0.11%); Cupertino has 0% city transfer tax.
5. **San Francisco Treasurer & Tax Collector**: Tiered Transfer Tax (0.75% for $1M–$4,999,999).
6. **San Francisco Prop H (Nov 2026)**: Multi-family parcel tax $249 base, rent-controlled units capped at $65/unit (SPUR Voter Guide).

## Flagged Irregularities
- **Property A Home Insurance**: User estimated ~$1,500/yr; 2026 Cupertino 95014 averages ~$930–$1,290/yr, but $3.1M replacement-cost policies may be higher. Flagged for actual quote.
- **Property B Landlord Insurance**: User estimated ~$1,500/yr; 2026 SF landlord insurance averages ~$2,235/yr (and 3-unit policies can be $2,500–$4,000/yr). Flagged for actual quote.
- **Property A Exact Tax Rate Area (TRA)**: Historical taxes suggest ~1.33% effective rate on assessed value (includes parcel taxes/bonds), vs 1.15%–1.25% typical. Flagged to look up exact TRA on Santa Clara County Assessor portal.
- **Property A Market Rent**: Modeled at $5,800/mo based on 2026 Cupertino 95014 3–4 bed comps ($5,000–$6,600/mo); formal CMA needed.
