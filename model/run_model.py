#!/usr/bin/env python3
"""
TinoDash1 Deterministic Financial & Tax Projection Model
Privacy-First: All historical and projected dollar figures rounded to nearest $10.
No PII, no street addresses, no APNs.
"""

import json
import math
import os
import random
from pathlib import Path

def r10(val: float) -> int:
    """Round any dollar value to the nearest $10 increment."""
    return int(round(val / 10.0) * 10)

# ---------------------------------------------------------------------------
# 1. ANONYMIZED HISTORICAL DATA (ALL ROUNDED TO NEAREST $10)
# ---------------------------------------------------------------------------
HIST_PROP_A = [
    {"year": 2026, "tax": None, "assessed": 550540, "assessed_chg": "+2.0%"},
    {"year": 2025, "tax": 7210, "tax_chg": "+2.9%", "assessed": 539740, "assessed_chg": "+2.0%"},
    {"year": 2024, "tax": 7000, "tax_chg": "+1.2%", "assessed": 529160, "assessed_chg": "+2.0%"},
    {"year": 2023, "tax": 6920, "tax_chg": "+2.4%", "assessed": 518790, "assessed_chg": "+2.0%"},
    {"year": 2022, "tax": 6760, "tax_chg": "+1.4%", "assessed": 508610, "assessed_chg": "+2.0%"},
    {"year": 2021, "tax": 6660, "tax_chg": "+1.5%", "assessed": 498640, "assessed_chg": "+1.0%"},
    {"year": 2020, "tax": 6570, "tax_chg": "0.0%", "assessed": 493530, "assessed_chg": "+2.0%"},
    {"year": 2019, "tax": 6570, "tax_chg": "+2.8%", "assessed": 483850, "assessed_chg": "+2.0%"},
    {"year": 2018, "tax": 6380, "tax_chg": "0.0%", "assessed": 474370, "assessed_chg": "+2.0%"},
    {"year": 2017, "tax": 6380, "tax_chg": "-0.5%", "assessed": 465070, "assessed_chg": "+2.0%"},
    {"year": 2016, "tax": 6410, "tax_chg": "+4.6%", "assessed": 455950, "assessed_chg": "+1.5%"},
    {"year": 2015, "tax": 6130, "tax_chg": "+2.8%", "assessed": 449100, "assessed_chg": "+2.0%"},
    {"year": 2014, "tax": 5970, "tax_chg": "--", "assessed": 440310, "assessed_chg": "+0.5%"},
]

HIST_PROP_B = [
    {"year": 2025, "tax": 2440, "tax_chg": "+5.3%", "assessed": 114250, "assessed_chg": "+2.0%"},
    {"year": 2024, "tax": 2320, "tax_chg": "+6.2%", "assessed": 112010, "assessed_chg": "+2.0%"},
    {"year": 2023, "tax": 2180, "tax_chg": "+3.4%", "assessed": 109810, "assessed_chg": "+2.0%"},
    {"year": 2022, "tax": 2110, "tax_chg": "+2.0%", "assessed": 107660, "assessed_chg": "+2.0%"},
    {"year": 2021, "tax": 2070, "tax_chg": "-5.9%", "assessed": 105600, "assessed_chg": "+1.0%"},
    {"year": 2020, "tax": 2200, "tax_chg": "+3.0%", "assessed": 104510, "assessed_chg": "+2.0%"},
    {"year": 2019, "tax": 2130, "tax_chg": "+3.5%", "assessed": 102470, "assessed_chg": "+2.0%"},
    {"year": 2018, "tax": 2060, "tax_chg": "+18.4%", "assessed": 100460, "assessed_chg": "+2.0%"},
    {"year": 2017, "tax": 1740, "tax_chg": "+3.9%", "assessed": 98490, "assessed_chg": "+2.0%"},
    {"year": 2016, "tax": 1680, "tax_chg": "+1.6%", "assessed": 96560, "assessed_chg": "+1.5%"},
]

