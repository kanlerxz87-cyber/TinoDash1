#!/usr/bin/env python3
"""
TinoDash1 Reproducible Static Site Generator.
Rebuilds model/engine.py -> docs/data/model_output.json and generates all GitHub Pages HTML files in docs/.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "model"))
import engine  # noqa: E402

DOCS = ROOT / "docs"


def fmt(val):
    if val is None:
        return "—"
    return f"${engine.r10(val):,}"


NAV_GROUPS = [
    ("Overview", [
        ("index.html", "Executive Summary"),
        ("briefing.html", "Attorney & CPA 1-Page Brief"),
    ]),
    ("Financial & Risk Analysis", [
        ("projections.html", "Projections, What-If & Distribution"),
        ("black-swan.html", "Black Swan & Phased Investing"),
    ]),
    ("Tax, Legal & Process", [
        ("tax-legal.html", "Tax, Prop 19, Prop H & Laws"),
        ("process-timeline.html", "Process, Deadlines & 5-Yr Plan"),
    ]),
    ("Review & Reference", [
        ("questions-suggestions.html", "Questions & Suggestions"),
        ("flagged.html", "Flagged for Review"),
        ("glossary.html", "Glossary"),
    ]),
]


def render_page(filename: str, title: str, body_html: str) -> None:
    nav_html = []
    for grp, items in NAV_GROUPS:
        links = []
        for href, label in items:
            cls = "nav-link active" if href == filename else "nav-link"
            links.append(f'<a class="{cls}" href="{href}">{label}</a>')
        nav_html.append(
            f'<div class="nav-group"><div class="nav-group-title">{grp}</div>{"".join(links)}</div>'
        )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — TinoDash1 Inheritance Decision Dashboard</title>
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">TinoDash1</div>
      <div class="brand-sub">Property A (95014) &amp; Property B (94122)<br/>Inheritance Decision Dashboard</div>
      {"".join(nav_html)}
      <div class="privacy-badge">
        <strong>Privacy-First Mode</strong><br/>
        Anonymized placeholders only. All tax, assessment &amp; cost figures rounded to $10 increments.
      </div>
    </aside>
    <main class="main">
      {body_html}
    </main>
  </div>
  <script src="assets/app.js"></script>
</body>
</html>
"""
    (DOCS / filename).write_text(html, encoding="utf-8")


def build_index(data):
    base_2045 = data["comparison_matrix"]["2045"]["20"]["base"]["paths"]
    pa_2045 = next(r for r in data["property_a_projection"] if r["year"] == 2045)
    est_2045 = next(r for r in data["estate_tax_projection"] if r["year"] == 2045)

    rows = []
    for k in ["sell_immediate", "mixed_sell_phased", "mixed_live_sell", "live_a", "mixed_rent_1031", "rent_a"]:
        p = base_2045[k]
        badge = '<span class="badge badge-pure">Pure</span>' if p["type"] == "pure" else '<span class="badge badge-mixed">Mixed</span>'
        extra = ""
        if k == "mixed_sell_phased":
            extra = f" (Reinvestment drag vs lump-sum: {fmt(p['reinvestment_risk_drag'])})"
        rows.append(f"""<tr>
          <td><strong>{p['name']}</strong> {badge}</td>
          <td class="num"><strong>{fmt(p['ending_wealth'])}</strong></td>
          <td>{p['notes']}{extra}</td>
        </tr>""")

    body = f"""
    <h1>Executive Summary &amp; Decision Framework</h1>
    <p class="lead">Anonymized analysis for inheriting <strong>Property A (Cupertino 95014)</strong> via trust in 2040–2050 while already owning <strong>Property B (San Francisco Outer Sunset 94122, 3-unit)</strong>. As of {data['meta']['as_of_date']}.</p>

    <div class="grid-4">
      <div class="card">
        <div class="kpi-label">Property A (2026 / 2045 Est.)</div>
        <div class="kpi-val">{fmt(3100000)} → {fmt(pa_2045['fmv'])}</div>
        <div class="kpi-sub">Inherited via trust; Prop 13 FBYV {fmt(550540)} (2026)</div>
      </div>
      <div class="card">
        <div class="kpi-label">Property B (Already Owned)</div>
        <div class="kpi-val">{fmt(1800000)}</div>
        <div class="kpi-sub">SF 94122 3-unit; 2 units rented ({fmt(7150)}/mo), 1 owner-available</div>
      </div>
      <div class="card">
        <div class="kpi-label">Leading Financial Path (2045, 20-Yr)</div>
        <div class="kpi-val">Sell Immediate</div>
        <div class="kpi-sub">Pure 3: {fmt(base_2045['sell_immediate']['ending_wealth'])} (§ 1014 step-up = $0 cap gain)</div>
      </div>
      <div class="card">
        <div class="kpi-label">Federal Estate Exclusion (2026 / 2045)</div>
        <div class="kpi-val">{fmt(15000000)} → {fmt(est_2045['single_exclusion'])}</div>
        <div class="kpi-sub">CA Estate Tax: $0 (<a href="https://www.irs.gov/instructions/i706" target="_blank">IRS 706</a> / <a href="https://www.sco.ca.gov/Files-ARD-Tax-Info/estate_lawreg_lawreg.pdf" target="_blank">SCO</a>)</div>
      </div>
    </div>

    <div class="callout warn">
      <h2 style="margin-top:0; border:none;">What Would Change the Answer?</h2>
      <ul>
        <li><strong>Long-Term Occupancy of Property A + High Imputed Rent:</strong> If the household genuinely plans to live in Property A for 10+ years, claiming <a href="https://www.boe.ca.gov/pdf/pub801.pdf" target="_blank">Prop 19</a> saves ~{fmt(pa_2045['prop19_annual_tax_savings'])}/yr in property tax (at 2045) and unlocks renting Property B's 3rd unit, narrowing the gap with selling.</li>
        <li><strong>Immediate Post-Inheritance Market Crash (1929 / 2008):</strong> Lump-sum equity reinvestment suffers severe sequence-of-returns risk. Parking sale proceeds in <strong>3M–2Y Treasuries for 24–36 months (Phased Investing)</strong> softens crash drawdowns — see <a href="black-swan.html">Black Swan &amp; Phased Investing</a> (with reinvestment risk shown beside the headline).</li>
        <li><strong>Estate Exceeding Federal Exclusion ({fmt(15000000)} single / {fmt(30000000)} married with portability in 2026):</strong> A 40% federal estate tax due within 9 months forces an estate liquidity plan and may require selling Property A regardless of long-term return projections.</li>
        <li><strong>Cupertino Market Rent Comparables:</strong> The Rent path currently ranks lowest due to full FMV reassessment and low Bay Area cap rates; independent 95014 MLS comparables (not voucher floors) are required to confirm whether Rent is viable.</li>
        <li><strong>Enacted Law Changes (2026–2050):</strong> Repeal/modification of Prop 19, reduction of the federal estate exclusion, or changes to IRC § 1014 step-up in basis would materially shift the ranking.</li>
      </ul>
    </div>

    <h2>Pure vs. Mixed Paths Comparison (Base Case: 2045 Transfer, 20-Year Horizon)</h2>
    <p>All 6 paths are compared at the exact same transfer date and horizon, incorporating Santa Clara County transfer tax ($1.10/$1,000), recording fees, Prop 19 indexed allowance, IRC § 1014 step-up, IRC § 121 exclusion, § 1250 depreciation recapture, and CA 1% Mental Health Services Tax above $1M. Use <a href="projections.html">Projections &amp; What-If</a> to test 2040/2045/2050 and 10/20/30/50-year horizons.</p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Path (Pure &amp; Mixed)</th><th class="num">20-Yr Ending Wealth (Base)</th><th>Key Mechanics &amp; Trade-Offs</th></tr>
        </thead>
        <tbody>{"".join(rows)}</tbody>
      </table>
    </div>

    <h2>Pre-Commitment Decision Rules (Agreed Before Figures Arrive)</h2>
    <div class="card">
      <p>To prevent reverse-engineering a choice from a single projection, agree in writing on these triggers before the transfer date:</p>
      <ol>
        <li><strong>Choose Sell Immediate (Pure 3) or Sell + Phased Treasuries (Mixed 3)</strong> if the household does not plan to live in Property A for at least 5+ years, OR if the estate needs liquidity for federal estate tax (Form 706 due in 9 months).</li>
        <li><strong>Choose Live in Property A (Pure 1) or Live 5 Yrs then Sell (Mixed 1)</strong> ONLY if the heir will occupy Property A as their primary residence within 1 year (qualifying for Prop 19) and wants the Cupertino lifestyle/schools while retaining Property B as a 3-unit income asset.</li>
        <li><strong>Choose Rent Property A (Pure 2) or Rent then 1031 (Mixed 2)</strong> ONLY if independent 95014 rental comparables show a net cap rate competitive with after-tax Treasuries/equities after full FMV reassessment and landlord insurance.</li>
      </ol>
    </div>

    <h2>Decision Log (Decision &amp; Date)</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Date</th><th>Item</th><th>Decision / Status</th><th>Rationale</th></tr></thead>
        <tbody>
          <tr><td>2026-11-25</td><td>Privacy &amp; Data Rounding</td><td><strong>Adopted</strong></td><td>All published figures anonymized (Property A / B) and rounded to $10 increments; exact parcel data kept offline.</td></tr>
          <tr><td>2026-11-25</td><td>Baseline Model Architecture</td><td><strong>Adopted</strong></td><td>Compare 3 Pure + 3 Mixed paths at identical transfer dates (2040/2045/2050) &amp; horizons (10/20/30/50 yrs) using ranges.</td></tr>
          <tr><td>2026-11-25</td><td>Same-Year Sale Baseline</td><td><strong>Modeled First</strong></td><td>IRC § 1014 step-up eliminates capital gain on immediate sale; serves as the tax-free liquidity benchmark.</td></tr>
          <tr><td>Pending</td><td>Private Estate Inventory &amp; Portability</td><td><strong>Action Required</strong></td><td>Confirm total estate size, prior taxable gifts, and predeceased spouse DSUE with estate attorney.</td></tr>
          <tr><td>Pending</td><td>Independent 95014 Rental Comps &amp; Insurance Quotes</td><td><strong>Action Required</strong></td><td>Replace estimated insurance ($1,500/yr) and rent range with broker quotes &amp; MLS comps; re-run model annually.</td></tr>
        </tbody>
      </table>
    </div>
    """
    render_page("index.html", "Executive Summary", body)


