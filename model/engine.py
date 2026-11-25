#!/usr/bin/env python3
"""
TinoDash1 Financial, Tax, Monte Carlo & Black Swan Modeling Engine.
All monetary outputs are rounded to the nearest $10 for privacy-first reporting.
"""

import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INPUTS_PATH = ROOT / "model" / "data_inputs.json"


def r10(val: float) -> int:
    """Round to nearest $10 increment."""
    return int(round(val / 10.0) * 10)


def load_inputs():
    with open(INPUTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def project_property_a_to_year(inp, target_year: int, scenario_idx: int = 1):
    """Project Property A FMV, Prop 13 FBYV, Prop 19 allowance, and annual operating costs to target_year."""
    pa = inp["properties"]["property_a"]
    tl = inp["tax_and_legal"]
    macro = inp["macro_assumptions"]

    base_yr = inp["meta"]["base_year"]
    n = target_year - base_yr
    appr = macro["home_appreciation_a_range"][scenario_idx]
    infl = macro["inflation_range"][scenario_idx]
    rent_g = macro["rent_growth_range"][scenario_idx]
    tax_rate = pa["effective_tax_rate_range"][scenario_idx]

    fmv = pa["estimated_fmv_2026"] * ((1 + appr) ** n)
    fbyv = pa["assessed_value_2026"] * ((1 + tl["prop13_max_annual_increase"]) ** n)
    prop19_cap = tl["prop19_allowance_2025_2027"] * ((1 + tl["prop19_indexing_annual_assumption"]) ** n)

    # Prop 19 enrolled taxable value if heir occupies within 1 year
    excluded_ceiling = fbyv + prop19_cap
    if fmv <= excluded_ceiling:
        assessed_prop19 = fbyv
    else:
        assessed_prop19 = fbyv + (fmv - excluded_ceiling)

    assessed_no_prop19 = fmv
    fixed_assess = pa["fixed_parcel_assessments_2026"] * ((1 + infl) ** n)

    tax_prop19 = assessed_prop19 * tax_rate + fixed_assess
    tax_no_prop19 = assessed_no_prop19 * tax_rate + fixed_assess

    water_yr = pa["water_monthly_range"][scenario_idx] * 12 * ((1 + infl) ** n)
    elec_yr = pa["electricity_monthly_range"][scenario_idx] * 12 * ((1 + infl) ** n)
    ins_primary = pa["insurance_primary_annual_range"][scenario_idx] * ((1 + infl) ** n)
    ins_landlord = pa["insurance_landlord_annual_range"][scenario_idx] * ((1 + infl) ** n)
    maint_yr = fmv * pa["maintenance_annual_pct_fmv_range"][scenario_idx]
    market_rent_yr = pa["market_rent_monthly_range"][scenario_idx] * 12 * ((1 + rent_g) ** n)
    imputed_rent_yr = pa["imputed_rent_monthly_range"][scenario_idx] * 12 * ((1 + rent_g) ** n)

    return {
        "year": target_year,
        "fmv": r10(fmv),
        "fbyv": r10(fbyv),
        "prop19_allowance": r10(prop19_cap),
        "assessed_prop19": r10(assessed_prop19),
        "assessed_no_prop19": r10(assessed_no_prop19),
        "tax_prop19": r10(tax_prop19),
        "tax_no_prop19": r10(tax_no_prop19),
        "prop19_annual_tax_savings": r10(tax_no_prop19 - tax_prop19),
        "water_yr": r10(water_yr),
        "elec_yr": r10(elec_yr),
        "ins_primary_yr": r10(ins_primary),
        "ins_landlord_yr": r10(ins_landlord),
        "maint_yr": r10(maint_yr),
        "market_rent_yr": r10(market_rent_yr),
        "imputed_rent_yr": r10(imputed_rent_yr),
    }


def project_property_b_to_year(inp, target_year: int, scenario_idx: int = 1):
    """Project Property B (already owned SF 3-unit) to target_year."""
    pb = inp["properties"]["property_b"]
    tl = inp["tax_and_legal"]
    macro = inp["macro_assumptions"]

    base_yr = inp["meta"]["base_year"]
    n = target_year - base_yr
    appr = macro["home_appreciation_b_range"][scenario_idx]
    infl = macro["inflation_range"][scenario_idx]
    rent_g = macro["rent_growth_range"][scenario_idx]

    fmv = pb["estimated_fmv_2026"] * ((1 + appr) ** n)
    assessed = pb["assessed_value_2025"] * ((1 + tl["prop13_max_annual_increase"]) ** (n + 1))
    fixed_assess = pb["fixed_parcel_assessments_2025"] * ((1 + infl) ** (n + 1))
    prop_h_tax = pb["sf_prop_h_2026_parcel_tax_range"][scenario_idx] * ((1 + infl) ** n)
    prop_tax = assessed * pb["sf_combined_tax_rate_fy2526"] + fixed_assess + prop_h_tax

    rent_2_units_yr = pb["monthly_rent_2_units_2026"] * 12 * ((1 + rent_g) ** n)
    rent_3rd_unit_yr = pb["monthly_rent_3rd_unit_if_rented_range"][scenario_idx] * 12 * ((1 + rent_g) ** n)
    water_yr = pb["water_monthly_range"][scenario_idx] * 12 * ((1 + infl) ** n)
    elec_yr = pb["electricity_monthly_range"][scenario_idx] * 12 * ((1 + infl) ** n)
    ins_yr = pb["insurance_3unit_annual_range"][scenario_idx] * ((1 + infl) ** n)
    maint_yr = fmv * pb["maintenance_annual_pct_fmv_range"][scenario_idx]

    return {
        "year": target_year,
        "fmv": r10(fmv),
        "assessed": r10(assessed),
        "prop_tax": r10(prop_tax),
        "prop_h_parcel_tax": r10(prop_h_tax),
        "rent_2_units_yr": r10(rent_2_units_yr),
        "rent_3rd_unit_yr": r10(rent_3rd_unit_yr),
        "water_yr": r10(water_yr),
        "elec_yr": r10(elec_yr),
        "ins_yr": r10(ins_yr),
        "maint_yr": r10(maint_yr),
    }


def compute_sale_net_proceeds(sale_price: float, basis: float, cum_depreciation: float,
                              inp: dict, scenario_idx: int = 1,
                              apply_sec121: bool = False, mfj: bool = True,
                              defer_1031: bool = False):
    """Compute net proceeds after Santa Clara County transfer tax, recording fees, selling costs,
    federal LTCG + NIIT + § 1250 recapture, and CA ordinary income + 1% MHST."""
    tl = inp["tax_and_legal"]
    sell_pct = tl["selling_costs_pct_range"][scenario_idx]
    broker_closing = sale_price * sell_pct
    transfer_tax = (sale_price / 1000.0) * (tl["scc_transfer_tax_per_1000"] + tl["cupertino_city_transfer_tax_per_1000"])
    recording = tl["scc_recording_fee_est"]
    total_tx_costs = broker_closing + transfer_tax + recording

    amount_realized = sale_price - total_tx_costs
    adj_basis = max(0.0, basis - cum_depreciation)
    total_gain = max(0.0, amount_realized - adj_basis)

    if defer_1031 or total_gain <= 0:
        return {
            "net_proceeds": amount_realized,
            "tx_costs": total_tx_costs,
            "transfer_tax": transfer_tax,
            "total_tax": 0.0,
            "cap_gain": total_gain,
            "recapture_tax": 0.0,
            "ca_mhst": 0.0,
        }

    # Depreciation recapture cannot be excluded by § 121
    recapture_gain = min(total_gain, cum_depreciation)
    non_recapture_gain = max(0.0, total_gain - recapture_gain)

    sec121_excl = (tl["irc_121_mfj"] if mfj else tl["irc_121_single"]) if apply_sec121 else 0.0
    taxable_ltcg = max(0.0, non_recapture_gain - sec121_excl)

    fed_ltcg_tax = taxable_ltcg * (tl["federal_ltcg_rate_high"] + tl["federal_niit_rate"])
    fed_recapture_tax = recapture_gain * (tl["unrecaptured_1250_max_rate"] + tl["federal_niit_rate"])

    # California taxes all capital gains & recapture as ordinary income + 1% MHST over $1M
    ca_taxable_gain = taxable_ltcg + recapture_gain
    ca_ordinary = ca_taxable_gain * tl["ca_top_ordinary_rate"]
    ca_mhst = max(0.0, ca_taxable_gain - tl["ca_mhst_threshold"]) * tl["ca_mhst_rate_over_1m"]

    total_tax = fed_ltcg_tax + fed_recapture_tax + ca_ordinary + ca_mhst
    return {
        "net_proceeds": amount_realized - total_tax,
        "tx_costs": total_tx_costs,
        "transfer_tax": transfer_tax,
        "total_tax": total_tax,
        "cap_gain": total_gain,
        "recapture_tax": fed_recapture_tax,
        "ca_mhst": ca_mhst,
    }


def simulate_paths(inp, transfer_year: int, horizon: int, scenario_idx: int = 1,
                   mfj: bool = True, include_imputed_rent: bool = True,
                   staging_months: int = 30):
    """Compare all 6 paths (3 pure + 3 mixed) over the exact same transfer_year and horizon."""
    pa_t0 = project_property_a_to_year(inp, transfer_year, scenario_idx)
    pb_t0 = project_property_b_to_year(inp, transfer_year, scenario_idx)
    pa = inp["properties"]["property_a"]
    tl = inp["tax_and_legal"]
    macro = inp["macro_assumptions"]

    appr_a = macro["home_appreciation_a_range"][scenario_idx]
    infl = macro["inflation_range"][scenario_idx]
    rent_g = macro["rent_growth_range"][scenario_idx]
    eq_ret = macro["equity_return_nominal_range"][scenario_idx]
    tbill_ret = macro["treasury_yield_range"][scenario_idx]
    # After-tax equity drag (dividends + periodic rebalancing) ~0.6%
    eq_after_tax = eq_ret - 0.006
    tbill_after_tax = tbill_ret * (1 - 0.37)  # Federal ordinary only; Treasuries exempt from CA state tax!
    marginal_income_tax = 0.37 + tl["ca_top_ordinary_rate"]  # ~49.3% combined high-bracket CA

    fmv0 = float(pa_t0["fmv"])
    basis0 = fmv0  # IRC § 1014 full step-up at date of death
    tax_rate_a = pa["effective_tax_rate_range"][scenario_idx]

    # --- PATH 1: PURE LIVE IN PROPERTY A (with Prop 19 + Imputed Rent + Rent 3rd SF unit) ---
    assessed_p1 = float(pa_t0["assessed_prop19"])
    port_p1 = 0.0
    cum_cf_p1 = 0.0
    for y in range(1, horizon + 1):
        fmv_y = fmv0 * ((1 + appr_a) ** y)
        assessed_p1 *= (1 + tl["prop13_max_annual_increase"])
        fixed_y = pa["fixed_parcel_assessments_2026"] * ((1 + infl) ** (transfer_year - 2026 + y))
        tax_y = assessed_p1 * tax_rate_a + fixed_y
        opex_y = (pa_t0["water_yr"] + pa_t0["elec_yr"] + pa_t0["ins_primary_yr"]) * ((1 + infl) ** y) + fmv_y * pa["maintenance_annual_pct_fmv_range"][scenario_idx]
        # Benefit: imputed rent saved (tax-free!) + optional 3rd unit rent on Property B (after tax)
        imputed_y = pa_t0["imputed_rent_yr"] * ((1 + rent_g) ** y) if include_imputed_rent else 0.0
        sf_3rd_net = pb_t0["rent_3rd_unit_yr"] * ((1 + rent_g) ** y) * 0.92 * (1 - marginal_income_tax)
        net_cf = imputed_y + sf_3rd_net - tax_y - opex_y
        port_p1 = port_p1 * (1 + eq_after_tax) + net_cf
        cum_cf_p1 += net_cf
    end_fmv_p1 = fmv0 * ((1 + appr_a) ** horizon)
    nw_p1 = end_fmv_p1 + port_p1

    # --- PATH 2: PURE RENT PROPERTY A (no Prop 19 -> reassessment; 27.5-yr depreciation) ---
    assessed_p2 = float(pa_t0["assessed_no_prop19"])
    port_p2 = 0.0
    cum_dep_p2 = 0.0
    annual_dep = (basis0 * pa["building_value_share_for_depreciation"]) / tl["depreciation_life_years"]
    for y in range(1, horizon + 1):
        fmv_y = fmv0 * ((1 + appr_a) ** y)
        assessed_p2 *= (1 + tl["prop13_max_annual_increase"])
        fixed_y = pa["fixed_parcel_assessments_2026"] * ((1 + infl) ** (transfer_year - 2026 + y))
        tax_y = assessed_p2 * tax_rate_a + fixed_y
        gross_rent = pa_t0["market_rent_yr"] * ((1 + rent_g) ** y) * (1 - pa["vacancy_rate"])
        mgmt = gross_rent * pa["property_mgmt_pct"]
        opex_y = (pa_t0["water_yr"] + pa_t0["elec_yr"] + pa_t0["ins_landlord_yr"]) * ((1 + infl) ** y) + fmv_y * pa["maintenance_annual_pct_fmv_range"][scenario_idx]
        noi = gross_rent - mgmt - tax_y - opex_y
        dep_y = annual_dep if y <= 27 else 0.0
        cum_dep_p2 += dep_y
        taxable_rental = max(0.0, noi - dep_y)
        after_tax_cf = noi - taxable_rental * marginal_income_tax
        port_p2 = port_p2 * (1 + eq_after_tax) + after_tax_cf
    end_fmv_p2 = fmv0 * ((1 + appr_a) ** horizon)
    # Liquidated after-tax value vs held value
    liq_p2 = compute_sale_net_proceeds(end_fmv_p2, basis0, cum_dep_p2, inp, scenario_idx, apply_sec121=False, mfj=mfj)
    nw_p2_held = end_fmv_p2 + port_p2
    nw_p2_liq = liq_p2["net_proceeds"] + port_p2

    # --- PATH 3: PURE SELL IMMEDIATE (Same Tax Year as Inheritance; § 1014 Step-Up -> $0 Cap Gain) ---
    sale_p3 = compute_sale_net_proceeds(fmv0, basis0, 0.0, inp, scenario_idx, apply_sec121=False, mfj=mfj)
    port_p3 = sale_p3["net_proceeds"] * ((1 + eq_after_tax) ** horizon)
    nw_p3 = port_p3

    # --- PATH 4: MIXED — LIVE IN A (5 YRS) THEN SELL (Prop 19 + IRC § 121 Exclusion) ---
    live_yrs = min(5, horizon)
    assessed_p4 = float(pa_t0["assessed_prop19"])
    port_p4 = 0.0
    for y in range(1, live_yrs + 1):
        fmv_y = fmv0 * ((1 + appr_a) ** y)
        assessed_p4 *= (1 + tl["prop13_max_annual_increase"])
        fixed_y = pa["fixed_parcel_assessments_2026"] * ((1 + infl) ** (transfer_year - 2026 + y))
        tax_y = assessed_p4 * tax_rate_a + fixed_y
        opex_y = (pa_t0["water_yr"] + pa_t0["elec_yr"] + pa_t0["ins_primary_yr"]) * ((1 + infl) ** y) + fmv_y * pa["maintenance_annual_pct_fmv_range"][scenario_idx]
        imputed_y = pa_t0["imputed_rent_yr"] * ((1 + rent_g) ** y) if include_imputed_rent else 0.0
        sf_3rd_net = pb_t0["rent_3rd_unit_yr"] * ((1 + rent_g) ** y) * 0.92 * (1 - marginal_income_tax)
        port_p4 = port_p4 * (1 + eq_after_tax) + (imputed_y + sf_3rd_net - tax_y - opex_y)
    sale_fmv_p4 = fmv0 * ((1 + appr_a) ** live_yrs)
    sale_p4 = compute_sale_net_proceeds(sale_fmv_p4, basis0, 0.0, inp, scenario_idx, apply_sec121=True, mfj=mfj)
    port_p4 += sale_p4["net_proceeds"]
    rem_yrs_p4 = horizon - live_yrs
    port_p4 *= ((1 + eq_after_tax) ** rem_yrs_p4)
    nw_p4 = port_p4

    # --- PATH 5: MIXED — RENT A (10 YRS) THEN 1031 EXCHANGE ---
    rent_yrs = min(10, horizon)
    assessed_p5 = float(pa_t0["assessed_no_prop19"])
    port_p5 = 0.0
    for y in range(1, rent_yrs + 1):
        fmv_y = fmv0 * ((1 + appr_a) ** y)
        assessed_p5 *= (1 + tl["prop13_max_annual_increase"])
        fixed_y = pa["fixed_parcel_assessments_2026"] * ((1 + infl) ** (transfer_year - 2026 + y))
        tax_y = assessed_p5 * tax_rate_a + fixed_y
        gross_rent = pa_t0["market_rent_yr"] * ((1 + rent_g) ** y) * (1 - pa["vacancy_rate"])
        mgmt = gross_rent * pa["property_mgmt_pct"]
        opex_y = (pa_t0["water_yr"] + pa_t0["elec_yr"] + pa_t0["ins_landlord_yr"]) * ((1 + infl) ** y) + fmv_y * pa["maintenance_annual_pct_fmv_range"][scenario_idx]
        noi = gross_rent - mgmt - tax_y - opex_y
        taxable_rental = max(0.0, noi - annual_dep)
        port_p5 = port_p5 * (1 + eq_after_tax) + (noi - taxable_rental * marginal_income_tax)
    exch_fmv = fmv0 * ((1 + appr_a) ** rent_yrs)
    exch_res = compute_sale_net_proceeds(exch_fmv, basis0, annual_dep * rent_yrs, inp, scenario_idx, defer_1031=True)
    # Reinvest 1031 equity into higher-yield replacement property (~5.5% net total return)
    rem_yrs_p5 = horizon - rent_yrs
    re_1031_end = exch_res["net_proceeds"] * ((1 + (appr_a + 0.020)) ** rem_yrs_p5)
    port_p5 *= ((1 + eq_after_tax) ** rem_yrs_p5)
    nw_p5 = re_1031_end + port_p5

    # --- PATH 6: MIXED — SELL IMMEDIATE + PHASED-INVESTING (3M-2Y Treasuries 24-36m) ---
    stage_yrs = staging_months / 12.0
    # Monthly linear phasing from Treasuries into equities over staging_months
    tbill_bal = sale_p3["net_proceeds"]
    eq_bal = 0.0
    r_tb_m = (1 + tbill_after_tax) ** (1 / 12.0) - 1
    r_eq_m = (1 + eq_after_tax) ** (1 / 12.0) - 1
    for m in range(1, staging_months + 1):
        tbill_bal *= (1 + r_tb_m)
        eq_bal *= (1 + r_eq_m)
        tranche = tbill_bal / (staging_months - m + 1)
        tbill_bal -= tranche
        eq_bal += tranche
    rem_yrs_p6 = max(0.0, horizon - stage_yrs)
    nw_p6 = (eq_bal + tbill_bal) * ((1 + eq_after_tax) ** rem_yrs_p6)
    reinvestment_drag_vs_lump = nw_p3 - nw_p6

    return {
        "transfer_year": transfer_year,
        "horizon": horizon,
        "property_a_t0_fmv": r10(fmv0),
        "paths": {
            "live_a": {
                "name": "Pure 1: Live in Property A (Prop 19)",
                "type": "pure",
                "ending_wealth": r10(nw_p1),
                "property_value": r10(end_fmv_p1),
                "liquid_portfolio": r10(port_p1),
                "notes": "Claims Prop 19; includes imputed rent + optional 3rd SF unit rent"
            },
            "rent_a": {
                "name": "Pure 2: Rent Property A (Reassessed)",
                "type": "pure",
                "ending_wealth": r10(nw_p2_held),
                "ending_wealth_liquidated": r10(nw_p2_liq),
                "property_value": r10(end_fmv_p2),
                "liquid_portfolio": r10(port_p2),
                "notes": "No Prop 19; 27.5-yr depreciation; liquidated value reflects § 1250 recapture + CA MHST"
            },
            "sell_immediate": {
                "name": "Pure 3: Sell Immediate & Invest (Lump Sum)",
                "type": "pure",
                "ending_wealth": r10(nw_p3),
                "initial_net_proceeds": r10(sale_p3["net_proceeds"]),
                "transfer_tax": r10(sale_p3["transfer_tax"]),
                "tx_costs": r10(sale_p3["tx_costs"]),
                "notes": "Same tax year as death: § 1014 step-up eliminates capital gain; full liquidity"
            },
            "mixed_live_sell": {
                "name": "Mixed 1: Live 5 Yrs (§ 121) then Sell",
                "type": "mixed",
                "ending_wealth": r10(nw_p4),
                "sec121_applied": True,
                "notes": "Claims Prop 19 during occupancy + $500k MFJ / $250k Single § 121 exclusion at sale"
            },
            "mixed_rent_1031": {
                "name": "Mixed 2: Rent 10 Yrs then 1031 Exchange",
                "type": "mixed",
                "ending_wealth": r10(nw_p5),
                "notes": "Defers capital gain & § 1250 recapture via IRC § 1031 into replacement investment property"
            },
            "mixed_sell_phased": {
                "name": f"Mixed 3: Sell + Phased Treasuries ({staging_months}m)",
                "type": "mixed",
                "ending_wealth": r10(nw_p6),
                "reinvestment_risk_drag": r10(reinvestment_drag_vs_lump),
                "notes": "Parks proceeds in 3M–2Y Treasuries (CA tax-exempt) & phases into equities; shows reinvestment drag"
            }
        }
    }


def run_monte_carlo(inp, transfer_year: int = 2045, horizon: int = 20, trials: int = 500):
    """Deterministic-seed Monte Carlo distribution (P10/P25/P50/P75/P90) for Sell Immediate,
    Sell + Phased 30m Treasuries, Live in A, and Rent A."""
    rng = random.Random(20261125)
    pa_t0 = project_property_a_to_year(inp, transfer_year, 1)
    fmv0 = float(pa_t0["fmv"])
    sale_p3 = compute_sale_net_proceeds(fmv0, fmv0, 0.0, inp, 1)
    net0 = sale_p3["net_proceeds"]

    eq_mean = inp["macro_assumptions"]["equity_return_nominal_range"][1] - 0.006
    eq_vol = inp["macro_assumptions"]["equity_volatility"]
    home_mean = inp["macro_assumptions"]["home_appreciation_a_range"][1]
    home_vol = 0.065
    tb_mean = inp["macro_assumptions"]["treasury_yield_range"][1] * (1 - 0.37)

    results = {"sell_immediate": [], "mixed_sell_phased": [], "live_a": [], "rent_a": []}
    for _ in range(trials):
        w_sell = net0
        w_phased_tb = net0
        w_phased_eq = 0.0
        w_live = fmv0
        w_rent = fmv0
        for y in range(1, horizon + 1):
            r_eq = max(-0.45, rng.gauss(eq_mean, eq_vol))
            r_hm = max(-0.20, rng.gauss(home_mean, home_vol))
            r_tb = max(0.005, rng.gauss(tb_mean, 0.012))

            w_sell *= (1 + r_eq)
            if y <= 3:
                w_phased_tb *= (1 + r_tb)
                w_phased_eq *= (1 + r_eq)
                tranche = w_phased_tb / (4 - y)
                w_phased_tb -= tranche
                w_phased_eq += tranche
            else:
                w_phased_eq *= (1 + r_eq)

            # Live & Rent approximate total return (appreciation + net yield/imputed rent)
            w_live *= (1 + r_hm + 0.011)
            w_rent *= (1 + r_hm + 0.007)

        results["sell_immediate"].append(w_sell)
        results["mixed_sell_phased"].append(w_phased_eq + w_phased_tb)
        results["live_a"].append(w_live)
        results["rent_a"].append(w_rent)

    summary = {}
    for k, arr in results.items():
        arr.sort()
        n = len(arr)
        summary[k] = {
            "p10": r10(arr[int(0.10 * n)]),
            "p25": r10(arr[int(0.25 * n)]),
            "p50": r10(arr[int(0.50 * n)]),
            "p75": r10(arr[int(0.75 * n)]),
            "p90": r10(arr[int(0.90 * n)]),
        }
    return {"transfer_year": transfer_year, "horizon": horizon, "trials": trials, "percentiles": summary}


def run_black_swan_scenarios(inp, transfer_year: int = 2045, horizon: int = 20):
    """Test 5 historical Black Swan regimes right at inheritance entry, comparing:
    1) Sell Immediate (Lump Sum Equity)
    2) Sell + Phased-Investing (3M-2Y Treasuries for 30 months)
    3) Live in Property A (Prop 19)
    4) Rent Property A
    Always reports Reinvestment Risk beside the Phased-Investing headline."""
    pa_t0 = project_property_a_to_year(inp, transfer_year, 1)
    fmv0 = float(pa_t0["fmv"])
    sale_p3 = compute_sale_net_proceeds(fmv0, fmv0, 0.0, inp, 1)
    net0 = sale_p3["net_proceeds"]

    scenarios = [
        {
            "id": "1929_depression",
            "name": "1929 Great Depression Entry",
            "description": "Severe deflationary equity crash (-45%, -30%, -15% in yrs 1–3) followed by slow recovery; Bay Area real estate drops -25% over 3 yrs.",
            "eq_shocks": [-0.45, -0.30, -0.15, 0.20, 0.12],
            "re_shocks": [-0.10, -0.10, -0.05, 0.00, 0.02],
            "tb_shocks": [0.035, 0.025, 0.015, 0.010, 0.010],
            "reinvestment_risk_note": "Treasury yields fall from 3.5% to 1.0% during deflation; however, avoiding the -67% cumulative equity drawdown dominates."
        },
        {
            "id": "1970s_stagflation",
            "name": "1970s Stagflation & High Inflation",
            "description": "High inflation (8–11%), stagnant real equities (-15%, -10%, +5%), high nominal Treasury yields (7–9%), strong nominal real estate (+9%/yr).",
            "eq_shocks": [-0.15, -0.10, 0.05, 0.04, 0.06],
            "re_shocks": [0.09, 0.09, 0.08, 0.08, 0.07],
            "tb_shocks": [0.055, 0.060, 0.055, 0.050, 0.045],
            "reinvestment_risk_note": "High nominal Treasury yields soften equity stagflation, but real purchasing power erodes if inflation exceeds after-tax Treasury yield."
        },
        {
            "id": "2000_dotcom",
            "name": "2000 Dot-Com / Silicon Valley Shock",
            "description": "3-year tech equity bear market (-12%, -18%, -22%); Cupertino rent dips -15% while home values stall before recovering.",
            "eq_shocks": [-0.12, -0.18, -0.22, 0.24, 0.10],
            "re_shocks": [0.02, -0.04, -0.02, 0.05, 0.07],
            "tb_shocks": [0.040, 0.025, 0.015, 0.012, 0.020],
            "reinvestment_risk_note": "Fed cuts short-term rates sharply (reinvestment risk on maturing 3M–2Y Treasuries), yet phased entry buys equities near 2002–2003 lows."
        },
        {
            "id": "2008_gfc",
            "name": "2008 Global Financial Crisis",
            "description": "Sharp -38% equity crash in Yr 1, +25% rebound in Yr 2; Bay Area real estate -18% peak-to-trough; Treasury yields drop near 0.2%.",
            "eq_shocks": [-0.38, 0.25, 0.14, 0.02, 0.15],
            "re_shocks": [-0.12, -0.06, 0.00, 0.02, 0.08],
            "tb_shocks": [0.020, 0.005, 0.003, 0.002, 0.002],
            "reinvestment_risk_note": "Severe reinvestment risk: 3M–2Y Treasuries roll over near 0.2% after Yr 1, and phasing misses part of the Yr 2 +25% V-shaped rebound."
        },
        {
            "id": "2022_rate_shock",
            "name": "2022 Inflation & Rate-Spike Shock",
            "description": "Stocks -18% and long bonds -15% simultaneously in Yr 1, followed by +22% equity rebound in Yr 2; 3M–2Y Treasuries jump to 4.5–5.0%.",
            "eq_shocks": [-0.18, 0.22, 0.18, 0.08, 0.07],
            "re_shocks": [-0.06, 0.01, 0.04, 0.04, 0.04],
            "tb_shocks": [0.025, 0.032, 0.030, 0.025, 0.022],
            "reinvestment_risk_note": "Short-duration 3M–2Y Treasuries avoid long-bond duration loss, but phasing still trails lump-sum if Yr 2–3 equities surge +44%."
        }
    ]

    normal_eq = inp["macro_assumptions"]["equity_return_nominal_range"][1] - 0.006
    normal_re = inp["macro_assumptions"]["home_appreciation_a_range"][1]

    out = []
    for sc in scenarios:
        w_lump = net0
        w_tb = net0
        w_eq = 0.0
        w_live = fmv0
        w_rent = fmv0
        min_lump = w_lump
        min_phased = net0

        for y in range(1, horizon + 1):
            r_eq = sc["eq_shocks"][y - 1] if y <= 5 else normal_eq
            r_re = sc["re_shocks"][y - 1] if y <= 5 else normal_re
            r_tb = sc["tb_shocks"][y - 1] if y <= 5 else 0.025

            w_lump *= (1 + r_eq)
            min_lump = min(min_lump, w_lump)

            # 30-month (2.5 yr) phased entry approximated cleanly across yrs 1-3 (40%, 40%, 20%)
            if y == 1:
                w_tb *= (1 + r_tb)
                tranche = w_tb * 0.40
                w_tb -= tranche
                w_eq = tranche * (1 + r_eq * 0.5)
            elif y == 2:
                w_tb *= (1 + r_tb)
                w_eq *= (1 + r_eq)
                tranche = w_tb * 0.6667
                w_tb -= tranche
                w_eq += tranche * (1 + r_eq * 0.5)
            elif y == 3:
                w_tb *= (1 + r_tb)
                w_eq *= (1 + r_eq)
                w_eq += w_tb * (1 + r_eq * 0.5)
                w_tb = 0.0
            else:
                w_eq *= (1 + r_eq)
            min_phased = min(min_phased, w_tb + w_eq)

            w_live *= (1 + r_re + 0.011)
            w_rent *= (1 + r_re + 0.007)

        w_phased = w_tb + w_eq
        out.append({
            "id": sc["id"],
            "name": sc["name"],
            "description": sc["description"],
            "sell_lump_sum_end": r10(w_lump),
            "sell_phased_30m_end": r10(w_phased),
            "phased_vs_lump_delta": r10(w_phased - w_lump),
            "lump_max_drawdown_pct": round((min_lump / net0 - 1.0) * 100, 1),
            "phased_max_drawdown_pct": round((min_phased / net0 - 1.0) * 100, 1),
            "live_a_end": r10(w_live),
            "rent_a_end": r10(w_rent),
            "reinvestment_risk_note": sc["reinvestment_risk_note"]
        })
    return {"transfer_year": transfer_year, "horizon": horizon, "scenarios": out}


def build_estate_tax_projection(inp):
    """Project Federal Estate Tax Basic Exclusion Amount (2026 = $15,000,000) to 2040/2045/2050."""
    tl = inp["tax_and_legal"]
    infl = inp["macro_assumptions"]["inflation_range"][1]
    rows = []
    for yr in [2026, 2030, 2035, 2040, 2045, 2050]:
        n = yr - 2026
        excl_single = tl["federal_estate_exclusion_2026"] * ((1 + infl) ** n)
        excl_married_portability = excl_single * 2.0
        rows.append({
            "year": yr,
            "single_exclusion": r10(excl_single),
            "married_portability_exclusion": r10(excl_married_portability),
            "top_federal_rate_pct": 40.0,
            "ca_estate_tax": 0
        })
    return rows


def generate_full_model():
    inp = load_inputs()

    # Year-by-year projections for Property A and B (2026 to 2050)
    prop_a_proj = [project_property_a_to_year(inp, yr, 1) for yr in range(2026, 2051)]
    prop_b_proj = [project_property_b_to_year(inp, yr, 1) for yr in range(2026, 2051)]

    # Matrix of all transfer_years x horizons (Low / Base / High)
    matrix = {}
    for ty in inp["meta"]["transfer_years"]:
        matrix[str(ty)] = {}
        for h in inp["meta"]["horizons_years"]:
            matrix[str(ty)][str(h)] = {
                "low": simulate_paths(inp, ty, h, scenario_idx=0),
                "base": simulate_paths(inp, ty, h, scenario_idx=1),
                "high": simulate_paths(inp, ty, h, scenario_idx=2),
            }

    mc = run_monte_carlo(inp, transfer_year=2045, horizon=20, trials=500)
    bs = run_black_swan_scenarios(inp, transfer_year=2045, horizon=20)
    estate_proj = build_estate_tax_projection(inp)

    return {
        "meta": inp["meta"],
        "sources": inp["sources"],
        "properties_input": inp["properties"],
        "tax_and_legal": inp["tax_and_legal"],
        "macro_assumptions": inp["macro_assumptions"],
        "property_a_projection": prop_a_proj,
        "property_b_projection": prop_b_proj,
        "comparison_matrix": matrix,
        "monte_carlo": mc,
        "black_swan": bs,
        "estate_tax_projection": estate_proj,
    }


if __name__ == "__main__":
    out = generate_full_model()
    out_path = ROOT / "docs" / "data" / "model_output.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"Model generated successfully -> {out_path}")
    base_2045_20 = out["comparison_matrix"]["2045"]["20"]["base"]["paths"]
    for k, v in base_2045_20.items():
        print(f"  {v['name']}: ${v['ending_wealth']:,}")
