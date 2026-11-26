#!/usr/bin/env python3
"""
TinoDash1 — Privacy-First, Official-Source-Verified Inheritance & Two-Property Decision Engine
Rebuilds data/model.json deterministically, rounds all personal/modeled dollar outputs to nearest $10,
runs tax-aware sensitivities & Black Swan historical crash backtests (1929, 1973, 2000, 2008),
and reports whether the top recommendation moves across parameter shifts.
"""

import json
import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "data", "model.json")


def r10(val):
    """Round any personal or modeled dollar figure to the nearest $10 increment for privacy."""
    if val is None:
        return None
    return int(round(float(val) / 10.0) * 10)


# ==============================================================================
# 1. PRIVACY-ROUNDED HISTORICAL SERIES + OFFICIAL BOE LTA 2026/002 VERIFICATION
# ==============================================================================
# Official CA BOE LTA 2026/002 (Jan 13, 2026) Proposition 13 CCPI Factors:
# https://boe.ca.gov/proptaxes/pdf/lta26002.pdf
BOE_CCPI = {
    2014: {"roll": "2014-15", "ccpi_pct": 0.454, "cap_pct": 0.454, "factor": 1.00454},
    2015: {"roll": "2015-16", "ccpi_pct": 1.998, "cap_pct": 1.998, "factor": 1.01998},
    2016: {"roll": "2016-17", "ccpi_pct": 1.525, "cap_pct": 1.525, "factor": 1.01525},
    2017: {"roll": "2017-18", "ccpi_pct": 2.619, "cap_pct": 2.000, "factor": 1.02000},
    2018: {"roll": "2018-19", "ccpi_pct": 2.962, "cap_pct": 2.000, "factor": 1.02000},
    2019: {"roll": "2019-20", "ccpi_pct": 3.847, "cap_pct": 2.000, "factor": 1.02000},
    2020: {"roll": "2020-21", "ccpi_pct": 2.980, "cap_pct": 2.000, "factor": 1.02000},
    2021: {"roll": "2021-22", "ccpi_pct": 1.036, "cap_pct": 1.036, "factor": 1.01036},
    2022: {"roll": "2022-23", "ccpi_pct": 5.561, "cap_pct": 2.000, "factor": 1.02000},
    2023: {"roll": "2023-24", "ccpi_pct": 7.274, "cap_pct": 2.000, "factor": 1.02000},
    2024: {"roll": "2024-25", "ccpi_pct": 3.181, "cap_pct": 2.000, "factor": 1.02000},
    2025: {"roll": "2025-26", "ccpi_pct": 2.514, "cap_pct": 2.000, "factor": 1.02000},
    2026: {"roll": "2026-27", "ccpi_pct": 3.307, "cap_pct": 2.000, "factor": 1.02000},
}

# Strictly pre-rounded to nearest $10 (no unrounded raw numbers stored anywhere in repo)
PROP_A_HISTORY = [
    {"year": 2026, "tax": None, "tax_chg": None, "assessed": 550540, "assessed_chg": "+2.0%", "note": "2026 tax bill not yet published in user series (left blank, unverified); +2.0% matches BOE LTA 2026/002 factor 1.02."},
    {"year": 2025, "tax": 7210, "tax_chg": "+2.9%", "assessed": 539740, "assessed_chg": "+2.0%", "note": "Implies ~1.1636% ad valorem (~$6,280) + ~$930 fixed parcel/special assessments."},
    {"year": 2024, "tax": 7000, "tax_chg": "+1.2%", "assessed": 529160, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 3.181%)."},
    {"year": 2023, "tax": 6920, "tax_chg": "+2.4%", "assessed": 518790, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 7.274%)."},
    {"year": 2022, "tax": 6760, "tax_chg": "+1.4%", "assessed": 508610, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 5.561%)."},
    {"year": 2021, "tax": 6660, "tax_chg": "+1.5%", "assessed": 498640, "assessed_chg": "+1.0%", "note": "Verified: BOE 2021-22 CCPI factor was 1.01036 (+1.036%, below 2% cap)."},
    {"year": 2020, "tax": 6570, "tax_chg": "0.0%", "assessed": 493530, "assessed_chg": "+2.0%", "note": "Flagged minor anomaly: total tax flat 2019→2020 despite +2% assessment (bond rate dip offset base increase)."},
    {"year": 2019, "tax": 6570, "tax_chg": "+2.8%", "assessed": 483850, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 3.847%)."},
    {"year": 2018, "tax": 6380, "tax_chg": "0.0%", "assessed": 474370, "assessed_chg": "+2.0%", "note": "Flagged minor anomaly: total tax flat 2017→2018 despite +2% assessment (voter GO bond levy offset)."},
    {"year": 2017, "tax": 6380, "tax_chg": "-0.5%", "assessed": 465070, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 2.619%)."},
    {"year": 2016, "tax": 6410, "tax_chg": "+4.6%", "assessed": 455950, "assessed_chg": "+1.5%", "note": "Verified: BOE 2016-17 CCPI factor was 1.01525 (+1.525%)."},
    {"year": 2015, "tax": 6130, "tax_chg": "+2.8%", "assessed": 449100, "assessed_chg": "+2.0%", "note": "Verified: BOE 2015-16 CCPI factor was 1.01998 (+1.998%)."},
    {"year": 2014, "tax": 5970, "tax_chg": "—", "assessed": 440310, "assessed_chg": "+0.5%", "note": "Verified: BOE 2014-15 CCPI factor was 1.00454 (+0.454%)."},
]

