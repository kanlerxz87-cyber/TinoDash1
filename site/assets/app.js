// Shared navigation, formatting, and live What-If model for TinoDash1

const NAV_GROUPS = [
  {
    title: "Decision Dashboard",
    links: [
      { href: "index.html", label: "Overview & What-If" },
      { href: "properties.html", label: "Properties & Projections" },
      { href: "blackswan.html", label: "Black Swan & Phased Risk" },
    ],
  },
  {
    title: "Law, Tax & Process",
    links: [
      { href: "taxes.html", label: "Taxes, Laws & Estate" },
      { href: "process.html", label: "Process & Deadlines" },
      { href: "brief.html", label: "Attorney & CPA Brief (1-Pg)" },
    ],
  },
  {
    title: "Governance & Verification",
    links: [
      { href: "questions.html", label: "Questions, Gaps & Suggestions" },
      { href: "review.html", label: "Flagged for Review & Glossary" },
    ],
  },
];

function fmtUSD(val) {
  if (val === null || val === undefined || Number.isNaN(val)) return "—";
  const rounded = Math.round(val / 10) * 10;
  return (rounded < 0 ? "-$" : "$") + Math.abs(rounded).toLocaleString("en-US");
}

function renderSidebar(activeFile) {
  const el = document.getElementById("sidebar");
  if (!el) return;
  let html = `
    <div class="brand">TinoDash1</div>
    <div class="brand-sub">Property A (95014) &amp; Property B (94122)<br>Inheritance Decision Dashboard</div>
  `;
  for (const g of NAV_GROUPS) {
    html += `<div class="nav-group"><div class="nav-group-title">${g.title}</div>`;
    for (const l of g.links) {
      const cls = l.href === activeFile ? "nav-link active" : "nav-link";
      html += `<a class="${cls}" href="${l.href}">${l.label}</a>`;
    }
    html += `</div>`;
  }
  html += `
    <div class="privacy-pill">
      <strong>Privacy-First Mode</strong><br>
      Zero PII. All dollar figures rounded to nearest $10. Placeholders used throughout.
    </div>
  `;
  el.innerHTML = html;
}

async function loadModelData() {
  const res = await fetch("data/model_data.json");
  if (!res.ok) throw new Error("Failed to load model_data.json");
  return res.json();
}