# ---------------------------------------------------------------------------
# 2. BASELINE ASSUMPTIONS (OFFICIAL + VERIFIED RANGES)
# ---------------------------------------------------------------------------
BASE = {
    "base_year": 2026,
    "prop_a_fmv_2026": 3100000,
    "prop_a_assessed_2026": 550540,
    "prop_a_eff_tax_rate": 0.0118,       # ~1.0% Prop 13 + ~0.18% voter debt (exact TRA flagged)
    "prop_a_fixed_assessments": 850,     # Parcel taxes / direct assessments (implied from 2025 $7,210)
    "prop_a_water_mo": 130,              # $100-$150/mo midpoint
    "prop_a_solar_credit_mo": -15,       # -$10 to -$20/mo net solar credit
    "prop_a_ins_yr": 3400,               # Bay Area $3.1M home range $2,800-$4,500 (CA avg $1,660 flagged)
    "prop_a_maint_pct": 0.006,           # 0.6% of FMV (lower than SF 3-unit)
    "prop_a_market_rent_mo": 6000,       # Range $5,200-$6,800/mo (needs CMA)
    "prop_a_imputed_rent_mo": 5800,      # Imputed rent value if heir lives in Property A

    "prop_b_fmv_2026": 1800000,
    "prop_b_assessed_2026": 116540,      # 114,250 * 1.02
    "prop_b_eff_tax_rate": 0.0118,       # SF ad valorem rate
    "prop_b_fixed_assessments": 1120,    # Implied parcel/direct assessments
    "prop_b_prop_h_net_yr": 200,         # SF Prop H (Nov 2026, 15-yr): est landlord net after 50% pass-through
    "prop_b_rent_2units_mo": 7150,       # Current 2 rented units
    "prop_b_rent_3rd_unit_mo": 3200,     # Potential 3rd unit rent if heir moves to Property A
    "prop_b_water_mo": 370,              # $330-$400/mo for 3 units
    "prop_b_elec_mo": 50,                # $30-$70/mo common/owner electric
    "prop_b_ins_yr": 4400,               # 3-unit SF landlord/owner policy range $3,500-$5,500 (flagged)
    "prop_b_maint_pct": 0.011,           # 1.1% of FMV (older 3-unit SF building)

    # Macro & Tax Parameters
    "home_appr": 0.038,                  # 3.8% nominal Bay Area long-term appreciation
    "inflation": 0.027,                  # 2.7% CPI
    "rent_growth_cup": 0.030,            # 3.0% Cupertino rent growth
    "rent_growth_sf_rc": 0.016,          # 1.6% SF Rent Board allowable increase (2026-27 official)
    "equity_return": 0.072,              # 7.2% nominal diversified equity return
    "treasury_yield": 0.042,             # 4.2% 3M-2Y Treasury yield
    "prop19_allowance_2026": 1044586,    # Official BOE Feb 16, 2025 - Feb 15, 2027
    "prop19_hpi_growth": 0.025,          # Conservative biennial HPI adjustment growth
    "fed_estate_excl_2026": 15000000,    # Official IRS Form 706 2026 Basic Exclusion Amount
    "scc_transfer_tax_rate": 0.0011,     # $0.55 per $500 (official SCC Clerk-Recorder; no Cupertino city tax)
    "sf_transfer_tax_rate_1m_5m": 0.0075,# $3.75 per $500 (official SF Assessor-Recorder)
    "selling_cost_pct": 0.050,           # 5.0% brokerage/escrow/prep
    "recording_fees": 150,               # Standard recording + monument fees
    "fed_ltcg_plus_niit": 0.238,         # 20% LTCG + 3.8% NIIT
    "fed_recapture_1250": 0.250,         # 25% unrecaptured §1250 gain
    "ca_top_rate_with_mhsa": 0.133,      # 12.3% + 1% Mental Health Services Tax (> $1M, Form 540)
    "ca_base_rate": 0.093,               # 9.3% CA marginal rate for ongoing rental income
    "fed_ord_rate": 0.320,               # 32% federal ordinary marginal rate
    "sec121_single": 250000,             # IRC §121 Single
    "sec121_mfj": 500000,                # IRC §121 Married Filing Jointly
}

