import { renderSiteChrome, fetchVerifiedData, fmtUsd } from './layout.js';
import {
  DEFAULT_INPUTS,
  runComparisonModel,
  runMonteCarloDistribution,
  projectProp19Allowance,
  roundTo10
} from './model.js';
import { loadInputs, saveInputs, resetInputs } from './storage.js';
import { renderTrajectoryChart, renderDistributionChart } from './charts.js';

renderSiteChrome('projections', '..');

let currentInputs = loadInputs();
let scenariosData = null;

const CONTROL_FIELDS = [
  { id: 'transferYear', type: 'number', label: (v) => `${v}` },
  { id: 'horizonYears', type: 'number', label: (v) => `${v} yrs` },
  { id: 'scenarioMode', type: 'string' },
  { id: 'filingStatus', type: 'string' },
  { id: 'totalGrossEstate2026Usd', type: 'number', label: (v) => `$${(v / 1e6).toFixed(1)}M` },
  { id: 'useMarriedPortabilityDsue', type: 'boolean' },
  { id: 'trustReceivesStepUp1014', type: 'boolean' },
  { id: 'claimProp19WhenLiving', type: 'boolean' },
  { id: 'indexProp19AllowanceWithHpi', type: 'boolean' },
  { id: 'sec121EnabledOnMixed', type: 'boolean' },
  { id: 'propAImputedRentPctOfMarket', type: 'number', label: (v) => `${v}%` },
  { id: 'propARentMonthly2026Usd', type: 'number', label: (v) => fmtUsd(v) },
  { id: 'propAInsurance2026Usd', type: 'number', label: (v) => fmtUsd(v) },
  { id: 'propBInsurance2026Usd', type: 'number', label: (v) => fmtUsd(v) },
  { id: 'caTopTaxRatePct', type: 'number' },
  { id: 'propertyMgmtFeePct', type: 'number' }
];

function syncControlsFromState() {
  for (const field of CONTROL_FIELDS) {
    const el = document.getElementById(`ctrl-${field.id}`);
    const lbl = document.getElementById(`lbl-${field.id}`);
    if (!el) continue;
    const val = currentInputs[field.id];
    el.value = String(val);
    if (lbl && field.label) lbl.textContent = field.label(val);
  }
}

function bindControls() {
  for (const field of CONTROL_FIELDS) {
    const el = document.getElementById(`ctrl-${field.id}`);
    if (!el) continue;
    el.addEventListener('input', () => {
      let val = el.value;
      if (field.type === 'number') val = Number(val);
      else if (field.type === 'boolean') val = val === 'true';
      currentInputs[field.id] = val;
      const lbl = document.getElementById(`lbl-${field.id}`);
      if (lbl && field.label) lbl.textContent = field.label(val);
      saveInputs(currentInputs);
      renderAll();
    });
  }

  document.getElementById('reset-controls-btn').addEventListener('click', () => {
    currentInputs = resetInputs();
    syncControlsFromState();
    renderAll();
  });
}

