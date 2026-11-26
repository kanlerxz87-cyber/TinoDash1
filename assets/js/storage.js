import { DEFAULT_INPUTS } from './model.js';

const INPUTS_KEY = 'tinodash1_whatif_inputs_v1';
const CHARTER_KEY = 'tinodash1_precommit_charter_v1';
const DECISIONS_KEY = 'tinodash1_decision_log_v1';
const SUGGESTIONS_KEY = 'tinodash1_suggestions_eval_v1';

export const DEFAULT_CHARTER = [
  {
    id: 'rule-sell',
    pathLabel: 'Choose Immediate Sale + Diversified Reinvestment (or Phased Staging) if:',
    criterion: 'Heir prefers remaining in San Francisco (Property B Unit 3), Cupertino net rental cap rate remains < 2.2% after FMV reassessment, or estate faces liquidity needs above the federal exclusion.',
    agreed: false,
    signedDate: ''
  },
  {
    id: 'rule-live',
    pathLabel: 'Choose Move Into Property A & Claim Prop 19 if:',
    criterion: 'Household commits in writing to occupying Property A as primary residence for >= 7–10 years AND Prop 19 saves >= $18,000/yr in taxes, while comfortable renting out Property B Unit 3 under SF Rent Control.',
    agreed: false,
    signedDate: ''
  },
  {
    id: 'rule-mixed-121',
    pathLabel: 'Choose Mixed Path (Live 5 Yrs w/ Prop 19 + §121, Then Sell) if:',
    criterion: 'Household wants to test Cupertino residency for ~5 years, qualifies for §121 ($250k/$500k exclusion), and verifies Property B Unit 3 can be reclaimed cleanly (or stays rented) without protected-tenant OMI block.',
    agreed: false,
    signedDate: ''
  },
  {
    id: 'rule-rent-hold',
    pathLabel: 'Choose Hold & Rent Property A (or §1031) ONLY if:',
    criterion: 'Verified market rent + realistic insurance/CapEx yields >= 2.8% net cap rate OR trust lacks §1014 basis step-up (bypass trust trap) making immediate sale tax-prohibitive.',
    agreed: false,
    signedDate: ''
  },
  {
    id: 'rule-ips',
    pathLabel: 'Adopt Written Investment Policy Statement (IPS) Before Proceeds Arrive:',
    criterion: 'Lock target equity/Treasury allocation, max single-asset concentration, and staging duration (Lump Sum vs 24–36m 2Y Treasury Ladder) BEFORE transfer date to eliminate emotional market timing.',
    agreed: false,
    signedDate: ''
  }
];

export const DEFAULT_DECISION_LOG = [
  {
    id: 'D-01',
    action: 'Verify trust structure (Survivor/Revocable vs A/B Bypass) & Form 706 DSUE portability status',
    owner: 'Estate Attorney + Trustee',
    status: 'Pending Discovery',
    decision: 'Pending attorney trust memo (determines §1014 basis step-up & $15M/$30M estate threshold)',
    decisionDate: ''
  },
  {
    id: 'D-02',
    action: 'Pull Property A exact 013-xxx Santa Clara TRA bill, land/improvement split, solar PTO date & CapEx inspection',
    owner: 'Trustee / Heir (Offline)',
    status: 'Pending Discovery',
    decision: 'Pending offline bill lookup (never upload APN or unrounded PDF to public repo)',
    decisionDate: ''
  },
  {
    id: 'D-03',
    action: 'Verify Property B build date (pre/post June 13, 1979), total sqft (>5,000 Prop H threshold) & tenant protection status',
    owner: 'Owner + SF Housing Counsel',
    status: 'Pending Discovery',
    decision: 'Apply conservative pre-1979 SF Rent Ordinance & Prop H assumptions until DBI/leases confirmed',
    decisionDate: ''
  },
  {
    id: 'D-04',
    action: 'Replace $1,500/yr insurance placeholders with 2 independent broker quotes (incl. FAIR Plan/DIC & Umbrella)',
    owner: 'Insurance Broker',
    status: 'Flagged for Review',
    decision: 'Model uses realistic market ranges ($4.2k A / $7.2k B) until actual declarations received',
    decisionDate: ''
  },
  {
    id: 'D-05',
    action: 'Sign household Pre-Commitment Decision Charter & Investment Policy Statement (IPS) before inheritance arrives',
    owner: 'Heir & Household',
    status: 'Ready for Sign-Off',
    decision: 'Await household review of criteria on Overview page',
    decisionDate: ''
  },
  {
    id: 'D-06',
    action: 'Schedule annual November review to refresh Prop 19 indexed cap, Form 540 brackets, OBBBA tax law & insurance markets',
    owner: 'Heir + CPA',
    status: 'Scheduled Annual',
    decision: 'Annual re-run scheduled each November using verified primary-source checklist',
    decisionDate: '2026-11-25'
  }
];