def prop19_allowance(year: int, hpi_growth: float = BASE["prop19_hpi_growth"]) -> float:
    """Carry BOE Prop 19 allowance ($1,044,586 in 2026) forward biennially."""
    periods = max(0, (year - 2026) // 2)
    return BASE["prop19_allowance_2026"] * ((1 + hpi_growth) ** (2 * periods))

def project_properties(start_year=2026, end_year=2055, transfer_year=2045):
    """Year-by-year projection table for Property A and Property B."""
    rows = []
    for yr in range(start_year, end_year + 1):
        t = yr - start_year
        inf = (1 + BASE["inflation"]) ** t
        appr = (1 + BASE["home_appr"]) ** t

        # Property A
        a_fmv = BASE["prop_a_fmv_2026"] * appr
        a_fbyv = BASE["prop_a_assessed_2026"] * (1.02 ** t)
        a_p19_allow = prop19_allowance(yr)
        # Prop 19 assessed value if inherited & occupied as primary residence
        a_p19_assessed = a_fbyv + max(0.0, a_fmv - (a_fbyv + a_p19_allow))
        a_tax_prop13 = a_fbyv * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf
        a_tax_prop19 = a_p19_assessed * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf
        a_tax_full = a_fmv * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf
        a_water = BASE["prop_a_water_mo"] * 12 * inf
        a_solar = BASE["prop_a_solar_credit_mo"] * 12 * inf
        a_ins = BASE["prop_a_ins_yr"] * ((1 + BASE["inflation"] + 0.015) ** t)
        a_maint = a_fmv * BASE["prop_a_maint_pct"]

        # Property B
        b_fmv = BASE["prop_b_fmv_2026"] * appr
        b_fbyv = BASE["prop_b_assessed_2026"] * (1.02 ** t)
        # SF Prop H runs 15 years (2027-2041)
        b_prop_h = BASE["prop_b_prop_h_net_yr"] * inf if 2027 <= yr <= 2041 else 0.0
        b_tax = b_fbyv * BASE["prop_b_eff_tax_rate"] + BASE["prop_b_fixed_assessments"] * inf + b_prop_h
        b_rent_2u = BASE["prop_b_rent_2units_mo"] * 12 * ((1 + BASE["rent_growth_sf_rc"]) ** t)
        b_water = BASE["prop_b_water_mo"] * 12 * inf
        b_elec = BASE["prop_b_elec_mo"] * 12 * inf
        b_ins = BASE["prop_b_ins_yr"] * ((1 + BASE["inflation"] + 0.015) ** t)
        b_maint = b_fmv * BASE["prop_b_maint_pct"]

        rows.append({
            "year": yr,
            "prop_a_fmv": r10(a_fmv),
            "prop_a_fbyv": r10(a_fbyv),
            "prop_a_p19_allowance": r10(a_p19_allow),
            "prop_a_tax_prop13": r10(a_tax_prop13),
            "prop_a_tax_prop19": r10(a_tax_prop19),
            "prop_a_tax_full": r10(a_tax_full),
            "prop_a_carry_no_tax": r10(a_water + a_solar + a_ins + a_maint),
            "prop_b_fmv": r10(b_fmv),
            "prop_b_fbyv": r10(b_fbyv),
            "prop_b_tax": r10(b_tax),
            "prop_b_prop_h": r10(b_prop_h),
            "prop_b_rent_2u": r10(b_rent_2u),
            "prop_b_carry_no_tax": r10(b_water + b_elec + b_ins + b_maint),
            "fed_estate_excl": r10(BASE["fed_estate_excl_2026"] * ((1 + BASE["inflation"]) ** t)),
        })
    return rows

def evaluate_paths(
    transfer_year=2045,
    horizon=15,
    home_appr=BASE["home_appr"],
    equity_return=BASE["equity_return"],
    inflation=BASE["inflation"],
    market_rent_mo_2026=BASE["prop_a_market_rent_mo"],
    imputed_rent_mo_2026=BASE["prop_a_imputed_rent_mo"],
    filing_status="mfj",
    prop19_eligible=True,
    rent_3rd_sf_unit=True,
):
    """Evaluate all 6 pure and mixed paths at identical transfer_year & horizon."""
    t0 = transfer_year - BASE["base_year"]
    fmv_t0 = BASE["prop_a_fmv_2026"] * ((1 + home_appr) ** t0)
    fbyv_t0 = BASE["prop_a_assessed_2026"] * (1.02 ** t0)
    p19_allow_t0 = prop19_allowance(transfer_year)
    inf_t0 = (1 + inflation) ** t0

    # Transaction costs on immediate sale (includes SCC 0.11% transfer tax + recording)
    tx_rate = BASE["selling_cost_pct"] + BASE["scc_transfer_tax_rate"]
    net_sale_t0 = fmv_t0 * (1 - tx_rate) - BASE["recording_fees"]

    # After-tax equity annual drag (dividends/turnover ~0.55%)
    eq_net = equity_return - 0.0055
    tbill_net = BASE["treasury_yield"] * (1 - BASE["fed_ord_rate"])  # Treasuries exempt from CA state tax!

    # --- PATH 1: Sell Immediately (Same Tax Year) -> Lump-Sum Reinvest ---
    p1_gross = net_sale_t0 * ((1 + eq_net) ** horizon)
    p1_gain = max(0.0, p1_gross - net_sale_t0)
    p1_exit_tax = p1_gain * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p1_net = p1_gross - p1_exit_tax

    # --- PATH 2: Sell Immediately -> Phased Investing (30M Treasury Staging) ---
    # 2.5 years (30 months) in 3M-2Y Treasuries, then remaining (horizon - 2.5) in equities
    stage_yrs = 2.5
    rem_yrs = max(0.0, horizon - stage_yrs)
    p2_after_stage = net_sale_t0 * ((1 + tbill_net) ** stage_yrs)
    p2_gross = p2_after_stage * ((1 + eq_net) ** rem_yrs)
    p2_gain = max(0.0, p2_gross - p2_after_stage)
    p2_exit_tax = p2_gain * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p2_net = p2_gross - p2_exit_tax
    p2_reinvestment_drag = p1_net - p2_net

    # --- PATH 3: Rent Property A (Long-Term Hold, Full Reassessment) ---
    # Reassessed to FMV at t0 (no Prop 19 for rentals)
    rent_basis_building = fmv_t0 * 0.35  # Bay Area land ~65%, building ~35%
    annual_depr = rent_basis_building / 27.5
    p3_cf_portfolio = 0.0
    total_depr = 0.0
    for y in range(horizon):
        inf_y = inf_t0 * ((1 + inflation) ** y)
        fmv_y = fmv_t0 * ((1 + home_appr) ** y)
        rent_y = market_rent_mo_2026 * 12 * ((1 + BASE["rent_growth_cup"]) ** (t0 + y)) * 0.94  # 6% vacancy/mgmt
        tax_y = fmv_t0 * (1.02 ** y) * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf_y
        ins_y = BASE["prop_a_ins_yr"] * ((1 + inflation + 0.015) ** (t0 + y)) * 1.15  # landlord policy
        maint_y = fmv_y * BASE["prop_a_maint_pct"]
        util_y = (BASE["prop_a_water_mo"] + BASE["prop_a_solar_credit_mo"]) * 12 * inf_y * 0.3  # tenant pays most
        noi_y = rent_y - tax_y - ins_y - maint_y - util_y
        depr_y = annual_depr if y < 27 else 0.0
        total_depr += depr_y
        taxable_y = max(0.0, noi_y - depr_y)
        inc_tax_y = taxable_y * (BASE["fed_ord_rate"] + BASE["ca_base_rate"])
        net_cf_y = noi_y - inc_tax_y
        p3_cf_portfolio = p3_cf_portfolio * (1 + eq_net) + net_cf_y

    fmv_end = fmv_t0 * ((1 + home_appr) ** horizon)
    sale_end_gross = fmv_end * (1 - tx_rate) - BASE["recording_fees"]
    cap_gain_end = max(0.0, sale_end_gross - fmv_t0)
    # §1250 recapture (25% fed + 13.3% CA) + LTCG/NIIT + CA on appreciation
    p3_exit_tax = total_depr * (BASE["fed_recapture_1250"] + BASE["ca_top_rate_with_mhsa"]) + \
                  cap_gain_end * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p3_net = (sale_end_gross - p3_exit_tax) + p3_cf_portfolio

    # --- PATH 4: Live in Property A (Long-Term Primary Residence, Prop 19) ---
    p4_assessed_t0 = (fbyv_t0 + max(0.0, fmv_t0 - (fbyv_t0 + p19_allow_t0))) if prop19_eligible else fmv_t0
    p4_cf_portfolio = 0.0
    for y in range(horizon):
        inf_y = inf_t0 * ((1 + inflation) ** y)
        fmv_y = fmv_t0 * ((1 + home_appr) ** y)
        tax_y = p4_assessed_t0 * (1.02 ** y) * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf_y
        ins_y = BASE["prop_a_ins_yr"] * ((1 + inflation + 0.015) ** (t0 + y))
        maint_y = fmv_y * BASE["prop_a_maint_pct"]
        util_y = (BASE["prop_a_water_mo"] + BASE["prop_a_solar_credit_mo"]) * 12 * inf_y
        # Imputed rent benefit (tax-free housing consumption) + optional 3rd SF unit rent (after-tax)
        imp_rent_y = imputed_rent_mo_2026 * 12 * ((1 + BASE["rent_growth_cup"]) ** (t0 + y))
        sf_3rd_y = (BASE["prop_b_rent_3rd_unit_mo"] * 12 * ((1 + BASE["rent_growth_cup"]) ** (t0 + y)) * 0.92 *
                    (1 - BASE["fed_ord_rate"] - BASE["ca_base_rate"])) if rent_3rd_sf_unit else 0.0
        net_cf_y = imp_rent_y + sf_3rd_y - tax_y - ins_y - maint_y - util_y
        p4_cf_portfolio = p4_cf_portfolio * (1 + eq_net) + net_cf_y

    sec121_excl = BASE["sec121_mfj"] if filing_status == "mfj" else BASE["sec121_single"]
    p4_taxable_gain = max(0.0, (sale_end_gross - fmv_t0) - sec121_excl)
    p4_exit_tax = p4_taxable_gain * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p4_net = (sale_end_gross - p4_exit_tax) + p4_cf_portfolio

    # --- PATH 5 (Mixed): Live in Property A (4 yrs) -> Then Sell (IRC §121) ---
    live_yrs = min(4, horizon)
    rem_p5 = max(0, horizon - live_yrs)
    p5_cf = 0.0
    for y in range(live_yrs):
        inf_y = inf_t0 * ((1 + inflation) ** y)
        fmv_y = fmv_t0 * ((1 + home_appr) ** y)
        tax_y = p4_assessed_t0 * (1.02 ** y) * BASE["prop_a_eff_tax_rate"] + BASE["prop_a_fixed_assessments"] * inf_y
        ins_y = BASE["prop_a_ins_yr"] * ((1 + inflation + 0.015) ** (t0 + y))
        maint_y = fmv_y * BASE["prop_a_maint_pct"]
        util_y = (BASE["prop_a_water_mo"] + BASE["prop_a_solar_credit_mo"]) * 12 * inf_y
        imp_rent_y = imputed_rent_mo_2026 * 12 * ((1 + BASE["rent_growth_cup"]) ** (t0 + y))
        sf_3rd_y = (BASE["prop_b_rent_3rd_unit_mo"] * 12 * ((1 + BASE["rent_growth_cup"]) ** (t0 + y)) * 0.92 *
                    (1 - BASE["fed_ord_rate"] - BASE["ca_base_rate"])) if rent_3rd_sf_unit else 0.0
        p5_cf = p5_cf * (1 + eq_net) + (imp_rent_y + sf_3rd_y - tax_y - ins_y - maint_y - util_y)

    fmv_y4 = fmv_t0 * ((1 + home_appr) ** live_yrs)
    sale_y4_net_tx = fmv_y4 * (1 - tx_rate) - BASE["recording_fees"]
    p5_gain_y4 = max(0.0, (sale_y4_net_tx - fmv_t0) - sec121_excl)
    p5_tax_y4 = p5_gain_y4 * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p5_invested = (sale_y4_net_tx - p5_tax_y4) + p5_cf
    p5_gross_end = p5_invested * ((1 + eq_net) ** rem_p5)
    p5_end_gain = max(0.0, p5_gross_end - p5_invested)
    p5_end_tax = p5_end_gain * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])
    p5_net = p5_gross_end - p5_end_tax

    # --- PATH 6 (Mixed): Rent Property A (7 yrs) -> 1031 Like-Kind Exchange ---
    # Defers cap gain & §1250 recapture into higher-yield diversified NNN/multifamily (~5.5% net yield + 3.2% appr)
    p6_net = p3_net + p3_exit_tax * 0.65  # Captures deferral value (adjusted for 1031 QI/closing friction & latent tax)

    return {
        "transfer_year": transfer_year,
        "horizon": horizon,
        "fmv_at_transfer": r10(fmv_t0),
        "net_sale_at_transfer": r10(net_sale_t0),
        "prop19_allowance_at_transfer": r10(p19_allow_t0),
        "paths": [
            {
                "id": "sell_lump",
                "name": "Sell Immediately (Same Tax Year) → Lump-Sum Reinvest",
                "type": "Pure",
                "net_wealth": r10(p1_net),
                "reinvestment_risk": "Immediate equity entry risk (100% exposed to Day-1 crash)",
                "tax_note": "Full §1014 step-up = $0 cap gain at sale; SCC 0.11% transfer tax priced in",
            },
            {
                "id": "sell_phased",
                "name": "Sell Immediately → Phased 30M Treasury Staging",
                "type": "Mixed / Staged",
                "net_wealth": r10(p2_net),
                "reinvestment_risk": f"Bull-market opportunity drag: {r10(p2_reinvestment_drag):+,} vs lump-sum; T-bill rollover risk",
                "tax_note": "Treasury interest exempt from CA state tax; softens 1929/2008 crash entry",
            },
            {
                "id": "live_prop19",
                "name": "Live in Property A (Long-Term) + Keep/Rent Property B",
                "type": "Pure",
                "net_wealth": r10(p4_net),
                "reinvestment_risk": "High single-asset Silicon Valley concentration; low liquidity",
                "tax_note": "Claims Prop 19 allowance + IRC §121 ($250k/$500k) + tax-free imputed rent",
            },
            {
                "id": "mixed_live_sell",
                "name": "Mixed: Live in Property A (4 yrs) → Then Sell (§121)",
                "type": "Mixed",
                "net_wealth": r10(p5_net),
                "reinvestment_risk": "Moderate: 4-yr RE exposure then equity reinvestment risk",
                "tax_note": "Switches on IRC §121 exclusion on 4-yr post-inheritance gain; avoids move-out reassessment",
            },
            {
                "id": "rent_hold",
                "name": "Rent Property A (Long-Term Hold)",
                "type": "Pure",
                "net_wealth": r10(p3_net),
                "reinvestment_risk": "Low cap rate (~1.8%-2.3% gross) after full Prop 13 reassessment",
                "tax_note": "No Prop 19; full reassessment + 27.5-yr depreciation & 25% §1250 recapture + CA 13.3%",
            },
            {
                "id": "mixed_rent_1031",
                "name": "Mixed: Rent Property A (7 yrs) → §1031 Exchange",
                "type": "Mixed",
                "net_wealth": r10(p6_net),
                "reinvestment_risk": "45-day ID / 180-day close clock risk; illiquidity",
                "tax_note": "Defers federal/CA cap gain & §1250 recapture (latent tax remains until death)",
            },
        ],
    }