def build_projections(data):
    mc = data["monte_carlo"]["percentiles"]
    max_p90 = max(v["p90"] for v in mc.values())

    dist_rows = []
    labels = {
        "sell_immediate": "Pure 3: Sell Immediate (Lump Sum Equity)",
        "mixed_sell_phased": "Mixed 3: Sell + Phased Treasuries (30m)",
        "live_a": "Pure 1: Live in Property A (Prop 19)",
        "rent_a": "Pure 2: Rent Property A (Reassessed)",
    }
    for k, lbl in labels.items():
        p = mc[k]
        left10 = p["p10"] / max_p90 * 100
        w10_90 = (p["p90"] - p["p10"]) / max_p90 * 100
        left25 = p["p25"] / max_p90 * 100
        w25_75 = (p["p75"] - p["p25"]) / max_p90 * 100
        left50 = p["p50"] / max_p90 * 100
        dist_rows.append(f"""
        <div class="dist-row">
          <div class="dist-label">
            <span>{lbl}</span>
            <span>P10: {fmt(p['p10'])} · <strong>Median (P50): {fmt(p['p50'])}</strong> · P90: {fmt(p['p90'])}</span>
          </div>
          <div class="dist-track">
            <div class="dist-p10-90" style="left:{left10:.1f}%; width:{w10_90:.1f}%;"></div>
            <div class="dist-p25-75" style="left:{left25:.1f}%; width:{w25_75:.1f}%;"></div>
            <div class="dist-p50" style="left:{left50:.1f}%;"></div>
          </div>
        </div>""")

    # Property A projection table (selected milestone years)
    pa_rows = []
    for r in data["property_a_projection"]:
        if r["year"] in [2026, 2030, 2035, 2040, 2045, 2050]:
            pa_rows.append(f"""<tr>
              <td>{r['year']}</td>
              <td class="num">{fmt(r['fmv'])}</td>
              <td class="num">{fmt(r['fbyv'])}</td>
              <td class="num">{fmt(r['prop19_allowance'])}</td>
              <td class="num">{fmt(r['tax_prop19'])}</td>
              <td class="num">{fmt(r['tax_no_prop19'])}</td>
              <td class="num">{fmt(r['prop19_annual_tax_savings'])}</td>
              <td><a href="https://www.boe.ca.gov/news/2025/nr-25-02.htm" target="_blank">CA BOE Prop 19</a></td>
            </tr>""")

    pb_rows = []
    for r in data["property_b_projection"]:
        if r["year"] in [2026, 2030, 2035, 2040, 2045, 2050]:
            pb_rows.append(f"""<tr>
              <td>{r['year']}</td>
              <td class="num">{fmt(r['fmv'])}</td>
              <td class="num">{fmt(r['assessed'])}</td>
              <td class="num">{fmt(r['prop_tax'])}</td>
              <td class="num">{fmt(r['prop_h_parcel_tax'])}</td>
              <td class="num">{fmt(r['rent_2_units_yr'])}</td>
              <td class="num">{fmt(r['maint_yr'])}</td>
              <td><a href="https://sfbos.archive.sf.gov/sites/default/files/bfc091725_agenda.pdf" target="_blank">SF BOS Rate</a> / <a href="https://media.api.sf.gov/documents/N26_EN_VIP.pdf" target="_blank">Prop H</a></td>
            </tr>""")

    body = f"""
    <h1>Projections, Interactive What-If Controls &amp; Distribution Chart</h1>
    <p class="lead">Compare all 6 paths (Pure + Mixed) at identical transfer dates and horizons using Low / Base / High ranges rather than single-point assumptions.</p>

    <div id="whatif-app">
      <div class="controls">
        <div class="ctrl-group">
          <label for="ctrl-year">Transfer Year</label>
          <select id="ctrl-year">
            <option value="2040">2040</option>
            <option value="2045" selected>2045 (Midpoint)</option>
            <option value="2050">2050</option>
          </select>
        </div>
        <div class="ctrl-group">
          <label for="ctrl-horizon">Horizon</label>
          <select id="ctrl-horizon">
            <option value="10">10 Years</option>
            <option value="20" selected>20 Years</option>
            <option value="30">30 Years</option>
            <option value="50">50 Years</option>
          </select>
        </div>
        <div class="ctrl-group">
          <label for="ctrl-scenario">Assumption Range</label>
          <select id="ctrl-scenario">
            <option value="low">Low (Conservative)</option>
            <option value="base" selected>Base (Central)</option>
            <option value="high">High (Optimistic)</option>
          </select>
        </div>
        <div class="ctrl-group">
          <label for="ctrl-eq">Equity Return Shift: <span id="lbl-eq">+0.0%</span></label>
          <input id="ctrl-eq" type="range" min="-3" max="3" step="0.5" value="0" />
        </div>
        <div class="ctrl-group">
          <label for="ctrl-home">Home Appreciation Shift: <span id="lbl-home">+0.0%</span></label>
          <input id="ctrl-home" type="range" min="-2" max="2" step="0.5" value="0" />
        </div>
        <div class="ctrl-group">
          <label for="ctrl-imputed">Imputed Rent Weight: <span id="lbl-imputed">100%</span></label>
          <input id="ctrl-imputed" type="range" min="0" max="1.2" step="0.2" value="1" />
        </div>
      </div>

      <div class="callout accent"><strong id="whatif-headline">Loading model...</strong></div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>Rank &amp; Path</th><th class="num">Ending Wealth</th><th class="num">vs. Leader</th><th>Notes</th></tr></thead>
          <tbody id="whatif-tbody"></tbody>
        </table>
      </div>
    </div>

    <h2>Outcome Distribution Chart (Monte Carlo: 500 Trials, 2045 Transfer, 20-Yr Horizon)</h2>
    <div class="card">
      <p class="kpi-sub" style="margin-bottom:14px;">Light blue = P10 to P90 range · Dark blue = P25 to P75 interquartile range · Black tick = Median (P50). All values rounded to $10.</p>
      {"".join(dist_rows)}
    </div>

    <h2>Property A (Cupertino 95014) Year-by-Year Projection (Base Case, $10 Rounded)</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Year</th><th class="num">Est. FMV</th><th class="num">Prop 13 FBYV</th><th class="num">Prop 19 Cap (Indexed)</th><th class="num">Tax w/ Prop 19</th><th class="num">Tax No Prop 19</th><th class="num">Annual Savings</th><th>Official Source</th></tr>
        </thead>
        <tbody>{"".join(pa_rows)}</tbody>
      </table>
    </div>

    <h2>Property B (SF Outer Sunset 94122, Already Owned) Projection (Base Case, $10 Rounded)</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Year</th><th class="num">Est. FMV</th><th class="num">Assessed (Prop 13)</th><th class="num">Total Prop Tax</th><th class="num">Prop H Parcel Tax</th><th class="num">2-Unit Rent/Yr</th><th class="num">Est. Maint/Yr</th><th>Official Source</th></tr>
        </thead>
        <tbody>{"".join(pb_rows)}</tbody>
      </table>
    </div>
    """
    render_page("projections.html", "Projections & What-If", body)


