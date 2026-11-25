import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_INPUTS,
  roundTo10,
  computeCaEffectiveMarginalRate,
  computeFederalCapGainTax,
  computeSfTransferTax,
  computeCupertinoTransferAndClosingCosts,
  computeSfPropHParcelTax,
  projectProp19Allowance,
  runComparisonModel,
  runMonteCarloDistribution
} from '../assets/js/model.js';

test('roundTo10 enforces nearest $10 rounding', () => {
  assert.equal(roundTo10(123456), 123460);
  assert.equal(roundTo10(9876), 9880);
  assert.equal(roundTo10(45421), 45420);
  assert.equal(roundTo10(3214), 3210);
});

test('CA Form 540 marginal tax reflects 1% Behavioral Health Services Tax over $1M', () => {
  const rateUnder = computeCaEffectiveMarginalRate(200000, 300000, 13.3);
  const rateOver = computeCaEffectiveMarginalRate(900000, 1000000, 13.3);
  assert.ok(rateUnder < 0.123, 'Under $1M gain should be below 12.3%');
  assert.ok(rateOver > 0.128 && rateOver <= 0.133, 'Gain crossing $1M triggers +1% surtax up to 13.3%');
});

test('Federal capital gains includes 25% §1250 recapture and 3.8% NIIT', () => {
  const tax = computeFederalCapGainTax({
    gain: 600000,
    ordinaryIncome: 300000,
    filingStatus: 'mfj',
    includeNiit: true,
    unrecaptured1250Gain: 100000
  });
  // §1250 = 25k; LTCG 15%/20% + 3.8% NIIT on 700k = significant positive tax
  assert.ok(tax > 140000);
});

test('SF Transfer tax jumps to 2.25% at $5M threshold while Cupertino has $0 city tax', () => {
  assert.equal(computeSfTransferTax(1800000), 1800000 * 0.0075);
  assert.equal(computeSfTransferTax(5200000), 5200000 * 0.0225);
  const scc = computeCupertinoTransferAndClosingCosts(3100000, 5.5);
  assert.equal(scc.cupertinoCityTax, 0);
  assert.equal(Math.round(scc.countyTransferTax), 3410);
});

test('SF Prop H Muni Parcel Tax starts July 2027 and scales above 5,000 sqft', () => {
  assert.equal(computeSfPropHParcelTax(2026, 6000, false), 0);
  assert.equal(computeSfPropHParcelTax(2027, 4000, false), 249);
  assert.equal(computeSfPropHParcelTax(2027, 4000, true), 0); // $249 senior deduction
  assert.equal(computeSfPropHParcelTax(2027, 7000, false), 249 + 2000 * 0.195);
});

test('Prop 19 allowance carries forward when HPI indexing enabled', () => {
  const sameYear = projectProp19Allowance(2026, 3.5, true);
  const year2042 = projectProp19Allowance(2042, 3.5, true);
  assert.equal(sameYear, 1044586);
  assert.ok(year2042 > 1800000);
});

test('Full 6-path comparison returns apples-to-apples outputs & reinvestment risk metrics', () => {
  const res = runComparisonModel(DEFAULT_INPUTS);
  assert.equal(res.paths.length, 6);
  const live = res.paths.find((p) => p.id === 'live-prop19');
  const sell = res.paths.find((p) => p.id === 'sell-immediate');
  const phased = res.paths.find((p) => p.id === 'mixed-phased-staging');
  const mixed121 = res.paths.find((p) => p.id === 'mixed-live-then-sell');

  assert.equal(live.prop19Applied, true);
  assert.equal(sell.prop19Applied, false);
  assert.equal(sell.startingPropAAssessed, 0);
  const rent = res.paths.find((p) => p.id === 'rent-hold');
  assert.ok(live.startingPropAAssessed < rent.startingPropAAssessed, 'Prop 19 reduces initial Cupertino assessed base');
  assert.ok(live.cumulativeImputedHousing > 0, 'Living path must compute imputed rent');
  assert.ok(mixed121.cumulativeOmiCosts > 0, 'Mixed live-then-sell returning to B3 prices OMI costs');
  assert.ok(phased.reinvestmentRiskDollars >= 0, 'Phased staging reports reinvestment risk');
  assert.ok(Number.isFinite(phased.opportunityDragVsLumpSum));
});

test('1929 and 2008 Black Swan regimes surface 3M T-bill reinvestment risk higher than 2Y ladder', () => {
  const crash3m = runComparisonModel({
    macroRegimeId: '2008-gfc-lost-decade',
    stagingInstrument: '3m-tbill',
    stagingMonths: 36
  });
  const crash2y = runComparisonModel({
    macroRegimeId: '2008-gfc-lost-decade',
    stagingInstrument: '2y-ladder',
    stagingMonths: 36
  });
  const p3m = crash3m.paths.find((p) => p.id === 'mixed-phased-staging');
  const p2y = crash2y.paths.find((p) => p.id === 'mixed-phased-staging');
  assert.ok(p3m.reinvestmentRiskDollars > p2y.reinvestmentRiskDollars);
});

test('Monte Carlo distribution returns monotonic P10 <= P50 <= P90', () => {
  const dist = runMonteCarloDistribution(DEFAULT_INPUTS, 120);
  for (const key of Object.keys(dist)) {
    const d = dist[key];
    assert.ok(d.p10 <= d.p25 && d.p25 <= d.p50 && d.p50 <= d.p75 && d.p75 <= d.p90);
  }
});