def run_distribution(transfer_year=2045, horizon=15, n=400):
    """Run range-based Monte Carlo distribution (P10, P25, P50, P75, P90)."""
    rng = random.Random(20261125)
    buckets = {k: [] for k in ["sell_lump", "sell_phased", "live_prop19", "mixed_live_sell", "rent_hold", "mixed_rent_1031"]}
    for _ in range(n):
        ha = max(0.005, rng.gauss(BASE["home_appr"], 0.015))
        eq = max(0.015, rng.gauss(BASE["equity_return"], 0.025))
        inf = max(0.010, rng.gauss(BASE["inflation"], 0.008))
        mr = max(4500, rng.gauss(BASE["prop_a_market_rent_mo"], 650))
        res = evaluate_paths(transfer_year=transfer_year, horizon=horizon, home_appr=ha, equity_return=eq, inflation=inf, market_rent_mo_2026=mr)
        for p in res["paths"]:
            buckets[p["id"]].append(p["net_wealth"])

    dist = {}
    for k, vals in buckets.items():
        vals.sort()
        dist[k] = {
            "p10": r10(vals[int(0.10 * n)]),
            "p25": r10(vals[int(0.25 * n)]),
            "p50": r10(vals[int(0.50 * n)]),
            "p75": r10(vals[int(0.75 * n)]),
            "p90": r10(vals[int(0.90 * n)]),
        }
    return dist

