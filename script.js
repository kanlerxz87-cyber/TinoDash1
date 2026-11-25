/* Simple dashboard helpers. No user input required for core flow; all controls default to the
   projected assumptions and every value is rounded to the nearest $10 where applicable. */

function $$(sel, root){return (root||document).querySelectorAll(sel)}

/* Distribute any-value projection helper used by paths.html */
function dist(total, weights){
  var s=weights.reduce(function(a,b){return a+b},0), out=[], acc=0;
  weights.forEach(function(w,i){var x=Math.round(total*w/s*100)/100; out.push(x); acc+=x});
  out[out.length-1]=total-acc+out[out.length-1]; return out;
}

/* Default assumption set (rounded to nearest $10). Can be overridden by query params on paths.html. */
window.ASSUMPTIONS = {
  homeA: 3100000,        // Property A: Cupertino, estimated value Nov 2026 ($3,100,000 user data)
  homeB: 1800000,        // Property B: SF, estimated value Nov 2026 ($1,800,000 user data)
  years: 20,             // horizon to 2040-2050
  growthA: 0.045,        // assumed annual value growth for projections (to be replaced by real data as prices update)
  rateA: 0.042,          // assumed annualized return for the sale+reinvest path
  cashRate: 0.045        // assumed conservative return for non-equity reinvestment (rounded estimates)
};

function readQuery(){
  var out={};
  location.search.replace(/^\?/,'').split('&').forEach(function(p){
    if(!p)return; var kv=p.split('='); out[decodeURIComponent(kv[0])]=decodeURIComponent(kv[1]||'');
  });
  return out;
}
