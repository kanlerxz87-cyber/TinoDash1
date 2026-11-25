import { renderSiteChrome, fetchVerifiedData, fmtUsd } from './layout.js';
import { runComparisonModel } from './model.js';
import { loadInputs, loadDecisions } from './storage.js';

renderSiteChrome('briefing', '..');

async function init() {
  const [{ scenarios }, inputs] = await Promise.all([
    fetchVerifiedData('..'),
    Promise.resolve(loadInputs())
  ]);
  const model = runComparisonModel(inputs);
  const ts = model.transferSummary;

  document.getElementById('bs-scenario-meta').textContent =
    `${inputs.scenarioMode.toUpperCase()} · ${inputs.filingStatus.toUpperCase()} · ${inputs.macroRegimeId}`;
  document.getElementById('bs-window').textContent = `${ts.transferYear}–${ts.endYear} (${ts.horizonYears} yrs)`;

  document.getElementById('bs-asset-a').innerHTML = `
    Est. Value (2026): <strong>$3,100,000</strong> (Projected ${ts.transferYear}: <strong>${fmtUsd(ts.propAValueAtTransfer)}</strong>)<br/>
    2026 Assessed: <strong>$550,540</strong> · Prop 19 Ceiling (${ts.transferYear}): <strong>${fmtUsd(ts.prop19ExcludedCeiling)}</strong><br/>
    SCC TRA 013-xxx (~1.171% + direct fees); 0.11% county transfer tax ($0 city tax).
  `;

  document.getElementById('bs-asset-b').innerHTML = `
    Est. Value (2026): <strong>$1,800,000</strong> · 3 Units (2 rented $7,150/mo + 1 owner-usable)<br/>
    2025 Assessed: <strong>$114,250</strong> ($2,440 tax) · SF FY26–27 rate 1.1816% + Prop H (7/1/2027)<br/>
    Rent Board 1.6% cap &amp; Prop H OMI relocation ($8,245–$24,733/unit) if pre-1979.
  `;

  document.getElementById('bs-estate-est').textContent = fmtUsd(ts.grossEstateAtTransfer);
  document.getElementById('bs-estate-tax').textContent = `${fmtUsd(ts.estateTaxDue)} (vs ${fmtUsd(ts.indexedExemptionAtTransfer)} cap)`;

  document.getElementById('bs-paths-tbody').innerHTML = model.paths
    .map((p) => {
      const meta = scenarios.paths.find((m) => m.id === p.id);
      return `
      <tr>
        <td><strong>${meta.shortName}</strong> · <a href="https://www.irs.gov/publications/p551" target="_blank" rel="noopener" style="font-size:0.75rem;">§1014/§121 ↗</a></td>
        <td>${p.prop19Applied ? 'Yes' : 'No'}</td>
        <td class="num">${p.startingPropAAssessed ? fmtUsd(p.startingPropAAssessed) : 'Sold Yr 0'}</td>
        <td class="num">${fmtUsd(p.cumulativeCashTaxPaid)}</td>
        <td class="num"><strong>${fmtUsd(p.afterTaxNetWealth)}</strong></td>
        <td class="num">${fmtUsd(p.totalEconomicWealthInclImputed)}</td>
      </tr>
    `;
    })
    .join('');

  document.getElementById('print-sheet-btn').addEventListener('click', () => window.print());
  document.getElementById('download-briefing-json').addEventListener('click', () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      inputs,
      transferSummary: ts,
      paths: model.paths.map((p) => ({
        id: p.id,
        prop19Applied: p.prop19Applied,
        startingPropAAssessed: p.startingPropAAssessed,
        afterTaxNetWealth: p.afterTaxNetWealth,
        totalEconomicWealthInclImputed: p.totalEconomicWealthInclImputed,
        reinvestmentRiskDollars: p.reinvestmentRiskDollars
      })),
      decisions: loadDecisions()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attorney-cpa-briefing-snapshot.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

init();
