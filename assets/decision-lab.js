// Dropdown nav toggle for Inheritance Decision Lab pages (hover/focus via CSS; click for touch)
document.querySelectorAll('.navgroup > button').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});
document.addEventListener('click', e => {
  if (!e.target.closest('.navgroup')) document.querySelectorAll('.navgroup.open').forEach(n => n.classList.remove('open'));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.navgroup.open').forEach(n => n.classList.remove('open')); });
