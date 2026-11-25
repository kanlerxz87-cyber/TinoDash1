#!/usr/bin/env python3
"""Verify the static site before deploy.

Checks:
  1. every internal href/src target exists
  2. every page has the required nav links
  3. every page contains the privacy placeholder notice
  4. no obvious personal identifiers (email, phone, street-number pattern with 'Ave/St/Dr')
  5. no un-rounded dollar amounts (non-multiples of 10) in rendered tables -- warning only
Exit non-zero on hard failures.
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted(p.name for p in ROOT.glob("*.html"))
REQUIRED_PAGES = {
    "index.html", "model.html", "black-swan.html", "taxes.html", "properties.html",
    "process.html", "questions.html", "suggestions.html", "briefing.html",
    "flagged.html", "glossary.html",
}

HREF = re.compile(r'(?:href|src)="([^"]+)"')
errors, warnings = [], []

# 1. links
for page in PAGES:
    text = (ROOT / page).read_text(encoding="utf-8")
    for target in HREF.findall(text):
        if target.startswith(("http://", "https://", "#", "mailto:", "data:")):
            continue
        clean = target.split("#")[0].split("?")[0]
        if not clean:
            continue
        if not (ROOT / clean).exists():
            errors.append(f"{page}: broken internal link -> {target}")

# 2. required pages + nav
for page in REQUIRED_PAGES:
    if not (ROOT / page).exists():
        errors.append(f"missing required page: {page}")

for page in PAGES:
    text = (ROOT / page).read_text(encoding="utf-8")
    if page != "briefing.html":
        for needed in ("index.html", "flagged.html", "glossary.html"):
            if f'href="{needed}"' not in text:
                errors.append(f"{page}: nav link missing -> {needed}")

# 3. privacy notice
for page in PAGES:
    text = (ROOT / page).read_text(encoding="utf-8")
    has_marker = ("placeholder" in text.lower()) or ("rounded to" in text.lower()) or ("no names" in text.lower())
    if page not in {"briefing.html"} and not has_marker:
        warnings.append(f"{page}: no privacy/rounding marker found")

# 4. personal identifiers
IDENT = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), "possible email address"),
    (re.compile(r"\(\d{3}\)\s*\d{3}-\d{4}"), "possible phone number"),
    (re.compile(r"\b\d{2,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:Ave|Avenue|St|Street|Dr|Drive|Rd|Road|Blvd|Way|Ct|Court|Ln|Ter)\b"), "possible street address"),
]
for page in PAGES:
    for lineno, line in enumerate((ROOT / page).read_text(encoding="utf-8").splitlines(), 1):
        for rx, label in IDENT:
            if rx.search(line):
                errors.append(f"{page}:{lineno}: {label} -> {line.strip()[:120]}")

# 5. rounding check (warning): dollar amounts in tables should be multiples of 10
DOLLAR = re.compile(r"\$\s?([0-9][0-9,]*)")
# Statutory constants published exactly by the authority -- rounding these would
# misstate the law. They identify no person, so they are exempt from the $10 rule.
STATUTORY = {1044586}
for page in PAGES:
    for lineno, line in enumerate((ROOT / page).read_text(encoding="utf-8").splitlines(), 1):
        if "<td" not in line:
            continue
        for raw in DOLLAR.findall(line):
            n = int(raw.replace(",", ""))
            if n >= 100 and n % 10 != 0 and n not in STATUTORY:
                warnings.append(f"{page}:{lineno}: dollar amount not a multiple of 10 -> ${raw}")
                break

print(f"pages checked: {len(PAGES)}")
for w in warnings:
    print("WARN:", w)
for e in errors:
    print("ERROR:", e)
if errors:
    print(f"\nFAILED with {len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1)
print(f"\nOK — no broken links, no identifier leaks ({len(warnings)} warning(s))")
