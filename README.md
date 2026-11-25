# Estate Decision Dashboard (Privacy-First)

Static GitHub Pages dashboard for analyzing an anonymized inheritance decision involving:

- **Property A**: Cupertino, Santa Clara County, CA (expected inheritance by trust, target 2040-2050)
- **Property B**: San Francisco, CA (already owned by the prospective Property A inheritor)

## Privacy

This repository is privacy-first. It must **not** contain:

- names, exact addresses, ZIP codes, parcel/APN IDs
- account numbers, SSNs, tax return details
- unrounded personal financial records
- private legal documents (trusts, leases, appraisals, statements)

All published currency figures are rounded to nearest $10 and labeled as verified/unverified/assumption where applicable.

## Site

The site is a static dashboard in [`docs/`](docs/). Entry point: [`docs/index.html`](docs/index.html).

### Key pages

- [Dashboard](docs/index.html) - "What would change the answer" first
- [Executive Summary](docs/pages/executive-summary.html)
- [Attorney & CPA Briefing Sheet](docs/pages/briefing-sheet.html) - printable one-page brief
- [Projections & Scenarios](docs/pages/projections.html) - what-if controls, mixed paths, reinvestment risk
- [Black Swan Scenarios](docs/pages/black-swan.html) - phased 3M-2Y Treasury parking (24-36 months)
- [Tax & Legal Rules](docs/pages/tax-legal.html)
- [Deadlines Timeline](docs/pages/timeline.html)
- [Questions & Missing Info](docs/pages/questions.html)
- [Suggestions & Improvements](docs/pages/suggestions.html)
- [Flagged for Review](docs/pages/flagged-review.html)
- [Sources Registry](docs/pages/sources.html)
- [Privacy & Data Handling](docs/pages/privacy.html)

## Local preview

```bash
python3 -m http.server 8000 --directory docs
# open http://localhost:8000
```

## Verification

- Every material legal/tax rule should be linked to an official source on the Sources page.
- User-supplied/unverified values are flagged and must not be treated as facts.
- Before committing, run a PII audit (e.g., grep for ZIPs, exact addresses, account IDs, raw unrounded personal values).

## Coordination

Multi-session work uses [`COORDINATION.md`](COORDINATION.md).
