import { renderSiteChrome, fetchVerifiedData, fmtUsd } from './layout.js';
import { runComparisonModel } from './model.js';
import { loadInputs, loadCharter, saveCharter } from './storage.js';

renderSiteChrome('overview', '.');

async function init() {
  const [{ scenarios }, inputs] = await Promise.all([
    fetchVerifiedData('.'),
    Promise.resolve(loadInputs())
  ]);

  const model = runComparisonModel(inputs);
  const ts = model.transferSummary;
  const sell = model.paths.find((p) => p.id === 'sell-immediate');
  const live = model.paths.find((p) => p.id === 'live-prop19');
  const phased = model.paths.find((p) => p.id === 'mixed-phased-staging');
  const sorted = [...model.paths].sort((a, b) => b.afterTaxNetWealth - a.afterTaxNetWealth);
  const leader = sorted[0];
  const leaderMeta = scenarios.paths.find((m) => m.id === leader.id);

  // KPI cards
  const kpiEl = document.getElementById('exec-kpis');
  kpiEl.innerHTML = `
    <div class="card">
      <div class="kpi-label">Leading After-Tax Financial Path</div>
      <div class="kpi-value" style="font-size:1.15rem;">${leaderMeta.shortName}</div>
      <div class="kpi-sub">After-tax net wealth: <strong>${fmtUsd(leader.afterTaxNetWealth)}</strong> (${ts.transferYear}→${ts.endYear})</div>
    </div>
    <div class="card">
      <div class="kpi-label">Projected Property A FMV (${ts.transferYear})</div>
      <div class="kpi-value">${fmtUsd(ts.propAValueAtTransfer)}</div>
      <div class="kpi-sub">FBYV roll: ${fmtUsd(ts.propAFbyvAtTransfer)} · Prop 19 ceiling: ${fmtUsd(ts.prop19ExcludedCeiling)}</div>
    </div>
    <div class="card">
      <div class="kpi-label">Prop 19 Annual Tax Savings (Yr 0)</div>
      <div class="kpi-value">${fmtUsd((ts.propAValueAtTransfer - live.startingPropAAssessed) * (inputs.propATraRatePct / 100))}</div>
      <div class="kpi-sub">Earned ONLY if occupied &ge;1 yr + BOE-19-P filed timely</div>
    </div>
    <div class="card ${ts.estateTaxDue > 0 ? 'card-danger' : ''}">
      <div class="kpi-label">Est. Federal Estate Tax (${ts.transferYear})</div>
      <div class="kpi-value">${fmtUsd(ts.estateTaxDue)}</div>
      <div class="kpi-sub">Estate ${fmtUsd(ts.grossEstateAtTransfer)} vs ${fmtUsd(ts.indexedExemptionAtTransfer)} indexed cap</div>
    </div>
  `;

  document.getElementById('model-subtitle').innerHTML =
    `Modeled identically from transfer year <strong>${ts.transferYear}</strong> through <strong>${ts.endYear}</strong> (${ts.horizonYears} yrs), ` +
    `Range: <strong>${inputs.scenarioMode.toUpperCase()}</strong>, Macro: <strong>${inputs.macroRegimeId}</strong>, ` +
    `Filing: <strong>${inputs.filingStatus.toUpperCase()}</strong>, Prop 19 Carry-Forward: <strong>${inputs.indexProp19AllowanceWithHpi ? 'Indexed' : 'Static'}</strong>. ` +
    `All figures rounded to nearest $10.`;

  // Staging headline banner with Reinvestment Risk prominently side-by-side
  const bannerEl = document.getElementById('staging-headline-banner');
  const dragSign = phased.opportunityDragVsLumpSum >= 0 ? 'Opportunity Drag vs Day-1 Lump Sum' : 'Crash Protection Gain vs Lump Sum';
  bannerEl.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;">
      <div>
        <strong>Phased Staging Headline (${inputs.stagingMonths}m via ${inputs.stagingInstrument === '2y-ladder' ? '2Y Treasury Ladder 4.61%' : '3M T-Bills 4.34%'}):</strong>
        After-Tax Ending Wealth <strong>${fmtUsd(phased.afterTaxNetWealth)}</strong> (Treasury interest exempt from CA Form 540 tax).
      </div>
      <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
        <span class="badge badge-flagged">Reinvestment Risk (Rate-Drop Loss): ${fmtUsd(phased.reinvestmentRiskDollars)}</span>
        <span class="badge badge-info">${dragSign}: ${fmtUsd(Math.abs(phased.opportunityDragVsLumpSum))}</span>
      </div>
    </div>
  `;

  // Populate 6-path comparison table
  const pathSources = {
    'sell-immediate': ['IRS Pub 551 (§1014)', 'https://www.irs.gov/publications/p551'],
    'rent-hold': ['IRS Pub 527 (27.5-Yr)', 'https://www.irs.gov/publications/p527'],
    'live-prop19': ['CA BOE Prop 19 (§63.2)', 'https://www.boe.ca.gov/prop19/'],
    'mixed-live-then-sell': ['IRS Pub 523 (§121)', 'https://www.irs.gov/publications/p523'],
    'mixed-phased-staging': ['US Treasury Yield Curve', 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2026'],
    'mixed-rent-then-1031': ['IRS Form 8824 (§1031)', 'https://www.irs.gov/pub/irs-pdf/i8824.pdf']
  };
  const tbody = document.getElementById('overview-paths-tbody');
  tbody.innerHTML = model.paths
    .map((res) => {
      const meta = scenarios.paths.find((m) => m.id === res.id);
      const isLeader = res.id === leader.id;
      const [srcLabel, srcUrl] = pathSources[res.id] || ['IRS Pub 551', 'https://www.irs.gov/publications/p551'];
      return `
        <tr style="${isLeader ? 'background:#f0fdf4;' : ''}">
          <td>
            <span class="badge ${meta.category === 'Pure' ? 'badge-info' : 'badge-verified'}">${meta.category}</span>
            <strong>${meta.name}</strong>
            ${isLeader ? '<span class="badge badge-verified" style="margin-left:4px;">Highest After-Tax</span>' : ''}
            <div style="font-size:0.8rem;color:var(--muted);margin-top:2px;">${meta.summary}</div>
          </td>
          <td>${res.prop19Applied ? '<span class="badge badge-verified">Yes (Claimed)</span>' : '<span class="badge badge-flagged">No / Full FMV</span>'}</td>
          <td class="num">${res.startingPropAAssessed ? fmtUsd(res.startingPropAAssessed) : 'Sold Yr 0'}</td>
          <td class="num">${fmtUsd(res.cumulativeCashTaxPaid)}</td>
          <td class="num">${res.cumulativeOmiCosts > 0 ? fmtUsd(res.cumulativeOmiCosts) : '$0'}</td>
          <td class="num"><strong>${fmtUsd(res.afterTaxNetWealth)}</strong></td>
          <td class="num">${fmtUsd(res.totalEconomicWealthInclImputed)}</td>
          <td style="font-size:0.82rem;">
            ${meta.omiRisk}
            ${res.id === 'mixed-phased-staging' ? `<div style="margin-top:4px;color:var(--amber);font-weight:600;">Reinvestment Risk: ${fmtUsd(res.reinvestmentRiskDollars)}</div>` : ''}
            <div style="margin-top:3px;"><a href="${srcUrl}" target="_blank" rel="noopener">${srcLabel} ↗</a></div>
          </td>
        </tr>
      `;
    })
    .join('');

  // Render Pre-Commitment Charter
  const charterRows = loadCharter();
  const charterBody = document.getElementById('charter-tbody');
  const renderCharter = () => {
    charterBody.innerHTML = charterRows
      .map(
        (row, idx) => `
      <tr>
        <td style="text-align:center;">
          <input type="checkbox" data-idx="${idx}" class="charter-chk" ${row.agreed ? 'checked' : ''} aria-label="Agree to ${row.pathLabel}" />
        </td>
        <td><strong>${row.pathLabel}</strong></td>
        <td style="font-size:0.86rem;">${row.criterion} · <a href="https://www.boe.ca.gov/prop19/" target="_blank" rel="noopener">Official Rule ↗</a></td>
        <td>
          <input type="date" data-idx="${idx}" class="charter-date" value="${row.signedDate || ''}" style="width:140px;padding:0.25rem;border:1px solid #cbd5e1;border-radius:5px;" />
        </td>
      </tr>
    `
      )
      .join('');

    charterBody.querySelectorAll('.charter-chk').forEach((el) => {
      el.addEventListener('change', (e) => {
        const i = Number(e.target.dataset.idx);
        charterRows[i].agreed = e.target.checked;
        if (e.target.checked && !charterRows[i].signedDate) {
          charterRows[i].signedDate = new Date().toISOString().slice(0, 10);
          renderCharter();
        }
        saveCharter(charterRows);
      });
    });

    charterBody.querySelectorAll('.charter-date').forEach((el) => {
      el.addEventListener('change', (e) => {
        const i = Number(e.target.dataset.idx);
        charterRows[i].signedDate = e.target.value;
        saveCharter(charterRows);
      });
    });
  };
  renderCharter();

  document.getElementById('export-charter-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(charterRows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pre-commitment-decision-charter.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

init();
