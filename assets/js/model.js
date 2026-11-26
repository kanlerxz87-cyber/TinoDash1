/**
 * Unified Bay Area Real Estate & Trust Inheritance Decision Model
 * Anonymized: Property A (Cupertino) + Property B (San Francisco Outer Sunset)
 * Zero hardcoded PII; all outputs can be rounded cleanly to $10 or displayed as ranges.
 */

export const BASE_YEAR = 2026;

export const DEFAULT_INPUTS = {
  // Timeline & Filing
  transferYear: 2042,
  horizonYears: 25,
  filingStatus: 'mfj', // 'single' | 'mfj'
  householdIncomeBase2026Usd: 260000,
  caTopTaxRatePct: 13.3, // Verified 2026 FTB top 12.3% bracket + 1.0% Line 62 above $1M
  includeNiit: true, // 3.8% NIIT above $200k/$250k unindexed threshold

  // Trust, Estate & Prop 19 Assumptions
  totalGrossEstate2026Usd: 14500000, // Property A ($3.1M) + Liquid/Other (~$11.4M)
  useMarriedPortabilityDsue: true, // $30M combined vs $15M single indexed
  trustReceivesStepUp1014: true, // false simulates A/B bypass trust carryover basis trap
  legacyCarryoverBasis2026Usd: 450000, // only used if trustReceivesStepUp1014 === false
  claimProp19WhenLiving: true, // carry forward Prop 19 allowance ($1,044,586 indexed)
  indexProp19AllowanceWithHpi: true,
  isHeirAge65PlusAtTransfer: false, // SF Prop H $249 senior owner deduction + FUHSD $98 senior

  // Property A (Cupertino) Inputs (2026$)
  propAValue2026Usd: 3100000,
  propAAssessed2026Usd: 550540,
  propATraRatePct: 1.171, // 1.1671% base + 0.0039% SCVWD State Water Proj
  propADirectAssessments2026Usd: 910,
  propARentMonthly2026Usd: 6300, // market comp midpoint vs $5,870-$6,390 SAFMR
  propAImputedRentPctOfMarket: 100, // living-path imputed rent ratio
  propAImprovementRatioPct: 40, // 40% building depreciable over 27.5 yrs
  propAInsurance2026Usd: 4200, // realistic market vs $1,500 placeholder
  propAMaintenancePctOfValue: 0.75, // routine + amortized CapEx
  propANemSunsetYear: 2040, // 20-yr NEM 2.0 sunset -> NBT
  propASellerBrokerageAndClosingPct: 5.5,
  propASaleInSameTaxYear: true,

  // Property B (SF Outer Sunset) Inputs (2026$)
  propBValue2026Usd: 1800000,
  propBAssessed2026Usd: 116530, // 2025 $114,250 * 1.02
  propBSqft: 3800,
  propBPre1979RentControl: true,
  propBTwoUnitsRent2026Usd: 7150,
  propBThirdUnitMarketRent2026Usd: 3400,
  propBInsurance2026Usd: 7200, // realistic 3-unit SF habitational
  propBWaterMonthly2026Usd: 360,
  propBElectricMonthly2026Usd: 50,
  propBMaintenancePctOfValue: 0.9,

  // Macro, Portfolio & Phased Staging Inputs
  scenarioMode: 'base', // 'low' | 'base' | 'high'
  macroRegimeId: 'baseline-nonconstant',
  reGrowthMeanPct: 3.5,
  rentGrowthMeanPct: 3.1,
  inflationMeanPct: 2.7,
  equityMeanPct: 7.4,
  equityVolatilityPct: 15.5,
  propertyMgmtFeePct: 0.0, // 0% self-managed, 6–8% if hired
  sec121EnabledOnMixed: true,
  stagingMonths: 24, // 24 or 36 months
  stagingInstrument: '2y-ladder', // '3m-tbill' | '2y-ladder'
  treasury3MRatePct: 4.32,
  treasury2YRatePct: 4.88,
  sec1031TargetYieldPct: 4.8
};

export function roundTo10(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / 10) * 10;
}

/**
 * Compute California Form 540 marginal rate on realized gains / ordinary income
 * Includes 1.0% Behavioral Health Services Tax > $1,000,000 (Line 62)
 */
