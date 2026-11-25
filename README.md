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

## Additions from session arena/62714618 (PR #10)

- `pages/pre-commitment.html` — pre-commitment agreement: sign the path triggers (Live / Rent / Same-year Sell / 24–36-month Treasury ladder + phase-in / Mixed M1–M3) **before** the figures arrive; Part 2 "what would change our minds" checkboxes; signature blocks; annual review cadence.
- `pages/investment-policy.html` — Investment Policy Statement for Property A sale proceeds: objectives in order, target 55/10/15/0/10/10 with bands, day-0 25/25/25/25 Treasury ladder (2026-11-24 curve: 3M 4.36% · 1Y 4.59% · 2Y 4.63%), months 13–36 phase-in at 1/24th per month, pause (never cancel) triggers, hard prohibitions, pre-acknowledged reinvestment risk, annual January review, IPS amendment requires all signatories.
- Both pages ship in the unified design system, are linked from the "Governance & Review" menu, and pass `npm run check`.
- Also included in PR #10: a one-character-class bugfix — every `assets/js/pages-*.js` module imported `../layout.js` (resolves to `assets/layout.js`, which does not exist), so no page's header/nav/footer chrome could render in the browser; imports now point at `./layout.js` (`assets/js/layout.js`). `scripts/link-audit.mjs` was extended so the two new pages are held to the same shell-ID binding checks.
