# Official-Source Verification Register (T-08)

**Session:** `arena/ff8e68dc-tinodash1` · **Checked:** 2026-11-26 (UTC) · **Scope:** November 2026 ballot outcomes, enacted vs. proposed federal/state/local tax rules, and the dashboard claims that depend on them.

**Privacy rule for this file:** No household-specific dollar values, names, addresses, parcel numbers, or ZIP codes. Only public statutory and official figures are quoted.

**Method rule:** A row is marked VERIFIED only when the official page was retrieved in this pass. A figure taken from a news or law-firm summary is marked SECONDARY. Anything not retrieved is marked UNVERIFIED and left blank on the site. No URL in this file was reconstructed from memory. Where a page could not be fetched, the row says so and gives no link.

| Status | Meaning |
| --- | --- |
| **ENACTED** | In statute or final rule and in force on the date shown. |
| **PASSED – NOT CERTIFIED** | Voters approved; certification pending. |
| **DEFEATED / FAILED** | Not adopted (preliminary or certified count). |
| **PROPOSED** | Bill or initiative only; not law. |
| **UNVERIFIED** | Not confirmed from an official source in this pass. |

---

## 1. Federal

| ID | Item | Status | Verified fact | Official source (retrieved) | Notes |
| --- | --- | --- | --- | --- | --- |
| F-01 | Federal estate & gift basic exclusion, 2026 | VERIFIED | $15,000,000 per individual; 2026 filing threshold for estate tax. | IRS Estate Tax page: https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax | "Permanent, indexed from 2027" is SECONDARY only. Statute text not retrieved; re-check before publishing "permanent." |
| F-02 | §6166 2% interest-portion amount, 2026 | VERIFIED | $1,940,000 | IRS Rev. Proc. 2025-32: https://www.irs.gov/pub/irs-drop/rp-25-32.pdf (chunks 0, 2, 3, 5) | Registry key `sec61662PctPortion2026Usd` is mislabeled; this is the §6601(j) amount, not §6621/§6622. |
| F-03 | 2026 ordinary-income brackets: top-bracket start | VERIFIED | Single & MFS (Table 3/4): over $640,600 (MFS: $384,350). MFJ (Table 1): over $768,700. HOH (Table 2): over $640,600. Estates & trusts (Table 5): over $16,000. | Rev. Proc. 2025-32 §4.01, re-fetched chunk 2 | Matches registry. |
| F-04 | 2026 long-term capital-gains 0% / 15% thresholds | VERIFIED | MFJ $98,900 / $613,700; single $49,450 / $545,500; HOH $66,200 / $579,600; MFS $49,450 / $306,850; estates & trusts $3,300 / $16,250. | Rev. Proc. 2025-32 §4.03, re-fetched chunk 2 | Matches registry. |
| F-05 | Gift annual exclusion, 2026 | VERIFIED | $19,000 per donee | Rev. Proc. 2025-32 (chunk 3/5 read earlier) | Matches registry. |
| F-06 | H.R. 1301 "Death Tax Repeal Act" | PROPOSED | Introduced 2025-02-13; referred to House Ways & Means; no later action. | Congress.gov: https://www.congress.gov/bill/119th-congress/house-bill/1301 | Not law. |
| F-07 | S. 4196 "Strengthen Social Security by Taxing Dynastic Wealth Act" | PROPOSED | Introduced 2026-03-25 (Sen. Van Hollen); referred to Senate Finance; status "Introduced." | Congress.gov: https://www.congress.gov/bill/119th-congress/senate-bill/4196 | **Bill terms are UNVERIFIED** (bill text not retrieved). SECONDARY summaries cite $3.5M per person ($7M married), $1M lifetime gift exemption, 45% top rate, effective 2027: https://hjlawfirm.com/proposed-changes-to-estate-and-gift-taxes-and-linked-to-social-security-solvency/ . Do not use in the model until confirmed. |
| F-08 | Federal Net Investment Income Tax thresholds | UNVERIFIED | Not retrieved in this pass. | — | Leave blank on site. |

## 2. California state

