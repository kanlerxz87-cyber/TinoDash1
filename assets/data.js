// Privacy-First Data Module: All historical property tax & assessed values are rounded to nearest $10.
// No personal names, street addresses, or unrounded identifying figures.

const SITE_NAV = [
  { group: "Overview", items: [
    { href: "index.html", label: "Executive Dashboard" },
    { href: "properties.html", label: "Properties A & B" }
  ]},
  { group: "Analysis", items: [
    { href: "black-swan.html", label: "Black Swan & Phased" },
    { href: "blackswan.html", label: "Black Swan (full analysis)" },
    { href: "tax-legal.html", label: "Tax, Prop 19 & Timeline" },
    { href: "property-tax.html", label: "Property Tax & Prop 19" },
    { href: "estate.html", label: "Estate vs Basis vs Assessment" },
    { href: "paths.html", label: "Paths — Pure & Mixed" },
    { href: "sensitivity.html", label: "What-If Controls" },
    { href: "timeline.html", label: "Deadlines" }
  ]},
  { group: "Action", items: [
    { href: "briefing.html", label: "Attorney & CPA Brief" },
    { href: "decisions.html", label: "Decisions & Glossary" },
    { href: "questions.html", label: "Missing Information" },
    { href: "suggestions.html", label: "Suggestions" },
    { href: "glossary.html", label: "Glossary" },
    { href: "insurance-maintenance.html", label: "Insurance & 5-Yr Plan" },
    { href: "sf-property.html", label: "Property B & Leases" },
    { href: "sources.html", label: "All Sources" },
    { href: "methodology.html", label: "Methodology" },
    { href: "legislation.html", label: "Legislation Tracker" },
    { href: "flagged.html", label: "Flagged for Review", isFlag: true }
  ]}
];

function renderNav(activePage) {
  const header = document.getElementById("site-header");
  if (!header) return;
  let groupsHtml = "";
  SITE_NAV.forEach(g => {
    groupsHtml += `<span class="nav-group-label">${g.group}</span>`;
    g.items.forEach(item => {
      const cls = `nav-link${item.href === activePage ? " active" : ""}${item.isFlag ? " flag-link" : ""}`;
      groupsHtml += `<a class="${cls}" href="${item.href}">${item.label}</a>`;
    });
  });
  header.innerHTML = `
    <div class="topbar-inner">
      <a class="brand" href="index.html">Estate<span>Decision</span> Dashboard</a>
      <nav class="nav-groups">${groupsHtml}</nav>
    </div>
  `;
}

// Property A: Cupertino 00000 (Inherited via Trust ~2040-2050)
// All historical values rounded to nearest $10 for privacy.
const PROPERTY_A_HISTORY = [
  { year: 2026, tax: null, taxNote: "Pending", assessed: 620000, assNote: "+2.0%" },
  { year: 2025, tax: 7210, taxNote: "+2.9%", assessed: 539740, assNote: "+2.0%" },
  { year: 2024, tax: 7000, taxNote: "+1.2%", assessed: 529160, assNote: "+2.0%" },
  { year: 2023, tax: 6920, taxNote: "+2.4%", assessed: 518790, assNote: "+2.0%" },
  { year: 2022, tax: 6760, taxNote: "+1.4%", assessed: 508610, assNote: "+2.0%" },
  { year: 2021, tax: 6660, taxNote: "+1.5%", assessed: 498640, assNote: "+1.0%" },
  { year: 2020, tax: 6570, taxNote: "0.0%", assessed: 493530, assNote: "+2.0%" },
  { year: 2019, tax: 6570, taxNote: "+2.8%", assessed: 483850, assNote: "+2.0%" },
  { year: 2018, tax: 6380, taxNote: "0.0%", assessed: 474370, assNote: "+2.0%" },
  { year: 2017, tax: 6380, taxNote: "-0.5%", assessed: 465070, assNote: "+2.0%" },
  { year: 2016, tax: 6410, taxNote: "+4.6%", assessed: 455950, assNote: "+1.5%" },
  { year: 2015, tax: 6130, taxNote: "+2.8%", assessed: 449100, assNote: "+2.0%" },
  { year: 2014, tax: 5970, taxNote: "Base", assessed: 440310, assNote: "+0.5%" }
];

// Property B: San Francisco Outer Sunset 00000 (Already Owned, 3-unit building)
// All historical values rounded to nearest $10 for privacy.
const PROPERTY_B_HISTORY = [
  { year: 2025, tax: 2440, taxNote: "+5.3%", assessed: 114250, assNote: "+2.0%" },
  { year: 2024, tax: 2320, taxNote: "+6.2%", assessed: 112010, assNote: "+2.0%" },
  { year: 2023, tax: 2180, taxNote: "+3.4%", assessed: 109810, assNote: "+2.0%" },
  { year: 2022, tax: 2110, taxNote: "+2.0%", assessed: 107660, assNote: "+2.0%" },
  { year: 2021, tax: 2070, taxNote: "-5.9%", assessed: 105600, assNote: "+1.0%" },
  { year: 2020, tax: 2200, taxNote: "+3.0%", assessed: 104510, assNote: "+2.0%" },
  { year: 2019, tax: 2130, taxNote: "+3.5%", assessed: 102470, assNote: "+2.0%" },
  { year: 2018, tax: 2060, taxNote: "+18.4%", assessed: 100460, assNote: "+2.0%" },
  { year: 2017, tax: 1740, taxNote: "+3.9%", assessed: 98490, assNote: "+2.0%" },
  { year: 2016, tax: 1680, taxNote: "+1.6%", assessed: 96560, assNote: "+1.5%" }
];

const VERIFIED_LAWS_2026 = {
  federalEstateExemptionSingle: 15000000,
  federalEstateExemptionMarried: 30000000,
  federalEstateTopRate: 0.40,
  annualGiftExclusion: 19000,
  prop19ExclusionCap: 1044586, // Feb 16, 2025 - Feb 15, 2027 (BOE LTA 2025/009)
  caTopOrdinaryRate: 0.123,
  caBhstSurtax: 0.01, // 1% Behavioral Health Services Tax > $1,000,000 (Form 540)
  sccTransferTaxRate: 0.0011, // $0.55 per $500 = $1.10 per $1,000
  sfTransferTaxRate1Mto5M: 0.0075, // $3.75 per $500
  sfPropHMultiFamilyBase: 249, // Nov 2026 Muni Parcel Tax
  sfPropHRentControlledCap: 65
};

function fmtUSD(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}
function fmtUSD10(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return "$" + (Math.round(n / 10) * 10).toLocaleString("en-US");
}
