import { renderSiteChrome, fetchVerifiedData, fmtUsd, fmtPct } from './layout.js';

renderSiteChrome('properties', '..');

async function init() {
  const { properties, sources } = await fetchVerifiedData('..');

  const renderHist = (rows) =>
    rows
      .map(
        (r) => `
      <tr>
        <td>${r.year}</td>
        <td class="num">${r.taxUsd === null ? '—' : fmtUsd(r.taxUsd)}</td>
        <td class="num">${r.taxChangePct === null ? '—' : fmtPct(r.taxChangePct, 1)}</td>
        <td class="num">${fmtUsd(r.assessedUsd)}</td>
        <td class="num">${fmtPct(r.assessedChangePct, 1)}</td>
        <td><span class="badge ${r.taxUsd === null ? 'badge-flagged' : 'badge-verified'}">${r.status}</span> · <a href="https://boe.ca.gov/proptaxes/pdf/lta26002.pdf" target="_blank" rel="noopener" style="font-size:0.78rem;">BOE CCPI ↗</a></td>
      </tr>
    `
      )
      .join('');

  document.getElementById('prop-a-history-tbody').innerHTML = renderHist(properties.propertyA.taxHistoryRounded);
  document.getElementById('prop-b-history-tbody').innerHTML = renderHist(properties.propertyB.taxHistoryRounded);

  const localRules = [
    {
      rule: 'Santa Clara County Cupertino TRA (013-xxx)',
      terms: 'Ad valorem UNVERIFIED + 0.0039% SCVWD State Water Proj = UNVERIFIED',
      impact: 'Excludes fixed direct fees (~$910/yr implied). Exact 6-digit TRA code flagged for private tax bill check.',
      status: 'Partially Verified',
      url: 'https://files.santaclaracounty.gov/exjcpb1531/2025-11/tax-rate-book-2025-2026.pdf'
    },
    {
      rule: 'FUHSD & CUSD School Parcel Taxes (Cupertino)',
      terms: 'FUHSD $98/yr (senior 65+ owner-occupant exemption available); CUSD Measure A expired June 30, 2023',
      impact: 'Flat parcel charge does not multiply on Prop 19 reassessment.',
      status: 'Verified',
      url: 'https://www.fuhsd.org/quick-links/parcel-tax-exemptions'
    },
    {
      rule: 'Santa Clara County Transfer Tax & Recording',
      terms: '$0.55 per $500 (0.11%) county DTT + $0 Cupertino city conveyance tax + $92 1st page recording',
      impact: 'Selling a $3.1M–$5.4M Cupertino home incurs only ~0.11% transfer tax vs 0.75%–2.25% in SF.',
      status: 'Verified',
      url: 'https://files.santaclaracounty.gov/exjcpb1531/2025-11/tax-rate-book-2025-2026.pdf'
    },
    {
      rule: 'San Francisco Secured Tax Rate (FY25–26 & FY26–27)',
      terms: 'FY26–27: 1.18162182% (SF Treasurer, verified) · FY25–26 rate: UNVERIFIED',
      impact: 'Combined with ~$1,090/yr implied direct assessments on Property B.',
      status: 'Verified',
      url: 'https://media.api.sf.gov/documents/bfc091626_agenda.pdf'
    },
    {
      rule: 'SF Prop H (Nov 3, 2026 Muni Parcel Tax — PASSED, preliminary 74.42%)',
      terms: 'Eff. July 1, 2027: Multifamily $249/yr + $0.195/sqft >5,000 sqft ($50k cap, CPI-indexed). $249 senior 65+ owner deduction.',
      impact: 'Adds ~$249+/yr to Property B; exact sqft >5,000 must be confirmed offline.',
      status: 'Verified Law / SqFt Unverified',
      url: 'https://sfelections.org/results/20261103/index.html'
    },
    {
      rule: 'SF Rent Board Annual Cap & Costa-Hawkins (1979 Cutoff)',
      terms: '1.6% allowable increase (Mar 1, 2026 – Feb 28, 2027) for pre-June 13, 1979 multi-unit rentals',
      impact: 'Caps Property B Unit 1–2 growth (and Unit 3 after initial market lease if rented out).',
      status: 'Verified Law / Build Yr Flagged',
      url: 'https://www.sf.gov/information--evictions-based-owner-or-relative-move'
    },
    {
      rule: 'SF Prop H (2006) OMI Relocation & Protected Tenants',
      terms: '$8,245/authorized occupant, max $24,733/unit + $5,497 elderly/disabled/minor; 36-mo occupancy; seniors 60+/disabled 10+ yrs immune in >=2-unit buildings',
      impact: 'Crucial barrier if renting out Property B Unit 3 during 5-yr Cupertino stay and trying to return later.',
      status: 'Verified',
      url: 'https://www.sf.gov/information--evictions-based-owner-or-relative-move'
    },
    {
      rule: 'SF Empty Homes Tax (Prop M) & Condo Conversion Lottery',
      terms: 'Prop M Empty Homes Tax invalidated (Court of Appeal A172067, Sept 11, 2026). Expedited Condo Conversion resumed Apr 2024 post-Pakdel settlement.',
      impact: 'No Empty Homes penalty on Property B Unit 3; 3-unit condo conversion subject to tenant lifetime-lease rules.',
      status: 'Verified',
      url: 'https://sfpublicworks.org/node/35233'
    },
    {
      rule: 'Utilities: SFPUC Water/Sewer, Cupertino Water & CPUC NEM 2.0 Sunset',
      terms: 'SFPUC +11.5%/yr FY27–28; Cupertino Water $100–$150/mo; PG&E ~$0.345/kWh; NEM 2.0 drops to NBT after 20-yr legacy',
      impact: 'Solar -$10 to -$20/mo credit flips to net electric expense (~+$90/mo) once 20-yr NEM legacy ends unless battery added.',
      status: 'Verified',
      url: 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/demand-side-management/customer-generation/net-energy-metering-and-net-billing'
    },
    {
      rule: 'Bay Area Homeowners & 3-Unit Habitational Insurance',
      terms: 'User placeholder $1,500/yr vs realistic market $2,800–$6,500 (A) & $4,800–$10,500 (B)',
      impact: 'CDI Sustainable Insurance Strategy active, FAIR Plan growing (+2.4% Q1 2026); actual quotes required.',
      status: 'Flagged for Review',
      url: 'https://www.insurance.ca.gov/'
    }
  ];

  document.getElementById('local-rules-tbody').innerHTML = localRules
    .map(
      (r) => `
      <tr>
        <td><strong>${r.rule}</strong></td>
        <td style="font-size:0.84rem;">${r.terms}</td>
        <td style="font-size:0.84rem;">${r.impact}</td>
        <td>
          <span class="badge ${r.status.includes('Flag') || r.status.includes('Unverified') ? 'badge-flagged' : 'badge-verified'}">${r.status}</span><br/>
          <a href="${r.url}" target="_blank" rel="noopener" style="font-size:0.8rem;">Official Source ↗</a>
        </td>
      </tr>
    `
    )
    .join('');

  const safmr = sources.rentalAndUtilities.hudFy2026Safmr;
  const comps = [
    { name: 'HUD FY2026 SAFMR — 3BR Voucher Benchmark', rent: safmr.propertyA.br3, note: 'Federal Section 8 benchmark (not private SFH luxury comp)', url: safmr.sourceUrl },
    { name: 'HUD FY2026 SAFMR — 4BR Voucher Benchmark', rent: safmr.propertyA.br4, note: 'Federal Section 8 4BR payment benchmark', url: safmr.sourceUrl },
    ...sources.rentalAndUtilities.cupertinoRentalComps.map((c) => ({
      name: `Property A Market Comp: ${c.type}`,
      rent: c.monthlyUsd,
      note: c.source,
      url: c.url
    })),
    { name: 'HUD FY2026 SAFMR — 2BR / 3BR (Property B Reference)', rent: safmr.propertyB.br2, note: `HUD SAFMR 2BR=$3,310 (Property B area) · 3BR=$4,230 (matches 2 units at $7,150/mo)`, url: safmr.sourceUrl }
  ];

  document.getElementById('rental-comps-tbody').innerHTML = comps
    .map(
      (c) => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td class="num">${c.rent === null ? '<span class="badge badge-flagged">Blank — Unverified</span>' : `${fmtUsd(c.rent)}/mo`}</td>
        <td class="num">${c.rent === null ? '—' : `${((c.rent * 12) / 3100000 * 100).toFixed(2)}%`}</td>
        <td style="font-size:0.84rem;">${c.note}</td>
        <td><a href="${c.url}" target="_blank" rel="noopener">Verify Source ↗</a></td>
      </tr>
    `
    )
    .join('');

  const renderCapex = (items, officialUrl, officialLabel) => {
    const totals = items.reduce(
      (acc, it) => ({ low: acc.low + it.lowUsd, base: acc.base + it.baseUsd, high: acc.high + it.highUsd }),
      { low: 0, base: 0, high: 0 }
    );
    return (
      items
        .map(
          (it) => `
        <tr>
          <td><strong>${it.item}</strong></td>
          <td class="num">${fmtUsd(it.lowUsd)}</td>
          <td class="num">${fmtUsd(it.baseUsd)}</td>
          <td class="num">${fmtUsd(it.highUsd)}</td>
          <td style="font-size:0.82rem;">${it.priority} · <a href="${officialUrl}" target="_blank" rel="noopener">${officialLabel} ↗</a></td>
        </tr>
      `
        )
        .join('') +
      `<tr style="background:var(--surface-alt);font-weight:700;">
        <td>Total 5-Year CapEx Plan</td>
        <td class="num">${fmtUsd(totals.low)}</td>
        <td class="num">${fmtUsd(totals.base)}</td>
        <td class="num">${fmtUsd(totals.high)}</td>
        <td>Flagged until inspections · <a href="${officialUrl}" target="_blank" rel="noopener">${officialLabel} ↗</a></td>
      </tr>`
    );
  };

  document.getElementById('capex-a-tbody').innerHTML = renderCapex(
    properties.propertyA.fiveYearCapexPlan2026Usd,
    'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/demand-side-management/customer-generation/net-energy-metering-and-net-billing',
    'CPUC / IRS Pub 527'
  );
  document.getElementById('capex-b-tbody').innerHTML = renderCapex(
    properties.propertyB.fiveYearCapexPlan2026Usd,
    'https://www.sf.gov/departments--department-building-inspection',
    'SF DBI'
  );
}

init();
