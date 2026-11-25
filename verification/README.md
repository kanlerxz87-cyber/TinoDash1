# Independent verification

These tools screen a static site without household records. **They do not prove a site is anonymous, verify that an official link supports its surrounding claim, or certify tax calculations.** A property's unusual combination of rounded amounts, dates, history, features and location can identify it even when names and street addresses are removed. The public repository, pull requests, branches, Pages builds, cached pages, logs and historical commits must all be considered separately.

## Static checks

Requires Python 3.9+ and no third-party packages. From the repository root:

```sh
python3 -m unittest discover -s verification -p 'test_*.py' -v
python3 verification/check_site.py /path/to/site-root
# Optional, if outbound access to the official websites is permitted:
python3 verification/check_site.py /path/to/site-root --remote
```

The checker reports local links and fragments, table rows without their own HTTPS official-domain link, remote form actions, and obvious potential identifiers. It also flags external scripts, storage/network APIs, and generated rows for manual review. Match contents are deliberately suppressed. Lookalike-domain exclusions are tested; a short allowlist covers official agencies whose domain is not `.gov`. An official domain alone does **not** establish that a link supports the row. Search, social, CDN and archived sources are not accepted as official just because they link to government data. Warnings and inaccessible URLs need human review; blocked `HEAD` requests are *unconfirmed*, not automatically broken.

Static parsing cannot execute JavaScript, determine whether numeric examples are truly synthetic, identify every personal detail, assess the law, or audit prior exposure. In particular, inspect programmatically generated tables **after rendering** and independently review content and model assumptions. All previews and scripts should avoid transmitting or persisting entered information. Never paste private figures into CI logs, issue comments, PR text, or these test fixtures.

## How to use results

Run on the exact commit and exact directory intended for publication, not only an archived branch. Independently inspect the published Pages URLs after deployment. Verify every proposed change to laws against primary agency material and its effective date, distinguish forecasts from enacted law, and retain unknown private facts as unverified. Re-run after every build, merge, and annual legal review.
