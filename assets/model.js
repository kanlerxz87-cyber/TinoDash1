/* TinoDash1 — transparent planning model (illustrative, not advice).
   All dollars rounded to nearest $10. Ranges, not points.
   Sources for rates are cited on taxes.html / properties.html. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const r10=x=>Math.round(x/10)*10;
const fmt=x=>"$"+r10(x).toLocaleString("en-US");

/* Seeded PRNG so the distribution chart is reproducible */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ---------- Inputs (defaults from user-provided figures, rounded) ---------- */
const DEFAULTS={
  inheritYear:2045, horizon:20,
  homeGrowth:3.5,           /* %/yr — scenario, not a forecast */
  stockReturn:7.0,          /* %/yr — scenario, not a forecast */
  treasuryYield:4.3,        /* %/yr — see FiscalData */
  inflation:2.5,
  rentA:6500,               /* $/mo — PLACEHOLDER pending comparables (flagged) */
  rentGrowth:2.5,
  taxRateA:1.16, taxRateB:1.18,   /* % of assessed — published typical; see flagged page */
  prop19Cap:1044586,        /* BOE Letter 2025/009 (2025–2027) */
  imputedRentOn:true, imputedRent:6500, imputedB:2400, rentB3:2400, rentB3On:true,
  exclusion121:500000,      /* married filing jointly */
  phaseMonths:30,           /* 24–36 Treasury parking */
  vacancy:5, mgmt:8,       /* % of gross rent — planning ranges */
  maintA:4500, maintB:9000,/* $/yr — planning ranges, unverified */
  insA:1800, insB:1800,     /* $/yr — UNVERIFIED, pending quotes */
  waterA:125, elecA:-15,    /* $/mo; solar credit negative cost */
  waterB:365, elecB:50,
  sellCost:5.5,             /* % of price — commission + closing range */
  caTop:12.3, fedLTCG:20, niit:3.8,
  valueA0:3100000, valueB0:1800000, assessedA0:550540, assessedB0:114250,
  rentB:7150,               /* $/mo user-provided */
  debtA:0, debtB:0          /* assume unencumbered — CONFIRM (flagged) */
};

/* ---------- Core projection ---------- */
/* Everything is measured as NET WEALTH at the horizon year, so every path is
   compared at the same date and horizon. Cash flows are accumulated at the
   stock-scenario rate (their opportunity cost). Property still held at the
   horizon is marked to market, net of selling cost and the taxes a sale would
   trigger -- so hold paths are not flattered by "free" unrealized value.

   Symmetry rule: the heir occupies exactly ONE dwelling in every path.
     live path  -> occupies A      (imputed rent of A; B's vacant unit may be let)
     rent path  -> occupies B unit (imputed rent of B's vacant unit; A is let)
     sell paths -> occupies B unit (imputed rent of B's vacant unit)
   Property B's existing rental income and running costs are identical in every
   path, so they are held out as a constant; only differences are modelled.     */
