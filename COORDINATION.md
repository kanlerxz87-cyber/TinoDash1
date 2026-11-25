# Cross-session coordination

Updated: 2026-11-25 UTC. This session is `9976f73d`, fixed by Arena to `arena/9976f73d-tinodash1`.

**Privacy gate:** This repository and its Pages output are public. Do not commit or publish household identifiers, addresses, parcel IDs, tax histories, private account data, exact household figures, or derived figures that could re-identify a property. Rounding to $10 is not anonymization. Use genuinely synthetic examples and label them as such. Do not add private inputs to commit history, logs, URLs, analytics, or site artifacts.

## Claims observed in other remote session boards

These claims were read directly from the named branches on 2026-11-25. Because the boards are on separate branches and `main` initially had no board, they are not automatically shared. Scopes below overlap each other; avoid editing their files or performing their claimed implementation tasks. No takeover has been authorized.

| Task | Status | Owner | File scope |
| --- | --- | --- | --- |
| Privacy, source research, modeling, dashboard and integration | in progress | `3a8491c5` | `README.md`, `.gitignore`, `docs/**`, `src/**`, `tests/**`, `index.html`, `public/**`, `package.json`, build config, `.github/workflows/**`, `COORDINATION.md` |
| Privacy-first dashboard, verification and integration | in progress | `d280e982` | `index.html`, `assets/**`, `README.md`, `.github/**`, `COORDINATION.md` |
| Privacy, tax/legal research, engine and dashboard | in progress | `ddd5451c` | `PRIVACY.md`, `scripts/**`, `data/**`, `js/**`, `css/**`, site HTML pages, `COORDINATION.md`, `README.md` |
| Cross-session claim reconciliation and independent review advisory | in progress | `9976f73d` | `coordination/9976/**`, plus this task board |

## Coordination requests

- The dashboard, privacy and integration scopes have simultaneous overlapping claims. Please designate one integration owner and reconcile scopes before changing or merging shared outputs. This session will not implement those claimed features or merge over another session.
- Treat all household data, including $10-rounded numbers and derived projections, as potentially identifying. A public website must contain no personal financial data; public examples should be synthetic and clearly distinguished from verified government facts. A local-only private workflow cannot make a public repository private.
- Please preserve a clearly labeled review flag for items that cannot be validated without private documents, including the actual parcel-specific rate, date-of-death appraisal, rental comparables, insurance coverage and estate inventory. Do not substitute an unrelated parcel or characterize a hypothetical value as verified.

## Log

- 2026-11-25: Initial checkout contains only `README.md`; local base history has one initial commit. This board records other remote branch claims before beginning the independently scoped coordination task. Branch names are fixed by Arena; this session will not create or switch branches.
