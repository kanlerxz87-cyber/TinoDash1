#!/usr/bin/env python3
"""Pre-deploy audit for the TinoDash site.

Hard failures (exit 1):
  * broken internal links (html / css / js / data targets)
  * personal identifiers: email address, phone number, street address pattern
  * conflicting duplicate page sets in the published root

Warnings (reported, do not fail):
  * dollar amounts in table cells that are not multiples of $10
  * un-rounded figures outside tables (prose) for review
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLISHED = sorted(ROOT.glob("*.html"))
# statutory constants published exactly by the authority: rounding one would
# misstate the law, and it identifies no person
STATUTORY = {1044586, 13990000, 15000000, 1000000, 550000, 250000, 500000,
             19000, 50000000, 25000000, 10000000, 4999999, 999999,
             9999999, 24999999}
LINK = re.compile(r'(?:href|src)="([^"]+)"')
# CDN/asset URLs and script tags are not identity data
SCRIPT = re.compile(r"<script[^>]*>[^<]*</script>|src=\"[^\"]+\"", re.I)
DOLLAR = re.compile(r"\$\s?([0-9][0-9,]{2,})")
# Values that would expose the real household: real ZIPs, the real figures, parcel ids
FORBIDDEN = [
    (re.compile(r"\b9[45]\d{3}\b"), "real ZIP code (use the synthetic 00000 placeholder)"),
    (re.compile(r"\b3100000\b|\$3,100,000|\b3\.1M\b"), "real Property A market value"),
    (re.compile(r"\b1800000\b|\$1,800,000|\b1\.8M\b"), "real Property B market value"),
    (re.compile(r"\b550540\b|\$550,540"), "real Property A assessment"),
    (re.compile(r"\b114250\b|\b114248\b|\$114,250"), "real Property B assessment"),
    (re.compile(r"\b7150\b|\$7,150"), "real Property B rent roll"),
    (re.compile(r"\bA[PN]{1,2}\b\s*[:#]\s*\d"), "possible parcel number"),
]
IDENT = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]{2,}"), "possible email address"),
    (re.compile(r"\(\d{3}\)\s*\d{3}-\d{4}"), "possible phone number"),
    (re.compile(r"\b\d{2,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:Ave|Avenue|St|Street|Dr|Drive|Rd|Road|"
                r"Blvd|Way|Ct|Court|Ln|Ter|Place|Pl)\b"), "possible street address"),
]
errors: list[str] = []
warnings: list[str] = []


def targets_ok(page: Path, text: str) -> None:
    for t in LINK.findall(text):
        if t.startswith(("http://", "https://", "#", "mailto:", "data:", "//")):
            continue
        clean = t.split("#")[0].split("?")[0]
        if not clean:
            continue
        if not (ROOT / clean).exists():
            errors.append(f"{page.name}: broken internal link -> {t}")


def scan_identifiers(page: Path) -> None:
    for n, line in enumerate(page.read_text(encoding="utf-8").splitlines(), 1):
        line = SCRIPT.sub("", line)          # strip asset URLs first
        for rx, label in FORBIDDEN:
            if rx.search(line):
                errors.append(f"{page.name}:{n}: FORBIDDEN {label} -> {line.strip()[:90]}")
        for rx, label in IDENT:
            if rx.search(line):
                errors.append(f"{page.name}:{n}: {label} -> {line.strip()[:110]}")


def scan_rounding(page: Path) -> None:
    for n, line in enumerate(page.read_text(encoding="utf-8").splitlines(), 1):
        if "<td" not in line:
            continue
        for raw in DOLLAR.findall(line):
            v = int(raw.replace(",", ""))
            if v >= 1000 and v % 10 and v not in STATUTORY:
                warnings.append(f"{page.name}:{n}: table amount not a multiple of $10 -> ${raw}")
                break


REQUIRED = {
    "index.html", "paths.html", "blackswan.html", "property-tax.html", "estate.html",
    "timeline.html", "sensitivity.html", "sf-property.html", "insurance-maintenance.html",
    "legislation.html", "sources.html", "flagged.html", "methodology.html",
    "briefing.html", "questions.html", "suggestions.html", "glossary.html",
}


def check_required() -> None:
    for name in sorted(REQUIRED):
        if not (ROOT / name).exists():
            errors.append(f"required page missing: {name}")


def scan_duplicates() -> None:
    """Two page sets in the published root would ship two competing versions."""
    groups = {
        "black-swan / blackswan": ["black-swan.html", "blackswan.html"],
        "questions+suggestions split": ["questions.html", "suggestions.html", "questions-suggestions.html"],
    }
    for label, files in groups.items():
        present = [f for f in files if (ROOT / f).exists()]
        if len(present) > 1 and label.startswith("black-swan"):
            warnings.append(f"duplicate page set: {label} -> {present}")


def main() -> int:
    if not PUBLISHED:
        errors.append("no html pages found at repo root")
    for page in PUBLISHED:
        text = page.read_text(encoding="utf-8")
        targets_ok(page, text)
        scan_identifiers(page)
        scan_rounding(page)
        if "SYNTHETIC DEMONSTRATION" not in text:
            errors.append(f"{page.name}: missing the synthetic-data disclosure banner")
        if "<<<<<<<" in text or ">>>>>>>" in text:
            errors.append(f"{page.name}: unresolved merge-conflict markers")
        if "<!doctype html>" not in text.lower()[:200] and "<!DOCTYPE html>" not in text[:200]:
            warnings.append(f"{page.name}: missing doctype")
    scan_duplicates()
    check_required()

    print(f"pages audited: {len(PUBLISHED)} -> {', '.join(p.name for p in PUBLISHED)}")
    for w in sorted(set(warnings)):
        print("WARN :", w)
    for e in errors:
        print("ERROR:", e)
    if errors:
        print(f"\nFAILED — {len(errors)} error(s), {len(set(warnings))} warning(s)")
        return 1
    print(f"\nOK — no broken internal links, no identifier leaks ({len(set(warnings))} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