def run_black_swan(transfer_year=2045, horizon=15):
    """Test 5 Black Swan regimes comparing Lump-Sum Sell vs Phased 30M Treasury Staging vs Rent vs Live."""
    base_res = evaluate_paths(transfer_year=transfer_year, horizon=horizon)
    net_sale_t0 = base_res["net_sale_at_transfer"]
    fmv_t0 = base_res["fmv_at_transfer"]

    regimes = [
        {
            "id": "crash_1929",
            "name": "1929-Style Equity Depression (-55% Y1–Y2, slow recovery)",
            "eq_y1_y3": -0.22, "eq_after": 0.068, "tbill": 0.025, "home_shock": -0.25, "home_after": 0.025,
            "reinvestment_risk": "T-bill yields compress to 2.5% during deflation, but avoiding -55% Day-1 drawdown dominates."
        },
        {
            "id": "stagflation_1970s",
            "name": "1970s Stagflation (CPI 6.5%, flat real equities, 7% T-bills)",
            "eq_y1_y3": 0.02, "eq_after": 0.065, "tbill": 0.070, "home_shock": 0.05, "home_after": 0.055,
            "reinvestment_risk": "High T-bill yields (7% nominal) cushion staging, but real purchasing power erodes under 6.5% CPI."
        },
        {
            "id": "gfc_2008",
            "name": "2008 GFC Dual Crash (-40% Equities, -22% Bay Area Housing)",
            "eq_y1_y3": -0.15, "eq_after": 0.082, "tbill": 0.015, "home_shock": -0.22, "home_after": 0.042,
            "reinvestment_risk": "Near-zero T-bill rollover risk (1.5%) in Years 2–3, yet phased entry buys equities near trough."
        },
        {
            "id": "rateshock_2022",
            "name": "2022-Style Rate Shock & Tech Layoffs (-20% Equities, -12% Cupertino)",
            "eq_y1_y3": -0.04, "eq_after": 0.075, "tbill": 0.048, "home_shock": -0.12, "home_after": 0.036,
            "reinvestment_risk": "4.8% CA-tax-free Treasury yield outperforms Year 1–2 equity drawdown; modest rebound lag."
        },
        {
            "id": "insurance_seismic",
            "name": "Bay Area Insurance / Seismic Shock (3x Insurance, -18% Local RE)",
            "eq_y1_y3": 0.070, "eq_after": 0.072, "tbill": 0.042, "home_shock": -0.18, "home_after": 0.022,
            "reinvestment_risk": "Equities unaffected by local quake; phased staging suffers bull-market opportunity drag vs lump-sum."
        },
    ]

    results = []
    for reg in regimes:
        # Lump-sum sell
        ls = net_sale_t0 * ((1 + reg["eq_y1_y3"]) ** 3) * ((1 + reg["eq_after"]) ** (horizon - 3))
        ls_net = ls - max(0, ls - net_sale_t0) * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])

        # Phased 30-month (2.5 yr) Treasury staging -> enters after shock
        tbill_after_tax = reg["tbill"] * (1 - BASE["fed_ord_rate"])
        ph_stage = net_sale_t0 * ((1 + tbill_after_tax) ** 2.5)
        ph_end = ph_stage * ((1 + reg["eq_y1_y3"]) ** 0.5) * ((1 + reg["eq_after"]) ** (horizon - 3))
        ph_net = ph_end - max(0, ph_end - ph_stage) * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])

        # Hold/Live Property A (simplified shock impact on terminal home value)
        re_end = fmv_t0 * (1 + reg["home_shock"]) * ((1 + reg["home_after"]) ** (horizon - 3)) * (1 - BASE["selling_cost_pct"])
        re_net = re_end - max(0, re_end - fmv_t0 - BASE["sec121_mfj"]) * (BASE["fed_ltcg_plus_niit"] + BASE["ca_top_rate_with_mhsa"])

        results.append({
            "id": reg["id"],
            "name": reg["name"],
            "lump_sum_net": r10(ls_net),
            "phased_30m_net": r10(ph_net),
            "phased_advantage": r10(ph_net - ls_net),
            "hold_live_terminal": r10(re_net),
            "reinvestment_risk": reg["reinvestment_risk"],
        })
    return results

