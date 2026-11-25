/* Minimal client-side helpers: active nav, last-updated stamp, simple table filter */
(function () {
  var path = location.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var resolved = new URL(href, location.href).pathname.replace(/\/$/, '/index.html');
    if (resolved === path) a.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('[data-now]').forEach(function (el) {
    el.textContent = new Date().toISOString().slice(0, 10);
  });
})();
function filterTable(inputId, tableId) {
  var q = (document.getElementById(inputId).value || '').toLowerCase();
  var rows = document.querySelectorAll('#' + tableId + ' tbody tr');
  rows.forEach(function (r) { r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none'; });
}