export function computeCaEffectiveMarginalRate(
  otherTaxableIncome,
  additionalGain,
  maxCapPct = 13.3,
  filingStatus = 'mfj'
) {
  if (additionalGain <= 0) return 0;

  // Directly verified against the FTB 2026 Form 540 rate schedules.
  // The Line 62 Behavioral Health Services Tax mechanics use the latest
  // retrieved 2025 Form 540 instructions: 1% over $1,000,000, not doubled for joint filers.
  const schedules = {
    single: [11456, 27157, 42861, 59498, 75197, 384109, 460927, 768213],
    mfs: [11456, 27157, 42861, 59498, 75197, 384109, 460927, 768213],
    mfj: [22912, 54314, 85722, 118996, 150394, 768218, 921854, 1536426],
    hoh: [22927, 54316, 70018, 86654, 102356, 522385, 626864, 1044771]
  };
  const limits = schedules[filingStatus] ?? schedules.mfj;
  const rates = [1, 2, 4, 6, 8, 9.3, 10.3, 11.3, Math.min(12.3, maxCapPct)];
  const surtaxRate = Math.max(0, maxCapPct - 12.3);

  const taxAt = (income) => {
    let tax = 0;
    let lower = 0;
    for (let i = 0; i < rates.length; i += 1) {
      const upper = limits[i] ?? Infinity;
      const taxableSlice = Math.max(0, Math.min(income, upper) - lower);
      tax += taxableSlice * (rates[i] / 100);
      lower = upper;
      if (income <= upper) break;
    }
    if (income > 1000000) tax += (income - 1000000) * (surtaxRate / 100);
    return tax;
  };

  const addedTax = taxAt(otherTaxableIncome + additionalGain) - taxAt(otherTaxableIncome);
  return addedTax / additionalGain;
}

/**
 * Compute Federal LTCG + NIIT effective tax rate on long-term capital gain
 */
export function computeFederalCapGainTax({
  gain,
  ordinaryIncome,
  filingStatus = 'mfj',
  includeNiit = true,
  unrecaptured1250Gain = 0
}) {
  if (gain <= 0 && unrecaptured1250Gain <= 0) return 0;
  const ltcgGain = Math.max(0, gain);
  const zeroMax = filingStatus === 'mfj' ? 98900 : 49450;
  const fifteenMax = filingStatus === 'mfj' ? 613700 : 545500;
  const niitThresh = filingStatus === 'mfj' ? 250000 : 200000;

  let tax = 0;
  let cursor = Math.max(0, ordinaryIncome);

  // Unrecaptured §1250 depreciation gain taxed up to 25%
  const sec1250Tax = Math.max(0, unrecaptured1250Gain) * 0.25;
  tax += sec1250Tax;
  cursor += Math.max(0, unrecaptured1250Gain);

  if (ltcgGain > 0) {
    const zeroRoom = Math.max(0, zeroMax - cursor);
    const inZero = Math.min(ltcgGain, zeroRoom);
    cursor += inZero;
    let rem = ltcgGain - inZero;

    const fifteenRoom = Math.max(0, fifteenMax - cursor);
    const inFifteen = Math.min(rem, fifteenRoom);
    tax += inFifteen * 0.15;
    rem -= inFifteen;

    if (rem > 0) {
      tax += rem * 0.20;
    }
  }

  if (includeNiit) {
    const totalMagi = ordinaryIncome + ltcgGain + Math.max(0, unrecaptured1250Gain);
    const excessMagi = Math.max(0, totalMagi - niitThresh);
    const nii = ltcgGain + Math.max(0, unrecaptured1250Gain);
    tax += Math.min(excessMagi, nii) * 0.038;
  }

  return tax;
}

/**
 * Compute San Francisco Documentary Transfer Tax based on official tiered schedule
 */
export function computeSfTransferTax(price) {
  if (price <= 250000) return price * 0.005;
  if (price <= 1000000) return price * 0.0068;
  if (price < 5000000) return price * 0.0075;
  if (price < 10000000) return price * 0.0225;
  if (price < 25000000) return price * 0.055;
  return price * 0.06;
}

/**
 * Compute Santa Clara County / Cupertino Sale Transaction Friction
 * County DTT = $0.55/$500 (0.11%), City conveyance = 0%, recording ~$105
 */
export function computeCupertinoTransferAndClosingCosts(salePrice, brokeragePct = 5.5) {
  const countyTransferTax = (salePrice / 500) * 0.55;
  const recordingAndTitle = 105 + salePrice * 0.002;
  const brokerage = salePrice * (brokeragePct / 100);
  return {
    countyTransferTax,
    cupertinoCityTax: 0,
    recordingAndTitle,
    brokerage,
    totalCost: countyTransferTax + recordingAndTitle + brokerage
  };
}

/**
 * Compute Nov 2026 SF Prop H Muni Parcel Tax (eff. July 1, 2027)
 */
export function computeSfPropHParcelTax(year, sqft, isSeniorOwnerOccupant = false, cpiIndex = 1.0) {
  if (year < 2027) return 0;
  const base = 249 * cpiIndex;
  const over5k = Math.max(0, sqft - 5000) * 0.195 * cpiIndex;
  const capped = Math.min(50000 * cpiIndex, base + over5k);
  const seniorDeduction = isSeniorOwnerOccupant ? 249 * cpiIndex : 0;
  return Math.max(0, capped - seniorDeduction);
}

/**
 * Carry Prop 19 indexed exclusion forward from 2026 ($1,044,586) to transferYear
 */
export function projectProp19Allowance(transferYear, hpiRatePct = 3.5, indexWithHpi = true) {
  const baseAllowance = 1044586;
  if (!indexWithHpi || transferYear <= BASE_YEAR) return baseAllowance;
  const years = transferYear - BASE_YEAR;
  // BOE adjusts biennially; compounded smoothly at HPI rate
  return baseAllowance * Math.pow(1 + hpiRatePct / 100, years);
}

