/**
 * Zero-dependency Responsive SVG Charts for Financial Projections,
 * Monte Carlo Percentile Distributions, and Black Swan Regime Comparisons.
 */

const COLORS = {
  'sell-immediate': '#1d4ed8',
  'mixed-phased-staging': '#0284c7',
  'mixed-rent-then-1031': '#047857',
  'mixed-live-then-sell': '#7c3aed',
  'rent-hold': '#d97706',
  'live-prop19': '#b91c1c'
};

const LABELS = {
  'sell-immediate': 'Sell Immediate (Lump Sum)',
  'mixed-phased-staging': 'Sell + Treasury Staging',
  'mixed-rent-then-1031': 'Rent 5 Yrs -> §1031',
  'mixed-live-then-sell': 'Live 5 Yrs (§121) -> Sell',
  'rent-hold': 'Hold & Rent Property A',
  'live-prop19': 'Live in A (Prop 19) + Rent B3'
};

function fmtAxisUsd(v) {
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `$${Math.round(v / 1e3)}k`;
  return `$${Math.round(v)}`;
}

export function renderTrajectoryChart(container, modelResult) {
  if (!container || !modelResult) return;
  const width = 820;
  const height = 310;
  const pad = { top: 20, right: 24, bottom: 36, left: 66 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const paths = modelResult.paths;
  const years = paths[0].yearlySeries.map((pt) => pt.year);
  const allVals = paths.flatMap((p) => p.yearlySeries.map((pt) => pt.preTaxWealth));
  const minVal = Math.min(0, ...allVals);
  const maxVal = Math.max(1000000, ...allVals) * 1.05;

  const x = (idx) => pad.left + (idx / Math.max(1, years.length - 1)) * plotW;
  const y = (val) => pad.top + plotH - ((val - minVal) / Math.max(1, maxVal - minVal)) * plotH;

  let gridSvg = '';
  for (let i = 0; i <= 4; i++) {
    const val = minVal + ((maxVal - minVal) * i) / 4;
    const py = y(val);
    gridSvg += `<line x1="${pad.left}" y1="${py}" x2="${width - pad.right}" y2="${py}" stroke="#e2e8f0" stroke-dasharray="3,3" />`;
    gridSvg += `<text x="${pad.left - 8}" y="${py + 4}" text-anchor="end" font-size="11" fill="#4b6076">${fmtAxisUsd(val)}</text>`;
  }

  const stepX = Math.max(1, Math.floor(years.length / 6));
  years.forEach((yr, idx) => {
    if (idx === 0 || idx === years.length - 1 || idx % stepX === 0) {
      gridSvg += `<text x="${x(idx)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#4b6076">${yr}</text>`;
    }
  });

  const linesSvg = paths
    .map((p) => {
      const d = p.yearlySeries
        .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${x(idx).toFixed(1)},${y(pt.preTaxWealth).toFixed(1)}`)
        .join(' ');
      const color = COLORS[p.id] || '#334155';
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" />`;
    })
    .join('');

  const legendHtml = paths
    .map((p) => {
      const color = COLORS[p.id] || '#334155';
      return `<span class="legend-item"><span class="legend-swatch" style="background:${color}"></span>${LABELS[p.id] || p.id}</span>`;
    })
    .join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="Projected pre-tax total wealth trajectories across paths">
      ${gridSvg}
      ${linesSvg}
    </svg>
    <div class="chart-legend">${legendHtml}</div>
  `;
}

export function renderDistributionChart(container, mcSummary) {
  if (!container || !mcSummary) return;
  const ids = Object.keys(mcSummary);
  const width = 820;
  const rowH = 44;
  const pad = { top: 24, right: 32, bottom: 34, left: 195 };
  const height = pad.top + pad.bottom + ids.length * rowH;
  const plotW = width - pad.left - pad.right;

  const minVal = Math.min(...ids.map((id) => mcSummary[id].p10)) * 0.9;
  const maxVal = Math.max(...ids.map((id) => mcSummary[id].p90)) * 1.05;
  const x = (val) => pad.left + ((val - minVal) / Math.max(1, maxVal - minVal)) * plotW;

  let grid = '';
  for (let i = 0; i <= 5; i++) {
    const val = minVal + ((maxVal - minVal) * i) / 5;
    const px = x(val);
    grid += `<line x1="${px}" y1="${pad.top}" x2="${px}" y2="${height - pad.bottom}" stroke="#e2e8f0" stroke-dasharray="3,3"/>`;
    grid += `<text x="${px}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#4b6076">${fmtAxisUsd(val)}</text>`;
  }

  const rowsSvg = ids
    .map((id, idx) => {
      const d = mcSummary[id];
      const cy = pad.top + idx * rowH + rowH / 2;
      const color = COLORS[id] || '#1d4ed8';
      return `
        <text x="${pad.left - 10}" y="${cy + 4}" text-anchor="end" font-size="12" font-weight="600" fill="#102438">${LABELS[id] || id}</text>
        <line x1="${x(d.p10)}" y1="${cy}" x2="${x(d.p90)}" y2="${cy}" stroke="${color}" stroke-width="3" opacity="0.45" />
        <line x1="${x(d.p10)}" y1="${cy - 7}" x2="${x(d.p10)}" y2="${cy + 7}" stroke="${color}" stroke-width="2" />
        <line x1="${x(d.p90)}" y1="${cy - 7}" x2="${x(d.p90)}" y2="${cy + 7}" stroke="${color}" stroke-width="2" />
        <rect x="${x(d.p25)}" y="${cy - 10}" width="${Math.max(2, x(d.p75) - x(d.p25))}" height="20" rx="4" fill="${color}" opacity="0.28" stroke="${color}" stroke-width="1.5" />
        <circle cx="${x(d.p50)}" cy="${cy}" r="5.5" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
      `;
    })
    .join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="Monte Carlo P10 to P90 After-Tax Net Wealth Distribution">
      ${grid}
      ${rowsSvg}
    </svg>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:#1d4ed8;opacity:0.45"></span>P10–P90 Range (Outer Whiskers)</span>
      <span class="legend-item"><span class="legend-swatch" style="background:#1d4ed8;opacity:0.28"></span>P25–P75 Interquartile Band</span>
      <span class="legend-item"><span class="legend-swatch" style="background:#1d4ed8;border-radius:999px"></span>P50 Median After-Tax Net Wealth</span>
    </div>
  `;
}

export function renderBlackSwanBars(container, rows) {
  if (!container || !rows || rows.length === 0) return;
  const width = 820;
  const groupH = 54;
  const pad = { top: 18, right: 24, bottom: 32, left: 210 };
  const height = pad.top + pad.bottom + rows.length * groupH;
  const plotW = width - pad.left - pad.right;

  const maxVal = Math.max(1000000, ...rows.flatMap((r) => [r.lumpSum, r.staged, r.live, r.rent])) * 1.08;
  const w = (val) => Math.max(2, (Math.max(0, val) / maxVal) * plotW);

  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const val = (maxVal * i) / 4;
    const gx = pad.left + w(val);
    grid += `<line x1="${gx}" y1="${pad.top}" x2="${gx}" y2="${height - pad.bottom}" stroke="#e2e8f0" stroke-dasharray="3,3" />`;
    grid += `<text x="${gx}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#4b6076">${fmtAxisUsd(val)}</text>`;
  }

  const bars = rows
    .map((r, idx) => {
      const y0 = pad.top + idx * groupH + 4;
      return `
        <text x="${pad.left - 10}" y="${y0 + 22}" text-anchor="end" font-size="11.5" font-weight="600" fill="#102438">${r.shortName}</text>
        <rect x="${pad.left}" y="${y0}" width="${w(r.lumpSum)}" height="10" rx="2" fill="#1d4ed8" />
        <rect x="${pad.left}" y="${y0 + 12}" width="${w(r.staged)}" height="10" rx="2" fill="#0284c7" />
        <rect x="${pad.left}" y="${y0 + 24}" width="${w(r.rent)}" height="10" rx="2" fill="#d97706" />
        <rect x="${pad.left}" y="${y0 + 36}" width="${w(r.live)}" height="10" rx="2" fill="#b91c1c" />
      `;
    })
    .join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="Black Swan stress test comparison across paths">
      ${grid}
      ${bars}
    </svg>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:#1d4ed8"></span>Sell Lump Sum</span>
      <span class="legend-item"><span class="legend-swatch" style="background:#0284c7"></span>Sell + Treasury Staging (24–36m)</span>
      <span class="legend-item"><span class="legend-swatch" style="background:#d97706"></span>Hold &amp; Rent Property A</span>
      <span class="legend-item"><span class="legend-swatch" style="background:#b91c1c"></span>Live in A (Prop 19) + Rent B3</span>
    </div>
  `;
}
