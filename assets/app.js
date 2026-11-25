// Dropdown nav toggle (hover/focus via CSS; click for touch)
document.querySelectorAll('.navgroup > button').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});
document.addEventListener('click', e => {
  if (!e.target.closest('.navgroup')) document.querySelectorAll('.navgroup.open').forEach(n => n.classList.remove('open'));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.navgroup.open').forEach(n => n.classList.remove('open')); });
// Nearest-$10 rounding helper for dynamically rendered tables
function r10(x){ return Math.round(x / 10) * 10; }
function fmt(x){ return (x<0?'-$':'$') + Math.abs(r10(x)).toLocaleString(); }
function fmtSigned(x){ return (x<0?'-$':'+$') + Math.abs(r10(x)).toLocaleString(); }
function pct(x, d){ return (x*100).toFixed(d===undefined?2:d) + '%'; }