function project(p, scenario){
  const shift = scenario==='low'?-1.5 : scenario==='high'?1.5 : 0;
  const g=(p.homeGrowth+shift)/100, s=(p.stockReturn+shift)/100,
        tY=p.treasuryYield/100, infl=p.inflation/100, rg=p.rentGrowth/100;
  const H=p.horizon, V0=p.valueA0;

  /* future value at H of n annual payments starting after `delay` years */
  function acc(first, growth, nYears, delay){
    let t=0;
    for(let k=0;k<nYears;k++){
      const yr=(delay||0)+k+1;            /* end of that year */
      t += first*Math.pow(1+growth,k)*Math.pow(1+s,Math.max(0,H-yr));
    }
    return t;
  }
  /* property tax accumulated at H; assessed grows at the Prop 13 2% cap */
  function accTax(assessed0, nYears, delay){
    let t=0;
    for(let k=0;k<nYears;k++){
      const yr=(delay||0)+k+1;
      t += assessed0*Math.pow(1.02,k)*p.taxRateA/100*Math.pow(1+s,Math.max(0,H-yr));
    }
    return t;
  }

  /* --- property-tax assessment at inheritance --- */
  /* Project today's assessed value with the Prop 13 cap up to the inheritance
     year, or hold it flat with the home-growth control -- whichever is lower,
     so the control is (approximately) growth-neutral. */
  const cappedAssess=p.assessedA0*Math.pow(1.02,p.inheritYear-2026);
  const grownAssess=p.assessedA0*Math.pow(1+g,p.inheritYear-2026);
  const factoredAtDeath=Math.min(cappedAssess,grownAssess);
  const excess=Math.max(0,V0-(factoredAtDeath+p.prop19Cap));
  const assessedLive0=factoredAtDeath+excess;  /* Prop 19: only the excess is added to the factored base */
  const assessedRent0=V0;                      /* no exclusion -> full reassessment to market */
  const taxLive0=assessedLive0*p.taxRateA/100;
  const taxRent0=assessedRent0*p.taxRateA/100;
  const gap=taxRent0-taxLive0;

  /* --- year-1 carrying costs --- */
  const liveCarry1=p.insA+p.maintA+(p.waterA+p.elecA)*12;
  const rentGross=p.rentA*12;
  const rentNet1=rentGross*(1-p.vacancy/100-p.mgmt/100)-p.insA-p.maintA-p.waterA*0.6*12;
  /* Symmetric switch: either every dwelling choice is valued at its imputed
     rent, or none is (housing benefit valued at zero). Never one-sided. */
  const imputedA1=p.imputedRentOn?p.imputedRent*12:0;
  const imputedB1=p.imputedRentOn?p.imputedB*12:0;
  const b3Income1=p.rentB3*12*(1-p.vacancy/100-p.mgmt/100);

  /* --- terminal value of A --- */
  const VH=V0*Math.pow(1+g,H), netVH=VH*(1-p.sellCost/100);
  const cgRate=(p.fedLTCG+p.niit+p.caTop)/100;
  const bldgShare=0.80, deprPerYr=V0*bldgShare/27.5;

  function saleTax(price, basis, exclude121, depr){
    const gain=Math.max(0,price-basis);
    if(exclude121) return Math.max(0,gain-p.exclusion121)*cgRate;
    if(depr>0){
      const recap=Math.min(gain,depr);
      return recap*(0.25+p.niit/100)+Math.max(0,gain-recap)*cgRate;
    }
    return gain*cgRate;
  }

  /* --- 1 · LIVE in A (Prop 19), B's third unit optionally let --- */
  const liveNet = netVH - saleTax(VH,V0,true,0)
    + acc(imputedA1,rg,H,0)
    + (p.rentB3On?acc(b3Income1,rg,H,0):0)
    - accTax(assessedLive0,H,0) - acc(liveCarry1,infl,H,0);

  /* --- 2 · RENT A, heir occupies B's vacant unit --- */
  const rentTerminal = netVH - saleTax(VH,V0-deprPerYr*H,false,deprPerYr*H);
  const rentNet = rentTerminal
    + acc(imputedB1,rg,H,0) + acc(rentNet1,rg,H,0)
    - accTax(assessedRent0,H,0);

  /* --- 3 · SELL in the inheritance year, invest in stocks --- */
  const saleNow=V0*(1-p.sellCost/100)-saleTax(V0,V0,false,0); /* step-up: gain ≈ 0 */
  const lumpNet = saleNow*Math.pow(1+s,H) + acc(imputedB1,rg,H,0);

  /* --- 4 · SELL year 1, park in Treasuries 24–36 months, then phase into stocks --- */
  const m=p.phaseMonths/12;
  const phasedNet = saleNow*Math.pow(1+tY,m)*Math.pow(1+s,H-m) + acc(imputedB1,rg,H,0);

  /* --- 5 · LIVE 5 years, sell (§121), then invest --- */
  const V5=V0*Math.pow(1+g,5);
  const net5Terminal=V5*(1-p.sellCost/100)-saleTax(V5,V0,true,0);
  const net5 = (net5Terminal - accTax(assessedLive0,5,0) - acc(liveCarry1,infl,5,0)
      + acc(imputedA1,rg,5,0) + (p.rentB3On?acc(b3Income1,rg,5,0):0))
      * Math.pow(1+s,Math.max(0,H-5))
      + acc(imputedB1,rg,Math.max(0,H-5),5);

  /* --- 6 · RENT 5 years, sell (depreciation + 25% recapture), then invest --- */
  const net6 = (V5*(1-p.sellCost/100)-saleTax(V5,V0-deprPerYr*5,false,deprPerYr*5)
      + acc(rentNet1,rg,5,0) + acc(imputedB1,rg,5,0) - accTax(assessedRent0,5,0))
      * Math.pow(1+s,Math.max(0,H-5))
      + acc(imputedB1,rg,Math.max(0,H-5),5);

  /* --- 7 · SELL + §1031 replacement rental --- */
  const net7 = V0*(1-p.sellCost/100)*Math.pow(1+g,H)*0.94 + acc(imputedB1,rg,H,0);

  const rows=[
    {id:"live",  name:"Live in A (Prop 19) + B rented", net:liveNet, liq:"Illiquid",
     note:"Imputed rent of A counted; lowest property tax; §121 still available later"},
    {id:"rent",  name:"Rent A + heir lives in B's vacant unit", net:rentNet, liq:"Illiquid",
     note:"Full reassessment; depreciation now, 25% recapture on sale"},
    {id:"lump",  name:"Sell year 1 → lump-sum stocks", net:lumpNet, liq:"Liquid",
     note:"Gain ≈ $0 at step-up; full crash-entry exposure"},
    {id:"phased",name:"Sell year 1 → Treasuries 24–36 mo → stocks", net:phasedNet, liq:"Liquid (staged)",
     note:"Softens a 1929/2008-style entry; carries reinvestment risk"},
    {id:"live5", name:"Live 5 yrs → sell (§121) → invest", net:net5, liq:"Liquid after year 5",
     note:"Mixed path; uses the $500,000 exclusion"},
    {id:"rent5", name:"Rent 5 yrs → sell (recapture) → invest", net:net6, liq:"Liquid after year 5",
     note:"Mixed path; depreciation lowers basis, recapture applies"},
    {id:"x1031", name:"Sell + §1031 replacement rental", net:net7, liq:"Illiquid",
     note:"Deferral only — capital stays concentrated in real estate"}
  ];
  return {rows, homeAtH:VH, taxLive0, taxRent0, assessedLive0, assessedRent0,
          factoredAtDeath, excess, gap, netVH};
}

