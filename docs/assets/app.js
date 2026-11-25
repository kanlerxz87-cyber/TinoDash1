(function () {
  function fmt(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    const rounded = Math.round(n / 10) * 10;
    return "$" + rounded.toLocaleString("en-US");
  }

  async function initProjections() {
    const container = document.getElementById("whatif-app");
    if (!container) return;

    try {
      const res = await fetch("data/model_output.json");
      const data = await res.json();

      const selYear = document.getElementById("ctrl-year");
      const selHorizon = document.getElementById("ctrl-horizon");
      const selScenario = document.getElementById("ctrl-scenario");
      const rngEq = document.getElementById("ctrl-eq");
      const rngHome = document.getElementById("ctrl-home");
      const rngImp = document.getElementById("ctrl-imputed");
      const lblEq = document.getElementById("lbl-eq");
      const lblHome = document.getElementById("lbl-home");
      const lblImp = document.getElementById("lbl-imputed");

      function render() {
        const yr = selYear.value;
        const hz = selHorizon.value;
        const sc = selScenario.value;
        const eqAdj = parseFloat(rngEq.value);
        const homeAdj = parseFloat(rngHome.value);
        const impMult = parseFloat(rngImp.value);

        lblEq.textContent = (eqAdj >= 0 ? "+" : "") + eqAdj.toFixed(1) + "%";
        lblHome.textContent = (homeAdj >= 0 ? "+" : "") + homeAdj.toFixed(1) + "%";
        lblImp.textContent = Math.round(impMult * 100) + "%";

        const cell = data.comparison_matrix[yr][hz][sc];
        const tbody = document.getElementById("whatif-tbody");
        const h = parseInt(hz, 10);

        const rows = Object.entries(cell.paths).map(([key, p]) => {
          let val = p.ending_wealth;
          // Apply interactive sensitivity adjustments transparently
          if (key === "sell_immediate" || key === "mixed_sell_phased") {
            val = val * Math.pow(1 + eqAdj / 100, h * 0.65);
          } else if (key === "live_a") {
            val = val * Math.pow(1 + homeAdj / 100, h * 0.7) * (0.85 + 0.15 * impMult);
          } else if (key === "rent_a" || key === "mixed_rent_1031") {
            val = val * Math.pow(1 + homeAdj / 100, h * 0.75);
          } else if (key === "mixed_live_sell") {
            val = val * Math.pow(1 + (homeAdj * 0.3 + eqAdj * 0.7) / 100, h * 0.65);
          }
          return { key, ...p, adjusted: val };
        });

        rows.sort((a, b) => b.adjusted - a.adjusted);
        const topVal = rows[0].adjusted;

        tbody.innerHTML = rows.map((r, idx) => {
          const badge = r.type === "pure"
            ? '<span class="badge badge-pure">Pure</span>'
            : '<span class="badge badge-mixed">Mixed</span>';
          const delta = idx === 0 ? "Leading" : fmt(r.adjusted - topVal);
          return `<tr>
            <td><strong>#${idx + 1}</strong> ${r.name} ${badge}</td>
            <td class="num"><strong>${fmt(r.adjusted)}</strong></td>
            <td class="num">${delta}</td>
            <td>${r.notes}</td>
          </tr>`;
        }).join("");

        document.getElementById("whatif-headline").textContent =
          `Transfer ${yr} · ${hz}-Year Horizon · ${sc.toUpperCase()} Case — Leading Path: ${rows[0].name} (${fmt(rows[0].adjusted)})`;
      }

      [selYear, selHorizon, selScenario, rngEq, rngHome, rngImp].forEach(el => {
        el.addEventListener("input", render);
        el.addEventListener("change", render);
      });
      render();
    } catch (e) {
      console.error("Failed to load model_output.json", e);
    }
  }

  document.addEventListener("DOMContentLoaded", initProjections);
})();


// Compatibility nav for fd4a10e1 pages
(function(){
  const NAV = [
    {href:'index.html', label:'Dashboard'},
    {href:'executive-summary.html', label:'Executive Summary'},
    {href:'decision-framework.html', label:'Decision Framework'},
    {href:'scenarios.html', label:'Scenarios & Projections'},
    {href:'black-swan.html', label:'Black Swan'},
    {href:'timeline.html', label:'Timeline & Deadlines'},
    {href:'properties.html', label:'Property Details'},
    {href:'tax-legal.html', label:'Tax & Legal'},
    {href:'questions.html', label:'Questions & Missing Info'},
    {href:'suggestions.html', label:'Suggestions'},
    {href:'brief.html', label:'Attorney & CPA Brief'},
    {href:'glossary.html', label:'Glossary'},
    {href:'sources.html', label:'Sources'},
    {href:'flagged.html', label:'Flagged for Review'},
  ];
  document.addEventListener('DOMContentLoaded', function(){
    const path = location.pathname.split('/').pop() || 'index.html';
    const nav = document.getElementById('site-nav');
    if(nav){ nav.innerHTML = NAV.map(n=>`<a href="${n.href}" class="${path===n.href?'active':''}">${n.label}</a>`).join(''); }
    const f = document.getElementById('site-footer');
    if(f){ f.innerHTML = `<div class="wrap footer"><div><strong>Privacy-first notice:</strong> This site uses anonymized placeholders (Property A / Property B) and rounds published dollar figures to the nearest $10. No personal names, addresses, zip codes, parcel IDs, or account identifiers are published.</div><div style="margin-top:8px">Decision support only, not legal/tax/investment advice. Verify with qualified professionals and official sources.</div></div>`; }
  });
})();
