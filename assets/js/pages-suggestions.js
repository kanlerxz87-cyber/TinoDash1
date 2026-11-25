import { renderSiteChrome } from '../layout.js';
import { loadSuggestions, saveSuggestions } from '../storage.js';

renderSiteChrome('suggestions', '..');

const rows = loadSuggestions();
const tbody = document.getElementById('suggestions-tbody');

function render() {
  tbody.innerHTML = rows
    .map(
      (s, idx) => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td><span class="badge badge-info">${s.category}</span></td>
        <td><strong>${s.title}</strong></td>
        <td style="font-size:0.85rem;">${s.rationale}</td>
        <td>${s.effort}</td>
        <td>
          <select data-idx="${idx}" class="sug-select" style="width:100%;padding:0.35rem;border:1px solid #cbd5e1;border-radius:5px;">
            <option value="Proposed for Review" ${s.decision === 'Proposed for Review' ? 'selected' : ''}>Proposed for Review</option>
            <option value="Evaluate with Estate CPA" ${s.decision === 'Evaluate with Estate CPA' ? 'selected' : ''}>Evaluate with Estate CPA</option>
            <option value="Evaluate if Multiple Heirs" ${s.decision === 'Evaluate if Multiple Heirs' ? 'selected' : ''}>Evaluate if Multiple Heirs</option>
            <option value="Recommended Immediately" ${s.decision === 'Recommended Immediately' ? 'selected' : ''}>Recommended Immediately</option>
            <option value="Approved for Next Phase" ${s.decision === 'Approved for Next Phase' ? 'selected' : ''}>Approved for Next Phase</option>
            <option value="Deferred / Decline" ${s.decision === 'Deferred / Decline' ? 'selected' : ''}>Deferred / Decline</option>
          </select>
        </td>
      </tr>
    `
    )
    .join('');

  tbody.querySelectorAll('.sug-select').forEach((el) => {
    el.addEventListener('change', (e) => {
      const i = Number(e.target.dataset.idx);
      rows[i].decision = e.target.value;
      saveSuggestions(rows);
    });
  });
}

render();

document.getElementById('export-suggestions-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'evaluated-site-suggestions.json';
  a.click();
  URL.revokeObjectURL(url);
});