def build_black_swan(data):
    bs = data["black_swan"]
    rows = []
    for sc in bs["scenarios"]:
        delta_cls = "badge-mixed" if sc["phased_vs_lump_delta"] >= 0 else "badge-warn"
        sign = "+" if sc["phased_vs_lump_delta"] >= 0 else ""
        rows.append(f"""<tr>
          <td><strong>{sc['name']}</strong><br/><span class="kpi-sub">{sc['description']}</span></td>
          <td class="num">{fmt(sc['sell_lump_sum_end'])}<br/><span class="kpi-sub">Max DD: {sc['lump_max_drawdown_pct']}%</span></td>
          <td class="num"><strong>{fmt(sc['sell_phased_30m_end'])}</strong><br/><span class="kpi-sub">Max DD: {sc['phased_max_drawdown_pct']}%</span></td>
          <td class="num"><span class="badge {delta_cls}">{sign}{fmt(sc['phased_vs_lump_delta'])}</span></td>
          <td><strong>Reinvestment Risk:</strong> {sc['reinvestment_risk_note']}</td>
          <td class="num">{fmt(sc['live_a_end'])} / {fmt(sc['rent_a_end'])}</td>
        </tr>""")

    body = f"""
    <h1>Black Swan Economic Conditions &amp; Phased-Investing Stress Test</h1>
    <p class="lead">Growth and inflation are never uniform over 50 years. This section tests 5 historical crisis regimes occurring immediately after inheriting Property A (2045 transfer, 20-year horizon), comparing <strong>Immediate Lump-Sum Equities</strong> against <strong>Phased-Investing (parking sale proceeds in 3M–2Y Treasuries for 24–36 months before phasing into stocks)</strong>.</p>

    <div class="callout warn">
      <strong>Headline + Reinvestment Risk Side-by-Side:</strong> Phased-Investing in 3M–2Y Treasuries (which are also <strong>exempt from California state income tax</strong>) dramatically cushions severe multi-year crash entries like <strong>1929</strong> and <strong>2000</strong>. However, <strong>Reinvestment Risk</strong> is real: in V-shaped crashes (2008, 2022) or normal bull markets, maturing short-term Treasuries roll over at lower Fed-cut yields and miss early equity rebounds (base-case opportunity drag: ~{fmt(data['comparison_matrix']['2045']['20']['base']['paths']['mixed_sell_phased']['reinvestment_risk_drag'])} over 20 yrs).
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Black Swan Regime</th>
            <th class="num">Sell Lump-Sum (20-Yr)</th>
            <th class="num">Phased 30m Treasuries (20-Yr)</th>
            <th class="num">Phased vs. Lump</th>
            <th>Reinvestment Risk (Beside Headline)</th>
            <th class="num">Live A / Rent A</th>
          </tr>
        </thead>
        <tbody>{"".join(rows)}</tbody>
      </table>
    </div>

    <h2>Recommended Investment Policy Statement (IPS) Guardrail</h2>
    <div class="card">
      <ul>
        <li><strong>Write the IPS before the money arrives:</strong> Pre-specify whether sale proceeds will be invested via lump-sum (higher expected value) or a 24–36 month Treasury ladder (lower regret/drawdown).</li>
        <li><strong>Use 3M–2Y U.S. Treasuries (not long-duration bonds):</strong> Avoids 2022-style duration losses and is exempt from California's 12.3%–13.3% state income tax.</li>
        <li><strong>Review extreme scenarios annually:</strong> Re-run stress tests each year as transfer dates approach and interest-rate regimes shift.</li>
      </ul>
    </div>
    """
    render_page("black-swan.html", "Black Swan & Phased Investing", body)