/* ---------- Distribution chart (seeded, reproducible) ---------- */
/* Simulates the SAME sale proceeds under two staging policies so the
   crash-entry benefit and the reinvestment risk are both visible. */
function simulate(p){
  const H=p.horizon, N=800, m=p.phaseMonths/12;
  const cash=p.valueA0*(1-p.sellCost/100);
  const rnd=mulberry32(20261125);
  const lump=[], phased=[];
  for(let i=0;i<N;i++){
    let wL=cash, wP=cash;
    for(let y=0;y<H;y++){
      let r=(rnd()+rnd()+rnd()-1.5)/1.5*p.stockReturn/100 + 0.015;
      if(rnd()<0.07) r=-0.30-rnd()*0.32;          /* ~7%/yr chance of a crash year */
      const tr=(y<m)? p.treasuryYield/100 : r;     /* phased: parked first */
      wL*=Math.max(0.05,1+r);
      wP*=Math.max(0.05,1+tr);
    }
    lump.push(wL); phased.push(wP);
  }
  lump.sort((a,b)=>a-b); phased.sort((a,b)=>a-b);
  const q=(a,f)=>a[Math.floor(N*f)];
  return {
    lump:{p10:q(lump,.10),p50:q(lump,.50),p90:q(lump,.90),arr:lump},
    phased:{p10:q(phased,.10),p50:q(phased,.50),p90:q(phased,.90),arr:phased},
    N, m
  };
}