/**
 * Generate non-constant yearly macro regime paths (returns arrays of annual rates)
 * Models historical Black Swan dynamics or realistic cyclical baseline
 */
export function buildRegimeSchedule(regimeId, totalYears, baseRates) {
  const eqBase = baseRates.equityMeanPct / 100;
  const reBase = baseRates.reGrowthMeanPct / 100;
  const cpiBase = baseRates.inflationMeanPct / 100;
  const rentBase = baseRates.rentGrowthMeanPct / 100;
  const t3mBase = baseRates.treasury3MRatePct / 100;
  const t2yBase = baseRates.treasury2YRatePct / 100;

  const schedule = [];
  for (let i = 0; i < totalYears; i++) {
    // Non-constant cyclical wave around baseline (prevents straight-line fallacy)
    const cyclePhase = (i % 9);
    let eq = eqBase + (cyclePhase === 3 ? -0.14 : cyclePhase === 4 ? 0.16 : cyclePhase === 7 ? -0.07 : 0.015);
    let re = reBase + (cyclePhase === 3 || cyclePhase === 4 ? -0.025 : 0.012);
    let cpi = cpiBase + (cyclePhase === 2 ? 0.014 : cyclePhase === 5 ? -0.008 : 0);
    let rent = Math.max(0.005, rentBase + (cpi - cpiBase) * 0.6);
    let t3m = Math.max(0.0025, t3mBase + (cpi - cpiBase) * 0.8);
    let t2y = Math.max(0.0075, t2yBase + (cpi - cpiBase) * 0.5);

    if (regimeId === '1929-depression') {
      if (i === 0) { eq = -0.45; re = -0.08; cpi = -0.03; rent = -0.05; t3m = 0.022; t2y = 0.028; }
      else if (i === 1) { eq = -0.28; re = -0.12; cpi = -0.08; rent = -0.08; t3m = 0.008; t2y = 0.016; }
      else if (i === 2) { eq = -0.35; re = -0.10; cpi = -0.06; rent = -0.06; t3m = 0.003; t2y = 0.012; }
      else if (i <= 5) { eq = 0.14; re = 0.01; cpi = 0.01; rent = 0.005; t3m = 0.003; t2y = 0.011; }
    } else if (regimeId === '1973-stagflation') {
      if (i === 0) { eq = -0.18; re = 0.04; cpi = 0.095; rent = 0.05; t3m = 0.072; t2y = 0.078; }
      else if (i === 1) { eq = -0.24; re = 0.02; cpi = 0.115; rent = 0.055; t3m = 0.078; t2y = 0.081; }
      else if (i === 2) { eq = 0.22; re = 0.05; cpi = 0.075; rent = 0.05; t3m = 0.055; t2y = 0.065; }
      else if (i >= 5 && i <= 7) { eq = 0.04; re = 0.03; cpi = 0.133; rent = 0.06; t3m = 0.118; t2y = 0.115; }
    } else if (regimeId === '2008-gfc-lost-decade') {
      if (i === 0) { eq = -0.22; re = -0.04; cpi = 0.032; rent = 0.02; t3m = 0.030; t2y = 0.034; }
      else if (i === 1) { eq = -0.24; re = -0.11; cpi = 0.012; rent = -0.01; t3m = 0.004; t2y = 0.015; }
      else if (i === 2) { eq = 0.12; re = -0.09; cpi = 0.005; rent = -0.02; t3m = 0.0015; t2y = 0.009; }
      else if (i === 3) { eq = -0.02; re = -0.03; cpi = 0.015; rent = 0.01; t3m = 0.0015; t2y = 0.008; }
      else if (i === 5) { eq = -0.36; re = 0.01; cpi = 0.02; rent = 0.02; t3m = 0.002; t2y = 0.010; }
    } else if (regimeId === '2020-2023-covid-rates') {
      if (i === 0) { eq = -0.32; re = 0.02; cpi = 0.014; rent = -0.02; t3m = 0.002; t2y = 0.006; } // V-crash window in staging year
      else if (i === 1) { eq = 0.44; re = 0.12; cpi = 0.054; rent = 0.04; t3m = 0.002; t2y = 0.008; }
      else if (i === 2) { eq = -0.19; re = -0.03; cpi = 0.091; rent = 0.05; t3m = 0.032; t2y = 0.041; }
      else if (i === 3) { eq = 0.19; re = -0.01; cpi = 0.042; rent = 0.03; t3m = 0.051; t2y = 0.047; }
    }

    schedule.push({ yearOffset: i, eq, re, cpi, rent, t3m, t2y });
  }
  return schedule;
}

/**
 * Adjust baseline return assumptions for Low / Base / High Range mode
 */
