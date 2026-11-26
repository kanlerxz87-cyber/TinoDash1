# Privacy Policy — TinoDash1 (Inheritance Decision Lab)

Personal information privacy is the top priority of this project.

## What this repository and site contain

- Placeholder property references only: **Property A** (Cupertino) and **Property B** (San Francisco Outer Sunset). Postal codes and parcel identifiers are intentionally omitted.
- User-supplied financial inputs are rounded to the nearest **$10** and presented as ranges where available. Official legal/tax parameters are linked to primary sources.
- The private inventory template is blank; it is intended to be copied and stored offline, never populated in this public repository.

## What this repository and site must never contain

Names of any person, street addresses, postal codes, APNs, exact unrounded valuations or tax bills, financial account details, family documents, scans, photos of documents, emails, or phone numbers.

## If personal data is found

1. Stop using the affected file; remove the data from the site immediately.
2. Log it on the site's **Flagged for Review** page (description + file + remediation, no PII in the log entry itself).
3. If PII reaches git history: scrub with `git filter-repo`, force-push only with the owner's approval, and rotate anything exposed.
4. Record the incident in `COORDINATION.md`.

## Historical exposure status (2026-11-26)

A full reachable-history audit found postal-location identifiers in superseded public commits. Current files have been scrubbed of postal codes and the duplicate `/docs/` pages have been retired, but deleting files in a normal pull request does **not** remove those commit objects from the public repository. A repository-wide rewrite and coordinated force-push remains unresolved and requires repository-owner coordination; until then, historical exposure must be treated as ongoing. The public Flagged for Review page records this limitation without repeating the identifiers.

## Data handling for research

Research used public, official government sources only (IRS, U.S. Treasury, CA BOE, CA FTB, SF Department of Elections / sf.gov, County of Santa Clara, CA Attorney General, leginfo.legislature.ca.gov). No non-public databases were accessed.

## Internal use

Any personal detail discovered while working (e.g., property-specific tax bills shared in source material) is used internally to build the model, is rounded before display, and is never published. The site is a decision-support tool, not a record of any person's estate. This is not legal, tax, or financial advice.
