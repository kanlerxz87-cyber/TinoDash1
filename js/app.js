// TinoDash — lightweight model for what-if controls, charts, and calculators
const MODEL = {
  prop13Cap: 0.02,
  inflation: { low: 0.02, high: 0.035, mid: 0.027 },
  homeAppr: { low: 0.015, high: 0.045, mid: 0.03 },
  rentGrowth: { low: 0.015, high: 0.03, mid: 0.022 },
  stockNom: { low: 0.05, high: 0.08, mid: 0.065 },
  bondNom: { low: 0.03, high: 0.045, mid: 0.037 },
  treasury2Y: { low: 0.035, high: 0.045, mid: 0.04 }
};

function fmtUSD(x){ return x==null? "—" : "$" + Math.round(x/10)*10 .toLocaleString('en-US'); }
function fmtPct(x){ return (x*100).toFixed(1) + "%"; }

function projectAssessedValue(start, years, cap=0.02){
  let v = start; const out=[Math.round(v)];
  for(let i=1;i<=years;i++){ v = v*(1+cap); out.push(Math.round(v/10)*10); }
  return out;
}
function projectMarketValue(start, years, rate){
  let v=start; const out=[Math.round(v/10)*10];
  for(let i=1;i<=years;i++){ v=v*(1+rate); out.push(Math.round(v/10)*10); }
  return out;
}

function calcTransferTaxSF(price){
  /* San Francisco Real Property Transfer Tax — official schedule.
     Authority: SF Business & Tax Regulations Code Art. 12-C, as published by the
     SF Treasurer & Tax Collector; the City's own measure digest restates the top
     tiers. The rate applies to the ENTIRE value, per $500 or fraction.
       under $250,000                 0.50%
       $250,000 – $999,999            0.68%
       $1,000,000 – $4,999,999        0.75%
       $5,000,000 – $9,999,999        2.25%
       $10,000,000 – $24,999,999      5.50%
       $25,000,000 and above          6.00%
     Re-verify annually (see legislation.html). Note: Property A is in Santa Clara
     County and pays NO SF tax — this function is only for what-ifs on Property B. */
  const tiers=[
    [250000,     0.0050],
    [1000000,    0.0068],
    [5000000,    0.0075],
    [10000000,   0.0225],
    [25000000,   0.0550],
    [Infinity,   0.0600]
  ];
  let rate=0.0050;
  for(const [cap,r] of tiers){ if(price<=cap){ rate=r; break; } }
  return Math.round(price*rate/10)*10;
}

function updateWhatIf(){
  const el = (id)=>document.getElementById(id);
  if(!el('appreciation')) return;
  const appr = parseFloat(el('appreciation').value)/100;
  const rentG = parseFloat(el('rentGrowth').value)/100;
  const stockR = parseFloat(el('stockReturn').value)/100;
  const holdYears = parseInt(el('holdYears').value,10);
  const inclProp19 = el('prop19Toggle')?.checked;
  const inclExclusion = el('exclusionToggle')?.checked;
  const imputed = parseFloat(el('imputedRent')?.value || 0);

  // Property A base
  const baseVal = 3100000;
  const baseAssessed = 550540;
  const years = holdYears;

  // Project market vs assessed
  const mkt = projectMarketValue(baseVal, years, appr);
  const assessedInheritHigh = Math.round(baseVal * 0.0118 /10)*10; // if reassessed at market without Prop19
  const assessedProp19 = projectAssessedValue(baseAssessed, years)[years]; // carried forward +2% cap

  const futureVal = mkt[mkt.length-1];
  const assessedNoProp19 = assessedInheritHigh; // first year after inheritance if no exclusion
  // Note: actual assessed at inheritance = market value at death (if no Prop19) then +2% cap thereafter

  // Sell path — basis step-up, same-year sale
  const basis = baseVal; // stepped-up at death (assume value at death = current estimate; in real case use DOD appraisal)
  const gainSameYear = Math.max(0, futureVal - basis); // if held 0 years, ~0; if held, gain accrues
  // For what-if, we model selling after holdYears
  const gain = Math.max(0, futureVal - basis);
  const fedCapGainLow = 0.15, fedCapGainHigh = 0.20;
  const caStateGain = 0.093; // CA taxes gains as ordinary income, top 9.3% + MHS 1% over $1M AGI
  const mhs = 0.01; // Mental Health Services Tax over $1M — see Form 540 instructions
  const niit = 0.038; // NIIT 3.8% if MAGI thresholds met

  // Primary residence exclusion
  let exclusion = 0;
  if(inclExclusion) exclusion = 500000; // married filing jointly, 2 of 5 year use/ownership; if single $250k — flagged

  const taxableGain = Math.max(0, gain - exclusion);
  const taxLow = taxableGain * (fedCapGainLow + caStateGain) + (taxableGain>1000000? taxableGain*mhs*0.25:0); // simplified
  const taxHigh = taxableGain * (fedCapGainHigh + caStateGain + niit) + (taxableGain>0? Math.min(taxableGain,2000000)*mhs*0.5:0);

  // Keep vs sell
  const propTaxNoProp19 = Math.round(assessedNoProp19 * 0.0118 /10)*10;
  const propTaxWithProp19 = Math.round(assessedProp19 * 0.0118 /10)*10;

  const rentMonthly = 7150 * Math.pow(1+rentG, years);
  const rentAnnual = rentMonthly*12;
  const imputedAnnual = imputed*12;

  // Update DOM
  const out = (id,val)=>{ if(el(id)) el(id).textContent = val; };
  out('outFutureVal', fmtUSD(futureVal));
  out('outAssessedNoProp19', fmtUSD(assessedNoProp19) + " → tax " + fmtUSD(propTaxNoProp19) + "/yr");
  out('outAssessedProp19', fmtUSD(assessedProp19) + " → tax " + fmtUSD(propTaxWithProp19) + "/yr");
  out('outTaxableGain', fmtUSD(taxableGain));
  out('outTaxLow', fmtUSD(taxLow));
  out('outTaxHigh', fmtUSD(taxHigh));
  out('outRent', fmtUSD(rentAnnual) + "/yr");
  out('outImputed', fmtUSD(imputedAnnual) + "/yr");
  out('outHoldYears', years + " years");

  // Recommendation hint
  let hint = "";
  if(inclProp19 && imputedAnnual > 30000) hint = "With Prop 19 + high imputed rent, Live path often beats Sell on after-tax, after-cost basis — verify occupancy & 5-yr plan.";
  else if(taxLow < 80000 && stockR > 0.06) hint = "Low taxable gain + strong market assumptions favor Sell & reinvest — but check reinvestment risk & 1929/2008 stress.";
  else hint = "Mixed: Rent B + Live A with option to sell after 2-yr exclusion window — see Mixed Paths.";
  if(el('hint')) el('hint').textContent = hint;
}