function renderAll() {
  if (!scenariosData) return;

  const lowModel = runComparisonModel({ ...currentInputs, scenarioMode: 'low' });
  const baseModel = runComparisonModel({ ...currentInputs, scenarioMode: 'base' });
  const highModel = runComparisonModel({ ...currentInputs, scenarioMode: 'high' });
  const activeModel =
    currentInputs.scenarioMode === 'low'
      ? lowModel
      : currentInputs.scenarioMode === 'high'
      ? highModel
      : baseModel;

  document.getElementById('traj-window-lbl').textContent =
    `${activeModel.transferSummary.transferYear}–${activeModel.transferSummary.endYear}`;

  const drivers = {
    'sell-immediate': 'Equity return & §1014 step-up status (bypass trap sensitivity)',
    'rent-hold': 'Cupertino cap rate vs Prop 13 loss, insurance & post-NEM 2.0 costs',
    'live-prop19': 'Prop 19 allowance + long-term occupancy + SF Unit 3 rental net',
    'mixed-live-then-sell': 'Prop 19 + §121 ($250k/$500k) capture minus SF OMI return cost',
    'mixed-phased-staging': 'Crash entry protection vs Reinvestment Risk & bull drag',
    'mixed-rent-then-1031': 'Deferred Form 3840 tax + replacement NNN/RE cap rate'
  };

  document.getElementById('range-matrix-tbody').innerHTML = baseModel.paths
    .map((bp, idx) => {
      const meta = scenariosData.paths.find((p) => p.id === bp.id);
      return `
        <tr>
          <td><strong>${meta.shortName}</strong></td>
          <td class="num">${fmtUsd(lowModel.paths[idx].afterTaxNetWealth)}</td>
          <td class="num"><strong>${fmtUsd(bp.afterTaxNetWealth)}</strong></td>
          <td class="num">${fmtUsd(highModel.paths[idx].afterTaxNetWealth)}</td>
          <td class="num">${fmtUsd(bp.totalEconomicWealthInclImputed)}</td>
          <td style="font-size:0.83rem;">${drivers[bp.id]} · <a href="https://www.ftb.ca.gov/forms/2025/2025-540-booklet.html" target="_blank" rel="noopener">FTB / IRS ↗</a></td>
        </tr>
      `;
    })
    .join('');

  renderTrajectoryChart(document.getElementById('trajectory-chart'), activeModel);

  const mc = runMonteCarloDistribution(currentInputs, 400);
  renderDistributionChart(document.getElementById('distribution-chart'), mc);

  // Year-by-year 2026–2055 Assessment Schedule
  const rows = [];
  const tYear = currentInputs.transferYear;
  const reRate = activeModel.inputs.effectiveRePct / 100;
  const cpiRate = activeModel.inputs.inflationMeanPct / 100;
  let prop19BaseAfter = null;
  let fmvBaseAfter = null;

  for (let yr = 2026; yr <= 2055; yr++) {
    const dt = yr - 2026;
    const fmv = currentInputs.propAValue2026Usd * Math.pow(1 + reRate, dt);
    const fbyv = currentInputs.propAAssessed2026Usd * Math.pow(1.02, dt);
    const allowance = projectProp19Allowance(yr, activeModel.inputs.effectiveRePct, currentInputs.indexProp19AllowanceWithHpi);
    const cpiMult = Math.pow(1 + cpiRate, dt);
    const directFees = currentInputs.propADirectAssessments2026Usd * cpiMult;
    const tra = currentInputs.propATraRatePct / 100;

    let p19Assessed = fbyv;
    let rentAssessed = fbyv;

    if (yr === tYear) {
      prop19BaseAfter = currentInputs.claimProp19WhenLiving
        ? fbyv + Math.max(0, fmv - (fbyv + allowance))
        : fmv;
      fmvBaseAfter = fmv;
    } else if (yr > tYear) {
      prop19BaseAfter *= 1.02;
      fmvBaseAfter *= 1.02;
    }

    if (yr >= tYear) {
      p19Assessed = prop19BaseAfter;
      rentAssessed = fmvBaseAfter;
    }

    const p19Tax = p19Assessed * tra + directFees - (yr >= tYear && currentInputs.claimProp19WhenLiving ? 70 : 0);
    const rentTax = rentAssessed * tra + directFees;

    rows.push(`
      <tr style="${yr === tYear ? 'background:#eff6ff;font-weight:600;' : ''}">
        <td>${yr}${yr === tYear ? ' (Transfer)' : ''} · <a href="https://www.boe.ca.gov/prop19/" target="_blank" rel="noopener" style="font-size:0.76rem;">BOE §63.2</a></td>
        <td class="num">${fmtUsd(fmv)}</td>
        <td class="num">${fmtUsd(fbyv)}</td>
        <td class="num">${fmtUsd(allowance)}</td>
        <td class="num">${fmtUsd(p19Assessed)}</td>
        <td class="num">${fmtUsd(p19Tax)}</td>
        <td class="num">${fmtUsd(rentAssessed)}</td>
        <td class="num">${fmtUsd(rentTax)}</td>
      </tr>
    `);
  }
  document.getElementById('yearly-tax-tbody').innerHTML = rows.join('');
}

async function init() {
  const data = await fetchVerifiedData('..');
  scenariosData = data.scenarios;
  syncControlsFromState();
  bindControls();
  renderAll();
}

init();
