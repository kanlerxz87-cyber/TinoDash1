# TinoDash1 — Privacy-First Inheritance Decision Dashboard

Live Dashboard (GitHub Pages): `https://kanlerxz87-cyber.github.io/TinoDash1/`

## Overview
Privacy-first, source-verified decision dashboard for evaluating the planned 2040–2050 trust inheritance of **Property A (Cupertino, CA 95014)** while already owning **Property B (San Francisco Outer Sunset, CA 94122, 3-unit)**.

- **Privacy-First:** Anonymized placeholders only; all published tax, assessment, and cost figures are rounded to the nearest **$10** increment.
- **Reproducible Model + Site:** Edit `model/data_inputs.json` and run:
  ```bash
  python3 build_site.py
  ```
  This recalculates `docs/data/model_output.json` and regenerates all 9 pages in `docs/`.
- **Official Source Verification:** Every tax and legal table row links directly to IRS, CA BOE, CA FTB, CA SCO, Santa Clara County, or San Francisco official documents. Unverified items are listed on `docs/flagged.html`.
