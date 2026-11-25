import { renderSiteChrome, fetchVerifiedData } from './layout.js';
import { loadDecisions, saveDecisions } from './storage.js';

renderSiteChrome('decisions', '..');

async function init() {
  const { scenarios } = await fetchVerifiedData('..');
  const decisions = loadDecisions();
  const tbody = document.getElementById('decision-log-tbody');

  const renderLog = () => {
    tbody.innerHTML = decisions
      .map(
        (d, idx) => `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td>
          <strong>${d.action}</strong>
          <div style="font-size:0.8rem;color:var(--muted);">Owner: ${d.owner} · <a href="https://www.irs.gov/instructions/i706" target="_blank" rel="noopener">Official Authority ↗</a></div>
        </td>
        <td>
          <select data-idx="${idx}" class="dec-status" style="width:100%;padding:0.3rem;border:1px solid #cbd5e1;border-radius:5px;">
            <option value="Pending Discovery" ${d.status === 'Pending Discovery' ? 'selected' : ''}>Pending Discovery</option>
            <option value="Flagged for Review" ${d.status === 'Flagged for Review' ? 'selected' : ''}>Flagged for Review</option>
            <option value="Ready for Sign-Off" ${d.status === 'Ready for Sign-Off' ? 'selected' : ''}>Ready for Sign-Off</option>
            <option value="Scheduled Annual" ${d.status === 'Scheduled Annual' ? 'selected' : ''}>Scheduled Annual</option>
            <option value="Decided / Locked" ${d.status === 'Decided / Locked' ? 'selected' : ''}>Decided / Locked</option>
          </select>
        </td>
        <td>
          <input type="text" data-idx="${idx}" class="dec-text" value="${d.decision.replace(/"/g, '&quot;')}" style="width:100%;padding:0.35rem;border:1px solid #cbd5e1;border-radius:5px;font-size:0.84rem;" />
        </td>
        <td>
          <input type="date" data-idx="${idx}" class="dec-date" value="${d.decisionDate || ''}" style="width:100%;padding:0.3rem;border:1px solid #cbd5e1;border-radius:5px;font-size:0.84rem;" />
        </td>
      </tr>
    `
      )
      .join('');

    tbody.querySelectorAll('.dec-status').forEach((el) => {
      el.addEventListener('change', (e) => {
        const i = Number(e.target.dataset.idx);
        decisions[i].status = e.target.value;
        if (e.target.value === 'Decided / Locked' && !decisions[i].decisionDate) {
          decisions[i].decisionDate = new Date().toISOString().slice(0, 10);
          renderLog();
        }
        saveDecisions(decisions);
      });
    });

    tbody.querySelectorAll('.dec-text').forEach((el) => {
      el.addEventListener('input', (e) => {
        const i = Number(e.target.dataset.idx);
        decisions[i].decision = e.target.value;
        saveDecisions(decisions);
      });
    });

    tbody.querySelectorAll('.dec-date').forEach((el) => {
      el.addEventListener('change', (e) => {
        const i = Number(e.target.dataset.idx);
        decisions[i].decisionDate = e.target.value;
        saveDecisions(decisions);
      });
    });
  };

  renderLog();

  document.getElementById('missing-qa-tbody').innerHTML = scenarios.missingInfoQuestions
    .map(
      (q) => `
      <tr>
        <td><strong>${q.id}</strong></td>
        <td><span class="badge badge-info">${q.category}</span></td>
        <td><strong>${q.question}</strong></td>
        <td style="font-size:0.84rem;">${q.whyItMatters}</td>
        <td style="font-size:0.84rem;">${q.howToDiscoverPrivately} · <a href="https://www.boe.ca.gov/prop19/" target="_blank" rel="noopener">Official Guide ↗</a></td>
      </tr>
    `
    )
    .join('');

  document.getElementById('export-decisions-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(decisions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inheritance-decision-log.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

init();
