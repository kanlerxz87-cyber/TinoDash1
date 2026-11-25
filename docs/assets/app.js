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
function renderNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const nav = document.getElementById('site-nav');
  if(nav){
    nav.innerHTML = NAV.map(n=>`<a href="${n.href}" class="${path===n.href?'active':''}">${n.label}</a>`).join('');
  }
  const f = document.getElementById('site-footer');
  if(f){
    f.innerHTML = `<div class="wrap footer">
      <div><strong>Privacy-first notice:</strong> This site uses anonymized placeholders (Property A / Property B) and rounds published dollar figures to the nearest $10. No personal names, addresses, zip codes, parcel IDs, or account identifiers are published. Any personal information in source inputs is for internal analysis only and must not be added to this repository or site.</div>
      <div style="margin-top:8px">Built for decision support, not legal, tax, or investment advice. Verify all figures with qualified professionals and official sources before acting.</div>
      <div style="margin-top:8px" class="small muted">Repository: kanlerxz87-cyber/TinoDash1 &middot; Branch: arena/fd4a10e1-tinodash1 &middot; Generated 2026-11-25</div>
    </div>`;
  }
}
document.addEventListener('DOMContentLoaded', renderNav);