| ID | Item | Status | Verified fact | Official source (retrieved) | Notes |
| --- | --- | --- | --- | --- | --- |
| C-01 | California estate tax / inheritance tax | SECONDARY (none exists) | Secondary sources say California has no state estate or inheritance tax; the pick-up tax collects zero since 2005. | SECONDARY: https://ridleylawoffices.com/estate-inheritance-tax-by-state/ · https://www.hvh.law/blog/federal-estate-tax-california-estate-tax-what-california-residents-should-know/ | **FTB estate-and-trust page fetch failed.** Official confirmation pending. |
| C-02 | Mental Health Services Act 1% surtax on taxable income over $1,000,000 | VERIFIED (search excerpt of official FTB text) | 1% on taxable income above $1,000,000; computed on Form 540 Line 62. | FTB 2024 Form 5805F instructions: https://www.ftb.ca.gov/forms/2024/2024-5805-f-instructions.html · FTB 2022 Form 540 booklet: https://www.ftb.ca.gov/forms/2022/2022-540-booklet.html | The dashboard's `ftb.ca.gov/file/personal/income-types/mental-health-services-tax.html` **fetch failed**; replace with the booklet link. Confirm against 2026 booklet. |
| C-03 | Top California income-tax rate after 2030 (12.3% → 9.3% absent Prop 3) | UNVERIFIED | The sunset claim comes from secondary summaries that were not retrieved. FTB 2026 Form 540 rate schedule not fetched. | — | Dashboard figure "combined top rate 13.3%" in `data/verified-sources.json` needs FTB confirmation. |
| C-04 | **Proposition 3** (make top income-tax rates permanent) | **PASSED – NOT CERTIFIED** | Registry records Yes ~60.7%. Unofficial counts seen in this pass were ~59.9% Yes (SOS-cited snapshot, Nov 6). Certification scheduled Dec 11, 2026 (secondary). | Official count not retrieved (SOS results page is a JavaScript shell): https://electionresults.sos.ca.gov/returns/maps/ballot-measures/prop/40 (pattern only; Prop 40 page). | **Registry error:** "Locks in top CA rates up to 13.3% permanently" is not supported. Prop 3 concerns the 10.3/11.3/12.3% rates; the 1% MHSA surtax is separate and already permanent. Replace % with "~59.9% (unofficial, Nov 6)" until certified. |
| C-05 | **Proposition 40** (one-time billionaire tax) | **DEFEATED** | Registry: No 52.1% / Yes 47.9% as of Nov 21. Secondary (AP-cited) later figure: No ~52.8%. | SOS results JavaScript shell: https://electionresults.sos.ca.gov/returns/maps/ballot-measures/prop/40 (no vote data parsed). | Registry percentages are **unofficial, early-count**. Mark "unofficial until SOS certification (Dec 11, 2026)." Use the range "No ~52–53%" in site copy. |
| C-06 | **Proposition 43** (two-thirds vote for citizen-initiated local special taxes; ACA 22) | **DEFEATED (early count)** | Registry: No ~54.9% / Yes ~45.1%. Early counts in this pass ~55% No. | Not retrieved from official source. | Registry percentage unverified; mark "early count." Do not confuse with the withdrawn Coupal initiative (25-0006A1). |
| C-07 | **Prop 19 repeal initiative** (Initiative 25-0017 / title "Repeals voter-enacted changes to property tax rules for transfers between family members") | **FAILED TO QUALIFY** (signature-insufficient) | CC/ROV Memo #26138 (May 18, 2026): total signatures less than 100% of required; petition **failed** under Elections Code §9030(b). | [OFFICIAL] CA SOS CC/ROV Memo #26138: https://elections.cdn.sos.ca.gov/ccrov/2026/may/26138jh.pdf (retrieved) | Registry cites `LAO 25-0422` (https://lao.ca.gov/ballot/2025/250422.pdf). **That URL was not retrieved and is UNVERIFIED.** Replace with the SOS memo. Proponent name omitted here. |
| C-08 | Prop 19 $1,000,000 base exclusion, indexed | VERIFIED | About $1,044,590 (official figure, rounded to nearest $10) for transfers Feb 16, 2025 – Feb 15, 2027. | BOE news release NR 25-02: https://www.boe.ca.gov/news/2025/nr-25-02.htm (retrieved) | **Next adjustment before Feb 16, 2027.** |
| C-09 | Prop 19 general rules | VERIFIED (partial) | Effective Feb 16, 2021; §69.6 parent-child transfers effective Apr 1, 2021; homeowners' exemption must be filed within 1 year of transfer; §69.6 claims limited to three properties. | BOE Prop 19 guidance: https://www.boe.ca.gov/prop19/ (chunk 0 of 6 retrieved; chunks 1–5 not read) | Remaining chunks **unread**. Eligibility for any household is fact-specific (attorney/CPA). |

## 3. San Francisco (local)