// Client-side mirror of model/run_model.py evaluate_paths() for live What-If controls
function computeWhatIf(base, opts) {
  const t0 = opts.transferYear - base.base_year;
  const fmv0 = base.prop_a_fmv_2026 * Math.pow(1 + opts.homeAppr, t0);
  const fbyv0 = base.prop_a_assessed_2026 * Math.pow(1.02, t0);
  const periods = Math.max(0, Math.floor((opts.transferYear - 2026) / 2));
  const p19Allow = base.prop19_allowance_2026 * Math.pow(1 + base.prop19_hpi_growth, 2 * periods);
  const inf0 = Math.pow(1 + base.inflation, t0);

  const txRate = base.selling_cost_pct + base.scc_transfer_tax_rate;
  const netSale0 = fmv0 * (1 - txRate) - base.recording_fees;
  const eqNet = opts.equityReturn - 0.0055;
  const tbillNet = base.treasury_yield * (1 - base.fed_ord_rate);
  const capTaxRate = base.fed_ltcg_plus_niit + base.ca_top_rate_with_mhsa;

  // Path 1: Sell Lump-Sum
  const p1Gross = netSale0 * Math.pow(1 + eqNet, opts.horizon);
  const p1Net = p1Gross - Math.max(0, p1Gross - netSale0) * capTaxRate;

  // Path 2: Sell Phased 30M Treasuries
  const stageYrs = 2.5;
  const remYrs = Math.max(0, opts.horizon - stageYrs);
  const p2Stage = netSale0 * Math.pow(1 + tbillNet, stageYrs);
  const p2Gross = p2Stage * Math.pow(1 + eqNet, remYrs);
  const p2Net = p2Gross - Math.max(0, p2Gross - p2Stage) * capTaxRate;

  // Path 3: Rent Long-Term
  const annualDepr = (fmv0 * 0.35) / 27.5;
  let p3Cf = 0, totalDepr = 0;
  for (let y = 0; y < opts.horizon; y++) {
    const infY = inf0 * Math.pow(1 + base.inflation, y);
    const fmvY = fmv0 * Math.pow(1 + opts.homeAppr, y);
    const rentY = opts.marketRent * 12 * Math.pow(1 + base.rent_growth_cup, t0 + y) * 0.94;
    const taxY = fmv0 * Math.pow(1.02, y) * base.prop_a_eff_tax_rate + base.prop_a_fixed_assessments * infY;
    const insY = base.prop_a_ins_yr * Math.pow(1 + base.inflation + 0.015, t0 + y) * 1.15;
    const maintY = fmvY * base.prop_a_maint_pct;
    const utilY = (base.prop_a_water_mo + base.prop_a_solar_credit_mo) * 12 * infY * 0.3;
    const noi = rentY - taxY - insY - maintY - utilY;
    const depr = y < 27 ? annualDepr : 0;
    totalDepr += depr;
    const incTax = Math.max(0, noi - depr) * (base.fed_ord_rate + base.ca_base_rate);
    p3Cf = p3Cf * (1 + eqNet) + (noi - incTax);
  }
  const fmvEnd = fmv0 * Math.pow(1 + opts.homeAppr, opts.horizon);
  const saleEndGross = fmvEnd * (1 - txRate) - base.recording_fees;
  const p3ExitTax = totalDepr * (base.fed_recapture_1250 + base.ca_top_rate_with_mhsa) +
                    Math.max(0, saleEndGross - fmv0) * capTaxRate;
  const p3Net = (saleEndGross - p3ExitTax) + p3Cf;

  // Path 4: Live Long-Term (Prop 19)
  const p4Assessed = opts.prop19Eligible ? (fbyv0 + Math.max(0, fmv0 - (fbyv0 + p19Allow))) : fmv0;
  let p4Cf = 0;
  for (let y = 0; y < opts.horizon; y++) {
    const infY = inf0 * Math.pow(1 + base.inflation, y);
    const fmvY = fmv0 * Math.pow(1 + opts.homeAppr, y);
    const taxY = p4Assessed * Math.pow(1.02, y) * base.prop_a_eff_tax_rate + base.prop_a_fixed_assessments * infY;
    const insY = base.prop_a_ins_yr * Math.pow(1 + base.inflation + 0.015, t0 + y);
    const maintY = fmvY * base.prop_a_maint_pct;
    const utilY = (base.prop_a_water_mo + base.prop_a_solar_credit_mo) * 12 * infY;
    const impRent = opts.imputedRent * 12 * Math.pow(1 + base.rent_growth_cup, t0 + y);
    const sf3rd = opts.rent3rdSf ? (base.prop_b_rent_3rd_unit_mo * 12 * Math.pow(1 + base.rent_growth_cup, t0 + y) * 0.92 * (1 - base.fed_ord_rate - base.ca_base_rate)) : 0;
    p4Cf = p4Cf * (1 + eqNet) + (impRent + sf3rd - taxY - insY - maintY - utilY);
  }
  const sec121 = opts.filingStatus === "mfj" ? base.sec121_mfj : base.sec121_single;
  const p4ExitTax = Math.max(0, (saleEndGross - fmv0) - sec121) * capTaxRate;
  const p4Net = (saleEndGross - p4ExitTax) + p4Cf;

  // Path 5: Mixed Live 4 yrs -> Sell (§121)
  const liveYrs = Math.min(4, opts.horizon);
  const remP5 = Math.max(0, opts.horizon - liveYrs);
  let p5Cf = 0;
  for (let y = 0; y < liveYrs; y++) {
    const infY = inf0 * Math.pow(1 + base.inflation, y);
    const fmvY = fmv0 * Math.pow(1 + opts.homeAppr, y);
    const taxY = p4Assessed * Math.pow(1.02, y) * base.prop_a_eff_tax_rate + base.prop_a_fixed_assessments * infY;
    const insY = base.prop_a_ins_yr * Math.pow(1 + base.inflation + 0.015, t0 + y);
    const maintY = fmvY * base.prop_a_maint_pct;
    const utilY = (base.prop_a_water_mo + base.prop_a_solar_credit_mo) * 12 * infY;
    const impRent = opts.imputedRent * 12 * Math.pow(1 + base.rent_growth_cup, t0 + y);
    const sf3rd = opts.rent3rdSf ? (base.prop_b_rent_3rd_unit_mo * 12 * Math.pow(1 + base.rent_growth_cup, t0 + y) * 0.92 * (1 - base.fed_ord_rate - base.ca_base_rate)) : 0;
    p5Cf = p5Cf * (1 + eqNet) + (impRent + sf3rd - taxY - insY - maintY - utilY);
  }
  const fmvY4 = fmv0 * Math.pow(1 + opts.homeAppr, liveYrs);
  const saleY4 = fmvY4 * (1 - txRate) - base.recording_fees;
  const p5TaxY4 = Math.max(0, (saleY4 - fmv0) - sec121) * capTaxRate;
  const p5Inv = (saleY4 - p5TaxY4) + p5Cf;
  const p5Gross = p5Inv * Math.pow(1 + eqNet, remP5);
  const p5Net = p5Gross - Math.max(0, p5Gross - p5Inv) * capTaxRate;

  // Path 6: Mixed Rent 7 yrs -> 1031 Exchange
  const p6Net = p3Net + p3ExitTax * 0.65;

  return {
    fmv0,
    netSale0,
    p19Allow,
    paths: [
      { id: "sell_lump", name: "Sell Immediately (Same Tax Year) → Lump-Sum Reinvest", type: "Pure", net: p1Net, risk: "100% Day-1 equity crash entry risk", tax: "Full §1014 step-up = $0 cap gain; SCC 0.11% transfer tax" },
      { id: "sell_phased", name: "Sell Immediately → Phased 30M Treasury Staging", type: "Mixed / Staged", net: p2Net, risk: `Bull-market drag: ${fmtUSD(p1Net - p2Net)} vs lump-sum; T-bill rollover risk`, tax: "Treasuries CA-tax-exempt; softens 1929/2008 crash entry" },
      { id: "mixed_live_sell", name: "Mixed: Live in Property A (4 yrs) → Then Sell (§121)", type: "Mixed", net: p5Net, risk: "4-yr RE concentration, then equity reinvestment risk", tax: `IRC §121 (${fmtUSD(sec121)}) shields post-inheritance gain` },
      { id: "live_prop19", name: "Live in Property A (Long-Term) + Keep/Rent Property B", type: "Pure", net: p4Net, risk: "High Silicon Valley single-asset concentration; low liquidity", tax: opts.prop19Eligible ? "Prop 19 exclusion + tax-free imputed rent + §121" : "No Prop 19 (full reassessment) + §121" },
      { id: "mixed_rent_1031", name: "Mixed: Rent Property A (7 yrs) → §1031 Exchange", type: "Mixed", net: p6Net, risk: "45/180-day exchange clock & illiquidity risk", tax: "Defers fed/CA cap gain & §1250 recapture" },
      { id: "rent_hold", name: "Rent Property A (Long-Term Hold)", type: "Pure", net: p3Net, risk: "Low cap rate after full reassessment; landlord/tenant risk", tax: "Full reassessment + 25% §1250 recapture + CA 13.3%" },
    ].sort((a, b) => b.net - a.net),
  };
}
