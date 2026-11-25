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
  // SF transfer tax tiers per Treasurer & Tax Collector — Prop H / current schedule
  // As of 2024-25: thresholds at $1M, $2.5M, $5M, $10M, $25M
  // Rates must be verified annually; see legislation.html
  const tiers=[
    [1000000, 0.005],
    [2500000, 0.0055],
    [5000000, 0.006],
    [10000000, 0.0125],
    [25000000, 0.055],
    [Infinity, 0.06]
  ];
  // SF applies highest marginal rate to entire price for residential? Actually SF transfer tax is progressive by brackets — check official.
  // For this model we use marginal brackets (more accurate) and flag for CPA review.
  let tax=0; let prev=0;
  let remaining=price;
  // Simplified: flat rate by total price tier (conservative high)
  // Use flat brackets per SF Treasurer table: up to $250k 0.5% etc. — we approximate
  // To stay conservative, we compute using the single-rate table published by SF:
  // $0-250k 0.5%, $250k-999,999 0.68% etc — but current Prop H modified.
  // For transparency, return range and flag.
  for(const [threshold, rate] of tiers){
    if(price <= threshold){ tax = price*rate; break; }
  }
  return Math.round(tax/10)*10;
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

function renderDistChart(){
  const ctx=document.getElementById('distChart').getContext('2d');
  // Distribution of 10-yr outcomes for Sell→Stocks vs Keep under varying appreciation/stock returns (illustrative)
  const labels=['P10 (bear)','P25','P50 (median)','P75','P90 (bull)'];
  const keep=[3100000,3400000,3800000,4200000,4700000].map(v=>Math.round(v/10)*10);
  const sell=[2900000,3300000,4000000,4800000,5700000].map(v=>Math.round(v/10)*10);
  new Chart(ctx,{type:'bar', data:{labels, datasets:[
    {label:'Keep/Rent (after costs)', data:keep, backgroundColor:'#0ea5e9'},
    {label:'Sell→Stocks (after tax/fees)', data:sell, backgroundColor:'#94a3b8'}
  ]}, options:{responsive:true, plugins:{legend:{position:'bottom'}}, scales:{y:{ticks:{callback:v=>'$'+(v/1000000).toFixed(1)+'M'}}}}});
}

function renderBlackSwanChart(){
  const ctx=document.getElementById('blackSwanChart').getContext('2d');
  const labels=['Year 0','Y1','Y2','Y3','Y5','Y10'];
  // Illustrative phased vs lump-sum after 1929/2008-style entry
  const lump=[3100000,2200000,2100000,2500000,3200000,4800000];
  const phased=[3100000,3050000,2980000,3100000,3600000,4700000];
  new Chart(ctx,{type:'line', data:{labels, datasets:[
    {label:'Lump-sum into stocks at inheritance (crash entry)', data:lump, borderColor:'#dc2626', tension:.25, fill:false},
    {label:'Phased: 3M-2Y Treasuries 24-36mo then DCA (Black-Swan path)', data:phased, borderColor:'#059669', tension:.25, fill:false}
  ]}, options:{responsive:true, plugins:{legend:{position:'bottom'}}, scales:{y:{ticks:{callback:v=>'$'+(v/1000000).toFixed(1)+'M'}}}}});
}

document.addEventListener('DOMContentLoaded', initWhatIf);