def build_tax_legal(data):
    est_rows = []
    for r in data["estate_tax_projection"]:
        est_rows.append(f"""<tr>
          <td>{r['year']}</td>
          <td class="num">{fmt(r['single_exclusion'])}</td>
          <td class="num">{fmt(r['married_portability_exclusion'])}</td>
          <td class="num">{r['top_federal_rate_pct']}%</td>
          <td class="num">$0</td>
          <td><a href="https://www.irs.gov/instructions/i706" target="_blank">IRS Form 706 (2026)</a> · <a href="https://www.sco.ca.gov/Files-ARD-Tax-Info/estate_lawreg_lawreg.pdf" target="_blank">CA SCO § 13301</a></td>
        </tr>""")

    body = f"""
    <h1>Tax &amp; Legal Framework (Separated by Tax System)</h1>
    <p class="lead">Every inheritance decision involves <strong>three completely separate tax systems</strong>. Never conflate them. Every row below is verified against official government sources.</p>

    <h2>1. Estate &amp; Inheritance Tax (Transfer-at-Death Tax)</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Year</th><th class="num">Federal Exclusion (Single)</th><th class="num">Married w/ Portability (DSUE)</th><th class="num">Top Federal Rate</th><th class="num">CA Estate Tax</th><th>Official Source</th></tr></thead>
        <tbody>{"".join(est_rows)}</tbody>
      </table>
    </div>
    <p class="kpi-sub">Note: 2026 Basic Exclusion Amount is verified at $15,000,000 (up from $13,990,000 in 2025) per IRS Form 706 Instructions (Rev. July 2026). Future years projected at 2.8% inflation. Portability requires a timely filed Form 706 by the predeceased spouse's estate.</p>

    <h2>2. Income-Tax Basis, Capital Gains, § 121, § 1031 &amp; Depreciation Recapture</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Rule / Provision</th><th>Verified Official Term</th><th>Impact on Property A / B</th><th>Official Source</th></tr></thead>
        <tbody>
          <tr><td><strong>IRC § 1014 Step-Up in Basis</strong></td><td>Cost basis resets to Fair Market Value (FMV) on date of death</td><td>Selling Property A in the same tax year as inheritance yields ~$0 capital gain. Obtain written date-of-death appraisal.</td><td><a href="https://www.irs.gov/publications/p559" target="_blank">IRS Pub 559</a></td></tr>
          <tr><td><strong>IRC § 121 Primary Residence Exclusion</strong></td><td>$250,000 Single / $500,000 MFJ (owned &amp; lived in 2 of last 5 yrs)</td><td>Applies to Mixed Path 1 (Live-then-Sell). Does NOT exclude post-1997 depreciation recapture.</td><td><a href="https://www.irs.gov/pub/irs-pdf/p523.pdf" target="_blank">IRS Pub 523 (2025)</a></td></tr>
          <tr><td><strong>Depreciation &amp; § 1250 Recapture</strong></td><td>27.5-yr residential depreciation; unrecaptured § 1250 gain taxed up to 25% federal (+ 3.8% NIIT)</td><td>Applies to Rent Property A path; CA taxes recapture as ordinary income.</td><td><a href="https://www.irs.gov/pub/irs-pdf/p523.pdf" target="_blank">IRS Pub 523</a></td></tr>
          <tr><td><strong>IRC § 1031 Like-Kind Exchange</strong></td><td>Defers capital gain &amp; § 1250 recapture on investment real estate</td><td>Must decide BEFORE selling; strict 45-day ID / 180-day close deadlines; requires Qualified Intermediary.</td><td><a href="https://www.irs.gov/businesses/small-businesses-self-employed/like-kind-exchanges-real-estate-tax-tips" target="_blank">IRS § 1031</a></td></tr>
          <tr><td><strong>CA Form 540 Capital Gains &amp; 1% MHST</strong></td><td>No preferential CA LTCG rate (up to 12.3% ordinary) + <strong>1% Mental Health Services Tax</strong> on CA taxable income &gt; $1,000,000 (13.3% top)</td><td>Selling appreciated real estate years after inheritance can trigger the 1% MHST above $1M.</td><td><a href="https://www.ftb.ca.gov/forms/2024/2024-540-ca-instructions.html" target="_blank">CA FTB Form 540</a></td></tr>
        </tbody>
      </table>
    </div>

    <h2>3. Property-Tax Assessment, Transfer Taxes &amp; Local Rules (Cupertino &amp; SF)</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Rule / Jurisdiction</th><th>Verified Official Term</th><th>Impact on Property A / B</th><th>Official Source</th></tr></thead>
        <tbody>
          <tr><td><strong>CA Proposition 19 (Parent-to-Child)</strong></td><td>Must become heir's principal residence &amp; file Homeowners' Exemption within <strong>1 year</strong>. Cap = FBYV + <strong>$1,044,586</strong> (Feb 16, 2025 – Feb 15, 2027), adjusted biennially by FHFA CA HPI.</td><td>If heir rents Property A or moves out later, exclusion is removed and reassessed to date-of-transfer FMV factored forward.</td><td><a href="https://www.boe.ca.gov/news/2025/nr-25-02.htm" target="_blank">CA BOE NR-25-02</a> · <a href="https://www.boe.ca.gov/pdf/pub801.pdf" target="_blank">Pub 801</a></td></tr>
          <tr><td><strong>Santa Clara County / Cupertino Transfer Tax</strong></td><td>County Documentary Transfer Tax: <strong>$0.55 per $500</strong> ($1.10/$1,000 = 0.11%). <strong>Cupertino City Transfer Tax: $0</strong> (only San Jose, Palo Alto, Mountain View levy city conveyance tax). Basic recording: $25 first page.</td><td>Priced into all Sell paths. Low transaction tax compared to SF.</td><td><a href="https://clerkrecorder.santaclaracounty.gov/recording-documents/recording-document-fees" target="_blank">SCC Clerk-Recorder</a></td></tr>
          <tr><td><strong>SF Property Tax Rate (FY 2025–26)</strong></td><td>Combined rate: <strong>$1.18268325 per $100</strong> (1.18268325%)</td><td>Applies to Property B (already owned, low Prop 13 base ~$114,250).</td><td><a href="https://sfbos.archive.sf.gov/sites/default/files/bfc091725_agenda.pdf" target="_blank">SF BOS Agenda</a></td></tr>
          <tr><td><strong>SF Prop H (Nov 2026 — Muni Parcel Tax)</strong></td><td>Annual parcel tax: <strong>$129 to $400,000/parcel</strong> depending on property type/size, inflation-adjusted for 15 years.</td><td>Modeled as incremental annual parcel tax on Property B.</td><td><a href="https://media.api.sf.gov/documents/N26_EN_VIP.pdf" target="_blank">SF Nov 2026 VIP</a></td></tr>
          <tr><td><strong>SF Prop H (2006 — Rent Board Relocation)</strong></td><td>Requires relocation payments for no-fault evictions (OMI / capital improvement), inflation-adjusted annually.</td><td>Critical if ever modifying occupancy of Property B's 2 rented units.</td><td><a href="https://www.sf.gov/reports--december-2006--san-francisco-rent-board-news-archive-2006" target="_blank">SF Rent Board</a></td></tr>
        </tbody>
      </table>
    </div>

    <h2>4. Enacted Law vs. Proposed Legislation Tracker</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Item</th><th>Status</th><th>Summary &amp; Decision Impact</th><th>Official Source</th></tr></thead>
        <tbody>
          <tr><td>Federal Estate Tax Exclusion ($15M in 2026)</td><td><span class="badge badge-mixed">Enacted</span></td><td>Confirmed in IRS July 2026 Form 706 instructions; indexed for inflation.</td><td><a href="https://www.irs.gov/instructions/i706" target="_blank">IRS Form 706</a></td></tr>
          <tr><td>CA Prop 19 Biennial Cap ($1,044,586)</td><td><span class="badge badge-mixed">Enacted</span></td><td>Active Feb 16, 2025 – Feb 15, 2027; next BOE adjustment due Feb 2027.</td><td><a href="https://www.boe.ca.gov/news/2025/nr-25-02.htm" target="_blank">CA BOE</a></td></tr>
          <tr><td>CA Prop 19 Repeal / Modification Efforts (e.g., SCA 4)</td><td><span class="badge badge-warn">Proposed / Historical</span></td><td>Do NOT rely on repeal until voters enact a constitutional amendment.</td><td><a href="https://boe.ca.gov/legdiv/pdf/0004SCA041923rd.pdf" target="_blank">CA BOE Analysis</a></td></tr>
          <tr><td>CA State Estate / Wealth Tax Proposals (e.g., SB 378)</td><td><span class="badge badge-warn">Proposed / Not Enacted</span></td><td>CA Constitution/R&amp;TC § 13301 currently prohibits state estate tax; requires voter approval to change.</td><td><a href="https://www.ftb.ca.gov/tax-pros/law/legislation/2019-2020/SB378-032519.pdf" target="_blank">CA FTB Analysis</a></td></tr>
          <tr><td>SF Real Property Transfer Tax Restructuring (Nov 2026)</td><td><span class="badge badge-warn">Ballot Measure</span></td><td>Targets $10M+ transfers (5.5%–6%); does not alter sub-$5M residential tiers directly.</td><td><a href="https://media.api.sf.gov/documents/N26_EN_VIP.pdf" target="_blank">SF Nov 2026 VIP</a></td></tr>
        </tbody>
      </table>
    </div>
    """
    render_page("tax-legal.html", "Tax, Prop 19, Prop H & Laws", body)