function drawDist(p, canvas){
  const sim=simulate(p), H=p.horizon;
  const ctx=canvas.getContext("2d"), dpr=2;
  const cssW=canvas.clientWidth||900, W=cssW*dpr, Hh=340*dpr;
  canvas.width=W; canvas.height=Hh;
  ctx.clearRect(0,0,W,Hh);

  const all=sim.lump.arr.concat(sim.phased.arr);
  const min=all[0], max=all[all.length-1], bins=32;
  const hist=a=>{const c=new Array(bins).fill(0);
    a.forEach(v=>{const b=Math.min(bins-1,Math.floor((v-min)/(max-min+1)*bins));c[b]++;});return c;};
  const hl=hist(sim.lump.arr), hp=hist(sim.phased.arr);
  const cmax=Math.max(...hl,...hp);
  const plotW=W-100, plotH=Hh-90, x0=60, y0=Hh-50;

  /* bars: lump (blue) behind, phased (green) in front, semi-transparent */
  const bw=plotW/bins;
  ctx.globalAlpha=0.55;
  hl.forEach((c,i)=>{const h=(c/cmax)*plotH; ctx.fillStyle="#1f5fa8";
    ctx.fillRect(x0+i*bw,y0-h,Math.max(1,bw-2),h);});
  hp.forEach((c,i)=>{const h=(c/cmax)*plotH; ctx.fillStyle="#0e7a5f";
    ctx.fillRect(x0+i*bw+2,y0-h,Math.max(1,bw-4),h);});
  ctx.globalAlpha=1;

  /* median markers */
  const px=v=>x0+((v-min)/(max-min+1))*plotW;
  ctx.fillStyle="#b91c1c";
  ctx.fillRect(px(sim.lump.p50)-1,y0-plotH,3,plotH);
  ctx.fillStyle="#0b5c47";
  ctx.fillRect(px(sim.phased.p50)-1,y0-plotH,3,plotH);

  ctx.fillStyle="#1a2233";
  ctx.font=(13*dpr)+"px -apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText("Simulated proceeds after "+H+" years — "+sim.N+" seeded paths, crash years included",x0,22*dpr);
  ctx.fillStyle="#1f5fa8";
  ctx.fillText("■ Lump-sum stocks",x0,42*dpr);
  ctx.fillStyle="#0e7a5f";
  ctx.fillText("■ Phased: Treasuries "+Math.round(sim.m*12)+" mo → stocks",x0+180*dpr,42*dpr);
  ctx.fillStyle="#5b6577";
  ctx.fillText(fmt(min),x0,y0+16*dpr);
  ctx.fillText(fmt(max),x0+plotW-70*dpr,y0+16*dpr);
  return sim;
}

function distSummary(sim, el){
  const pct=(a,b)=>((a/b-1)*100).toFixed(1)+"%";
  el.innerHTML=`
  <table>
    <thead><tr><th>Policy</th><th class="num">10th percentile</th><th class="num">Median</th><th class="num">90th percentile</th><th class="num">Spread (90th–10th)</th></tr></thead>
    <tbody>
      <tr><td>Lump-sum stocks at sale</td><td class="num">${fmt(sim.lump.p10)}</td><td class="num">${fmt(sim.lump.p50)}</td><td class="num">${fmt(sim.lump.p90)}</td><td class="num">${fmt(sim.lump.p90-sim.lump.p10)}</td></tr>
      <tr class="alt"><td>Phased (Treasuries ${Math.round(sim.m*12)} mo → stocks)</td><td class="num">${fmt(sim.phased.p10)}</td><td class="num">${fmt(sim.phased.p50)}</td><td class="num">${fmt(sim.phased.p90)}</td><td class="num">${fmt(sim.phased.p90-sim.phased.p10)}</td></tr>
      <tr><td><strong>Difference</strong></td><td class="num">${pct(sim.phased.p10,sim.lump.p10)}</td><td class="num">${pct(sim.phased.p50,sim.lump.p50)}</td><td class="num">${pct(sim.phased.p90,sim.lump.p90)}</td><td class="num">—</td></tr>
    </tbody>
  </table>
  <p class="note"><strong>Reinvestment risk sits in the median column:</strong> phasing usually costs a little
  when markets rise (negative median difference). <strong>Crash protection sits in the 10th percentile column:</strong>
  phasing usually avoids the worst outcomes. That trade-off is the whole point of the black-swan test.</p>`;
}

