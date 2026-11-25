# Coordination board

Public repository: never add private property identifiers, household figures, inventory, or credentials. Do not publish unverified values as facts.

| Task | Status | Owner | File scope |
|---|---|---|---|
| Privacy-first decision dashboard, verification and integration | needs review | arena-d280e982 | index.html, assets/, README.md, .github/, COORDINATION.md |

The session is constrained to the existing Arena branch; no additional session branches will be created. No other claims existed when this board was created.

## Integration notes · 2026-11-25

- Scope delivered as a public-safe static guide; public household figures and identifiers intentionally omitted. Rounding alone is not sufficient anonymization.
- Verified selected rules against [BOE Proposition 19 guidance](https://boe.ca.gov/proptaxes/pdf/lta25015.pdf), [IRS Form 706 instructions](https://www.irs.gov/instructions/i706), [IRS publication 523](https://www.irs.gov/publications/p523), and [FTB Form 540 instructions](https://www.ftb.ca.gov/forms/2025/2025-540-instructions.html). Other official links are included alongside each substantive table row. This is not a claim of complete line-by-line verification.
- Checked local navigation links and JavaScript syntax; scenario smoke test uses hypothetical index units. No external historical backtest, private model, appraisals, quotes or complete source-link validation performed. These gaps and the ambiguous Prop H are flagged in the site.
- Remote main has one initial commit as returned by GitHub; this does not prove no external copies or previous exposure. No history rewriting undertaken.
- GitHub Pages is configured to build from main root, so no Actions workflow is required.
- Status: needs review, not fully verified. In particular, published numeric household projections and recommendation are not possible without private verification; do not treat the lab as the requested complete model.