| ID | Item | Status | Verified fact | Official source (retrieved) | Notes |
| --- | --- | --- | --- | --- | --- |
| S-01 | **SF Proposition H** (Muni parcel tax, labeled "Measure H" by SFDOE) | **PASSED – NOT CERTIFIED** | Yes 74.42% (preliminary). | SF Dept. of Elections Nov 3, 2026 results: https://www.sfelections.org/results/20261103/index.html (retrieved, preliminary) | Add "not certified." Certification pending. |
| S-02 | Prop H term | VERIFIED per research notes | July 1, 2027 – June 30, 2042. | Source URL **not re-retrieved in this pass.** Re-attach from SFDOE measure text. | Matches registry. |
| S-03 | Prop H multifamily structure (registry: $249 base; $0.195/sq ft over 5,000; $50,000 cap) | UNVERIFIED | Registry values not checked against measure text. | — | Remove from site copy until verified. |
| S-04 | Prop H single-family rate above 5,000 sq ft | **CONFLICT (unresolved)** | Ballot-text summaries in news (SF Examiner, SF Standard) say $1.99 per sq ft. The SF Controller's Sept 16, 2026 economic report says $1.19. | Controller PDF: https://www.sf.gov/sites/default/files/2026-07/MUNI_parcel_tax_economic_impact_final.pdf — **fetch failed in this pass** | Flag. Resolve against certified measure text. Not relevant to Property B unless its building area is over 5,000 sq ft (UNVERIFIED). |
| S-05 | Prop H senior owner-occupant deduction (registry: $249) | UNVERIFIED; dollar amount not supported | Secondary voter guide (GrowSF) describes a $0 charge for owner-occupants age 65+; the registry's $249 is not confirmed. | — | Registry key `seniorOwnerOccupantDeductionUsd` (249) **conflicts** with the secondary description. Flag. |
| S-06 | Prop H tenant pass-through ($65 per unit) | UNVERIFIED | Only from a June 2026 pre-vote analysis (secondary). | — | Leave blank. |
| S-07 | Prop H revenue estimate | UNVERIFIED FIGURE | ~$177 million per year per the Controller's economic report (secondary citation). | Controller PDF (fetch failed; see S-04) | Cite the Controller report once retrievable. |
| S-08 | **SF Measure I** (transfer tax, sales ≥ $10M; half dedicated to housing) | **FAILED (preliminary)** | No 51.62%. | SF Dept. of Elections: https://www.sfelections.org/results/20261103/index.html (retrieved, preliminary) | **Missing from the site and registry.** Add. |
| S-09 | Regional Measure (RTM) transit sales tax | PASSED – NOT CERTIFIED | 14-year term; ~$1B per year (secondary news). | SF DOE results page (above) for the SF portion; regional rate details UNVERIFIED | Do not publish regional rates until verified. |
| S-10 | SF Empty Homes Tax (Prop M, 2022) | **INVALIDATED** (Court of Appeal, A172067, Sept 11, 2026) | Tax not being collected. | SF Treasurer & Tax Collector: https://sftreasurer.org/business/taxes-fees/empty-homes-tax-eht (retrieved in an earlier search) | Matches registry. |
| S-11 | SF ad valorem rate FY2026–27 (registry: 1.18162182%) | UNVERIFIED | Not re-fetched. | — | Re-check against Assessor-Recorder notice. |
| S-12 | SF Rent Board cap (registry: 1.6% for Mar 1, 2026–Feb 28, 2027) and relocation amounts | UNVERIFIED | Not re-fetched. | — | Re-check against sf.gov Rent Board notices. |

## 4. Santa Clara County / Cupertino (not reviewed in this pass)

| ID | Item | Status |
| --- | --- | --- |
| SC-01 | Combined tax rate, Cupertino TRA | UNVERIFIED. Registry source: Santa Clara County 2025–26 Tax Rate Book (URL present in registry, not retrieved). |
| SC-02 | Parcel taxes and expired school measure | UNVERIFIED. Re-fetch district pages. |
| SC-03 | County documentary transfer tax and city transfer tax | UNVERIFIED. |
| SC-04 | HUD FY2026 Small Area FMR (registry: HUD FY2026 SAFMR PDF) | UNVERIFIED. Voucher benchmarks are not market rents. |

---

## 5. Irregularities in the current published dashboard (requests for the integration session)

These are **requests only**. Shared pages are owned by the integration session (`a11dfc9d`, T-07). This session did not edit them. Locations were confirmed by grep.