/* ---------- UI wiring ---------- */
function readInputs(){
  const p={...DEFAULTS};
  ["inheritYear","horizon","homeGrowth","stockReturn","treasuryYield","inflation",
   "rentA","rentGrowth","taxRateA","taxRateB","imputedRent","phaseMonths",
   "maintA","maintB","insA","insB","sellCost","caTop","fedLTCG","niit","imputedB","rentB3"].forEach(k=>{
    const el=$(k); if(el) p[k]=parseFloat(el.value);
  });
  p.imputedRentOn=$("imputedRentOn")?$("imputedRentOn").checked:true;
  p.rentB3On=$("rentB3On")?$("rentB3On").checked:true;
  p.exclusion121=$("exclusion121")?parseFloat($("exclusion121").value):500000;
  return p;
}
let baselineTop=null;
function render(){
  const p=readInputs();
  const mid=project(p,"mid"), low=project(p,"low"), high=project(p,"high");
  const tbody=$("cmpBody");
  if(tbody){
    tbody.innerHTML="";
    mid.rows.forEach((r,i)=>{
      const tr=document.createElement("tr");
      if(i%2)tr.className="alt";
      tr.innerHTML=`<td>${r.name}</td><td class="num">${fmt(low.rows[i].net)}</td>
        <td class="num"><strong>${fmt(r.net)}</strong></td><td class="num">${fmt(high.rows[i].net)}</td>
        <td>${r.note}</td>`;
      tbody.appendChild(tr);
    });
  }
  const top=[...mid.rows].sort((a,b)=>b.net-a.net)[0];
  const moved=$("moved");
  if(moved){
    if(baselineTop===null){baselineTop=top.id; moved.innerHTML=`Baseline top path: <strong>${top.name}</strong>. Move a control to test whether the recommendation moves.`;}
    else moved.innerHTML=`Top path now: <strong>${top.name}</strong>. Recommendation moved: <strong>${top.id!==baselineTop?"YES — changed from baseline":"NO — same as baseline"}</strong>.`;
  }
  const d=$("distCanvas");
  if(d){ const sim=drawDist(p,d); const ds=$("distSummary"); if(ds) distSummary(sim,ds); }
  const tl=$("taxLive"), tr=$("taxRent"), tg=$("taxGap");
  if(tl) tl.textContent=fmt(mid.taxLive0);
  if(tr) tr.textContent=fmt(mid.taxRent0);
  if(tg) tg.textContent=fmt(mid.gap)+"/yr";
  const k=$("kpis");
  if(k) k.innerHTML=`
    <div class="card"><div class="kpi">${fmt(mid.homeAtH)}<small>Property A value at horizon (mid case)</small></div></div>
    <div class="card"><div class="kpi">${fmt(mid.taxLive0)}<small>Year-1 property tax if Prop 19 live path</small></div></div>
    <div class="card"><div class="kpi">${fmt(mid.taxRent0)}<small>Year-1 property tax if rented (reassessed)</small></div></div>
    <div class="card"><div class="kpi">${fmt(mid.gap)}<small>Year-1 property-tax gap: rent vs live path</small></div></div>`;
  ["inheritYear","horizon","homeGrowth","stockReturn","treasuryYield","inflation","rentA","rentGrowth",
   "taxRateA","taxRateB","imputedRent","imputedB","rentB3","phaseMonths","maintA","maintB","insA","insB","sellCost","caTop","fedLTCG","niit"]
   .forEach(k=>{const o=$(k+"Out"); if(o&&$(k)) o.textContent=$(k).value;});
}
if(typeof module!=="undefined"&&module.exports){module.exports={project,DEFAULTS};}
if(typeof document!=="undefined")document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("input[type=range],input[type=checkbox],input[type=number]").forEach(el=>{
    el.addEventListener("input",render);
  });
  const reset=$("resetBtn");
  if(reset) reset.addEventListener("click",()=>{
    Object.keys(DEFAULTS).forEach(k=>{const el=$(k); if(el&&typeof DEFAULTS[k]==="number") el.value=DEFAULTS[k];});
    const c=$("imputedRentOn"); if(c)c.checked=true;
    const c2=$("rentB3On"); if(c2)c2.checked=true;
    baselineTop=null; render();
  });
  render();
});
})();
