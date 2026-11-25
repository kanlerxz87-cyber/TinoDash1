# Coordination board

## Privacy notice
This repository is public. Do not put household-identifying data, property values, tax bills, rents, unit counts, addresses, ZIP/postal codes, parcel identifiers, trust records, or account details in the site, model inputs/outputs, Git metadata, issues, or public coordination notes. Property A and Property B are anonymized labels only. Private records belong in an offline or secure, non-repository workspace.

## Session registry
| Session | Branch | Status | Scope |
|---|---|---|---|
| Previous contributors | merged branches recorded in GitHub | merged | Existing dashboard, model, sources and Pages deployment |
| Current Arena session | `arena/9f552e20-tinodash1` | in progress | Emergency privacy containment of the public site and repository; no private values will be reprinted |

## Task board
| # | Task | Status | Owner | Files / scope | Notes |
|---|---|---|---|---|---|
| T01 | Privacy-first publishing and removal of household-specific data | needs review | Prior integration; remediation assigned to current session | All published assets, model inputs/outputs, README, coordination notes, GitHub Pages workflow | Initial review found household-specific financial/property facts in the deployed tree and prior public commits. Public site must be replaced with an anonymized, input-blank version. History/caches need separate remediation. |
| T02 | Dashboard navigation and categorized information | done | Previous contributors | Site pages/assets | Keep categories and official source links while removing private case facts. |
| T03 | Executive summary and answer-changing factors | done | Previous contributors | Site overview | No path recommendation until required facts are verified. |
| T04 | Pure and mixed path comparison | needs review | Current session | Published pages/model outputs | Existing model outputs included private case figures; replace with generic blank inputs and explain scope. |
| T05 | Black-swan and phased-investing scenario | needs review | Current session | Published pages/model outputs | Keep Treasury ladder and same-calendar-month stress controls; remove case-specific dollar projections and unsupported backtests. |
| T06 | What-if controls and tax sensitivities | needs review | Current session | Published pages/model inputs | Do not publish user-specific data; keep the browser-only model blank by default. |
| T07 | Imputed rent, home-sale exclusion, Prop 19 and local measures | needs review | Current session | Published pages | Retain only source-confirmed general law; distinguish current official rules from future assumptions and proposals. |
| T08 | Property-tax assessment / tax-rate-area review | needs review | Current session | Published pages / model data | Parcel-specific lookup requires private owner action; do not publish parcel-level result. |
| T09 | Estate tax, basis, assessment and liquidity | needs review | Current session | Published pages / model data | Keep the three tax systems separate; no household estate total or inventory in repository. |
| T10 | Insurance, utilities, maintenance and capital plan | needs review | Current session | Published pages / model data | Use written, property-specific quotes privately; do not publish household cost estimates. |
| T11 | Rental leases and local rules | needs review | Current session | Published pages | Preserve official local-law links; no tenant, lease, unit-count or rent-roll facts in public output. |
| T12 | Conditional deadlines timeline | done | Previous contributors | Site process page | Deadlines must be recalculated from actual transfer dates and current law. |
| T13 | Enacted-law / proposal tracker | needs review | Current session | Published pages | Recheck official authorities; clearly label proposal, preliminary result, enacted law and effective date. |
| T14 | One-page Attorney & CPA briefing export | needs review | Current session | Published print page | Printable summary must contain no case-specific identifiers or amounts. |
| T15 | Questions and suggestions queue | done | Previous contributors | Site questions/review pages | Discovery checklist may remain if anonymized. |
| T16 | Official links and flagged items | needs review | Current session | All site tables/source ledger | Recheck factual claims against primary sources and leave unsupported property-specific values blank. |
| T17 | GitHub Pages integration / deployment | needs review | Current session | `.github/workflows/pages.yml`, deployed site | Deploy only privacy-reviewed assets; verify the final published URL after merge. |
| T18 | Emergency public-data containment | in progress | Current Arena session (`arena/9f552e20-tinodash1`) | `site/**`, legacy public HTML/data, `model/**`, `docs/**`, `README.md`, `COORDINATION.md`, `.github/workflows/pages.yml` | Scope established after a rebase conflict revealed that another integration had already merged a website. This session is not duplicating initial site creation; it is replacing exposed outputs and checking all current tracked assets. |

## Verification / conflict log

- Initial checkout was at base commit `8f95825`. Before site work was completed, `origin/main` advanced with parallel site integrations; the required rebase reported an add/add conflict in this board. The conflict was resolved by preserving the shared board and recording the privacy remediation scope here. No other branch is being used.
- Current `origin/main` contains multiple generations of website assets. The Pages workflow publishes `site/`; the repository also contains legacy root and `docs/` assets plus model inputs/outputs. Review must cover all of them so an old page or dataset cannot remain public or be accidentally redeployed.
- A review of the merged tree found household-specific property locations and financial/rental facts in deployed pages, model output, README and coordination history. The values are intentionally not repeated in this note. This contradicts the earlier “zero PII”/privacy-complete status and requires urgent remediation.
- A normal cleanup commit cannot erase already-pushed commits, GitHub caches, forks, mirrors, search indexes or other clones. Do not force-push or rewrite a shared branch without the repository owner's authorization and a coordinated GitHub sensitive-data removal plan. Current-tree and live-site containment are in scope now; history/caches remain a flagged action.
- Official-source verification in this task is limited to the linked public legal authorities and does not authenticate any private property estimate, cost, rent, assessment, title or trust detail.

## Final verification record
Pending. Add the final site build/link/privacy checks, deployment run and PR URL after completion. No private household values are to be written into this board.
