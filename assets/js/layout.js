/**
 * Shared Site Layout, Grouped Navigation Chrome, Privacy Banner & Formatters
 * Uses relative paths (`basePrefix`) so links resolve identically on root or /TinoDash1/
 */

export function fmtUsd(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  const rounded = Math.round(amount / 10) * 10;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(rounded);
}

export function fmtExactUsd(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

export function fmtRangeUsd(low, high) {
  return `${fmtUsd(low)} – ${fmtUsd(high)}`;
}

export function fmtPct(val, digits = 2) {
  if (val === null || val === undefined || Number.isNaN(val)) return '—';
  return `${Number(val).toFixed(digits)}%`;
}

export function renderSiteChrome(activeId, basePrefix = '.') {
  const p = (rel) => (basePrefix === '.' ? `./${rel}` : `${basePrefix}/${rel}`);
  const headerEl = document.getElementById('site-header');
  const stripEl = document.getElementById('privacy-strip');
  const footerEl = document.getElementById('site-footer');

  if (headerEl) {
    headerEl.innerHTML = `
      <div class="header-inner">
        <a href="${p('index.html')}" class="brand">
          <span class="brand-title">Bay Area Inheritance Decision Dashboard</span>
          <span class="brand-sub">Property A (Cupertino) · Property B (SF) · Verified Nov 25, 2026</span>
        </a>
        <nav class="nav-groups" aria-label="Grouped Main Navigation">
          <a href="${p('index.html')}" class="nav-link ${activeId === 'overview' ? 'active' : ''}">Overview</a>

          <div class="nav-dropdown">
            <button type="button" class="nav-dropdown-btn" aria-expanded="false">Modeling ▾</button>
            <div class="nav-menu">
              <a href="${p('pages/projections.html')}" class="${activeId === 'projections' ? 'active' : ''}">Financial Projections &amp; What-If Lab</a>
              <a href="${p('pages/black-swan.html')}" class="${activeId === 'black-swan' ? 'active' : ''}">Black Swan &amp; Phased Treasury Staging</a>
            </div>
          </div>

          <div class="nav-dropdown">
            <button type="button" class="nav-dropdown-btn" aria-expanded="false">Properties &amp; Laws ▾</button>
            <div class="nav-menu">
              <a href="${p('pages/properties.html')}" class="${activeId === 'properties' ? 'active' : ''}">Properties A &amp; B, Taxes, Comps &amp; CapEx</a>
              <a href="${p('pages/tax-estate.html')}" class="${activeId === 'tax-estate' ? 'active' : ''}">Estate vs Basis vs Prop 19 &amp; Legislation</a>
            </div>
          </div>

          <div class="nav-dropdown">
            <button type="button" class="nav-dropdown-btn" aria-expanded="false">Governance &amp; Review ▾</button>
            <div class="nav-menu">
              <a href="${p('pages/decisions.html')}" class="${activeId === 'decisions' ? 'active' : ''}">Decision Log &amp; Missing Info Q&amp;As</a>
              <a href="${p('pages/flagged.html')}" class="${activeId === 'flagged' ? 'active' : ''}">Flagged for Review (Unverified)</a>
              <a href="${p('pages/suggestions.html')}" class="${activeId === 'suggestions' ? 'active' : ''}">Suggestions (Evaluate Before Editing)</a>
              <a href="${p('pages/glossary.html')}" class="${activeId === 'glossary' ? 'active' : ''}">Glossary &amp; Privacy Governance</a>
              <a href="${p('pages/pre-commitment.html')}" class="${activeId === 'pre-commitment' ? 'active' : ''}">Pre-Commitment Agreement (Sign First)</a>
              <a href="${p('pages/investment-policy.html')}" class="${activeId === 'investment-policy' ? 'active' : ''}">Investment Policy Statement (Proceeds)</a>
            </div>
          </div>

          <a href="${p('pages/briefing-sheet.html')}" class="nav-link nav-cta ${activeId === 'briefing' ? 'active' : ''}">1-Page Briefing Sheet</a>
        </nav>
      </div>
    `;

    // Accessible click toggle for dropdowns on touch/mobile
    headerEl.querySelectorAll('.nav-dropdown-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrap = btn.closest('.nav-dropdown');
        const wasOpen = wrap.classList.contains('open');
        headerEl.querySelectorAll('.nav-dropdown').forEach((d) => d.classList.remove('open'));
        if (!wasOpen) wrap.classList.add('open');
      });
    });
    document.addEventListener('click', () => {
      headerEl.querySelectorAll('.nav-dropdown').forEach((d) => d.classList.remove('open'));
    });
  }

  if (stripEl) {
    stripEl.innerHTML = `
      <strong>Privacy Notice:</strong> All assets are anonymized (Property A / Property B) with zero names, street addresses, or APNs. All user dollar figures are rounded to <strong>$10 increments</strong> or ranges. Unverified parameters are marked <span class="badge badge-flagged">Flagged for Review</span>.
    `;
  }

  if (footerEl) {
    footerEl.innerHTML = `
      <div>
        Decision-support model only — not legal, tax, or investment advice. Statutory baselines verified November 25, 2026 against IRS, CA FTB, CA BOE, Santa Clara County, SF Assessor/Rent Board/Elections, HUD, BLS, Treasury, and FHFA sources.
      </div>
    `;
  }
}

export async function fetchVerifiedData(basePrefix = '.') {
  const p = (rel) => (basePrefix === '.' ? `./${rel}` : `${basePrefix}/${rel}`);
  const [sources, properties, scenarios] = await Promise.all([
    fetch(p('data/verified-sources.json')).then((r) => r.json()),
    fetch(p('data/properties.json')).then((r) => r.json()),
    fetch(p('data/scenarios.json')).then((r) => r.json())
  ]);
  return { sources, properties, scenarios };
}