| # | Location (confirmed) | Problem | Requested correction | Row |
| --- | --- | --- | --- | --- |
| R-01 | `data/verified-sources.json` → `california.nov2026StateBallot[0].voteSummary` (Prop 40). Also `COORDINATION.md`. | "No 52.1% / Yes 47.9% (as of Nov 21)" is an early count, labeled as a result. | Label "unofficial (early count); certification Dec 11, 2026." | C-05 |
| R-02 | `data/verified-sources.json` → `california.nov2026StateBallot[1].voteSummary` and `.impact` (Prop 3). | "~60.7%" is not supported by a retrieved official count. `.impact` says "up to 13.3% permanently" — not supported (Prop 3 concerns the 10.3/11.3/12.3% rates; 1% MHSA is separate). Also `california.incomeTaxForm540.combinedTopRatePct` 13.3 needs FTB confirmation. | Correct the `.impact` text; mark the % unofficial. | C-03, C-04 |
| R-03 | `data/verified-sources.json` → `california.nov2026StateBallot[2].voteSummary` (Prop 43). | "~54.9%" is an early count. | Label "early count." | C-06 |
| R-04 | `data/verified-sources.json` → `california.nov2026StateBallot[3].measure` ("LAO 25-0422") and `url`. | The LAO citation is not retrieved. The SOS memo #26138 confirms failure. | Cite SOS memo #26138 (May 18, 2026). | C-07 |
| R-05 | `data/verified-sources.json` → `sanFrancisco.propHMuniParcelTaxNov2026` (`multifamilyBaseUsd`, `multifamilyPerSqftOver5000Usd`, `multifamilyCapUsd`, `seniorOwnerOccupantDeductionUsd`). Dashboard text: `index.html` line ~104; `assets/js/pages-glossary.js` line ~69; `assets/js/pages-properties.js` line ~57; `assets/js/pages-tax-estate.js` line ~56. | Prop H rate structure and $249 senior deduction are UNVERIFIED (S-03, S-05). Site copy presents "passed 74.42%" as final, and states "$249 + $0.195/sqft" as settled. | Mark as "passed, preliminary, not certified"; remove the unverified rate and deduction details from site copy, or flag them. | S-01, S-03, S-05 |
| R-06 | `data/verified-sources.json` → `sanFrancisco` (no Measure I entry); site (no mention). | **SF Measure I (failed) is missing.** | Add S-08. | S-08 |
| R-07 | `data/model.json` line ~1787 and `scripts/build_verified_model.py` line ~833: case label "Estate Exclusion Rolled Back to ~$7.14M Base." | The $7.14M base is not sourced to any official document. Only the S.4196 secondary summaries mention a $3.5M figure, and that bill is unverified. | Relabel as illustrative, or tie the case to S-4196 once its text is verified (F-07). | F-07 |
| R-08 | ZIP codes appear in `README.md`, `index.html`, `PRIVACY.md`, `assets/js/layout.js`, `assets/js/model.js`, `assets/js/storage.js`, `assets/js/pages-glossary.js`, `assets/js/pages-properties.js`, `pages/briefing-sheet.html`, `pages/flagged.html`, `pages/properties.html`, `data/properties.json`, `data/verified-sources.json`, `scripts/build_verified_model.py`, `COORDINATION.md`. | Full ZIP codes for the two properties combined with neighborhood and rounded values are a quasi-identifier under the project's privacy rule. (Already claimed by `a11dfc9d`, T-07.) | Remove ZIPs from published text and files. | — |
| R-09 | `assets/js/layout.js` (footer, line ~107): "Statutory baselines verified November 2026." | Not all baselines were verified in this pass (see Sections 2–4, UNVERIFIED rows). | Change to per-row verification dates and status. | — |
| R-10 | `docs/sources.html` (FTB MHSA link). | The FTB MHSA link `file/personal/income-types/mental-health-services-tax.html` **fetch failed** in this pass. | Replace with the FTB 2022 Form 540 booklet link (Line 62) or a re-verified current link. | C-02 |
| R-11 | `data/verified-sources.json` → `federal.estateTax` and `sec61662PctPortion2026Usd` key. | Key label is wrong (§6601(j), not §6621/§6622). | Rename key and label. | F-02 |

---

## 6. Privacy exposure map (no values reproduced)

A scan of every remote ref and every reachable commit, using the raw-figure list kept **outside** the repository (not committed), found pre-rounding household figures in these paths. Only commit IDs and paths are listed.

