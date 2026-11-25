# Independent verification

These tools screen a static site without household records. **They do not prove a site is anonymous, verify that an official link supports its surrounding claim, or certify tax calculations.** A property's unusual combination of rounded amounts, dates, history, features and location can identify it even when names and street addresses are removed. The public repository, pull requests, branches, Pages builds, cached pages, logs and historical commits must all be considered separately.

## Static checks

Requires Python 3.9+ and no third-party packages. From the repository root:

```sh
python3 -m unittest discover -s verification -p 'test_*.py' -v
python3 verification/check_site.py /path/to/site-root
# Optional, ONLY after privately verifying every URL contains no sensitive data:
# This sends URL paths and queries to external servers.
python3 verification/check_site.py /path/to/site-root --remote
```

The checker reports local links and fragments, unresolved conflict markers, table rows without their own HTTPS official-domain link, remote form actions, and obvious potential identifiers. It also flags external scripts, storage/network APIs, and generated rows for manual review. Match contents and paths are deliberately suppressed by default: pass `--show-paths` only after privately reviewing filenames, which can themselves be identifying. Lookalike-domain exclusions are tested; a short allowlist covers official agencies whose domain is not `.gov`. An official domain alone does **not** establish that a link supports the row. Search, social, CDN and archived sources are not accepted as official just because they link to government data. Warnings and inaccessible URLs need human review; blocked `HEAD` requests are *unconfirmed*, not automatically broken. Optional remote-check output suppresses URLs, but the requests themselves transmit the complete URL to remote servers, so never enable them before independently reviewing those URLs for sensitive content.

### Value-suppressed triage

When an already-existing private JSON file contains data whose possible repetition needs screening, run locally and privately, with dot-separated field paths selected by the reviewer:

```sh
python3 verification/check_sensitive_values.py \
  --seed-json /private/path/existing-input.json \
  --field properties.property_a.history \
  --field properties.property_b.history \
  --root /path/to/publication-root
```

The scanner holds seeds in memory and prints match counts, **never the values**. It hides paths by default because filenames can themselves identify a household; use `--show-paths` only after privately reviewing filenames. That option masks matched seeds in paths, but cannot reliably remove names or other identifiers. The scanner checks exact and nearest-$10 formatted numbers in paths and a limited set of text file extensions, filters history years and percentages, and exits nonzero for matches. It does not scan binaries, images, PDFs, unlisted file types, or symlinks. Coincidences are common and transformed or derived figures may not match: review findings privately and do not treat a clean result as proof of anonymity. Do not publish a denylist or the seed JSON; that would repeat the leak. This command does not inspect PR descriptions, Git history, refs, builds, caches, or third-party copies.

Static parsing cannot execute JavaScript, determine whether numeric examples are truly synthetic, identify every personal detail, assess the law, or audit prior exposure. Independently review content and model assumptions. Never paste private figures into CI logs, issue comments, PR text, or test fixtures.

## Offline browser checks

For Linux x86-64 with Node.js 22.17–22.x, 24.x, or 26+, the following uses a pinned headless Chromium package (a substantial npm download; browser files stay in ignored `node_modules` and temporary storage):

```sh
npm ci --prefix verification
npm test --prefix verification
node verification/check_browser.cjs /path/to/site-root
```

The browser serves local files under a virtual project subpath, intercepts external resources and non-GET requests, suppresses browser console/error details, checks rendered data rows for their own official links, dispatches existing controls and scenario buttons without entering private data, and flags uncaught script errors and viewport overflow. Paths are hidden unless `--show-paths` is passed after private filename review. It also uses DNS and proxy restrictions as defense in depth, but this is not an OS network sandbox; use an isolated environment for sensitive material and never load untrusted sites. Cookie/storage writes are review warnings. The screen checks only a subset of interactions and cannot establish visual quality, anonymity, historical containment, or that linked sources substantiate claims. For real live verification use an authorized browser and inspect a safely published version separately.

## How to use results

Run on the exact commit and exact directory intended for publication, not only an archived branch. Independently inspect the published Pages URLs after deployment. Verify every proposed change to laws against primary agency material and its effective date, distinguish forecasts from enacted law, and retain unknown private facts as unverified. Re-run after every build, merge, and annual legal review.