def build_process_timeline(data):
    body = """
    <h1>Step-by-Step Inheritance Process, Deadlines Timeline &amp; 5-Year Capital Plan</h1>
    <p class="lead">Operational roadmap for trust administration, statutory deadlines, building maintenance, and private estate inventory.</p>

    <h2>Visual Deadlines Timeline (From Date of Death = Day 0)</h2>
    <div class="card">
      <div class="timeline">
        <div class="tl-item">
          <div class="tl-time">Days 1–30 · Immediate Trust Administration</div>
          <strong>Secure Property A &amp; Notify Insurer:</strong> Obtain certified death certificates, notify homeowner's insurance carrier (vacancy/trustee endorsement), and maintain water/solar accounts.
        </div>
        <div class="tl-item">
          <div class="tl-time">Days 30–60 · Written Date-of-Death Valuation</div>
          <strong>Order Certified Appraisal:</strong> Obtain an independent written date-of-death appraisal of Property A to establish the IRC § 1014 stepped-up income-tax basis.
        </div>
        <div class="tl-item">
          <div class="tl-time">Within 150 Days · Santa Clara County Assessor Notice</div>
          <strong>File Change in Ownership Statement (Death of Real Property Owner):</strong> File BOE-502-D with the Santa Clara County Assessor within 150 days of death to avoid penalties.
        </div>
        <div class="tl-item">
          <div class="tl-time">Within 9 Months · Federal Estate Tax (IRS Form 706)</div>
          <strong>File Form 706 &amp; Pay Any Estate Tax:</strong> Due 9 months after death (6-month extension available via Form 4768, but tax payment is due at 9 months). Required if gross estate + prior taxable gifts exceed exclusion OR to elect portability (DSUE).
        </div>
        <div class="tl-item">
          <div class="tl-time">Within 12 Months (1 Year) · Proposition 19 Hard Deadline</div>
          <strong>Move In &amp; File Homeowners' Exemption (if claiming Prop 19):</strong> Heir must occupy Property A as principal residence AND file BOE-19-P + Homeowners' Exemption within 1 year of transfer.
        </div>
        <div class="tl-item">
          <div class="tl-time">Same Tax Year · Same-Year Sale Benchmark</div>
          <strong>Execute Sale (if Sell Path chosen):</strong> Selling within the same tax year as death minimizes post-death appreciation/tax friction and locks in § 1014 basis.
        </div>
      </div>
    </div>

    <h2>5-Year Maintenance &amp; Capital Plan (Property A &amp; Property B)</h2>
    <div class="grid-2">
      <div class="card">
        <h3>Property A (Cupertino 95014 — Lower Maintenance)</h3>
        <ul>
          <li><strong>Utilities:</strong> Water ~$100–$150/mo; Solar generates ~$10–$20/mo net credit ($0 electricity bill).</li>
          <li><strong>Insurance:</strong> User est. $1,500/yr — <em>flagged unverified</em>; budget $3,200–$5,500/yr until broker quote obtained.</li>
          <li><strong>5-Yr Capital Reserve:</strong> Roof/solar inverter check (Yr 1), exterior paint/HVAC service (Yr 2–3), plumbing/water heater (Yr 4–5). Target 0.4%–1.0% of FMV/yr.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Property B (SF 94122 — 3-Unit, Higher Maintenance)</h3>
        <ul>
          <li><strong>Utilities:</strong> Water ~$330–$400/mo (all 3 units); Electricity ~$30–$70/mo.</li>
          <li><strong>Insurance:</strong> User est. $1,500/yr — <em>flagged unverified</em>; 3-unit SF landlord policies typically run $4,200–$7,500/yr.</li>
          <li><strong>5-Yr Capital Reserve:</strong> Coastal salt-air exterior/roof maintenance, seismic/soft-story compliance check, 3-unit plumbing/electrical upgrades. Target 0.8%–1.8% of FMV/yr.</li>
        </ul>
      </div>
    </div>

    <h2>Private Estate Inventory &amp; Privacy Containment Checklist (Keep Offline)</h2>
    <div class="card">
      <p>Keep this inventory in an encrypted offline vault — <strong>never</strong> commit to GitHub:</p>
      <ul>
        <li>Exact street addresses, APNs (Assessor's Parcel Numbers), and Santa Clara County Tax Rate Area (TRA) code.</li>
        <li>Trust instrument, successor trustee contact, and beneficiary shares.</li>
        <li>Full balance sheet of liquid cash, brokerage accounts, retirement accounts, and life insurance to test against the $15M (2026) federal estate exclusion.</li>
        <li>History of prior taxable gifts (Form 709) and any predeceased spouse Form 706 portability election (DSUE).</li>
        <li>Property B's signed leases, rent roll, security deposits, and SF Rent Board registration status.</li>
      </ul>
    </div>
    """
    render_page("process-timeline.html", "Process, Deadlines & 5-Yr Plan", body)


