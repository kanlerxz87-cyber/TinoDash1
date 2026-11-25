# TinoDash1 — Cupertino / San Francisco inheritance decision dashboard

A privacy-first, static GitHub Pages site that organises the analysis for a household deciding what to do
with a Cupertino house inherited by trust around 2040–2050, given that a San Francisco house is already owned
by the heir and produces rental income.

**Live site:** https://kanlerxz87-cyber.github.io/TinoDash1/

## Privacy rules (non-negotiable)

- Placeholders only: **Property A** (Cupertino 95014), **Property B** (San Francisco 94122), **Heir**,
  **Decedent**, **Trustee**. No names, street addresses, account numbers, or anything else identifying.
- All dollar amounts rounded to the nearest **$10** so no figure can be matched back to a public record.
- The private estate inventory lives offline, **outside** this repository.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Dashboard, executive summary, "what would change the answer" |
| `model.html` | Interactive model: what-if controls, mixed paths, distribution chart |
| `black-swan.html` | Crash/stagflation cases + phased-investing (Treasury parking) test |
| `taxes.html` | Estate tax, income-tax basis, property-tax assessment kept separate; law-change tracker |
| `properties.html` | Both properties: tax history, projections, five-year capital plans, utilities |
| `process.html` | Step-by-step inheritance by trust + deadline timeline |
| `questions.html` | Questions, missing information, discovery plan, pre-commit criteria |
| `suggestions.html` | Suggestions register — review and choose before implementing |
| `briefing.html` | One-page printable Attorney & CPA Briefing Sheet |
| `flagged.html` | Flagged for Review: everything unverified or irregular |
| `glossary.html` | Plain-language definitions |

## Verification standard

Every factual row carries a link to an official source (IRS, FTB, BOE, Treasury, HUD, county, city).
Where an official value does not exist, the cell is left **blank** and listed on `flagged.html`.
No value is inferred.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Notes

- Not tax, legal, or investment advice. Consult a licensed attorney and CPA.
- Re-verify all rates and thresholds annually; see `suggestions.html` S-04/S-05.
