// Interactive Financial & Tax Projection Engine for Property A (Cupertino) & Property B (SF)

function runModel() {
  const transferYear = parseInt(document.getElementById("ctrl-transfer-year").value, 10);
  const horizon = parseInt(document.getElementById("ctrl-horizon").value, 10);
  const propGrowth = parseFloat(document.getElementById("ctrl-prop-growth").value) / 100;
  const stockReturn = parseFloat(document.getElementById("ctrl-stock-return").value) / 100;
  const inflation = parseFloat(document.getElementById("ctrl-inflation").value) / 100;
  const marketRentMo = parseFloat(document.getElementById("ctrl-rent").value);
  const imputedRentMo = parseFloat(document.getElementById("ctrl-imputed-rent").value);
  const filingStatus = document.getElementById("ctrl-filing").value;
  const prop19Occupy = document.getElementById("ctrl-prop19").value === "yes";

  // Update labels
  document.getElementById("val-transfer-year").textContent = transferYear;
  document.getElementById("val-horizon").textContent = horizon + " yrs";
  document.getElementById("val-prop-growth").textContent = (propGrowth * 100).toFixed(1) + "%";
  document.getElementById("val-stock-return").textContent = (stockReturn * 100).toFixed(1) + "%";
  document.getElementById("val-inflation").textContent = (inflation * 100).toFixed(1) + "%";
  document.getElementById("val-rent").textContent = fmtUSD(marketRentMo) + "/mo";
  document.getElementById("val-imputed-rent").textContent = fmtUSD(imputedRentMo) + "/mo";

  const yrsToTransfer = transferYear - 2026;
  const fmvAtTransfer = 3100000 * Math.pow(1 + propGrowth, yrsToTransfer);
  const oldAssessedAtTransfer = 550540 * Math.pow(1.02, yrsToTransfer);
  const prop19CapAtTransfer = 1044586 * Math.pow(1 + inflation, yrsToTransfer);

  // Prop 19 Assessed Value at Transfer
  const prop19Assessed = prop19Occupy
    ? Math.max(oldAssessedAtTransfer, fmvAtTransfer - prop19CapAtTransfer > oldAssessedAtTransfer ? fmvAtTransfer - prop19CapAtTransfer : oldAssessedAtTransfer)
    : fmvAtTransfer;
  const fullReassessed = fmvAtTransfer;

  const effTaxRate = 0.0125; // ~1.25% TRA estimate (flagged for exact TRA lookup)
  const sellCostRate = 0.05 + 0.0011; // 5% broker/closing + 0.11% SCC transfer tax
  const netProceedsAtTransfer = fmvAtTransfer * (1 - sellCostRate);

  // Baseline annual operating costs at transfer (rounded/indexed)
  const waterAnnual0 = 1500 * Math.pow(1 + inflation, yrsToTransfer);
  const insAnnual0 = 1500 * Math.pow(1 + inflation, yrsToTransfer);
  const solarCredit0 = 180 * Math.pow(1 + inflation, yrsToTransfer);
  const maintAnnual0 = fmvAtTransfer * 0.005; // 0.5% maintenance

  // 1. Pure Sell (Same Tax Year) -> 100% S&P 500
  let sellWealth = netProceedsAtTransfer;
  const sellSeries = [sellWealth];
  for (let y = 1; y <= horizon; y++) {
    // Assume 1.5% dividend yield taxed at ~23.8% fed + 11.3% CA = ~35% -> ~0.5% drag
    sellWealth = sellWealth * (1 + stockReturn - 0.005);
    sellSeries.push(sellWealth);
  }
  const sellNetAfterExitTax = sellWealth * 0.85; // ~15% blended LTCG+CA if liquidated at end

  // 2. Mixed: Phased Investing (24-36 mo in 3M-2Y Treasuries at 4.0%, then S&P 500)
  let phasedWealth = netProceedsAtTransfer;
  const phasedSeries = [phasedWealth];
  const treasuryYield = 0.04;
  for (let y = 1; y <= horizon; y++) {
    if (y <= 2) {
      phasedWealth = phasedWealth * (1 + treasuryYield * 0.72); // after-tax T-bill
    } else if (y === 3) {
      phasedWealth = phasedWealth * (1 + (treasuryYield * 0.72 + stockReturn - 0.005) / 2);
    } else {
      phasedWealth = phasedWealth * (1 + stockReturn - 0.005);
    }
    phasedSeries.push(phasedWealth);
  }

  // 3. Pure Rent (Hold Property A, Full Reassessment)
  let rentCash = 0;
  let propValRent = fmvAtTransfer;
  const rentSeries = [propValRent];
  const annualRent0 = marketRentMo * 12 * Math.pow(1 + inflation, yrsToTransfer);
  for (let y = 1; y <= horizon; y++) {
    propValRent *= (1 + propGrowth);
    const rentGross = annualRent0 * Math.pow(1 + inflation, y - 1) * 0.95; // 5% vacancy
    const propTax = fullReassessed * Math.pow(1.02, y - 1) * effTaxRate;
    const opEx = (waterAnnual0 + insAnnual0 - solarCredit0) * Math.pow(1 + inflation, y - 1) + propValRent * 0.005;
    const noi = rentGross - propTax - opEx;
    const afterTaxNoi = noi > 0 ? noi * 0.70 : noi; // ~30% marginal tax after depreciation shield
    rentCash = rentCash * (1 + stockReturn - 0.005) + afterTaxNoi;
    rentSeries.push(propValRent + rentCash);
  }

  // 4. Pure Live-In (Occupy Property A, Prop 19 Exclusion + Imputed Rent)
  let liveCash = 0;
  let propValLive = fmvAtTransfer;
  const liveSeries = [propValLive];
  const annualImp0 = imputedRentMo * 12 * Math.pow(1 + inflation, yrsToTransfer);
  for (let y = 1; y <= horizon; y++) {
    propValLive *= (1 + propGrowth);
    const propTax = prop19Assessed * Math.pow(1.02, y - 1) * effTaxRate;
    const opEx = (waterAnnual0 + insAnnual0 - solarCredit0) * Math.pow(1 + inflation, y - 1) + propValLive * 0.005;
    const netBenefit = annualImp0 * Math.pow(1 + inflation, y - 1) - propTax - opEx;
    liveCash = liveCash * (1 + stockReturn - 0.005) + netBenefit;
    liveSeries.push(propValLive + liveCash);
  }

  // 5. Mixed: Live-In 3 Yrs -> Sell (IRC § 121 Exclusion $250k/$500k) -> S&P 500
  let mixLiveSell = fmvAtTransfer;
  const sec121 = filingStatus === "married" ? 500000 : 250000;
  for (let y = 1; y <= Math.min(3, horizon); y++) {
    mixLiveSell *= (1 + propGrowth);
  }
  const gain3yr = Math.max(0, mixLiveSell - fmvAtTransfer - sec121);
  let mixProceeds = mixLiveSell * (1 - sellCostRate) - gain3yr * 0.28;
  for (let y = 4; y <= horizon; y++) {
    mixProceeds *= (1 + stockReturn - 0.005);
  }

  // 6. Mixed: 1031 Like-Kind Exchange (Rent -> Exchange at Yr 5 -> Hold)
  const exchangeWealth = (propValRent + rentCash) * 1.03; // ~3% tax-deferral boost vs taxable churn

  // Update KPIs
  document.getElementById("kpi-fmv").textContent = fmtUSD10(fmvAtTransfer);
  document.getElementById("kpi-prop19").textContent = fmtUSD10(prop19Assessed);
  document.getElementById("kpi-sell").textContent = fmtUSD10(sellWealth);
  document.getElementById("kpi-rent").textContent = fmtUSD10(propValRent + rentCash);

  // Update Comparison Table
  const rows = [
    {
      name: "1. Pure Sell (Same Tax Year)",
      type: "Pure",
      endWealth: sellWealth,
      taxProfile: "Step-up basis (IRC § 1014): $0 cap gains at sale; 0.11% SCC transfer tax.",
      risk: "High sequence/entry risk (100% equities Day 1). High liquidity.",
      badge: "badge-success"
    },
    {
      name: "2. Mixed: Phased Investing (3M–2Y Treasuries → Stocks)",
      type: "Mixed",
      endWealth: phasedWealth,
      taxProfile: "Step-up basis at sale; Treasury interest taxed as ordinary federal (exempt CA).",
      risk: "Reinvestment & inflation-drag risk (~" + fmtUSD10(sellWealth - phasedWealth) + " opportunity cost in bull markets), but softens 1929/2008 crash entry.",
      badge: "badge-info"
    },
    {
      name: "3. Pure Rent (Hold Property A)",
      type: "Pure",
      endWealth: propValRent + rentCash,
      taxProfile: "Full Prop 19 reassessment to FMV; 27.5-yr depreciation & § 1250 recapture on exit.",
      risk: "Concentration risk in 95014 + landlord/vacancy risk. Low liquidity.",
      badge: "badge-warning"
    },
    {
      name: "4. Pure Live-In (Prop 19 + Imputed Rent)",
      type: "Pure",
      endWealth: propValLive + liveCash,
      taxProfile: prop19Occupy ? "Prop 19 exclusion applied (1-yr move-in)." : "No Prop 19 (full reassessment).",
      risk: "Requires giving up Property B (SF) primary residence or commuting.",
      badge: "badge-info"
    },
    {
      name: "5. Mixed: Live-In 3 Yrs → Sell (IRC § 121)",
      type: "Mixed",
      endWealth: mixProceeds,
      taxProfile: "Prop 19 for 3 yrs + $" + (sec121/1000) + "k § 121 exclusion on post-inheritance gain.",
      risk: "3-year illiquidity & market-timing risk, then transitions to liquid equities.",
      badge: "badge-success"
    },
    {
      name: "6. Mixed: 1031 Like-Kind Exchange (Yr 5)",
      type: "Mixed",
      endWealth: exchangeWealth,
      taxProfile: "Defers post-inheritance gain & § 1250 recapture; loses § 121.",
      risk: "Strict 45/180-day ID/close deadlines; remains illiquid real estate.",
      badge: "badge-warning"
    }
  ];

  const tbody = document.getElementById("paths-tbody");
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.name}</strong><br><span class="badge ${r.badge}">${r.type}</span></td>
      <td><strong>${fmtUSD10(r.endWealth)}</strong></td>
      <td>${r.taxProfile}</td>
      <td>${r.risk}</td>
    </tr>
  `).join("");

  drawProjectionChart(sellSeries, phasedSeries, rentSeries, liveSeries, horizon, transferYear);
  drawDistributionChart(sellWealth, phasedWealth, propValRent + rentCash, propValLive + liveCash);
}

function drawProjectionChart(sellS, phasedS, rentS, liveS, horizon, startYear) {
  const canvas = document.getElementById("proj-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pad = { t: 25, r: 20, b: 35, l: 75 };
  const allVals = [...sellS, ...phasedS, ...rentS, ...liveS];
  const maxVal = Math.max(...allVals) * 1.08;

  // Grid
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#64748b";
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.stroke();
    const val = (maxVal * i / 4) / 1e6;
    ctx.fillText("$" + val.toFixed(1) + "M", 8, y + 4);
  }

  function plot(series, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    series.forEach((v, idx) => {
      const x = pad.l + (W - pad.l - pad.r) * (idx / horizon);
      const y = pad.t + (H - pad.t - pad.b) * (1 - v / maxVal);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  plot(sellS, "#1d4ed8");
  plot(phasedS, "#0891b2");
  plot(rentS, "#d97706");
  plot(liveS, "#15803d");

  // X-axis labels
  ctx.fillStyle = "#64748b";
  ctx.fillText(startYear, pad.l, H - 10);
  ctx.fillText(startYear + Math.floor(horizon / 2), pad.l + (W - pad.l - pad.r) / 2 - 15, H - 10);
  ctx.fillText(startYear + horizon, W - pad.r - 32, H - 10);
}

function drawDistributionChart(sellW, phasedW, rentW, liveW) {
  const canvas = document.getElementById("dist-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const items = [
    { label: "Pure Sell (S&P)", val: sellW, color: "#1d4ed8" },
    { label: "Phased (T-Bills→S&P)", val: phasedW, color: "#0891b2" },
    { label: "Pure Rent", val: rentW, color: "#d97706" },
    { label: "Pure Live-In", val: liveW, color: "#15803d" }
  ];
  const maxV = Math.max(...items.map(i => i.val)) * 1.15;
  const barH = 32;
  const gap = 18;
  ctx.font = "12px sans-serif";

  items.forEach((it, idx) => {
    const y = 20 + idx * (barH + gap);
    const w = Math.max(10, (W - 220) * (it.val / maxV));
    ctx.fillStyle = "#334155";
    ctx.fillText(it.label, 10, y + 20);
    ctx.fillStyle = it.color;
    ctx.fillRect(150, y, w, barH);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(fmtUSD10(it.val), 158 + w, y + 20);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav("index.html");
  if (document.getElementById("ctrl-transfer-year")) {
    document.querySelectorAll(".model-ctrl").forEach(el => {
      el.addEventListener("input", runModel);
      el.addEventListener("change", runModel);
    });
    runModel();
  }
});