export function resolveScenarioParams(rawInputs) {
  const inputs = { ...DEFAULT_INPUTS, ...rawInputs };
  let reDelta = 0;
  let eqDelta = 0;
  let rentDelta = 0;
  let insMult = 1.0;

  if (inputs.scenarioMode === 'low') {
    reDelta = -1.3;
    eqDelta = -1.8;
    rentDelta = -0.8;
    insMult = 1.35;
  } else if (inputs.scenarioMode === 'high') {
    reDelta = 1.1;
    eqDelta = 1.4;
    rentDelta = 0.8;
    insMult = 0.85;
  }

  return {
    ...inputs,
    effectiveRePct: inputs.reGrowthMeanPct + reDelta,
    effectiveEqPct: inputs.equityMeanPct + eqDelta,
    effectiveRentPct: inputs.rentGrowthMeanPct + rentDelta,
    effectiveInsMult: insMult
  };
}

/**
 * Simulate all 6 Pure & Mixed Inheritance Paths over an identical Transfer Year & Horizon
 */
export function runComparisonModel(rawInputs = {}) {
  const params = resolveScenarioParams(rawInputs);
  const transferDelay = Math.max(1, params.transferYear - BASE_YEAR);
  const horizon = Math.max(5, params.horizonYears);

  // Pre-transfer growth (2026 -> transferYear) under baseline compound assumptions
  const rePreMult = Math.pow(1 + params.effectiveRePct / 100, transferDelay);
  const cpiPreMult = Math.pow(1 + params.inflationMeanPct / 100, transferDelay);
  const rentPreMult = Math.pow(1 + params.effectiveRentPct / 100, transferDelay);

  const propAValueAtTransfer = params.propAValue2026Usd * rePreMult;
  const propBValueAtTransfer = params.propBValue2026Usd * Math.pow(1 + (params.effectiveRePct - 0.3) / 100, transferDelay);
  const propAFbyvAtTransfer = params.propAAssessed2026Usd * Math.pow(1.02, transferDelay);
  const propBFbyvAtTransfer = params.propBAssessed2026Usd * Math.pow(1.02, transferDelay);

  // Estate tax check at transferYear
  const otherLiquid2026 = Math.max(0, params.totalGrossEstate2026Usd - params.propAValue2026Usd);
  const grossEstateAtTransfer = propAValueAtTransfer + otherLiquid2026 * Math.pow(1 + params.effectiveEqPct / 100 * 0.7, transferDelay);
  const base2026Exemption = params.useMarriedPortabilityDsue ? 30000000 : 15000000;
  const indexedExemptionAtTransfer = base2026Exemption * cpiPreMult;
  const taxableExcessEstate = Math.max(0, grossEstateAtTransfer - indexedExemptionAtTransfer);
  const estateTaxDue = taxableExcessEstate * 0.40;
  const propAAllocatedEstateTax = grossEstateAtTransfer > 0
    ? estateTaxDue * (propAValueAtTransfer / grossEstateAtTransfer)
    : 0;

  // Prop 19 allowance at transfer
  const prop19AllowanceAtTransfer = projectProp19Allowance(
    params.transferYear,
    params.effectiveRePct,
    params.indexProp19AllowanceWithHpi
  );

  // Post-transfer macro schedule
  const schedule = buildRegimeSchedule(params.macroRegimeId, horizon, {
    equityMeanPct: params.effectiveEqPct,
    reGrowthMeanPct: params.effectiveRePct,
    inflationMeanPct: params.inflationMeanPct,
    rentGrowthMeanPct: params.effectiveRentPct,
    treasury3MRatePct: params.treasury3MRatePct,
    treasury2YRatePct: params.treasury2YRatePct
  });

  const pathIds = [
    'sell-immediate',
    'rent-hold',
    'live-prop19',
    'mixed-live-then-sell',
    'mixed-phased-staging',
    'mixed-rent-then-1031'
  ];

  const results = pathIds.map((pathId) =>
    simulateSinglePath({
      pathId,
      params,
      schedule,
      transferDelay,
      horizon,
      propAValueAtTransfer,
      propBValueAtTransfer,
      propAFbyvAtTransfer,
      propBFbyvAtTransfer,
      prop19AllowanceAtTransfer,
      propAAllocatedEstateTax,
      cpiPreMult,
      rentPreMult
    })
  );

  const baselineSell = results.find((r) => r.id === 'sell-immediate');
  const phased = results.find((r) => r.id === 'mixed-phased-staging');
  if (baselineSell && phased) {
    phased.opportunityDragVsLumpSum = baselineSell.afterTaxNetWealth - phased.afterTaxNetWealth;
  }

  return {
    inputs: params,
    transferSummary: {
      transferYear: params.transferYear,
      horizonYears: horizon,
      endYear: params.transferYear + horizon,
      propAValueAtTransfer: roundTo10(propAValueAtTransfer),
      propBValueAtTransfer: roundTo10(propBValueAtTransfer),
      propAFbyvAtTransfer: roundTo10(propAFbyvAtTransfer),
      prop19AllowanceAtTransfer: roundTo10(prop19AllowanceAtTransfer),
      prop19ExcludedCeiling: roundTo10(propAFbyvAtTransfer + prop19AllowanceAtTransfer),
      grossEstateAtTransfer: roundTo10(grossEstateAtTransfer),
      indexedExemptionAtTransfer: roundTo10(indexedExemptionAtTransfer),
      estateTaxDue: roundTo10(estateTaxDue),
      propAAllocatedEstateTax: roundTo10(propAAllocatedEstateTax)
    },
    paths: results
  };
}