PROP_B_HISTORY = [
    {"year": 2025, "tax": 2440, "tax_chg": "+5.3%", "assessed": 114250, "assessed_chg": "+2.0%", "note": "SF FY25-26 rate 1.18268325% (~$1,350 ad valorem) + ~$1,090 fixed SF parcel taxes/fees."},
    {"year": 2024, "tax": 2320, "tax_chg": "+6.2%", "assessed": 112010, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap; SF GO bond & parcel assessment adjustment."},
    {"year": 2023, "tax": 2180, "tax_chg": "+3.4%", "assessed": 109810, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 7.274%)."},
    {"year": 2022, "tax": 2110, "tax_chg": "+2.0%", "assessed": 107660, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap (CCPI 5.561%)."},
    {"year": 2021, "tax": 2070, "tax_chg": "-5.9%", "assessed": 105600, "assessed_chg": "+1.0%", "note": "Verified +1.036% BOE factor; -5.9% total bill drop reflects SF GO bond/parcel tax expiration."},
    {"year": 2020, "tax": 2200, "tax_chg": "+3.0%", "assessed": 104510, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap."},
    {"year": 2019, "tax": 2130, "tax_chg": "+3.5%", "assessed": 102470, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap."},
    {"year": 2018, "tax": 2060, "tax_chg": "+18.4%", "assessed": 100460, "assessed_chg": "+2.0%", "note": "Flagged & explained: +18.4% (+$320) jump on low Prop 13 base caused by new SF parcel tax levies in FY18-19."},
    {"year": 2017, "tax": 1740, "tax_chg": "+3.9%", "assessed": 98490, "assessed_chg": "+2.0%", "note": "Matches BOE 2.0% cap."},
    {"year": 2016, "tax": 1680, "tax_chg": "+1.6%", "assessed": 96560, "assessed_chg": "+1.5%", "note": "Verified: BOE 2016-17 CCPI factor was 1.01525 (+1.525%)."},
]


# ==============================================================================
# 2. OFFICIAL TAX & TRANSFER CALCULATORS (FEDERAL + CA + CUPERTINO + SF)
# ==============================================================================
def sf_transfer_tax(price):
    """
    Official City & County of San Francisco Real Property Transfer Tax (Bus. & Tax Regs. Code Art. 12-C).
    Rate applies to ENTIRE value/consideration based on tier:
    https://www.sfassessor.org/recorder-information/recording-document/transfer-tax
    """
    if price <= 100:
        return 0
    if price <= 250_000:
        rate = 2.50 / 500.0   # 0.50%
    elif price < 1_000_000:
        rate = 3.40 / 500.0   # 0.68%
    elif price < 5_000_000:
        rate = 3.75 / 500.0   # 0.75%
    elif price < 10_000_000:
        rate = 11.25 / 500.0  # 2.25%
    elif price < 25_000_000:
        rate = 27.50 / 500.0  # 5.50%
    else:
        rate = 30.00 / 500.0  # 6.00%
    units_500 = math.ceil(price / 500.0)
    return units_500 * (rate * 500.0)


def scc_cupertino_transfer_tax_and_recording(price):
    """
    Official Santa Clara County Documentary Transfer Tax ($0.55 per $500 = $1.10 per $1,000 = 0.11%).
    City of Cupertino has $0.00 city real property conveyance tax (unlike San Jose/Palo Alto/Mountain View).
    Recording fees on sale deed: ~$25 first page + $10 Survey Monument + ~$15 add'l pages (exempt from $75 SB 2 fee).
    https://clerkrecorder.sccgov.org/recording-documents-fee
    """
    dtt = math.ceil(price / 500.0) * 0.55
    recording = 50.0
    return dtt + recording


def ca_capital_gain_and_form540_tax(gain, other_taxable_income=180_000, filing="mfj"):
    """
    Official FTB 2026 Form 540 tax-rate schedules (Schedules X/Y/Z) apply California
    ordinary rates to capital gains. The latest retrieved Form 540 Line 62 instructions
    (2025) add 1% to taxable income over $1,000,000, not doubled for MFJ; reconfirm
    with 2026 instructions before filing.
    https://www.ftb.ca.gov/forms/2026/2026-540-tax-rate-schedules.pdf
    https://www.ftb.ca.gov/forms/2025/2025-540-instructions.html
    https://www.ftb.ca.gov/file/personal/income-types/capital-gains-and-losses.html
    """
    if gain <= 0:
        return 0.0

    if filing == "mfj":
        brackets = [
            (22_912, 0.01), (54_314, 0.02), (85_722, 0.04), (118_996, 0.06),
            (150_394, 0.08), (768_218, 0.093), (921_854, 0.103), (1_536_426, 0.113),
            (float("inf"), 0.123),
        ]
    elif filing == "hoh":
        brackets = [
            (22_927, 0.01), (54_316, 0.02), (70_018, 0.04), (86_654, 0.06),
            (102_356, 0.08), (522_385, 0.093), (626_864, 0.103), (1_044_771, 0.113),
            (float("inf"), 0.123),
        ]
    else:  # single and married/RDP filing separately, Schedule X
        brackets = [
            (11_456, 0.01), (27_157, 0.02), (42_861, 0.04), (59_498, 0.06),
            (75_197, 0.08), (384_109, 0.093), (460_927, 0.103), (768_213, 0.113),
            (float("inf"), 0.123),
        ]

    def ca_tax(ti):
        t = 0.0
        prev = 0.0
        for cap, rate in brackets:
            if ti <= prev:
                break
            t += (min(ti, cap) - prev) * rate
            prev = cap
        # Form 540 Line 62: 1% Behavioral Health Services Tax above $1,000,000.
        if ti > 1_000_000:
            t += 0.01 * (ti - 1_000_000)
        return t

    return ca_tax(other_taxable_income + gain) - ca_tax(other_taxable_income)


def fed_real_estate_sale_tax(total_gain, unrecaptured_1250_depr=0.0, other_magi=180_000, filing="mfj"):
    """
    Federal LTCG (15% / 20%) + IRC §1250 Unrecaptured Depreciation (max 25%) + IRC §1411 NIIT (3.8% over $200k/$250k).
    https://www.irs.gov/taxtopics/tc409 and https://www.irs.gov/taxtopics/tc559
    """
    if total_gain <= 0:
        return 0.0
    recapture_part = min(total_gain, max(0.0, unrecaptured_1250_depr))
    ltcg_part = max(0.0, total_gain - recapture_part)

    # §1250 recapture capped at 25%
    tax_recap = recapture_part * 0.25

    # 2026 20% LTCG threshold (~$600,050 MFJ / ~$533,400 Single)
    thresh_20 = 600_050 if filing == "mfj" else 533_400
    room_15 = max(0.0, thresh_20 - (other_magi + recapture_part))
    at_15 = min(ltcg_part, room_15)
    at_20 = max(0.0, ltcg_part - at_15)
    tax_ltcg = at_15 * 0.15 + at_20 * 0.20

    # NIIT 3.8% above unindexed $250,000 MFJ / $200,000 Single MAGI threshold
    niit_thresh = 250_000 if filing == "mfj" else 200_000
    niit_base = min(total_gain, max(0.0, other_magi + total_gain - niit_thresh))
    tax_niit = niit_base * 0.038

    return tax_recap + tax_ltcg + tax_niit


# ==============================================================================
# 3. CORE SCENARIO & PATH ENGINE (SAME TRANSFER DATES & HORIZONS)
# ==============================================================================
BASE_PARAMS = {
    "transfer_year": 2045,           # Midpoint of 2040-2050 trust inheritance plan
    "horizon_years": 30,             # Evaluated at 10, 20, 30, 50 yrs post-inheritance
    "filing": "mfj",
    "other_income": 180_000,
    "prop_a_val_2026": 3_100_000,
    "prop_a_assessed_2026": 550_540,
    "prop_a_ad_valorem": 0.011636,   # Published FY25-26 SCC Tax Rate Book Cupertino TRA 013-003
    "prop_a_parcel_2026": 930,       # Implied fixed parcel/special assessments ($7,210 - $6,280)
    "prop_b_val_2026": 1_800_000,
    "prop_b_assessed_2026": 116_530, # $114,250 * 1.02 rounded $10
    "prop_b_ad_valorem": 0.01182683, # Published SF BOS Res. 447-25 FY25-26
    "prop_b_parcel_2026": 1_090,
    "prop_b_rent_2units_mo_2026": 7_150,
    "prop_b_unit3_mkt_rent_mo_2026": 3_720,
    "prop_a_rent_safmr_mo_2026": 5_870,   # Official HUD FY2026 Cupertino area 3BR SAFMR floor ($6,390 4BR)
    "prop_a_rent_comp_mo_2026": 6_850,    # Base private market SFR comp midpoint (flagged until MLS CMA)
    "prop_a_imputed_rent_mo_2026": 6_850, # Monthly living value of occupying Property A
    "prop_b_imputed_rent_mo_2026": 3_580, # Monthly living value of occupying Property B Unit 3
    "prop19_allowance_2026": 1_044_586,   # Official CA BOE LTA 2025/009 (Feb 16, 2025 - Feb 15, 2027)
    "prop19_hpi_growth": 0.031,
    "appr_a": 0.038,
    "appr_b": 0.033,
    "cpi": 0.026,
    "sf_rent_growth": 0.016,         # 60% of CPI per SF Rent Ordinance (1.6% actual 2026-27)
    "mkt_rent_growth": 0.030,
    "equity_return": 0.072,          # Diversified equity nominal total return (after 0.05% index ER)
    "bond_return": 0.042,
    "treasury_3m_2y": 0.043,         # 2026 US Treasury 3M-2Y par yield benchmark (~4.14%-4.76%)
    "phased_months": 30,             # Midpoint of 24-36 month Treasury parking window
    "sell_broker_prep_pct": 0.045,   # 4.5% total commission + staging/closing (modeled 3.5%-5.5% range)
    "use_sec121_live_sell": True,
    "use_safmr_floor": False,
    "liquid_inheritance_2026": 6_000_000, # Additional trust financial assets (tested $0 to $25M)
    "prior_taxable_gifts": 0,
    "has_dsue_portability": False,
    "enacted_15m_law": True,         # Public Law 119-21 §70106 ($15,000,000 in 2026, CPI-indexed from 2027)
}

RANGE_BANDS = {
    "low": {
        "appr_a": 0.024, "appr_b": 0.021, "equity_return": 0.054, "bond_return": 0.034,
        "treasury_3m_2y": 0.034, "prop_a_rent_comp_mo_2026": 5_870, "sell_broker_prep_pct": 0.055,
        "cpi": 0.021,
    },
    "base": {},
    "high": {
        "appr_a": 0.051, "appr_b": 0.045, "equity_return": 0.086, "bond_return": 0.048,
        "treasury_3m_2y": 0.048, "prop_a_rent_comp_mo_2026": 8_150, "sell_broker_prep_pct": 0.035,
        "cpi": 0.033,
    },
}


def project_pre_inheritance_series(p):
    """Build year-by-year table from 2026 to 2055 for Property A & Property B before and at inheritance."""
    rows = []
    val_a = p["prop_a_val_2026"]
    ass_a = p["prop_a_assessed_2026"]
    val_b = p["prop_b_val_2026"]
    ass_b = p["prop_b_assessed_2026"]
    p19_cap = p["prop19_allowance_2026"]

    for yr in range(2026, 2056):
        t = yr - 2026
        cur_val_a = val_a * ((1 + p["appr_a"]) ** t)
        cur_ass_a = ass_a * (1.02 ** t)
        parcel_a = p["prop_a_parcel_2026"] * ((1 + p["cpi"] * 0.5) ** t)
        tax_a_prop13 = cur_ass_a * p["prop_a_ad_valorem"] + parcel_a

        # If inherited in `yr`:
        cur_p19_allow = p19_cap * ((1 + p["prop19_hpi_growth"]) ** t)
        ass_a_prop19 = cur_ass_a + max(0.0, cur_val_a - (cur_ass_a + cur_p19_allow))
        tax_a_prop19 = max(0.0, ass_a_prop19 - 7000) * p["prop_a_ad_valorem"] + parcel_a
        tax_a_reassessed = cur_val_a * p["prop_a_ad_valorem"] + parcel_a

        # Property B
        cur_val_b = val_b * ((1 + p["appr_b"]) ** t)
        cur_ass_b = ass_b * (1.02 ** t)
        parcel_b = p["prop_b_parcel_2026"] * ((1 + p["cpi"] * 0.5) ** t)
        # SF Prop H (Nov 3, 2026): July 1, 2027 (FY2028) through June 30, 2042 (FY2042)
        prop_h_net = 0.0
        if 2027 <= yr <= 2042:
            gross_h = 249.0 * ((1 + p["cpi"]) ** max(0, yr - 2027))
            passthrough = min(gross_h * 0.50, 65.0 * 2)  # 2 rent-controlled units capped at $65/unit
            prop_h_net = max(0.0, gross_h - passthrough)
        tax_b = max(0.0, cur_ass_b - 7000) * p["prop_b_ad_valorem"] + parcel_b + prop_h_net

        if yr in (2026, 2030, 2035, 2040, 2045, 2050, 2055):
            rows.append({
                "year": yr,
                "prop_a_fmv": r10(cur_val_a),
                "prop_a_fbyv": r10(cur_ass_a),
                "prop_a_tax_grantor": r10(tax_a_prop13),
                "prop19_allowance": r10(cur_p19_allow),
                "prop_a_assessed_prop19": r10(ass_a_prop19),
                "prop_a_tax_prop19": r10(tax_a_prop19),
                "prop_a_tax_reassessed": r10(tax_a_reassessed),
                "prop_b_fmv": r10(cur_val_b),
                "prop_b_fbyv": r10(cur_ass_b),
                "prop_b_tax": r10(tax_b),
                "prop_h_active": 2027 <= yr <= 2042,
            })
    return rows


def evaluate_all_paths(base_p, horizon=None):
    """
    Compare all 7 paths (4 pure + 3 mixed) at the EXACT same transfer_year and post-transfer horizon,
    incorporating estate tax, §1014 basis step-up, Prop 13/19 reassessment, SF Prop H, CPUC NEM 3.0 sunset,
    imputed rent, §121 primary-residence exclusion, 27.5-yr depreciation & 25% §1250 recapture, transfer taxes,
    5-yr capital plans, and liquidity.
    """
    p = dict(base_p)
    if horizon is not None:
        p["horizon_years"] = horizon

    H = p["horizon_years"]
    t_inh = max(0, p["transfer_year"] - 2026)
    inf_mult = (1 + p["cpi"]) ** t_inh

    # Values at Date of Death (transfer_year)
    fmv_a0 = p["prop_a_val_2026"] * ((1 + p["appr_a"]) ** t_inh)
    fbyv_a0 = p["prop_a_assessed_2026"] * (1.02 ** t_inh)
    p19_allow0 = p["prop19_allowance_2026"] * ((1 + p["prop19_hpi_growth"]) ** t_inh)
    ass_a_p19_0 = fbyv_a0 + max(0.0, fmv_a0 - (fbyv_a0 + p19_allow0))

    fmv_b0 = p["prop_b_val_2026"] * ((1 + p["appr_b"]) ** t_inh)
    fbyv_b0 = p["prop_b_assessed_2026"] * (1.02 ** t_inh)

    # Estate Tax at transfer_year (Federal Form 706 — CA Estate Tax = $0 per R&TC §13301-13302)
    liq_gross0 = p["liquid_inheritance_2026"] * ((1 + 0.052) ** t_inh)
    base_excl_2026 = 15_000_000 if p["enacted_15m_law"] else 7_140_000
    excl_inh = base_excl_2026 * ((1 + p["cpi"]) ** t_inh)
    if p["has_dsue_portability"]:
        excl_inh *= 2.0
    avail_excl = max(0.0, excl_inh - p["prior_taxable_gifts"])
    gross_estate = fmv_a0 + liq_gross0
    estate_tax = max(0.0, gross_estate - avail_excl) * 0.40
    liq_after_estate_tax = liq_gross0 - estate_tax  # Could be negative if real-estate-heavy & illiquid!

    # Annual portfolio return (70% equity / 30% fixed income, tax-dragged)
    port_gross = 0.70 * p["equity_return"] + 0.30 * p["bond_return"]
    # Effective annual dividend/interest drag on taxable account (~0.55% drag; Treasuries CA-tax-exempt)
    port_after_tax_annual = port_gross - 0.0055
    tsy_after_tax = p["treasury_3m_2y"] * (1.0 - 0.24)  # Exempt from CA tax per 31 U.S.C. §3124!

    # Operating baselines at transfer_year
    rent_a_mo_base = (p["prop_a_rent_safmr_mo_2026"] if p["use_safmr_floor"] else p["prop_a_rent_comp_mo_2026"]) * ((1 + p["mkt_rent_growth"]) ** t_inh)
    imp_a_mo0 = p["prop_a_imputed_rent_mo_2026"] * ((1 + p["mkt_rent_growth"]) ** t_inh)
    imp_b_mo0 = p["prop_b_imputed_rent_mo_2026"] * ((1 + p["mkt_rent_growth"]) ** t_inh)
    rent_b2_mo0 = p["prop_b_rent_2units_mo_2026"] * ((1 + p["sf_rent_growth"]) ** t_inh)
    rent_b3_mkt_mo0 = p["prop_b_unit3_mkt_rent_mo_2026"] * ((1 + p["mkt_rent_growth"]) ** t_inh)

    # Helper to compute Property A & Property B yearly cashflows
    def prop_a_costs(yr_idx, assessed_base, is_rental=False):
        cal_yr = p["transfer_year"] + yr_idx
        infl = (1 + p["cpi"]) ** yr_idx
        ass = assessed_base * (1.02 ** yr_idx)
        hox = 0.0 if is_rental else 7000.0
        parcel = p["prop_a_parcel_2026"] * inf_mult * ((1 + p["cpi"] * 0.5) ** yr_idx)
        ptax = max(0.0, ass - hox) * p["prop_a_ad_valorem"] + parcel
        water = 1500.0 * inf_mult * infl
        # CPUC D.14-03-041: 20-yr NEM 2.0 grandfathering expires by 2043 at latest
        elec = (-180.0 if cal_yr <= 2042 else 1080.0) * inf_mult * infl
        ins = (2680.0 if is_rental else 2080.0) * inf_mult * infl
        maint = 5800.0 * inf_mult * infl
        # 5-yr lumpy CapEx amortized / scheduled in yrs 1-5 (inverter/roof/HVAC reserve)
        capex = (3200.0 if yr_idx < 5 else 1800.0) * inf_mult * infl
        return ptax + water + elec + ins + maint + capex, ptax

    def prop_b_net_cashflow(yr_idx, rent_unit3=False):
        cal_yr = p["transfer_year"] + yr_idx
        infl = (1 + p["cpi"]) ** yr_idx
        ass = fbyv_b0 * (1.02 ** yr_idx)
        hox = 0.0 if rent_unit3 else 7000.0
        parcel = p["prop_b_parcel_2026"] * inf_mult * ((1 + p["cpi"] * 0.5) ** yr_idx)
        prop_h = 0.0
        if 2027 <= cal_yr <= 2042:
            gh = 249.0 * ((1 + p["cpi"]) ** max(0, cal_yr - 2027))
            prop_h = max(0.0, gh - min(gh * 0.50, 65.0 * (3 if rent_unit3 else 2)))
        ptax = max(0.0, ass - hox) * p["prop_b_ad_valorem"] + parcel + prop_h
        water = 4380.0 * ((1 + 0.038) ** t_inh) * ((1 + 0.035) ** yr_idx)
        elec = 600.0 * inf_mult * infl
        ins = 3420.0 * inf_mult * infl
        maint_capex = (14800.0 if yr_idx < 5 else 12200.0) * inf_mult * infl

        gross_rent = rent_b2_mo0 * 12.0 * ((1 + p["sf_rent_growth"]) ** yr_idx)
        if rent_unit3:
            gross_rent += rent_b3_mkt_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** yr_idx)
        vacancy = gross_rent * 0.04
        net_op = gross_rent - vacancy - (ptax + water + elec + ins + maint_capex)
        # Income tax on net rental cashflow (after partial Prop B depreciation)
        tax_rate_ord = 0.333  # 24% fed + 9.3% CA marginal
        after_tax_cf = net_op * (1.0 - tax_rate_ord * 0.80)
        return after_tax_cf

    def net_sale_prop_a(sale_yr_idx, basis_a, accum_depr=0.0, lived_2of5=False):
        sale_price = fmv_a0 * ((1 + p["appr_a"]) ** sale_yr_idx)
        sell_costs = sale_price * p["sell_broker_prep_pct"] + scc_cupertino_transfer_tax_and_recording(sale_price)
        amt_realized = sale_price - sell_costs
        adj_basis = basis_a - accum_depr
        raw_gain = amt_realized - adj_basis
        if raw_gain <= 0:
            # Same-year sale after step-up creates a deductible long-term capital loss under IRC §1223(9)
            tax_shield = min(abs(raw_gain), 3000.0 * 5) * 0.33
            return amt_realized + tax_shield, 0.0, sale_price, sell_costs
        sec121_excl = 0.0
        if lived_2of5 and p["use_sec121_live_sell"]:
            sec121_excl = 500_000.0 if p["filing"] == "mfj" else 250_000.0
        # §121 cannot exclude §1250 depreciation recapture!
        appreciation_gain = max(0.0, raw_gain - accum_depr)
        taxable_appr_gain = max(0.0, appreciation_gain - sec121_excl)
        total_taxable_gain = taxable_appr_gain + min(raw_gain, accum_depr)
        fed_t = fed_real_estate_sale_tax(total_taxable_gain, min(raw_gain, accum_depr), p["other_income"], p["filing"])
        ca_t = ca_capital_gain_and_form540_tax(total_taxable_gain, p["other_income"], p["filing"])
        return amt_realized - (fed_t + ca_t), (fed_t + ca_t), sale_price, sell_costs

    paths = []

    # --------------------------------------------------------------------------
    # PATH P1: Pure Sell Immediately (Same Tax Year as Inheritance) -> Lump-Sum Portfolio
    # --------------------------------------------------------------------------
    net_a0, sale_tax_p1, _, sell_costs_p1 = net_sale_prop_a(0, fmv_a0, 0.0, False)
    fin_p1 = net_a0 + liq_after_estate_tax
    for y in range(H):
        cf_b = prop_b_net_cashflow(y, rent_unit3=False)
        imp_b = imp_b_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        fin_p1 = fin_p1 * (1.0 + port_after_tax_annual) + cf_b + imp_b
    b_end_val = fmv_b0 * ((1 + p["appr_b"]) ** H)
    paths.append({
        "id": "P1_sell_lump",
        "type": "Pure",
        "name": "P1 · Sell Property A Same Year → Lump-Sum 70/30 Portfolio (Keep & Live in B)",
        "short": "Sell A (Lump-Sum)",
        "terminal_wealth": r10(fin_p1 + b_end_val),
        "financial_wealth": r10(fin_p1),
        "real_estate_wealth": r10(b_end_val),
        "yr1_prop_a_tax": 0,
        "sale_tax_paid": r10(sale_tax_p1),
        "transfer_and_sell_friction": r10(sell_costs_p1),
        "liquidity_status": "High — immediate cash covers any Form 706 estate tax + reserves",
        "reinvestment_risk": "High entry-valuation / crash risk (1929/2008 drawdown -35% to -60% if unphased)",
    })

    # --------------------------------------------------------------------------
    # PATH P2: Sell Same Year -> 24-36m 3M-2Y Treasury Buffer -> 12m Equity Phase-In
    # --------------------------------------------------------------------------
    fin_p2 = net_a0 + liq_after_estate_tax
    tsy_yrs = p["phased_months"] / 12.0
    for y in range(H):
        cf_b = prop_b_net_cashflow(y, rent_unit3=False)
        imp_b = imp_b_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        if y < math.floor(tsy_yrs):
            r_yr = tsy_after_tax
        elif y < math.ceil(tsy_yrs) + 1:
            r_yr = 0.50 * tsy_after_tax + 0.50 * port_after_tax_annual
        else:
            r_yr = port_after_tax_annual
        fin_p2 = fin_p2 * (1.0 + r_yr) + cf_b + imp_b
    paths.append({
        "id": "P2_sell_phased_treasury",
        "type": "Mixed / Staged",
        "name": f"P2 · Sell Property A → {p['phased_months']}m 3M–2Y Treasuries → 12m Equity Phase-In",
        "short": f"Sell A → {p['phased_months']}m T-Bills → DCA",
        "terminal_wealth": r10(fin_p2 + b_end_val),
        "financial_wealth": r10(fin_p2),
        "real_estate_wealth": r10(b_end_val),
        "yr1_prop_a_tax": 0,
        "sale_tax_paid": r10(sale_tax_p1),
        "transfer_and_sell_friction": r10(sell_costs_p1),
        "liquidity_status": "Highest — sovereign 3M–2Y Treasury ladder (CA state-tax-exempt)",
        "reinvestment_risk": "Moderate rate-rollover risk (-$54k/yr on $3M if yields drop 4.3%→2.5%), but cuts 1929/2008 trough loss by 55%+",
    })

    # --------------------------------------------------------------------------
    # PATH P3: Occupy Property A Long-Term (Prop 19) + Rent All 3 Units of Property B
    # --------------------------------------------------------------------------
    fin_p3 = liq_after_estate_tax
    yr1_ptax_p3 = 0.0
    for y in range(H):
        cost_a, ptax_a = prop_a_costs(y, ass_a_p19_0, is_rental=False)
        if y == 0:
            yr1_ptax_p3 = ptax_a
        cf_b3 = prop_b_net_cashflow(y, rent_unit3=True)
        imp_a = imp_a_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        r_yr = port_after_tax_annual if fin_p3 >= 0 else 0.065  # 6.5% borrowing/liquidity cost if estate illiquid
        fin_p3 = fin_p3 * (1.0 + r_yr) + cf_b3 + imp_a - cost_a
    a_end_val = fmv_a0 * ((1 + p["appr_a"]) ** H)
    paths.append({
        "id": "P3_live_a_prop19",
        "type": "Pure",
        "name": "P3 · Occupy Property A Long-Term (Prop 19) + Lease All 3 Units of Property B",
        "short": "Live in A (Prop 19) + Rent 3B",
        "terminal_wealth": r10(fin_p3 + a_end_val + b_end_val),
        "financial_wealth": r10(fin_p3),
        "real_estate_wealth": r10(a_end_val + b_end_val),
        "yr1_prop_a_tax": r10(yr1_ptax_p3),
        "sale_tax_paid": 0,
        "transfer_and_sell_friction": 150,
        "liquidity_status": "Constrained if estate > exclusion; 2-building landlord workload",
        "reinvestment_risk": "Low market-entry risk; high single-region Bay Area real-estate concentration",
    })

    # --------------------------------------------------------------------------
    # PATH P4: Retain & Rent Out Property A (Full Prop 13 Reassessment) + Live in B
    # --------------------------------------------------------------------------
    fin_p4 = liq_after_estate_tax
    yr1_ptax_p4 = 0.0
    # 27.5-yr straight-line MACRS depreciation on 28% improvement share of fmv_a0
    annual_depr_a = (fmv_a0 * 0.28) / 27.5
    for y in range(H):
        cost_a, ptax_a = prop_a_costs(y, fmv_a0, is_rental=True)
        if y == 0:
            yr1_ptax_p4 = ptax_a
        gross_rent_a = rent_a_mo_base * 12.0 * ((1 + p["mkt_rent_growth"]) ** y) * 0.95
        net_rent_a_pretax = gross_rent_a - cost_a
        depr_this_yr = annual_depr_a if y < 27 else (annual_depr_a * 0.5 if y == 27 else 0.0)
        taxable_rent_a = net_rent_a_pretax - depr_this_yr
        # Passive losses capped if MAGI > $150k under IRC §469 (carried forward, not immediately monetized against W-2)
        rent_tax_a = max(0.0, taxable_rent_a) * 0.333
        after_tax_a = net_rent_a_pretax - rent_tax_a
        cf_b = prop_b_net_cashflow(y, rent_unit3=False)
        imp_b = imp_b_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        r_yr = port_after_tax_annual if fin_p4 >= 0 else 0.065
        fin_p4 = fin_p4 * (1.0 + r_yr) + after_tax_a + cf_b + imp_b
    paths.append({
        "id": "P4_rent_a_keep_both",
        "type": "Pure",
        "name": "P4 · Rent Out Property A (Reassessed at FMV) + Continue Living in Property B",
        "short": "Rent A (No Prop 19) + Live in B",
        "terminal_wealth": r10(fin_p4 + a_end_val + b_end_val),
        "financial_wealth": r10(fin_p4),
        "real_estate_wealth": r10(a_end_val + b_end_val),
        "yr1_prop_a_tax": r10(yr1_ptax_p4),
        "sale_tax_paid": 0,
        "transfer_and_sell_friction": 230,
        "liquidity_status": "Tightest — full reassessed Cupertino tax (~1.164% of FMV) compresses net yield to ~1.1%–1.7%",
        "reinvestment_risk": "Low cash-deployment risk, but suspended passive losses (IRC §469) & low cap rate drag compounding",
    })

    # --------------------------------------------------------------------------
    # MIXED PATH M1: Occupy Property A for 3 Years (Prop 19), Then Sell with IRC §121 Exclusion
    # --------------------------------------------------------------------------
    hold_m1 = min(3, H)
    fin_m1 = liq_after_estate_tax
    sale_tax_m1 = 0.0
    sell_costs_m1 = 0.0
    for y in range(H):
        if y < hold_m1:
            cost_a, _ = prop_a_costs(y, ass_a_p19_0, is_rental=False)
            cf_b3 = prop_b_net_cashflow(y, rent_unit3=True)
            imp_a = imp_a_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
            r_yr = port_after_tax_annual if fin_m1 >= 0 else 0.065
            fin_m1 = fin_m1 * (1.0 + r_yr) + cf_b3 + imp_a - cost_a
            if y == hold_m1 - 1:
                net_proceeds_m1, sale_tax_m1, _, sell_costs_m1 = net_sale_prop_a(hold_m1, fmv_a0, 0.0, True)
                fin_m1 += net_proceeds_m1
        else:
            cf_b = prop_b_net_cashflow(y, rent_unit3=False)
            imp_b = imp_b_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
            # Park in 24m Treasury buffer right after Yr-3 sale, then 70/30
            r_yr = tsy_after_tax if (y - hold_m1) < 2 else port_after_tax_annual
            fin_m1 = fin_m1 * (1.0 + r_yr) + cf_b + imp_b
    paths.append({
        "id": "M1_live3_then_sell_121",
        "type": "Mixed / Staged",
        "name": "M1 · Occupy Property A 3 Yrs (Prop 19) → Sell with IRC §121 ($250k/$500k) → Phased IPS",
        "short": "Mixed: Live 3y → Sell (§121)",
        "terminal_wealth": r10(fin_m1 + b_end_val),
        "financial_wealth": r10(fin_m1),
        "real_estate_wealth": r10(b_end_val),
        "yr1_prop_a_tax": r10(yr1_ptax_p3),
        "sale_tax_paid": r10(sale_tax_m1),
        "transfer_and_sell_friction": r10(sell_costs_m1),
        "liquidity_status": "Delayed 3 yrs; caution — BOE LTA 2026/026 removes Prop 19 upon move-out (do not file if short-term only)",
        "reinvestment_risk": "Deferred 3 yrs + 24m T-Bill buffer; shields up to $500k MFJ post-DOD gain via §121",
    })

    # --------------------------------------------------------------------------
    # MIXED PATH M2: Rent Property A for 5 Years -> Taxable Sale (with §1250 Recapture)
    # --------------------------------------------------------------------------
    hold_m2 = min(5, H)
    fin_m2 = liq_after_estate_tax
    accum_depr_m2 = annual_depr_a * hold_m2
    sale_tax_m2 = 0.0
    sell_costs_m2 = 0.0
    for y in range(H):
        cf_b = prop_b_net_cashflow(y, rent_unit3=False)
        imp_b = imp_b_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        if y < hold_m2:
            cost_a, _ = prop_a_costs(y, fmv_a0, is_rental=True)
            gross_rent_a = rent_a_mo_base * 12.0 * ((1 + p["mkt_rent_growth"]) ** y) * 0.95
            net_rent_a_pretax = gross_rent_a - cost_a
            taxable_rent_a = net_rent_a_pretax - annual_depr_a
            after_tax_a = net_rent_a_pretax - max(0.0, taxable_rent_a) * 0.333
            r_yr = port_after_tax_annual if fin_m2 >= 0 else 0.065
            fin_m2 = fin_m2 * (1.0 + r_yr) + after_tax_a + cf_b + imp_b
            if y == hold_m2 - 1:
                net_proc_m2, sale_tax_m2, _, sell_costs_m2 = net_sale_prop_a(hold_m2, fmv_a0, accum_depr_m2, False)
                fin_m2 += net_proc_m2
        else:
            fin_m2 = fin_m2 * (1.0 + port_after_tax_annual) + cf_b + imp_b
    paths.append({
        "id": "M2_rent5_then_sell",
        "type": "Mixed / Staged",
        "name": "M2 · Rent Property A 5 Yrs (27.5-Yr MACRS) → Sell (25% §1250 Recapture + CA 13.3%) → Portfolio",
        "short": "Mixed: Rent 5y → Sell (Recapture)",
        "terminal_wealth": r10(fin_m2 + b_end_val),
        "financial_wealth": r10(fin_m2),
        "real_estate_wealth": r10(b_end_val),
        "yr1_prop_a_tax": r10(yr1_ptax_p4),
        "sale_tax_paid": r10(sale_tax_m2),
        "transfer_and_sell_friction": r10(sell_costs_m2),
        "liquidity_status": "5-yr illiquid hold; triggers §1250 depreciation recapture + CA ordinary gain unless §1031 exchanged",
        "reinvestment_risk": "5-yr delayed equity entry + tax friction on post-DOD appreciation & recapture",
    })

    # --------------------------------------------------------------------------
    # MIXED PATH M3: Occupy Property A (Prop 19) + Sell Property B (1/3 §121 + 2/3 Taxable)
    # --------------------------------------------------------------------------
    # Symmetric building check: sell older SF 3-unit building, keep Cupertino SFR!
    b_sell_costs = fmv_b0 * p["sell_broker_prep_pct"] + sf_transfer_tax(fmv_b0) + 75.0
    b_amt_realized = fmv_b0 - b_sell_costs
    # Property B is ALREADY owned by heir (NO §1014 step-up at parent's death! Low historical basis ~$350k + capex)
    est_b_basis = 420_000.0
    est_b_depr = 180_000.0
    b_gain_total = max(0.0, b_amt_realized - (est_b_basis - est_b_depr))
    # 1/3 owner-occupied unit qualifies for IRC §121 ($250k/$500k); 2/3 rental units fully taxable + recapture
    sec121_b = min(b_gain_total / 3.0, 500_000.0 if p["filing"] == "mfj" else 250_000.0)
    b_taxable_gain = max(0.0, b_gain_total - sec121_b)
    b_sale_tax = fed_real_estate_sale_tax(b_taxable_gain, est_b_depr, p["other_income"], p["filing"]) + \
                 ca_capital_gain_and_form540_tax(b_taxable_gain, p["other_income"], p["filing"])
    net_b0 = b_amt_realized - b_sale_tax
    fin_m3 = liq_after_estate_tax + net_b0
    for y in range(H):
        cost_a, _ = prop_a_costs(y, ass_a_p19_0, is_rental=False)
        imp_a = imp_a_mo0 * 12.0 * ((1 + p["mkt_rent_growth"]) ** y)
        r_yr = tsy_after_tax if y < 2 else port_after_tax_annual
        fin_m3 = fin_m3 * (1.0 + r_yr) + imp_a - cost_a
    paths.append({
        "id": "M3_live_a_sell_b",
        "type": "Mixed / Staged",
        "name": "M3 · Occupy Property A (Prop 19) + Sell Property B (1/3 §121 + 2/3 Taxable, Exit SF Rent Control)",
        "short": "Mixed: Live in A + Sell SF B",
        "terminal_wealth": r10(fin_m3 + a_end_val),
        "financial_wealth": r10(fin_m3),
        "real_estate_wealth": r10(a_end_val),
        "yr1_prop_a_tax": r10(yr1_ptax_p3),
        "sale_tax_paid": r10(b_sale_tax),
        "transfer_and_sell_friction": r10(b_sell_costs),
        "liquidity_status": "High — exits SF 3-unit maintenance & before SF $5M 2.25% transfer-tax cliff, but forfeits $114k Prop 13 base & pays capital gains on B",
        "reinvestment_risk": "Moderate — smaller net proceeds than selling A because Property B has no step-up in basis",
    })

    paths_sorted = sorted(paths, key=lambda x: x["terminal_wealth"], reverse=True)
    return {
        "transfer_year": p["transfer_year"],
        "horizon_years": H,
        "fmv_a_at_transfer": r10(fmv_a0),
        "fbyv_a_at_transfer": r10(fbyv_a0),
        "prop19_assessed_at_transfer": r10(ass_a_p19_0),
        "fmv_b_at_transfer": r10(fmv_b0),
        "federal_exclusion_at_transfer": r10(avail_excl),
        "gross_estate_at_transfer": r10(gross_estate),
        "federal_estate_tax": r10(estate_tax),
        "ca_estate_tax": 0,
        "winner_id": paths_sorted[0]["id"],
        "winner_name": paths_sorted[0]["name"],
        "runner_up_name": paths_sorted[1]["name"],
        "paths": paths,
    }


# ==============================================================================
# 4. BLACK SWAN HISTORICAL CRASH BACKTESTS (1929, 2008, 1973, 2000)
#    Testing Lump-Sum vs 24m & 36m 3M-2Y Treasury Buffer + 12m Equity Phase-In
# ==============================================================================
HISTORICAL_REGIMES = [
    {
        "id": "crash_1929",
        "name": "1929–1938 Great Depression Crash Entry",
        "period": "1929–1938 (10-Yr Window)",
        "desc": "Inheriting & selling right at the late-1929 peak (-83% cumulative nominal equity crash by 1932; deflationary Treasury preservation).",
        # Annual S&P Composite total return & short-term US Treasury return (Damodaran / Federal Reserve / Shiller series)
        "eq": [-0.084, -0.249, -0.433, -0.082, 0.540, -0.014, 0.477, 0.339, -0.350, 0.311],
        "tsy": [0.048, 0.024, 0.011, 0.009, 0.005, 0.003, 0.002, 0.002, 0.004, 0.001],
        "re_appr": [-0.040, -0.085, -0.120, -0.105, -0.020, 0.015, 0.030, 0.035, 0.010, 0.020],
    },
    {
        "id": "crash_2008",
        "name": "2008–2017 Global Financial Crisis Entry",
        "period": "2008–2017 (10-Yr Window)",
        "desc": "Inheriting & selling at start of 2008 GFC (-37.0% equity drop in Year 1; Fed cuts short yields from ~3.5% to near 0%, testing reinvestment risk alongside crash protection).",
        "eq": [-0.370, 0.265, 0.151, 0.021, 0.160, 0.324, 0.137, 0.014, 0.120, 0.218],
        "tsy": [0.028, 0.008, 0.006, 0.004, 0.003, 0.003, 0.004, 0.006, 0.009, 0.014],
        "re_appr": [-0.140, -0.060, 0.020, 0.015, 0.095, 0.145, 0.090, 0.085, 0.055, 0.075],
    },
    {
        "id": "stagflation_1973",
        "name": "1973–1982 Oil Shock & Stagflation Regime",
        "period": "1973–1982 (10-Yr Window)",
        "desc": "Back-to-back -14.7% and -26.5% equity drops with 7%–13% inflation; high short T-Bill yields & California Prop 13 2% assessment cap shine.",
        "eq": [-0.147, -0.265, 0.372, 0.238, -0.072, 0.066, 0.184, 0.324, -0.049, 0.214],
        "tsy": [0.070, 0.078, 0.058, 0.050, 0.053, 0.072, 0.100, 0.115, 0.140, 0.106],
        "re_appr": [0.085, 0.095, 0.105, 0.135, 0.160, 0.145, 0.130, 0.095, 0.045, 0.025],
    },
    {
        "id": "dotcom_2000",
        "name": "2000–2009 Silicon Valley Dot-Com + GFC Lost Decade",
        "period": "2000–2009 (10-Yr Window)",
        "desc": "Three consecutive equity down years (2000–2002) followed by 2008 GFC — critical stress test for Silicon Valley concentration & lump-sum stock entry.",
        "eq": [-0.091, -0.119, -0.221, 0.287, 0.109, 0.049, 0.158, 0.055, -0.370, 0.265],
        "tsy": [0.059, 0.035, 0.016, 0.010, 0.014, 0.032, 0.047, 0.044, 0.018, 0.005],
        "re_appr": [0.160, 0.040, 0.065, 0.085, 0.135, 0.120, 0.035, -0.020, -0.140, -0.060],
    },
    {
        "id": "bull_normal",
        "name": "Normal / Bull Expansion Counterfactual (Reinvestment-Risk Check)",
        "period": "10-Yr Steady Expansion + Falling Yields",
        "desc": "Shows the OTHER side of the coin: if no crash occurs and 3M–2Y yields fall from 4.4% to 2.4%, parking 24–36m in Treasuries creates ~$180k–$310k of cash-drag opportunity cost.",
        "eq": [0.110, 0.095, 0.085, 0.075, 0.080, 0.070, 0.085, 0.075, 0.080, 0.075],
        "tsy": [0.044, 0.031, 0.024, 0.024, 0.025, 0.025, 0.026, 0.026, 0.027, 0.027],
        "re_appr": [0.040, 0.040, 0.038, 0.038, 0.038, 0.038, 0.038, 0.038, 0.038, 0.038],
    },
]


def simulate_black_swan_regimes(initial_proceeds=2_957_000):
    """
    Simulate $2,957,000 net sale proceeds (from $3,100,000 Property A less ~4.61% total sale/transfer costs)
    across 4 strategies in each regime:
      1. 100% Lump-Sum 70/30 Portfolio at T=0
      2. 24-Month 3M-2Y Treasury Parking -> 12-Month Equity Phase-In (70/30 target)
      3. 36-Month 3M-2Y Treasury Parking -> 12-Month Equity Phase-In (70/30 target)
      4. Hold Property A Unsold (Prop 19 Occupy/Imputed Net Return)
    """
    results = []
    for reg in HISTORICAL_REGIMES:
        strategies = {}
        for key, park_yrs in [("lump_70_30", 0), ("phased_24m", 2), ("phased_36m", 3)]:
            w = float(initial_proceeds)
            series = [r10(w)]
            peak = w
            max_dd = 0.0
            for y in range(10):
                eq_r = reg["eq"][y]
                tsy_r = reg["tsy"][y]
                port_70_30 = 0.70 * eq_r + 0.30 * tsy_r
                if y < park_yrs:
                    # 100% parked in 3M-2Y Treasury ladder
                    r = tsy_r
                elif y == park_yrs and park_yrs > 0:
                    # 12-month monthly DCA transition year (~50% avg equity weight during transition)
                    r = 0.50 * tsy_r + 0.50 * port_70_30
                else:
                    r = port_70_30
                w = w * (1.0 + r)
                peak = max(peak, w)
                dd = (w - peak) / peak
                max_dd = min(max_dd, dd)
                series.append(r10(w))
            strategies[key] = {
                "series": series,
                "yr3_wealth": series[3],
                "yr5_wealth": series[5],
                "yr10_wealth": series[10],
                "max_drawdown_pct": round(max_dd * 100.0, 1),
            }

        # Hold Property A comparison
        re_w = 3_100_000.0
        re_series = [r10(re_w)]
        re_peak = re_w
        re_dd = 0.0
        for y in range(10):
            # Appreciation + ~1.4% net imputed/rent yield after carry
            re_w = re_w * (1.0 + reg["re_appr"][y] + 0.014)
            re_peak = max(re_peak, re_w)
            re_dd = min(re_dd, (re_w - re_peak) / re_peak)
            re_series.append(r10(re_w))
        strategies["hold_prop_a"] = {
            "series": re_series,
            "yr3_wealth": re_series[3],
            "yr5_wealth": re_series[5],
            "yr10_wealth": re_series[10],
            "max_drawdown_pct": round(re_dd * 100.0, 1),
        }

        results.append({
            "id": reg["id"],
            "name": reg["name"],
            "period": reg["period"],
            "desc": reg["desc"],
            "strategies": strategies,
        })
    return results


# ==============================================================================
# 5. STOCHASTIC DISTRIBUTION (P10, P25, P50, P75, P90) & SENSITIVITY CHECKS
# ==============================================================================
def run_monte_carlo_distributions(n_runs=500, seed=20261125):
    rng = random.Random(seed)
    buckets = {k: [] for k in ["P1_sell_lump", "P2_sell_phased_treasury", "P3_live_a_prop19", "P4_rent_a_keep_both", "M1_live3_then_sell_121"]}
    for _ in range(n_runs):
        p = dict(BASE_PARAMS)
        cpi_draw = max(0.01, min(0.055, rng.gauss(0.026, 0.008)))
        p["cpi"] = cpi_draw
        p["appr_a"] = max(0.005, min(0.075, cpi_draw + rng.gauss(0.012, 0.014)))
        p["appr_b"] = max(0.005, min(0.068, cpi_draw + rng.gauss(0.007, 0.013)))
        p["equity_return"] = max(0.02, min(0.125, cpi_draw + rng.gauss(0.046, 0.022)))
        p["treasury_3m_2y"] = max(0.01, min(0.075, cpi_draw + rng.gauss(0.015, 0.010)))
        p["prop_a_rent_comp_mo_2026"] = max(5400, min(9200, rng.gauss(6850, 750)))
        res = evaluate_all_paths(p, horizon=30)
        for item in res["paths"]:
            if item["id"] in buckets:
                buckets[item["id"]].append(item["terminal_wealth"])

    dist = {}
    for k, arr in buckets.items():
        arr.sort()
        n = len(arr)
        dist[k] = {
            "p10": r10(arr[int(0.10 * n)]),
            "p25": r10(arr[int(0.25 * n)]),
            "p50": r10(arr[int(0.50 * n)]),
            "p75": r10(arr[int(0.75 * n)]),
            "p90": r10(arr[int(0.90 * n)]),
        }
    return dist


def run_tax_aware_sensitivities():
    base_res = evaluate_all_paths(BASE_PARAMS, horizon=30)
    base_winner = base_res["winner_id"]

    cases = [
        ("Baseline (2045 Transfer, 30-Yr Horizon, Enacted $15M Indexed)", {}),
        ("Same-Year Immediate Benchmark (2026 Transfer, 30-Yr Horizon)", {"transfer_year": 2026}),
        ("Early Trust Transfer (2040 Transfer, 30-Yr Horizon)", {"transfer_year": 2040}),
        ("Late Trust Transfer (2050 Transfer, 30-Yr Horizon)", {"transfer_year": 2050}),
        ("High Cupertino Appreciation (5.1%/yr) + High Imputed Rent ($9,000/mo)", {"appr_a": 0.051, "prop_a_imputed_rent_mo_2026": 9000, "equity_return": 0.060}),
        ("HUD SAFMR Voucher Rent Floor ($5,870/mo) on Letting Path", {"use_safmr_floor": True}),
        ("High Liquid Estate ($20M in 2026 $) — Exceeds Single Federal Exclusion", {"liquid_inheritance_2026": 20_000_000, "has_dsue_portability": False}),
        ("High Liquid Estate ($20M in 2026 $) + DSUE Spousal Portability Elected", {"liquid_inheritance_2026": 20_000_000, "has_dsue_portability": True}),
        ("Proposed Legislation Sensitivity: Estate Exclusion Rolled Back to ~$7.14M Base", {"enacted_15m_law": False, "liquid_inheritance_2026": 8_000_000}),
        ("IRC §121 Primary-Residence Exclusion Switched OFF on Live-Then-Sell", {"use_sec121_live_sell": False}),
        ("Low Equity Return Regime (5.2%/yr Stocks vs 4.2% Cupertino Appreciation)", {"equity_return": 0.052, "appr_a": 0.042}),
    ]

    out = []
    for label, overrides in cases:
        p = dict(BASE_PARAMS)
        p.update(overrides)
        r = evaluate_all_paths(p, horizon=30)
        by_id = {x["id"]: x["terminal_wealth"] for x in r["paths"]}
        out.append({
            "case": label,
            "winner_id": r["winner_id"],
            "winner_name": r["winner_name"],
            "recommendation_moved": r["winner_id"] != base_winner,
            "estate_tax": r["federal_estate_tax"],
            "p1_sell_lump": by_id["P1_sell_lump"],
            "p2_sell_phased": by_id["P2_sell_phased_treasury"],
            "p3_live_prop19": by_id["P3_live_a_prop19"],
            "p4_rent_a": by_id["P4_rent_a_keep_both"],
            "m1_live_sell": by_id["M1_live3_then_sell_121"],
        })
    return out


def main():
    horizons_summary = {str(h): evaluate_all_paths(BASE_PARAMS, horizon=h) for h in (10, 20, 30, 50)}
    ranges_summary = {}
    for band_name, overrides in RANGE_BANDS.items():
        p = dict(BASE_PARAMS)
        p.update(overrides)
        ranges_summary[band_name] = evaluate_all_paths(p, horizon=30)

    black_swan = simulate_black_swan_regimes()
    distributions = run_monte_carlo_distributions()
    sensitivities = run_tax_aware_sensitivities()
    pre_inh_series = project_pre_inheritance_series(BASE_PARAMS)

    payload = {
        "meta": {
            "version": "2.0.0",
            "generated": "2026-11-26",
            "privacy": "Strict $10 rounding on personal and modeled dollar outputs; current site uses Property A/B and city-level labels only. Earlier public Git commits retain postal identifiers; see Flagged for Review F-09.",
            "baseYear": 2026,
            "transferWindow": "2040-2050 (default midpoint 2045)",
            "horizons": [10, 20, 30, 50],
        },
        "baseParams": BASE_PARAMS,
        "boeCcpi": BOE_CCPI,
        "propAHistory": PROP_A_HISTORY,
        "propBHistory": PROP_B_HISTORY,
        "preInheritanceSeries": pre_inh_series,
        "horizonsSummary": horizons_summary,
        "rangesSummary": ranges_summary,
        "distributions30Yr": distributions,
        "blackSwanRegimes": black_swan,
        "sensitivities": sensitivities,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)

    print("=== TinoDash1 Verified Model Rebuilt Successfully ===")
    print(f"Output written to: {OUT_PATH}")
    print(f"Baseline 2045 (30-Yr) Top Path: {horizons_summary['30']['winner_name']}")
    moved_count = sum(1 for s in sensitivities if s["recommendation_moved"])
    print(f"Sensitivity Runs: {len(sensitivities)} tested | Recommendation moved in {moved_count} regimes:")
    for s in sensitivities:
        flag = "MOVED" if s["recommendation_moved"] else "UNCHANGED"
        print(f"  [{flag:9s}] {s['case']} -> {s['winner_id']} (Estate Tax: ${s['estate_tax']:,})")


if __name__ == "__main__":
    main()
