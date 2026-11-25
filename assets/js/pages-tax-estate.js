import { renderSiteChrome, fetchVerifiedData, fmtUsd } from '../layout.js';
import { runComparisonModel } from '../model.js';
import { loadInputs } from '../storage.js';

renderSiteChrome('tax-estate', '..');

async function init() {
  const [{ sources }, inputs] = await Promise.all([
    fetchVerifiedData('..'),
    Promise.resolve(loadInputs())
  ]);
  const model = runComparisonModel(inputs);
  const ts = model.transferSummary;

  const box = document.getElementById('estate-liquidity-box');
  const excess = Math.max(0, ts.grossEstateAtTransfer - ts.indexedExemptionAtTransfer);
  box.innerHTML = `
    <div class="grid-3">
      <div>
        <div class="kpi-label">Projected Gross Estate (${ts.transferYear})</div>
        <div class="kpi-value">${fmtUsd(ts.grossEstateAtTransfer)}</div>
        <div class="kpi-sub">Based on ${fmtUsd(inputs.totalGrossEstate2026Usd)} today (Prop A + liquid)</div>
      </div>
      <div>
        <div class="kpi-label">Federal Exclusion (${inputs.useMarriedPortabilityDsue ? 'DSUE Portability' : 'Single'})</div>
        <div class="kpi-value">${fmtUsd(ts.indexedExemptionAtTransfer)}</div>
        <div class="kpi-sub">2026 base: ${inputs.useMarriedPortabilityDsue ? '$30M married w/ Form 706 DSUE' : '$15M single'}</div>
      </div>
      <div>
        <div class="kpi-label">Estate Tax Due in 9 Months (40%)</div>
        <div class="kpi-value" style="color:${ts.estateTaxDue > 0 ? 'var(--crimson)' : 'var(--emerald)'};">${fmtUsd(ts.estateTaxDue)}</div>
        <div class="kpi-sub">${ts.estateTaxDue > 0 ? `Taxable excess ${fmtUsd(excess)} — LIQUIDITY PLAN REQUIRED` : 'Below projected federal exclusion under current inputs'}</div>
      </div>
    </div>
    <p style="margin:0.65rem 0 0;font-size:0.85rem;color:var(--muted);">
      <strong>Key Action:</strong> Verify prior Form 709 taxable gifts (which consume part of the $15M/$30M lifetime exemption) and confirm whether a surviving spouse timely filed Form 706 portability. If liquid assets cannot cover 40% estate tax in 9 months, Path 1/5 (immediate sale) or estate borrowing becomes mandatory.
    </p>
  `;

  const legRows = [
    {
      name: 'Federal OBBBA (P.L. 119-21) & Rev. Proc. 2025-32',
      status: 'Enacted (Permanent Law)',
      terms: 'Sets 2026 $15M/person estate/gift exclusion (indexed 2027), $19k gift exclusion, permanent 10%–37% ordinary & 0%/15%/20% LTCG brackets, and temporary $40,400 SALT cap (phasing >$505k MAGI, reverting to $10k in 2030).',
      url: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf'
    },
    ...sources.california.nov2026StateBallot.map((b) => ({
      name: b.measure,
      status: b.status,
      terms: `${b.voteSummary}. ${b.impact}`,
      url: b.url
    })),
    {
      name: 'SF Prop H (Muni Parcel Tax) & Regional Measure RTM',
      status: 'Passed (Nov 3, 2026)',
      terms: 'SF Prop H passed 74.42% (eff. July 1, 2027: $249 + $0.195/sqft >5,000 sqft). Regional Measure RTM adds +1% sales tax in SF & +0.5% in Santa Clara County.',
      url: 'https://sfelections.org/results/20261103/index.html'
    },
    {
      name: 'SF Empty Homes Tax (Prop M)',
      status: 'Struck Down (Sept 11, 2026)',
      terms: 'CA Court of Appeal (A172067) affirmed invalidation; not active unless CA Supreme Court reverses.',
      url: 'https://www.sf.gov/sites/default/files/2026-07/MUNI_parcel_tax_economic_impact_final.pdf'
    },
    {
      name: 'CA Form 540 Line 62 & Form 593 Withholding',
      status: 'Enacted Law',
      terms: 'CA taxes capital gains as ordinary income up to 12.3% + 1.0% Behavioral Health Services Tax >$1M (13.3% top). Form 593 applies 3.33% escrow withholding unless §121/loss/§1031 exemption applies.',
      url: 'https://www.ftb.ca.gov/forms/2025/2025-540-booklet.html'
    }
  ];

  document.getElementById('legislation-tbody').innerHTML = legRows
    .map(
      (r) => `
      <tr>
        <td><strong>${r.name}</strong></td>
        <td><span class="badge ${r.status.includes('Defeated') || r.status.includes('Struck') || r.status.includes('Not') ? 'badge-info' : 'badge-verified'}">${r.status}</span></td>
        <td style="font-size:0.84rem;">${r.terms}</td>
        <td><a href="${r.url}" target="_blank" rel="noopener">Official Source ↗</a></td>
      </tr>
    `
    )
    .join('');
}

init();
