import { renderSiteChrome, fetchVerifiedData, fmtUsd } from './layout.js';
import { runComparisonModel } from './model.js';
import { loadInputs, saveInputs } from './storage.js';
import { renderBlackSwanBars } from './charts.js';

renderSiteChrome('black-swan', '..');

let inputs = loadInputs();
let scenariosData = null;

function render() {
  if (!scenariosData) return;
  const regEl = document.getElementById('bs-regime');
  const monEl = document.getElementById('bs-months');
  const insEl = document.getElementById('bs-instrument');
  regEl.value = inputs.macroRegimeId;
  monEl.value = String(inputs.stagingMonths);
  insEl.value = inputs.stagingInstrument;

  document.querySelectorAll('.hdr-months').forEach((el) => {
    el.textContent = String(inputs.stagingMonths);
  });

  const activeRun = runComparisonModel(inputs);
  const sellActive = activeRun.paths.find((p) => p.id === 'sell-immediate');
  const stagedActive = activeRun.paths.find((p) => p.id === 'mixed-phased-staging');
  const activeRegimeMeta = scenariosData.blackSwanRegimes.find((r) => r.id === inputs.macroRegimeId);
  const diff = stagedActive.afterTaxNetWealth - sellActive.afterTaxNetWealth;

  document.getElementById('bs-headline-card').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:1rem;">
      <div style="flex:1;min-width:260px;">
        <div class="kpi-label">Staging Headline (${activeRegimeMeta.name})</div>
        <div class="kpi-value">${fmtUsd(stagedActive.afterTaxNetWealth)}</div>
        <div class="kpi-sub">
          ${inputs.stagingMonths}-month Treasury staging via <strong>${inputs.stagingInstrument === '2y-ladder' ? '2Y Treasury Ladder (4.88%)' : '3M T-Bills (4.32%)'}</strong>.
          Net staging advantage/(drag) vs Day-1 Lump Sum: <strong>${diff >= 0 ? '+' : ''}${fmtUsd(diff)}</strong>.
        </div>
      </div>
      <div style="min-width:260px;background:#ffffff;border:1px solid #fde68a;border-radius:8px;padding:0.75rem 0.9rem;">
        <div class="kpi-label" style="color:var(--amber);">Reinvestment Risk Beside Headline</div>
        <div style="font-size:1.25rem;font-weight:700;color:var(--amber);margin:0.15rem 0;">${fmtUsd(stagedActive.reinvestmentRiskDollars)}</div>
        <div style="font-size:0.82rem;color:var(--muted);">
          Lost Treasury income when Fed cuts short rates during crash entry (3M bills reset downward immediately while 2Y ladder locks 4.88%). Staging Treasury interest earned (0% CA tax): <strong>${fmtUsd(stagedActive.stagingTreasuryYieldEarned)}</strong>.
        </div>
      </div>
    </div>
  `;

  const chartRows = [];
  const tbodyHtml = scenariosData.blackSwanRegimes
    .map((reg) => {
      const r = runComparisonModel({ ...inputs, macroRegimeId: reg.id });
      const sell = r.paths.find((p) => p.id === 'sell-immediate');
      const staged = r.paths.find((p) => p.id === 'mixed-phased-staging');
      const rent = r.paths.find((p) => p.id === 'rent-hold');
      const live = r.paths.find((p) => p.id === 'live-prop19');
      const buffer = staged.afterTaxNetWealth - sell.afterTaxNetWealth;

      chartRows.push({
        shortName: reg.name.split('(')[0].trim().slice(0, 28),
        lumpSum: sell.afterTaxNetWealth,
        staged: staged.afterTaxNetWealth,
        rent: rent.afterTaxNetWealth,
        live: live.afterTaxNetWealth
      });

      return `
        <tr style="${reg.id === inputs.macroRegimeId ? 'background:#eff6ff;' : ''}">
          <td>
            <strong>${reg.name}</strong>
            <div style="font-size:0.8rem;color:var(--muted);">${reg.description} · <a href="https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2026" target="_blank" rel="noopener">US Treasury / BLS ↗</a></div>
          </td>
          <td class="num">${fmtUsd(sell.afterTaxNetWealth)}</td>
          <td class="num"><strong>${fmtUsd(staged.afterTaxNetWealth)}</strong></td>
          <td class="num" style="color:${buffer >= 0 ? 'var(--emerald)' : 'var(--amber)'};font-weight:600;">
            ${buffer >= 0 ? '+' : ''}${fmtUsd(buffer)}
          </td>
          <td class="num" style="color:var(--amber);font-weight:600;">${fmtUsd(staged.reinvestmentRiskDollars)}</td>
          <td class="num">${fmtUsd(rent.afterTaxNetWealth)}</td>
          <td class="num">${fmtUsd(live.afterTaxNetWealth)}</td>
        </tr>
      `;
    })
    .join('');

  document.getElementById('bs-regimes-tbody').innerHTML = tbodyHtml;
  renderBlackSwanBars(document.getElementById('bs-bars-chart'), chartRows);
}

async function init() {
  const data = await fetchVerifiedData('..');
  scenariosData = data.scenarios;

  document.getElementById('bs-regime').addEventListener('change', (e) => {
    inputs.macroRegimeId = e.target.value;
    saveInputs(inputs);
    render();
  });
  document.getElementById('bs-months').addEventListener('change', (e) => {
    inputs.stagingMonths = Number(e.target.value);
    saveInputs(inputs);
    render();
  });
  document.getElementById('bs-instrument').addEventListener('change', (e) => {
    inputs.stagingInstrument = e.target.value;
    saveInputs(inputs);
    render();
  });

  render();
}

init();