def build_briefing(data):
    base_2045 = data["comparison_matrix"]["2045"]["20"]["base"]["paths"]
    pa_2045 = next(r for r in data["property_a_projection"] if r["year"] == 2045)

    body = f"""
    <div class="no-print" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <span><strong>One-Page Printable Briefing Sheet</strong> (formatted for 1-page PDF/print)</span>
      <button class="btn" onclick="window.print()">Print / Save as 1-Page PDF</button>
    </div>

    <h1>Attorney &amp; CPA Briefing Sheet — Estate &amp; Property Decision</h1>
    <p class="lead" style="margin-bottom:10px;">Prepared {data['meta']['as_of_date']} · Anonymized ($10 rounded) · Planned Trust Transfer: 2040–2050</p>

    <div class="grid-2">
      <div class="card">
        <h3 style="margin-top:0;">1. Household Fact Pattern</h3>
        <ul style="margin:0; padding-left:18px;">
          <li><strong>Property A (Cupertino 95014):</strong> Inherited via trust; 2026 est. FMV $3,100,000; Prop 13 FBYV $550,540; solar installed.</li>
          <li><strong>Property B (SF 94122):</strong> Already owned by heir; 3-unit building ($1,800,000 est. FMV; $114,250 assessed; 2 units rented at $7,150/mo, 1 owner-available).</li>
          <li><strong>Liquid Estate:</strong> Considerable cash/investments — may exceed Federal Estate Tax Exclusion ($15,000,000 single in 2026; CA estate tax = $0).</li>
        </ul>
      </div>
      <div class="card">
        <h3 style="margin-top:0;">2. Base-Case Model Summary (2045, 20-Yr)</h3>
        <ul style="margin:0; padding-left:18px;">
          <li><strong>Sell Immediate (§ 1014):</strong> {fmt(base_2045['sell_immediate']['ending_wealth'])}</li>
          <li><strong>Sell + Phased 30m Treasuries:</strong> {fmt(base_2045['mixed_sell_phased']['ending_wealth'])}</li>
          <li><strong>Live 5 Yrs (§ 121) then Sell:</strong> {fmt(base_2045['mixed_live_sell']['ending_wealth'])}</li>
          <li><strong>Live Long-Term (Prop 19):</strong> {fmt(base_2045['live_a']['ending_wealth'])}</li>
          <li><strong>Rent (Reassessed):</strong> {fmt(base_2045['rent_a']['ending_wealth'])}</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:0;">3. Priority Questions for Estate Attorney &amp; CPA</h3>
      <table>
        <thead><tr><th>Topic</th><th>Specific Question to Confirm</th><th>Statutory Reference</th></tr></thead>
        <tbody>
          <tr><td><strong>Estate Tax &amp; Liquidity</strong></td><td>Does total projected estate + prior taxable gifts exceed the federal exclusion? Is portability (DSUE) available from a predeceased spouse?</td><td>IRS Form 706 ($15M in 2026)</td></tr>
          <tr><td><strong>Trust &amp; Step-Up Basis</strong></td><td>Does the trust structure guarantee a full IRC § 1014 basis step-up on Property A at death?</td><td>IRC § 1014 / IRS Pub 559</td></tr>
          <tr><td><strong>Prop 19 Eligibility</strong></td><td>Confirm 1-year occupancy &amp; Homeowners' Exemption rules and indexed cap ({fmt(pa_2045['prop19_allowance'])} est. in 2045).</td><td>CA BOE Pub 801 / NR-25-02</td></tr>
          <tr><td><strong>CA 1% MHST &amp; § 121</strong></td><td>Model CA ordinary income + 1% MHST above $1M if selling after holding; verify § 121 ($250k/$500k) eligibility.</td><td>CA FTB Form 540 / IRS Pub 523</td></tr>
          <tr><td><strong>SF Property B Leases</strong></td><td>Verify SF Rent Ordinance status, Prop H (2006) relocation rules, and Prop H (2026) parcel tax impact.</td><td>SF Rent Board / SF VIP 2026</td></tr>
        </tbody>
      </table>
    </div>
    """
    render_page("briefing.html", "Attorney & CPA 1-Page Brief", body)


