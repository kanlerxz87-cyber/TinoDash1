# COORDINATION.md

Shared task board for multi-session work on `kanlerxz87-cyber/TinoDash1`.

## Rules
- Claim a task by writing your session ID and file scope, then commit and push the claim immediately.
- Never start a task claimed by another active session.
- Keep file scopes non-overlapping. If you need a file owned by another session, log a request here.
- Make small, frequent commits; `git pull --rebase` before every push.
- If you hit a merge conflict, stop, resolve without discarding other work, and log it.
- When done, record sources, verification performed, and irregularities; mark done.
- Never mark anything verified without checking against an official source and linking it.
- Shared outputs (site index/navigation, combined data) are changed only by final integration once all tasks are done.
- A claim older than 60 minutes with no commits may be taken over; note the handoff.

## Session
- Active session: `sess-99b3f90f`
- Branch: `arena/99b3f90f-tinodash1`
- Started: 2026-11-25

## Task Board

| Task | Status | Owner | Scope | Notes |
|---|---|---|---|---|
| Repo audit / privacy scrub / history check | done | sess-99b3f90f | `COORDINATION.md`, `.gitignore`, `docs/pages/privacy.html`, `docs/pages/flagged-review.html` | Git history audited: only initial commit 8f95825 (README.md). Grep audit for user-supplied ZIPs/raw sensitive values found no ZIPs and no unrounded raw values; rounded display values remain as intended. External prior exposure cannot be proven from this repo. |
| Official-source research & citations registry | done | sess-99b3f90f | `docs/pages/sources.html`, `docs/data/sources.json` | Official sources: IRS estate tax/706/Pub551/523/527/121/559/1031, CA BOE Prop 19/BOE-19-P/LTA 2025/009, CA RTC 63.2, CA FTB 540 booklet/capital gains, CA SCO, Santa Clara Clerk-Recorder/Assessor, SF Rent Board/OMI, Federal Reserve History. |
| Private estate model & anonymized data | done | sess-99b3f90f | `docs/pages/projections.html`, `docs/pages/black-swan.html`, `docs/pages/property-comparison.html`, `docs/templates/*` | All displayed figures rounded to nearest $10. User-supplied historical values marked unverified. What-if controls, mixed paths, phased Treasury 24-36m path, reinvestment risk shown. |
| Static site / GitHub Pages dashboard | done | sess-99b3f90f | `docs/**`, `.github/workflows/pages.yml`, `README.md` | 16 HTML pages, shared CSS/JS, no build step, docs/ artifact deploy workflow. Internal link check: 0 missing. |
| Final verification / PR / merge / deploy | in_progress | sess-99b3f90f | all | Committing, PR, merge, Pages deploy verification pending. |

## Requests / Handoffs
- None.

## Log
- 2026-11-25 sess-99b3f90f: Created COORDINATION.md. Audited repo - initial commit only.
- 2026-11-25 sess-99b3f90f: Built privacy-first static site in docs/ with 16 pages, sources registry, flagged review, printable briefing sheet, what-if projections, black swan phased Treasury path, timeline, glossary, decision framework, questions/suggestions. PII grep audit: no ZIPs, no unrounded raw sensitive values found. Internal link check passed (0 missing). Proceeding to PR/merge/deploy.
