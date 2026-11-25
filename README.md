# Bay Area Inheritance & Real Estate Decision Dashboard (`TinoDash1`)

**Live GitHub Pages Site:** [https://kanlerxz87-cyber.github.io/TinoDash1/](https://kanlerxz87-cyber.github.io/TinoDash1/)

Privacy-first, primary-source-verified decision dashboard analyzing trust inheritance of **Property A (Cupertino, ZIP 95014)** alongside already-owned **Property B (San Francisco Outer Sunset, ZIP 94122)** and potential liquid trust assets.

## Privacy & Verification Standards
- **Strict Anonymization:** Zero personal names, street addresses, trust titles, emails, or Assessor Parcel Numbers (APNs).
- **$10-Increment Rounding:** Every property-level dollar input and historical assessment/tax figure in `data/properties.json` is rounded to the nearest **$10** increment and enforced by `scripts/privacy-audit.mjs`.
- **Verified Official Citations Only:** Statutory, ballot, tax-rate, rental, utility, insurance, and macroeconomic figures link directly to primary official sources (`irs.gov`, `ftb.ca.gov`, `boe.ca.gov`, `santaclaracounty.gov`, `sf.gov`, `sfelections.org`, `huduser.gov`, `home.treasury.gov`, `bls.gov`, `fhfa.gov`, `insurance.ca.gov`, `cpuc.ca.gov`). Unconfirmed assumptions are explicitly listed on [`pages/flagged.html`](./pages/flagged.html).

## Dashboard Structure
- [`index.html`](./index.html) — Executive Summary, *"What Would Change the Answer"* triggers, Pure + Mixed 6-path comparison, and Pre-Commitment Decision Criteria Charter
- [`pages/projections.html`](./pages/projections.html) — Interactive What-If Lab, Low/Base/High range sensitivity, Monte Carlo distribution chart, and 2026–2055 assessment projections
- [`pages/black-swan.html`](./pages/black-swan.html) — Non-constant macro regimes (1929, 1973–82, 2000–09, 2020–23) and 24–36 month Treasury staging with Reinvestment Risk
- [`pages/properties.html`](./pages/properties.html) — Property A vs B profiles, $10-rounded historical tax tables, SCC TRA `013-xxx`, SF Prop H & OMI rules, 95014 rental comps vs HUD SAFMR, utilities/solar, and 5-year CapEx plans
- [`pages/tax-estate.html`](./pages/tax-estate.html) — Separation of Estate Tax vs §1014 Basis vs Prop 19, DSUE liquidity check, inheritance deadline timeline, Nov 2026 legislative watchlist, and IPS template
- [`pages/decisions.html`](./pages/decisions.html) — Action Checklist with recorded Decision & Date log + 7 Missing-Info Discovery Q&As
- [`pages/flagged.html`](./pages/flagged.html) — Flagged for Review (unverified parameters & anomalies)
- [`pages/suggestions.html`](./pages/suggestions.html) — Improvement suggestions to evaluate before implementation
- [`pages/briefing-sheet.html`](./pages/briefing-sheet.html) — One-page printable Attorney & CPA Briefing Sheet
- [`pages/glossary.html`](./pages/glossary.html) — Searchable glossary & repository privacy governance

## Local Checks & Running Locally
```bash
npm run check
# Runs:
# 1. node scripts/privacy-audit.mjs   (PII scan + strict $10 rounding check)
# 2. node scripts/link-audit.mjs      (Relative subpath, DOM binding & HTTPS link audit)
# 3. node --test tests/*.test.mjs     (Financial, tax, Prop 19 & Black Swan unit tests)

python3 -m http.server 4173 --bind 0.0.0.0
```