def build_questions_suggestions(data):
    body = """
    <h1>Questions, Missing Information &amp; Suggestions Roadmap</h1>
    <p class="lead">A clear inventory of what we know, what is missing, how to discover it, and a dedicated suggestions section to review before implementing any future changes.</p>

    <h2>1. Known vs. Missing Information &amp; Discovery Plan</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Category</th><th>What We Have</th><th>What Is Missing</th><th>How to Discover</th></tr></thead>
        <tbody>
          <tr><td><strong>Estate Size &amp; Gifts</strong></td><td>"Considerable money" potentially above federal exclusion</td><td>Exact net worth, prior taxable gifts (Form 709), portability (DSUE)</td><td>Build offline private estate inventory; request prior Form 709/706 copies from CPA.</td></tr>
          <tr><td><strong>Property A Tax Rate</strong></td><td>Rounded historical tax/assessment (~1.3% effective w/ fixed assessments)</td><td>Exact Santa Clara County Tax Rate Area (TRA) published rate</td><td>Look up parcel privately on Santa Clara County Assessor / Tax Collector portal.</td></tr>
          <tr><td><strong>Property A Market Rent</strong></td><td>Modeled range ($5,200–$7,400/mo)</td><td>Independent 95014 MLS rental comparables</td><td>Request 3–5 recent 95014 single-family lease comps from a local broker (do not rely on HUD voucher floor).</td></tr>
          <tr><td><strong>Home &amp; Landlord Insurance</strong></td><td>User estimate (~$1,500/yr each)</td><td>Actual binding quotes for Cupertino primary/landlord &amp; SF 3-unit</td><td>Obtain written quotes from 2–3 California insurance brokers (including CA FAIR Plan backup if needed).</td></tr>
          <tr><td><strong>Property B Leases</strong></td><td>3 units total; 2 rented at $7,150/mo; 1 owner-available</td><td>Year built (pre-1979 SF rent control?), lease end dates, tenant protected status</td><td>Review signed leases &amp; SF Rent Board registry privately with SF landlord-tenant counsel.</td></tr>
          <tr><td><strong>Household Filing &amp; Goals</strong></td><td>Desire to maximize profit &amp; lower costs</td><td>Filing status (Single vs MFJ), target retirement date, willingness to live in Cupertino</td><td>Complete Pre-Commitment Decision Rules on the Executive Summary page.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>2. Dedicated Suggestions &amp; Improvement Roadmap (Review Before Implementing)</h2>
    <div class="callout accent">
      <strong>How to use this section:</strong> Review each suggestion below with the household and advisers. Choose which items to adopt before making any changes to the model or site.
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Suggestion</th><th>Decision-Making Benefit</th><th>Effort</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>S-01</td><td><strong>Add Annual Re-Run Reminder &amp; Diff Log</strong></td><td>Shows whether updated inputs (interest rates, Prop 19 cap, FMV) actually moved the winning path.</td><td>Low</td><td><span class="badge badge-warn">Proposed</span></td></tr>
          <tr><td>S-02</td><td><strong>Add Trust Liquidity / Estate Tax Funding Module</strong></td><td>Models life insurance, Section 6166 installment election, or partial asset sales if estate &gt; $15M.</td><td>Medium</td><td><span class="badge badge-warn">Proposed</span></td></tr>
          <tr><td>S-03</td><td><strong>Add Cupertino 95014 Comps Input Form (Local-Only)</strong></td><td>Lets the user paste local MLS comps in browser memory (never uploaded) to test Rent path accuracy.</td><td>Medium</td><td><span class="badge badge-warn">Proposed</span></td></tr>
          <tr><td>S-04</td><td><strong>Add Property B Sell-vs-Hold Comparison</strong></td><td>Tests whether selling Property B (with SF transfer tax + capital gains) and moving to Property A beats holding B.</td><td>Medium</td><td><span class="badge badge-warn">Proposed</span></td></tr>
          <tr><td>S-05</td><td><strong>Add Automated Official-Link Health Check (GitHub Action)</strong></td><td>Alerts annually if IRS, CA BOE, FTB, or SF/SCC official URLs change or publish new biennial Prop 19 caps.</td><td>Low</td><td><span class="badge badge-warn">Proposed</span></td></tr>
        </tbody>
      </table>
    </div>
    """
    render_page("questions-suggestions.html", "Questions & Suggestions", body)


