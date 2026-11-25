import { renderSiteChrome } from '../layout.js';

renderSiteChrome('glossary', '..');

const TERMS = [
  {
    term: 'Prop 19 (Parent-Child Exclusion)',
    category: 'CA Property Tax',
    desc: 'Allows child inheriting primary residence to exclude Factored Base Year Value (FBYV) + $1,044,586 (2025–2027 indexed) ONLY if heir moves in as principal residence within 1 year and files BOE-19-P + Homeowners Exemption.',
    url: 'https://www.boe.ca.gov/prop19/'
  },
  {
    term: 'FBYV (Factored Base Year Value)',
    category: 'CA Property Tax',
    desc: 'Prop 13 historical assessed value inflated by no more than 2% per year prior to transfer (~$550,540 for Property A in 2026).',
    url: 'https://www.boe.ca.gov/prop19/'
  },
  {
    term: 'IRC §1014 & Form 8971',
    category: 'Federal Income Basis',
    desc: 'Resets income-tax cost basis of inherited assets to Fair Market Value at date of death (or 6-mo §2032 alternate valuation), wiping out pre-death capital gains. Form 8971 locks basis within 30 days of Form 706.',
    url: 'https://www.irs.gov/pub/irs-pdf/i8971.pdf'
  },
  {
    term: 'DSUE (Deceased Spousal Unused Exclusion)',
    category: 'Federal Estate Tax',
    desc: 'Portability election on timely Form 706 (9 mo + 6 mo Form 4768, or 5 yrs under Rev. Proc. 2022-32) allowing surviving spouse to add predeceased spouse unused $15M exclusion (up to $30M combined in 2026).',
    url: 'https://www.irs.gov/pub/irs-pdf/i706.pdf'
  },
  {
    term: 'IRC §121 (Primary Residence Exclusion)',
    category: 'Federal / CA Capital Gains',
    desc: 'Excludes up to $250,000 ($500,000 MFJ) of capital gain after 2 of 5 years ownership & principal use; reduced proportionally for post-2008 nonqualified rental use prior to occupancy and excludes §1250 depreciation.',
    url: 'https://www.irs.gov/publications/p523'
  },
  {
    term: 'IRC §1250 Unrecaptured Depreciation',
    category: 'Federal / CA Rental Tax',
    desc: 'Accumulated 27.5-year residential rental depreciation taxed upon sale at up to 25% federal rate + California ordinary income rate (up to 13.3%) unless deferred via §1031 or wiped out at subsequent death.',
    url: 'https://www.irs.gov/publications/p527'
  },
  {
    term: 'IRC §1031 & FTB Form 3840',
    category: 'Tax-Deferred Exchange',
    desc: 'Defers federal & CA gains when investment real estate is exchanged within 45-day ID / 180-day close rules. If replacement property is outside California, FTB Form 3840 must be filed annually to track deferred CA tax.',
    url: 'https://www.irs.gov/pub/irs-pdf/i8824.pdf'
  },
  {
    term: 'NIIT (3.8% Net Investment Income Tax)',
    category: 'Federal Surtax',
    desc: '3.8% Medicare surtax on capital gains, rental profit, and Treasury interest above $200k Single / $250k MFJ MAGI (thresholds are NOT indexed for inflation).',
    url: 'https://www.irs.gov/pub/irs-pdf/i8960.pdf'
  },
  {
    term: 'CA Form 540 Line 62 (+1% >$1M)',
    category: 'CA Income Tax',
    desc: 'California taxes capital gains at ordinary rates up to 12.3%, PLUS a 1.0% Behavioral Health Services Tax on taxable income over $1,000,000 = 13.3% top marginal rate.',
    url: 'https://www.ftb.ca.gov/forms/2025/2025-540-booklet.html'
  },
  {
    term: 'TRA (Tax Rate Area 013-xxx)',
    category: 'Santa Clara County Tax',
    desc: 'Six-digit code identifying every overlapping city, school, and water bond rate on a parcel. Cupertino starts with 013- (~1.1671%–1.1786% + 0.0039% SCVWD).',
    url: 'https://files.santaclaracounty.gov/exjcpb1531/2025-11/tax-rate-book-2025-2026.pdf'
  },
  {
    term: 'SF Prop H (Nov 2026 Muni Tax vs 2006 OMI)',
    category: 'San Francisco Local Law',
    desc: 'Nov 2026 Prop H (passed 74.4%) levies $249 + $0.195/sqft >5,000 sqft on multifamily buildings from July 2027. Separately, 2006 Prop H governs Owner Move-In relocation payments ($8,245–$24,733/unit).',
    url: 'https://sfelections.org/results/20261103/index.html'
  },
  {
    term: 'HUD SAFMR (Small Area Fair Market Rent)',
    category: 'Rental Benchmark',
    desc: 'ZIP-code-level Section 8 housing voucher payment standards; useful floor check, but must be supplemented with active private-market single-family home comparables in Cupertino 95014.',
    url: 'https://www.huduser.gov/portal/datasets/fmr/fmr2026/FY2026_Small_Area_FMR_Schedule.pdf'
  },
  {
    term: 'NEM 2.0 20-Yr Sunset → NBT',
    category: 'CA Solar & Utilities',
    desc: 'CPUC Net Energy Metering 2.0 exports remain legacy-protected for 20 years from interconnection, then transition to Net Billing Tariff (lower export credits unless paired with battery storage).',
    url: 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/demand-side-management/net-energy-metering-and-net-billing'
  },
  {
    term: 'Reinvestment Risk vs Opportunity Drag (Staging)',
    category: 'Macro & Black Swan Risk',
    desc: 'Reinvestment Risk is the yield loss when rolling 3M T-Bills get reset near 0% during a 1929/2008 Fed rate-cut cycle. Opportunity Drag is lagging a bull market or 2020 V-rebound while waiting in cash.',
    url: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2026'
  }
];

const tbody = document.getElementById('glossary-tbody');
const search = document.getElementById('glossary-search');

function render(q = '') {
  const norm = q.trim().toLowerCase();
  const filtered = TERMS.filter(
    (t) =>
      !norm ||
      t.term.toLowerCase().includes(norm) ||
      t.category.toLowerCase().includes(norm) ||
      t.desc.toLowerCase().includes(norm)
  );
  tbody.innerHTML = filtered
    .map(
      (t) => `
      <tr>
        <td><strong>${t.term}</strong></td>
        <td><span class="badge badge-info">${t.category}</span></td>
        <td style="font-size:0.86rem;">${t.desc}</td>
        <td><a href="${t.url}" target="_blank" rel="noopener">Source ↗</a></td>
      </tr>
    `
    )
    .join('');
}

search.addEventListener('input', (e) => render(e.target.value));
render();