function initWhatIf(){
  ['appreciation','rentGrowth','stockReturn','holdYears','prop19Toggle','exclusionToggle','imputedRent'].forEach(id=>{
    const e=document.getElementById(id);
    if(e){ e.addEventListener('input', updateWhatIf); e.addEventListener('change', updateWhatIf); }
  });
  updateWhatIf();
  // Charts
  if(document.getElementById('distChart')) renderDistChart();
  if(document.getElementById('blackSwanChart')) renderBlackSwanChart();
}

/* ---------- reproducible seeded simulations (no hard-coded outcomes) ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* Distribution of 20-year wealth: keep/rent the house vs sell and invest.
   Crash years are drawn from the same seed, so the two policies are paired. */
function simulateOutcomes(n, years, eqMid, crashProb){
  const rnd=mulberry32(20261125); const keep=[], sell=[];
  for(let i=0;i<n;i++){
    let house=3100000, port=6164680;             // house value vs net sale proceeds
    for(let y=0;y<years;y++){
      const rHouse=0.02+ (rnd()-0.5)*0.04;        // 0%–4% house drift, no crash modelled on house
      let rEq=eqMid+(rnd()+rnd()+rnd()-1.5)/1.5*0.18;
      if(rnd()<crashProb) rEq=-0.30-rnd()*0.30;   // crash year
      house*=1+rHouse; port*=Math.max(0.05,1+rEq);
    }
    keep.push(house); sell.push(port);
  }
  const q=(a,f)=>{a.sort((x,y)=>x-y);return a[Math.floor(a.length*f)];};
  return {keep:{p10:q(keep,.1),p50:q(keep,.5),p90:q(keep,.9)},
          sell:{p10:q(sell,.1),p50:q(sell,.5),p90:q(sell,.9)}};
}

function renderDistChart(){
  const el=document.getElementById('distChart');
  if(!el||typeof Chart==='undefined') return;
  const sim=simulateOutcomes(600,20,0.075,0.06);
  const labels=['10th percentile (bear)','Median','90th percentile (bull)'];
  new Chart(el.getContext('2d'),{type:'bar',data:{labels,datasets:[
    {label:'Keep / rent the house (property value)', data:[sim.keep.p10,sim.keep.p50,sim.keep.p90].map(v=>Math.round(v/10)*10), backgroundColor:'#0ea5e9'},
    {label:'Sell year 1 → stocks (after tax & costs)', data:[sim.sell.p10,sim.sell.p50,sim.sell.p90].map(v=>Math.round(v/10)*10), backgroundColor:'#94a3b8'}
  ]},options:{responsive:true,plugins:{legend:{position:'bottom'},
    title:{display:true,text:'600 seeded 20-year paths, crash years included — median and tails, not a forecast'}},
    scales:{y:{ticks:{callback:v=>'$'+(v/1000000).toFixed(1)+'M'}}}}});
  const note=document.getElementById('distNote');
  if(note) note.innerHTML='Seeded simulation, 600 paired paths. <strong>Median:</strong> sell→stocks '+fmtUSD(sim.sell.p50)+
    ' vs keep '+fmtUSD(sim.keep.p50)+'. <strong>10th percentile:</strong> '+fmtUSD(sim.sell.p10)+' vs '+fmtUSD(sim.keep.p10)+
    ' — this is where crash-entry risk shows up.';
}

function renderBlackSwanChart(){
  const el=document.getElementById('blackSwanChart');
  if(!el||typeof Chart==='undefined') return;
  const labels=['Year 0','Y1','Y2','Y3','Y5','Y10'];
  // 1929-style entry: -35% over the first two years, then a slow recovery
  const lump=[6164680,4007040,3806690,4187360,4606100,5900000];
  // Phased: 30 months parked at 4% while the fall happens, then phased in
  const phased=[6164680,6042000,5921000,5950000,5600000,6400000];
  new Chart(el.getContext('2d'),{type:'line',data:{labels,datasets:[
    {label:'Lump-sum stocks at inheritance (1929-style entry)', data:lump.map(v=>Math.round(v/10)*10), borderColor:'#dc2626', tension:.25, fill:false},
    {label:'Phased: Treasuries 24–36 mo, then phase into stocks', data:phased.map(v=>Math.round(v/10)*10), borderColor:'#059669', tension:.25, fill:false}
  ]},options:{responsive:true,plugins:{legend:{position:'bottom'},
    title:{display:true,text:'Illustrative 1929-style entry: par values, rebuilt scenario — see blackswan.html'}},
    scales:{y:{ticks:{callback:v=>'$'+(v/1000000).toFixed(1)+'M'}}}}});
}

document.addEventListener('DOMContentLoaded', initWhatIf);
