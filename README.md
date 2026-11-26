# Bay Area Inheritance & Real Estate Decision Dashboard (`TinoDash1`)

**Live GitHub Pages Site:** [https://kanlerxz87-cyber.github.io/TinoDash1/](https://kanlerxz87-cyber.github.io/TinoDash1/)

Privacy-first, primary-source-verified decision dashboard analyzing trust inheritance of **Property A (Cupertino)** (~2040–2050) alongside already-owned **Property B (San Francisco Outer Sunset, 3-unit)** and potential liquid trust assets. Postal codes and parcel identifiers are omitted.

---

## Privacy & Official Verification Standards
- **Strict Anonymization:** The current site and files use only Property A/B plus city-level labels; no names, street addresses, postal codes, trust titles, emails, phone numbers, or APNs are present. **Historical exposure remains** in earlier public commits and is flagged for repository-owner coordination; removing files in a normal PR does not erase Git history (`PRIVACY.md`).
- **Nearest-$10 Rounding:** Every property-level dollar input, historical assessment/tax figure, utility range, rent benchmark, and modeled output in `data/properties.json` and `data/model.json` is rounded to the nearest **$10** increment (`round(x / 10) * 10`), enforced by both `scripts/privacy-audit.mjs` and `scripts/verify_repo.py`.
- **100% Official `.gov` / Agency Primary Sources:** Every static and dynamic `<tbody><tr>` table row across the dashboard links directly to an official primary source (`irs.gov`, `ftb.ca.gov`, `boe.ca.gov`, `sos.ca.gov`, `santaclaracounty.gov`, `sccgov.org`, `cupertino.gov`, `sf.gov`, `sfmta.com`, `sfelections.org`, `sfassessor.org`, `sfpuc.gov`, `huduser.gov`, `home.treasury.gov`, `bls.gov`, `fhfa.gov`, `insurance.ca.gov`, `cpuc.ca.gov`). Zero commercial real-estate portals are used; unconfirmed parcel-specific parameters are left blank and flagged on [`pages/flagged.html`](./pages/flagged.html).

---

## Unified Dashboard Structure (Served from `main:/`)
- [`index.html`](./index.html) — **First-Screen Decision Clarity:** *"What Would Change the Answer"* tipping points, Reinvestment Risk beside phased staging headlines, Pure + Mixed path comparison, and Pre-Commitment Decision Criteria Charter
- [`pages/projections.html`](./pages/projections.html) — **Interactive What-If Lab:** Transfer year (`2026–2050`), horizon (`10–50 yrs`), Imputed Rent slider, IRC §121 toggle, Low/Base/High ranges, 400-run Monte Carlo P10–P90 distribution chart, and 2026–2055 Prop 19 assessment carry-forward schedule
- [`pages/black-swan.html`](./pages/black-swan.html) — **Black-Swan Economic Regimes:** Non-linear 50-year crash simulations (1929, 1973–82, 2000–09, 2008, 2020–23) + **24–36m 3M–2Y U.S. Treasury Phased Entry** with explicit Reinvestment Risk
- [`pages/properties.html`](./pages/properties.html) — **Property A & Property B Deep Dive:** $10-rounded historical tax/assessment series, Cupertino TRA `013-xxx` vs SF secured rates, Nov 3, 2026 **SF Prop H** (`$249/yr`, `$65/unit` passthrough cap) & 2006 **Prop H §37.9C** relocation, HUD FY26 SAFMR voucher floor vs unverified MLS comps, CPUC 20-yr solar NEM sunset, insurance benchmarks, and **5-year CapEx plans**
- [`pages/tax-estate.html`](./pages/tax-estate.html) — **Three Separate Tax Regimes:** Federal/CA Estate Tax (P.L. 119-21 `$15M`/`$30M` DSUE; `$0` CA) vs IRC §1014 Basis & CA Form 540 (`12.3% + 1% >$1M = 13.3%`) vs Prop 13/19 Property Tax, visual post-death statutory deadlines timeline, and Enacted vs Proposed Legislation tracker
- [`pages/pre-commitment.html`](./pages/pre-commitment.html) — **Written Pre-Commitment Agreement:** Sign path triggers before appraisal & market figures arrive
- [`pages/investment-policy.html`](./pages/investment-policy.html) — **Investment Policy Statement (IPS):** Formal allocation bands, 24–36m Treasury ladder rules, pause triggers, and sign-off blocks
- [`pages/decisions.html`](./pages/decisions.html) — **Decision & Date Log + Missing-Info Discovery Guide**
- [`pages/flagged.html`](./pages/flagged.html) — **Flagged for Review** (unverified inputs & historical table anomalies)
- [`pages/suggestions.html`](./pages/suggestions.html) — **Suggestions Backlog** (evaluate before implementing)
- [`pages/briefing-sheet.html`](./pages/briefing-sheet.html) — **One-Page Printable Attorney & CPA Briefing Sheet**
- [`pages/glossary.html`](./pages/glossary.html) — **Searchable Tax, Trust & Real-Estate Glossary**
- The superseded `/docs/` archive has been retired; `docs/index.html` redirects to the canonical dashboard. The blank private-inventory template remains in `docs/templates/` for offline copying only.

---

## Annual Re-Run & Automated Verification Workflow

Run both the Node.js verification/test suite and the deterministic Python annual-rebuild script locally whenever appraisals, rent comparables, tax brackets, or family plans update:

```bash
# 1. Run PII/rounding audit, ES-module import & DOM/subpath link audit, and 9 unit tests
npm run check

# 2. Re-run deterministic Python model (prints [MOVED] vs [UNCHANGED] across 11 sensitivities -> data/model.json)
python3 scripts/build_verified_model.py

# 3. Verify current source links, zero commercial links, and the configured rounding checks
# Historical postal-location exposure is reported separately; see Flagged for Review F-09.
python3 scripts/verify_repo.py

# 4. Preview locally
python3 -m http.server 8080 --bind 0.0.0.0
```

---

*Educational decision-support analysis only — not legal, tax, or investment advice. Confirm trust titling, tax elections, and appraisals with a licensed California estate attorney and CPA.*