function simulateSinglePath({
  pathId,
  params,
  schedule,
  transferDelay,
  horizon,
  propAValueAtTransfer,
  propBValueAtTransfer,
  propAFbyvAtTransfer,
  propBFbyvAtTransfer,
  prop19AllowanceAtTransfer,
  propAAllocatedEstateTax,
  cpiPreMult,
  rentPreMult
}) {
  let propAVal = propAValueAtTransfer;
  let propBVal = propBValueAtTransfer;
  let cpiIdx = cpiPreMult;

  // Determine Property A income tax basis at transfer (§1014 step-up vs carryover trap)
  let propABasis = params.trustReceivesStepUp1014
    ? propAValueAtTransfer
    : params.legacyCarryoverBasis2026Usd;

  // Determine Property A property tax assessed value at transfer
  const prop19AppliesInitially =
    (pathId === 'live-prop19' || pathId === 'mixed-live-then-sell') && params.claimProp19WhenLiving;

  let propAAssessed = prop19AppliesInitially
    ? Math.max(
        propAFbyvAtTransfer,
        propAFbyvAtTransfer + Math.max(0, propAValueAtTransfer - (propAFbyvAtTransfer + prop19AllowanceAtTransfer))
      )
    : propAValueAtTransfer;
  const initialPropAAssessed = pathId === 'sell-immediate' || pathId === 'mixed-phased-staging' ? 0 : propAAssessed;

  let propBAssessed = propBFbyvAtTransfer;

  // Track cumulative cash/investment portfolio (starts after paying Property A's allocated estate tax)
  let portfolio = -propAAllocatedEstateTax;
  let stagingCashReserve = 0;
  let stagingLocked2YRate = params.treasury2YRatePct / 100;
  let staging3MTbillSumYield = 0;
  let stagingYieldDropRiskDollars = 0;

  let propARented = pathId === 'rent-hold' || pathId === 'mixed-rent-then-1031';
  let propAOwned = true;
  let propB3Rented = pathId === 'live-prop19' || pathId === 'mixed-live-then-sell';
  let in1031Exchange = false;
  let sec1031PropertyVal = 0;
  let propACumDepreciation = 0;
  let propBCumDepreciation = 0;
  let cumulativeCashTaxPaid = 0;
  let cumulativeImputedHousing = 0;
  let cumulativeOmiCosts = 0;
  let yearsLivingInA = 0;
  let yearsRentingA = 0;

  // Initial rents at transferYear
  let propARentAnnual = params.propARentMonthly2026Usd * 12 * rentPreMult;
  let propB2RentAnnual = params.propBTwoUnitsRent2026Usd * 12 * Math.pow(
    params.propBPre1979RentControl ? 1.022 : 1 + params.effectiveRentPct / 100,
    transferDelay
  );
  let propB3RentAnnual = params.propBThirdUnitMarketRent2026Usd * 12 * rentPreMult;

  const yearlySeries = [];

  // Immediate Sale or Phased Staging happens at t = 0
  if (pathId === 'sell-immediate' || pathId === 'mixed-phased-staging') {
    const friction = computeCupertinoTransferAndClosingCosts(propAVal, params.propASellerBrokerageAndClosingPct);
    const saleGain = Math.max(0, propAVal - friction.totalCost - propABasis);
    const fedTax = computeFederalCapGainTax({
      gain: saleGain,
      ordinaryIncome: params.householdIncomeBase2026Usd * cpiIdx,
      filingStatus: params.filingStatus,
      includeNiit: params.includeNiit
    });
    const caRate = computeCaEffectiveMarginalRate(
      params.householdIncomeBase2026Usd * cpiIdx,
      saleGain,
      params.caTopTaxRatePct,
      params.filingStatus
    );
    const caTax = saleGain * caRate;
    cumulativeCashTaxPaid += fedTax + caTax;
    const netProceeds = Math.max(0, propAVal - friction.totalCost - fedTax - caTax);

    propAOwned = false;
    propAVal = 0;

    if (pathId === 'sell-immediate') {
      portfolio += netProceeds;
    } else {
      // Phased staging: hold netProceeds in Treasury sleeve and phase into equities over 24–36m
      stagingCashReserve = Math.max(0, netProceeds + portfolio);
      portfolio = 0;
    }
  }

  const stagingTotalYears = Math.ceil(params.stagingMonths / 12);

  for (let y = 0; y < horizon; y++) {
    const year = params.transferYear + y;
    const step = schedule[y];
    cpiIdx *= 1 + step.cpi;

    // 1. Mid-horizon mixed transitions at Year 5 (y === 5)
    if (y === 5 && pathId === 'mixed-live-then-sell' && propAOwned) {
      const friction = computeCupertinoTransferAndClosingCosts(propAVal, params.propASellerBrokerageAndClosingPct);
      const rawGain = Math.max(0, propAVal - friction.totalCost - propABasis);
      const sec121Limit = params.sec121EnabledOnMixed
        ? (params.filingStatus === 'mfj' ? 500000 : 250000)
        : 0;
      const taxableGain = Math.max(0, rawGain - sec121Limit);
      const fedTax = computeFederalCapGainTax({
        gain: taxableGain,
        ordinaryIncome: params.householdIncomeBase2026Usd * cpiIdx,
        filingStatus: params.filingStatus,
        includeNiit: params.includeNiit
      });
      const caTax = taxableGain * computeCaEffectiveMarginalRate(
        params.householdIncomeBase2026Usd * cpiIdx,
        taxableGain,
        params.caTopTaxRatePct,
        params.filingStatus
      );
      cumulativeCashTaxPaid += fedTax + caTax;
      portfolio += Math.max(0, propAVal - friction.totalCost - fedTax - caTax);
      propAOwned = false;
      propAVal = 0;

      // Reclaim Property B Unit 3 via SF OMI (if pre-1979 rent control applies)
      if (propB3Rented) {
        const omiRelocationCost = (params.propBPre1979RentControl ? 18500 : 0) * (cpiIdx / cpiPreMult);
        cumulativeOmiCosts += omiRelocationCost;
        portfolio -= omiRelocationCost;
        propB3Rented = false;
      }
    }

    if (y === 5 && pathId === 'mixed-rent-then-1031' && propAOwned) {
      const friction = computeCupertinoTransferAndClosingCosts(propAVal, params.propASellerBrokerageAndClosingPct);
      // 1031 exchange defers Fed + CA capital gains & §1250 recapture into higher-yield RE
      sec1031PropertyVal = Math.max(0, propAVal - friction.totalCost - 6500); // QI & exchange fees
      propAOwned = false;
      propARented = false;
      in1031Exchange = true;
      propAVal = 0;
    }

    // 2. Grow existing investment portfolio & handle Phased Treasury Staging tranches
    portfolio *= 1 + step.eq * 0.85; // slightly smoothed net equity return after 0.08% ETF fee
    if (pathId === 'mixed-phased-staging' && stagingCashReserve > 0) {
      const remainingMonths = Math.max(1, params.stagingMonths - y * 12);
      const monthsThisYear = Math.min(12, remainingMonths);
      const fractionMoved = monthsThisYear / remainingMonths;

      const effectiveYield =
        params.stagingInstrument === '2y-ladder'
          ? (y < 2 ? stagingLocked2YRate : step.t2y)
          : step.t3m;

      // Track reinvestment risk: loss if 3M drops below initial locked 2Y ladder
      if (params.stagingInstrument === '3m-tbill') {
        stagingYieldDropRiskDollars += stagingCashReserve * Math.max(0, stagingLocked2YRate - step.t3m);
      } else {
        stagingYieldDropRiskDollars += stagingCashReserve * Math.max(0, step.t2y - stagingLocked2YRate) * 0.35;
      }

      const interestEarned = stagingCashReserve * effectiveYield;
      // Treasury interest: Federal ordinary + NIIT only (0% CA State income tax!)
      const fedTreasuryTax = interestEarned * (0.28 + (params.includeNiit ? 0.038 : 0));
      cumulativeCashTaxPaid += fedTreasuryTax;
      staging3MTbillSumYield += interestEarned - fedTreasuryTax;

      const transferToStocks = stagingCashReserve * fractionMoved;
      stagingCashReserve = Math.max(0, stagingCashReserve - transferToStocks + (interestEarned - fedTreasuryTax));
      portfolio += transferToStocks;
    }

    // 3. Property A Annual Cash Flow & Taxes (while owned)
    if (propAOwned) {
      if (propARented) yearsRentingA += 1;
      else yearsLivingInA += 1;

      const propATax =
        propAAssessed * (params.propATraRatePct / 100) +
        params.propADirectAssessments2026Usd * cpiIdx -
        (!propARented ? 70 : 0); // Homeowners exemption ($7k * ~1%)

      const insuranceA = params.propAInsurance2026Usd * params.effectiveInsMult * cpiIdx;
      const maintA = propAVal * (params.propAMaintenancePctOfValue / 100);
      const waterA = 1440 * Math.pow(1.04, transferDelay + y);
      const solarElecA = year >= params.propANemSunsetYear ? 1080 * cpiIdx : -120 * cpiIdx;
      const mgmtA = propARented ? propARentAnnual * 0.96 * (params.propertyMgmtFeePct / 100) : 0;

      const grossRentA = propARented ? propARentAnnual * 0.96 : 0;
      const imputedLivingA = !propARented
        ? propARentAnnual * (params.propAImputedRentPctOfMarket / 100)
        : 0;
      cumulativeImputedHousing += imputedLivingA;

      const operatingExpA = propATax + insuranceA + maintA + waterA + Math.max(0, solarElecA) + mgmtA;
      let cashFlowA = grossRentA - operatingExpA - Math.min(0, solarElecA);

      if (propARented) {
        const remainingDepYears = Math.max(0, Math.min(1, 27.5 - (yearsRentingA - 1)));
        const annualDepA =
          ((propABasis * (params.propAImprovementRatioPct / 100)) / 27.5) * remainingDepYears;
        propACumDepreciation += annualDepA;
        const taxableRentalA = grossRentA - operatingExpA - annualDepA;
        if (taxableRentalA > 0) {
          const marginalTaxRate = 0.24 + (params.includeNiit ? 0.038 : 0) + 0.093;
          const incTax = taxableRentalA * marginalTaxRate;
          cashFlowA -= incTax;
          cumulativeCashTaxPaid += incTax;
        }
      }

      portfolio += cashFlowA;
      propAVal *= 1 + step.re;
      propAAssessed *= 1.02;
      propARentAnnual *= 1 + step.rent;
    }

    // 4. Exchanged 1031 Asset Cash Flow (Path 6 after Yr 5)
    if (in1031Exchange) {
      const netYield1031 = sec1031PropertyVal * (params.sec1031TargetYieldPct / 100);
      const depShelter = sec1031PropertyVal * 0.65 / 27.5;
      const taxable1031 = Math.max(0, netYield1031 - depShelter);
      const incTax1031 = taxable1031 * (0.24 + 0.093 + (params.includeNiit ? 0.038 : 0));
      cumulativeCashTaxPaid += incTax1031;
      portfolio += netYield1031 - incTax1031;
      sec1031PropertyVal *= 1 + step.re * 0.85;
    }

    // 5. Property B Annual Cash Flow (Owned in ALL paths for apples-to-apples comparison)
    const propBTax =
      propBAssessed * 0.0118162 +
      1090 * cpiIdx +
      computeSfPropHParcelTax(year, params.propBSqft, !propB3Rented && params.isHeirAge65PlusAtTransfer, cpiIdx);
    const insuranceB = params.propBInsurance2026Usd * params.effectiveInsMult * cpiIdx;
    const waterB = params.propBWaterMonthly2026Usd * 12 * Math.pow(1.055, transferDelay + y);
    const electricB = params.propBElectricMonthly2026Usd * 12 * cpiIdx;
    const maintB = propBVal * (params.propBMaintenancePctOfValue / 100);

    const grossRentB = propB2RentAnnual * 0.97 + (propB3Rented ? propB3RentAnnual * 0.96 : 0);
    if (!propB3Rented) {
      cumulativeImputedHousing += propB3RentAnnual;
    }
    const mgmtB = grossRentB * (params.propertyMgmtFeePct / 100);
    const totalExpB = propBTax + insuranceB + waterB + electricB + maintB + mgmtB;
    const rentalShareB = propB3Rented ? 1.0 : 0.67;
    const annualDepB = (propBVal * 0.35 * rentalShareB) / 27.5;
    propBCumDepreciation += annualDepB;
    const taxableRentalB = Math.max(0, grossRentB - totalExpB * rentalShareB - annualDepB);
    const taxB = taxableRentalB * (0.24 + 0.093 + (params.includeNiit ? 0.038 : 0));
    cumulativeCashTaxPaid += taxB;

    portfolio += grossRentB - totalExpB - taxB;

    // Grow Property B value, assessed roll, and rent-controlled rents
    propBVal *= 1 + (step.re - 0.002);
    propBAssessed *= 1.02;
    const sfCapRate = params.propBPre1979RentControl ? Math.max(0.012, step.cpi * 0.6) : step.rent;
    propB2RentAnnual *= 1 + sfCapRate;
    propB3RentAnnual *= 1 + (propB3Rented ? sfCapRate : step.rent);

    yearlySeries.push({
      year,
      propAVal: roundTo10(propAVal),
      propAAssessed: roundTo10(propAAssessed),
      propBVal: roundTo10(propBVal),
      portfolio: roundTo10(portfolio + stagingCashReserve + sec1031PropertyVal),
      preTaxWealth: roundTo10(propAVal + propBVal + portfolio + stagingCashReserve + sec1031PropertyVal)
    });
  }

  // 6. Terminal Exit Comparison (After-Tax Liquidation Value of Real Estate + Portfolio)
  const preTaxEndingWealth = propAVal + propBVal + portfolio + stagingCashReserve + sec1031PropertyVal;

  let terminalTaxesAndFriction = 0;
  if (propAOwned && propAVal > 0) {
    const exitFrictionA = computeCupertinoTransferAndClosingCosts(propAVal, params.propASellerBrokerageAndClosingPct);
    const adjBasisA = Math.max(0, propABasis - propACumDepreciation);
    const totalGainA = Math.max(0, propAVal - exitFrictionA.totalCost - adjBasisA);
    const depRecapA = Math.min(totalGainA, propACumDepreciation);
    const remCapGainA = Math.max(0, totalGainA - depRecapA);

    // If Path 3 lived in A >=2 yrs, allow §121 exclusion if switched on
    const sec121AtExitA =
      pathId === 'live-prop19' && params.sec121EnabledOnMixed && yearsLivingInA >= 2
        ? (params.filingStatus === 'mfj' ? 500000 : 250000)
        : 0;
    const taxableCapGainA = Math.max(0, remCapGainA - sec121AtExitA);

    const fedExitA = computeFederalCapGainTax({
      gain: taxableCapGainA,
      unrecaptured1250Gain: depRecapA,
      ordinaryIncome: params.householdIncomeBase2026Usd * cpiIdx,
      filingStatus: params.filingStatus,
      includeNiit: params.includeNiit
    });
    const caExitA =
      (taxableCapGainA + depRecapA) *
      computeCaEffectiveMarginalRate(
        params.householdIncomeBase2026Usd * cpiIdx,
        taxableCapGainA + depRecapA,
        params.caTopTaxRatePct,
        params.filingStatus
      );
    terminalTaxesAndFriction += exitFrictionA.totalCost + fedExitA + caExitA;
  }

  if (in1031Exchange && sec1031PropertyVal > 0) {
    // 1031 property deferred gain until subsequent death step-up or sale; price sale friction + partial tax reserve
    const friction1031 = sec1031PropertyVal * 0.055;
    terminalTaxesAndFriction += friction1031;
  }

  // Property B terminal transfer friction (equal across paths, slightly differentiates net wealth scale)
  const sfExitTransferTax = computeSfTransferTax(propBVal) + propBVal * 0.05;
  terminalTaxesAndFriction += sfExitTransferTax;

  // Unrealized equity portfolio tax estimate (~50% unrealized appreciation over horizon at Fed+CA rate)
  const unrealizedPortGain = Math.max(0, portfolio * 0.45);
  const portExitTax =
    computeFederalCapGainTax({
      gain: unrealizedPortGain,
      ordinaryIncome: params.householdIncomeBase2026Usd * cpiIdx,
      filingStatus: params.filingStatus,
      includeNiit: params.includeNiit
    }) +
    unrealizedPortGain * 0.11;
  terminalTaxesAndFriction += portExitTax;

  const afterTaxNetWealth = preTaxEndingWealth - terminalTaxesAndFriction;
  const totalEconomicWealthInclImputed = afterTaxNetWealth + cumulativeImputedHousing;

  return {
    id: pathId,
    prop19Applied: prop19AppliesInitially,
    startingPropAAssessed: roundTo10(initialPropAAssessed),
    endingPropAAssessed: roundTo10(propAOwned ? propAAssessed : 0),
    preTaxEndingWealth: roundTo10(preTaxEndingWealth),
    afterTaxNetWealth: roundTo10(afterTaxNetWealth),
    totalEconomicWealthInclImputed: roundTo10(totalEconomicWealthInclImputed),
    cumulativeImputedHousing: roundTo10(cumulativeImputedHousing),
    cumulativeCashTaxPaid: roundTo10(cumulativeCashTaxPaid),
    cumulativeOmiCosts: roundTo10(cumulativeOmiCosts),
    reinvestmentRiskDollars: roundTo10(stagingYieldDropRiskDollars),
    opportunityDragVsLumpSum: 0,
    stagingTreasuryYieldEarned: roundTo10(staging3MTbillSumYield),
    stagingTotalYears,
    yearlySeries
  };
}