export const DEFAULT_SUGGESTIONS = [
  {
    id: 'S-01',
    title: 'Add Form 1041 Trust Retention vs Beneficiary Distribution Tax Module',
    category: 'Tax Precision',
    rationale: 'Under 2026 Rev. Proc. 2025-32, trusts hit the top 37% ordinary bracket above $16,000 and 20% LTCG above $16,250 vs $768,700 / $613,700 for MFJ individuals. Modeling trust distribution timing before sale prevents accidental fiduciary surtaxes.',
    effort: 'Medium',
    decision: 'Evaluate with Estate CPA'
  },
  {
    id: 'S-02',
    title: 'Model §1031 DST / NNN Replacement Options Alongside Single-Tenant SFH',
    category: 'Mixed Paths',
    rationale: 'Compares active landlord workload & CA FTB Form 3840 out-of-state tracking against passive diversified §1031 structures for Path 6.',
    effort: 'Medium',
    decision: 'Proposed for Review'
  },
  {
    id: 'S-03',
    title: 'Add CEA Earthquake Deductible & Soft-Story Seismic Reserve Stress Test',
    category: 'Risk Management',
    rationale: 'Both Cupertino and SF (Property B area) carry Bay Area seismic exposure; uninsured 15%–25% CEA deductibles materially affect concentrated single-asset risk vs liquid ETFs.',
    effort: 'Low',
    decision: 'Proposed for Review'
  },
  {
    id: 'S-04',
    title: 'Add Multi-Heir Equalizing Loan / Sibling Buyout Calculator',
    category: 'Trust Governance',
    rationale: 'If Property A must be split among co-beneficiaries, a California Prop 58/19 third-party buyout loan (vs trust-level financing) preserves Prop 19 parent-child exclusion on the buyer heir share if structured properly.',
    effort: 'High',
    decision: 'Evaluate if Multiple Heirs'
  },
  {
    id: 'S-05',
    title: 'Convert Repo to Private or Maintain Encrypted Private Data Overlay',
    category: 'Privacy & OpSec',
    rationale: 'Keep this public repository strictly anonymized + $10-rounded, or transition to a private repository before entering exact parcel tax bills, leases, or estate balances.',
    effort: 'Low',
    decision: 'Recommended Immediately'
  }
];

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

export function loadInputs() {
  return { ...DEFAULT_INPUTS, ...safeParse(INPUTS_KEY, {}) };
}

export function saveInputs(nextInputs) {
  try {
    localStorage.setItem(INPUTS_KEY, JSON.stringify(nextInputs));
  } catch {
    // ignore storage quota errors
  }
}

export function resetInputs() {
  try {
    localStorage.removeItem(INPUTS_KEY);
  } catch {
    // ignore
  }
  return { ...DEFAULT_INPUTS };
}

export function loadCharter() {
  return safeParse(CHARTER_KEY, DEFAULT_CHARTER);
}

export function saveCharter(rows) {
  try {
    localStorage.setItem(CHARTER_KEY, JSON.stringify(rows));
  } catch {}
}

export function loadDecisions() {
  return safeParse(DECISIONS_KEY, DEFAULT_DECISION_LOG);
}

export function saveDecisions(rows) {
  try {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(rows));
  } catch {}
}

export function loadSuggestions() {
  return safeParse(SUGGESTIONS_KEY, DEFAULT_SUGGESTIONS);
}

export function saveSuggestions(rows) {
  try {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(rows));
  } catch {}
}
