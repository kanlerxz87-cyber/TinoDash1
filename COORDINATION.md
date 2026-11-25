# COORDINATION.md — TinoDash1 Shared Task Board

## Session & Branch Policy
- Active Session Branch: `arena/914b57ba-tinodash1`
- Privacy Policy: **Strict anonymization & $10 rounding** on all published property tax, assessed value, and cost figures. Never commit personal names, street addresses, APN/parcel numbers, or exact unrounded tax figures to Git.

## Task Board

| Task ID | Task Description | Status | Owner Session | File Scope |
|---|---|---|---|---|
| T-01 | Official source verification (IRS Form 706/523/544, CA BOE Prop 19, FTB Form 540/MHST, SCO, Santa Clara Clerk-Recorder, SF BOS/Elections/Prop H) | done | `arena/914b57ba-tinodash1` | `model/data_inputs.json` |
| T-02 | Build reproducible Python financial, tax, Monte Carlo & Black Swan + Phased-Investing modeling engine | done | `arena/914b57ba-tinodash1` | `model/engine.py` |
| T-03 | Build static GitHub Pages dashboard generator (`docs/`) with all required pages, interactive what-if controls, distribution charts, printable Attorney & CPA brief, and Flagged for Review page | done | `arena/914b57ba-tinodash1` | `build_site.py`, `docs/` |
| T-04 | Line-by-line verification, link check, privacy/rounding audit, PR creation, merge to `main`, and GitHub Pages deployment check | done | `arena/914b57ba-tinodash1` | `docs/`, `COORDINATION.md` |

## Official Sources Verified
1. **IRS Form 706 Instructions (Rev. July 2026)** — 2025 Basic Exclusion $13,990,000; 2026 Basic Exclusion $15,000,000; Portability (DSUE); Annual Gift Exclusion $19,000: `https://www.irs.gov/instructions/i706`
2. **IRS Working Families Tax Cuts (2026)** — Estate tax exclusion $15,000,000 for 2026: `https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers`
3. **IRS Publication 523 (2025)** — IRC § 121 Primary Residence Exclusion ($250,000 single / $500,000 MFJ) & § 1250 Depreciation Recapture: `https://www.irs.gov/pub/irs-pdf/p523.pdf`
4. **CA BOE Proposition 19 Fact Sheet (Pub 801) & News Release NR-25-02** — 1-year primary residence & homeowners' exemption rule; $1,044,586 indexed cap (Feb 16, 2025 – Feb 15, 2027): `https://www.boe.ca.gov/news/2025/nr-25-02.htm` and `https://www.boe.ca.gov/pdf/pub801.pdf`
5. **CA State Controller's Office (SCO)** — CA Rev. & Tax. Code § 13301 (No California estate or inheritance tax): `https://www.sco.ca.gov/Files-ARD-Tax-Info/estate_lawreg_lawreg.pdf`
6. **CA Franchise Tax Board (FTB)** — Form 540 / Mental Health Services Tax (1% on CA taxable income > $1,000,000); capital gains taxed as ordinary income: `https://www.ftb.ca.gov/forms/2024/2024-540-ca-instructions.html`
7. **Santa Clara County Clerk-Recorder** — Documentary Transfer Tax $0.55 per $500 ($1.10/$1,000); Cupertino has $0 city conveyance tax; basic recording fee $25 first page: `https://clerkrecorder.santaclaracounty.gov/recording-documents/recording-document-fees`
8. **City and County of San Francisco BOS (FY 2025–26)** — Combined property tax rate $1.18268325 per $100 (1.18268325%): `https://sfbos.archive.sf.gov/sites/default/files/bfc091725_agenda.pdf`
9. **San Francisco Voter Information Pamphlet (Nov 3, 2026)** — Prop H (Muni Parcel Tax: $129–$400,000/parcel for 15 yrs, inflation-adjusted) & Real Property Transfer Tax tiers: `https://media.api.sf.gov/documents/N26_EN_VIP.pdf`
10. **San Francisco Rent Board (Prop H, 2006)** — No-fault eviction relocation payments (OMI/capital improvement, inflation-adjusted annually): `https://www.sf.gov/reports--december-2006--san-francisco-rent-board-news-archive-2006`

## Flagged Irregularities & Unverified Items
- Property A exact Santa Clara County Tax Rate Area (TRA) rate — requires private parcel lookup; modeled with effective rate range derived from rounded historical tax/assessment ratio.
- Property A & B exact home/landlord insurance quotes — user estimated ~$1,500/yr; flagged as unverified pending broker quotes (typical CA Bay Area policies are often higher).
- Property A market rent comparables — no private MLS comps provided; modeled with range and flagged to obtain independent Cupertino 95014 comparables rather than relying on HUD SAFMR voucher floor.
- Property B exact lease terms, tenant tenure, and SF Rent Ordinance status (pre-1979 vs post-1979) — flagged for private verification.
- Total estate value, prior taxable gifts, and predeceased spouse DSUE portability — flagged for private estate inventory & attorney review.

## Session Log
- `2026-11-25`: Initialized `COORDINATION.md` on `arena/914b57ba-tinodash1`, completed official source verification (T-01), starting T-02.