def build_flagged(data):
    body = """
    <h1>Flagged for Review (Unverified Items &amp; Irregularities)</h1>
    <p class="lead">Per strict verification rules, any value that could not be confirmed from an official government source is flagged below with links for manual review. No values were hallucinated.</p>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Item</th><th>Status</th><th>Reason Flagged / Irregularity</th><th>Official Verification Link</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>Property A Exact Tax Rate Area (TRA)</strong></td>
            <td><span class="badge badge-danger">Unverified (Private Lookup)</span></td>
            <td>Exact parcel TRA cannot be published without exposing parcel identity. Modeled using 1.10%–1.35% range.</td>
            <td><a href="https://www.sccassessor.org/" target="_blank">Santa Clara County Assessor</a></td>
          </tr>
          <tr>
            <td><strong>Property A &amp; B Insurance Quotes ($1,500/yr user est.)</strong></td>
            <td><span class="badge badge-danger">Unverified</span></td>
            <td>$1,500/yr is likely below current 2026 California market rates for a $3.1M Cupertino home and a 3-unit SF building. Modeled with wider ranges ($1,500–$7,500/yr).</td>
            <td><a href="https://www.insurance.ca.gov/" target="_blank">CA Dept. of Insurance</a></td>
          </tr>
          <tr>
            <td><strong>Property A Market Rent Comparables</strong></td>
            <td><span class="badge badge-danger">Unverified</span></td>
            <td>No private MLS comparables provided; rent path ranked on range ($5,200–$7,400/mo) rather than verified comps.</td>
            <td><a href="https://www.huduser.gov/portal/datasets/fmr/smallarea/index.html" target="_blank">HUD SAFMR (Floor Reference Only)</a></td>
          </tr>
          <tr>
            <td><strong>Property B SF Rent Control &amp; Lease Terms</strong></td>
            <td><span class="badge badge-danger">Unverified (Private Lookup)</span></td>
            <td>Building construction year (pre-1979 vs post-1979) and tenant protected status not provided.</td>
            <td><a href="https://www.sf.gov/departments/rent-board" target="_blank">SF Rent Board</a></td>
          </tr>
          <tr>
            <td><strong>Total Estate Value, Prior Gifts &amp; DSUE Portability</strong></td>
            <td><span class="badge badge-danger">Unverified (Private Lookup)</span></td>
            <td>Exact estate size above/below the $15,000,000 (2026) federal exclusion is unknown; requires private inventory.</td>
            <td><a href="https://www.irs.gov/instructions/i706" target="_blank">IRS Form 706 Instructions</a></td>
          </tr>
          <tr>
            <td><strong>SF Prop H (Nov 2026) Exact Tier for Property B</strong></td>
            <td><span class="badge badge-warn">Needs Parcel Size Check</span></td>
            <td>Official parcel tax ranges from $129 to $400,000/parcel by type/size; modeled at $130–$800/yr range.</td>
            <td><a href="https://media.api.sf.gov/documents/N26_EN_VIP.pdf" target="_blank">SF Nov 2026 Voter Pamphlet</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    """
    render_page("flagged.html", "Flagged for Review", body)


def build_glossary(data):
    body = """
    <h1>Glossary of Terms</h1>
    <p class="lead">Plain-English definitions of tax, real estate, and investment terms used across TinoDash1.</p>

    <div class="grid-2">
      <div class="card">
        <h3>Property Tax Terms</h3>
        <ul>
          <li><strong>Factored Base Year Value (FBYV):</strong> A property's Prop 13 assessed value (original base value increased by at most 2% per year).</li>
          <li><strong>Proposition 19 (CA):</strong> Allows a parent-to-child transfer of a family home to keep its FBYV + an indexed allowance ($1,044,586 in 2025–2027) ONLY if the child moves in within 1 year as their primary residence.</li>
          <li><strong>Tax Rate Area (TRA):</strong> The specific geographic tax district in a California county that determines the 1% Prop 13 base rate plus local voter-approved bonds.</li>
          <li><strong>Documentary Transfer Tax:</strong> One-time tax paid when real estate is sold ($1.10 per $1,000 in Santa Clara County; $0 city tax in Cupertino).</li>
        </ul>
      </div>
      <div class="card">
        <h3>Estate &amp; Income Tax Terms</h3>
        <ul>
          <li><strong>IRC § 1014 Step-Up in Basis:</strong> Resets an inherited asset's cost basis to its Fair Market Value on the date of death, eliminating prior unrealized capital gains.</li>
          <li><strong>Portability (DSUE):</strong> Deceased Spousal Unused Exclusion — allows a surviving spouse to carry over a deceased spouse's unused federal estate tax exclusion via Form 706.</li>
          <li><strong>IRC § 121 Exclusion:</strong> Excludes up to $250,000 (Single) or $500,000 (MFJ) of capital gain on the sale of a primary residence owned and lived in for 2 of the last 5 years.</li>
          <li><strong>Unrecaptured § 1250 Gain:</strong> Federal tax (up to 25%) on previously claimed residential rental depreciation when the property is sold.</li>
          <li><strong>CA 1% MHST:</strong> California's 1% Mental Health Services Tax on California taxable income exceeding $1,000,000.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Investment &amp; Modeling Terms</h3>
        <ul>
          <li><strong>Imputed Rent:</strong> The implicit tax-free housing benefit of living in a home you own instead of paying rent to a landlord.</li>
          <li><strong>Phased-Investing (Treasury Staging):</strong> Parking sale proceeds in 3M–2Y U.S. Treasuries for 24–36 months and gradually moving into equities to reduce crash-entry risk.</li>
          <li><strong>Reinvestment Risk:</strong> The risk that maturing short-term Treasuries must be reinvested at lower interest rates (e.g., after Fed rate cuts) or miss early equity market rebounds.</li>
          <li><strong>Sequence-of-Returns Risk:</strong> The danger that a severe market crash occurs right after a large lump-sum investment, permanently impairing long-term compounding.</li>
        </ul>
      </div>
      <div class="card">
        <h3>San Francisco Specific Terms</h3>
        <ul>
          <li><strong>SF Prop H (Nov 2026):</strong> San Francisco parcel tax ($129–$400,000/parcel, inflation-adjusted for 15 years) to fund Muni operations.</li>
          <li><strong>SF Prop H (2006):</strong> San Francisco Rent Board ordinance mandating inflation-adjusted relocation payments for no-fault evictions (e.g., owner move-in).</li>
          <li><strong>IRC § 1031 Exchange:</strong> Tax-deferred swap of one investment property for another like-kind investment property, deferring capital gains and depreciation recapture.</li>
        </ul>
      </div>
    </div>
    """
    render_page("glossary.html", "Glossary", body)


def main():
    DOCS.mkdir(parents=True, exist_ok=True)
    data = engine.generate_full_model()
    out_json = DOCS / "data" / "model_output.json"
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(data, indent=2), encoding="utf-8")

    # Add .nojekyll so GitHub Pages serves docs/ cleanly
    (DOCS / ".nojekyll").write_text("", encoding="utf-8")

    build_index(data)
    build_projections(data)
    build_black_swan(data)
    build_tax_legal(data)
    build_process_timeline(data)
    build_briefing(data)
    build_questions_suggestions(data)
    build_flagged(data)
    build_glossary(data)
    print("Site built successfully in docs/ (9 pages + model_output.json)")


if __name__ == "__main__":
    main()