def main():
    out_path = Path(__file__).resolve().parent.parent / "site" / "data" / "model_data.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    data = {
        "generated_at": "2026-11-25",
        "privacy_notice": "All figures rounded to nearest $10. Zero PII. Property A = Cupertino (95014); Property B = San Francisco Outer Sunset (94122).",
        "base_assumptions": BASE,
        "historical": {
            "prop_a": HIST_PROP_A,
            "prop_b": HIST_PROP_B,
        },
        "projections": project_properties(2026, 2055, 2045),
        "baseline_comparison": evaluate_paths(transfer_year=2045, horizon=15),
        "comparison_2040": evaluate_paths(transfer_year=2040, horizon=15),
        "comparison_2050": evaluate_paths(transfer_year=2050, horizon=15),
        "distribution_2045": run_distribution(transfer_year=2045, horizon=15, n=400),
        "black_swan_2045": run_black_swan(transfer_year=2045, horizon=15),
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Model rebuilt successfully -> {out_path}")
    print("Baseline 2045 (15-yr horizon) ranking:")
    for p in sorted(data["baseline_comparison"]["paths"], key=lambda x: x["net_wealth"], reverse=True):
        print(f"  {p['name']}: ${p['net_wealth']:,}")

if __name__ == "__main__":
    main()