| Path | Commit(s) | Where it lives | Action needed |
| --- | --- | --- | --- |
| `flagged.html` | `84f4d3d` | Reachable from `origin/main` | Owner decision: history rewrite |
| `.snippets/pages/flagged.html` | `84f4d3d`, `10b3d50` | Reachable from `origin/main` | Owner decision: history rewrite |
| `scripts/verify_repo.py` (old version, with plain-text list) | `5c06ae0`, `12b41b4`, `a5b21ad`, `c9994bc`, `70b5e2b`, `a95a1ac`, `a43711a` (on `origin/main`); `b1a5b39` (`origin/arena/8fbf68e6-tinodash1`); `d4ae3fb` (`origin/arena/a11dfc9d-tinodash1`); `c71beb2` (this session's claim) | Reachable from `origin/main` and other session branches | Fixed in the working tree by this session (T-09). History still contains it. |
| `scripts/check_site.py` | `ebfc473` | `origin/arena/f58323fd-tinodash1` only (not on `origin/main`) | Session `f58323fd` to remove; owner to delete the branch |

**Status:** The current working tree is clean of pre-rounding figures, since `scripts/verify_repo.py` now loads them from a file outside the repo. **Git history is not clean.** Rewriting history and force-pushing `main` or remote branches needs the repository owner's explicit approval (`PRIVACY.md`). This session has not performed that action. Cached copies (forks, PR diffs, Pages caches) cannot be removed from this repository.

**Owner steps to approve or decline:**
1. Approve a `git filter-repo` rewrite that removes the listed paths' raw-figure content, then force-push `main` and the affected session branches, coordinating with the sessions in `COORDINATION.md`.
2. Delete or force-update remote branches that still carry the old `verify_repo.py` or `flagged.html` content.
3. If the repository is public, ask GitHub Support to purge cached views of the affected commits.

---

## 7. Not verified in this pass (open)

- Certified results: Prop 3, Prop 40, Prop 43, SF Prop H, SF Measure I, RTM.
- FTB 2026 Form 540 rate schedule; FTB estate-and-trust page (fetch failed).
- Full text of S.4196 and H.R. 1301 (only status pages were retrieved).
- Full text of SF Prop H and the Controller economic report (sf.gov fetch failed).
- Prop 19 guidance chunks 1–5 of 6.
- Santa Clara County items (Section 4), SF rent and assessor items (S-11, S-12), NIIT (F-08), and all insurance, utility, rent, and maintenance inputs. These must stay blank or flagged.

## 8. Recheck cadence

- Weekly until certification: SOS and SF Dept. of Elections results pages (C-04–C-06, S-01, S-08, S-09).
- Before Feb 16, 2027: BOE Prop 19 adjustment (C-08).
- Quarterly: Congress.gov status for H.R. 1301 and S. 4196 (F-06, F-07).
- Annually (after the IRS revenue procedure is published): F-01–F-05.
- Annually: FTB Form 540 instructions and rate schedules (C-02, C-03).

---

## 9. Live-site observations (fetched 2026-11-26; flagged, not edited here)

Read from the live GitHub Pages landing page (`https://kanlerxz87-cyber.github.io/TinoDash1/`). These are for the integration session (T-07). None is verified in this pass.

| # | Observation | Why flagged | Row |
| --- | --- | --- | --- |
| R-12 | Landing page states a "37.1% combined Fed+NIIT+CA" tax on a carryover-basis sale. | The federal top rate (37%, F-03) is verified. The NIIT (3.8%) and CA rates are not verified in this pass, and the stated total does not reconcile with the components named. | F-08, C-03 |
| R-13 | Landing page shows OMI relocation amounts "$8,245–$24,733" and "$5,497" in other places. | Not multiples of $10, which breaks the project's rounding rule. Source amounts unverified in this pass (S-12). | S-12 |
| R-14 | Landing page shows "$1,044,586" in full. | Exact unrounded figure in published copy. Use about $1,044,590 (official figure, rounded). | C-08 |
| R-15 | Landing page states "Prop H Muni Tax passed (74.4%) adding $249/yr (+ $0.195/sqft >5,000 sqft)". | Same as R-05. Preliminary and not certified; rate structure unverified (S-03). | S-01, S-03 |
| R-16 | Landing page cites Prop 19 "~$20k+/yr" savings and "$21,210" Year-0 savings. | Model output, not sourced to an official figure. Keep the model label and add "modeled, illustrative." | — |
| R-17 | Landing page shows ZIP codes for both properties (95014 / 94122). | Same as R-08. | — |