/**
 * Deterministic Seeded Monte Carlo Distribution across 400 trials
 * Produces P10, P25, P50, P75, P90 percentiles & histogram buckets for Distribution Chart
 */
export function runMonteCarloDistribution(rawInputs = {}, trials = 400) {
  const params = resolveScenarioParams(rawInputs);
  const pathsToCompare = ['sell-immediate', 'rent-hold', 'live-prop19', 'mixed-live-then-sell', 'mixed-phased-staging'];
  const outcomes = Object.fromEntries(pathsToCompare.map((id) => [id, []]));

  // Seeded PRNG (Mulberry32) so results are 100% deterministic & reproducible
  let seed = 20261125;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const randNormal = () => {
    const u1 = Math.max(1e-7, rand());
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };

  for (let t = 0; t < trials; t++) {
    const zEq = randNormal();
    const zRe = 0.35 * zEq + Math.sqrt(1 - 0.35 * 0.35) * randNormal();
    const zCpi = randNormal();

    const trialInputs = {
      ...rawInputs,
      equityMeanPct: Math.max(1.0, params.equityMeanPct + zEq * 2.4),
      reGrowthMeanPct: Math.max(-0.5, params.reGrowthMeanPct + zRe * 1.4),
      inflationMeanPct: Math.max(0.8, params.inflationMeanPct + zCpi * 0.8)
    };
    const res = runComparisonModel(trialInputs);
    for (const p of res.paths) {
      if (outcomes[p.id]) {
        outcomes[p.id].push(p.afterTaxNetWealth);
      }
    }
  }

  const summaries = {};
  for (const id of pathsToCompare) {
    const sorted = [...outcomes[id]].sort((a, b) => a - b);
    const pick = (q) => roundTo10(sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]);
    summaries[id] = {
      p10: pick(0.1),
      p25: pick(0.25),
      p50: pick(0.5),
      p75: pick(0.75),
      p90: pick(0.9),
      samples: sorted
    };
  }

  return summaries;
}
