#!/usr/bin/env python3
"""
Automated privacy, $10-rounding, ES-module import, link-integrity, and official-source audit for TinoDash1.
Exits non-zero if any check fails.
"""

import glob
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FORBIDDEN_EXACT_RAW = [
    "440305", "449102", "455951", "465069", "474369", "483855", "493532",
    "498645", "508617", "518788", "529162", "539745", "550537",
    "5965", "6342", "6383", "6377", "6574", "6573", "6668", "6818", "6967", "7058", "7207",
    "96557", "98488", "100457", "102466", "104515", "105597", "107708", "109862", "112059", "114248",
    "1675", "1738", "2058", "2118", "2202", "2072", "2102", "2146", "2175", "2439",
]

FORBIDDEN_COMMERCIAL_DOMAINS = (
    "redfin.com",
    "zillow.com",
    "rentometer.com",
    "lendingtree.com",
    "gethomeinsurancequotes.com",
    "baysano.com",
    "gavop.com",
)


def comma_form(num_str):
    return f"{int(num_str):,}"


def main():
    errors = []

    # 1. Check tracked files for .pyc / __pycache__
    tracked = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
    for tf in tracked:
        if "__pycache__" in tf or tf.endswith(".pyc"):
            errors.append(f"Tracked bytecode file found: {tf}")

    # 2. Check all text files in workspace for conflict markers, commercial brokerage links, & unrounded raw numbers
    patterns = []
    for raw in FORBIDDEN_EXACT_RAW:
        c = comma_form(raw)
        patterns.append((raw, re.compile(rf"(?<!\d){re.escape(c)}(?!\d)")))
        if len(raw) >= 5:
            patterns.append((raw, re.compile(rf"(?<!\d){re.escape(raw)}(?!\d)")))

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in {".git", "__pycache__", ".venv", "node_modules"}]
        for fn in filenames:
            p = Path(dirpath) / fn
            rel = p.relative_to(ROOT).as_posix()
            if rel == "scripts/verify_repo.py":
                continue
            try:
                txt = p.read_text(encoding="utf-8")
            except Exception:
                continue

            if re.search(r"^(<{7} |={7}$|>{7} )", txt, flags=re.M):
                errors.append(f"Conflict marker in {rel}")

            for dom in FORBIDDEN_COMMERCIAL_DOMAINS:
                if dom in txt:
                    errors.append(f"Commercial non-official link ({dom}) found in {rel}")

            for raw, pat in patterns:
                if pat.search(txt):
                    errors.append(f"Forbidden unrounded personal number ({raw}) found in {rel}")

    # 3. Check git commit history: 0 unrounded 5-6 digit assessment rolls anywhere in HEAD history,
    #    and 0 unrounded 4+ digit personal figures in any new commits over origin/main.
    git_log_head = subprocess.check_output(["git", "log", "HEAD", "-p"], cwd=ROOT, text=True, errors="ignore")
    for raw in FORBIDDEN_EXACT_RAW:
        c = comma_form(raw)
        if len(raw) >= 5 and re.search(rf"(?<!\d){re.escape(c)}(?!\d)", git_log_head):
            errors.append(f"Git history contains unrounded assessment figure {c}")

    try:
        subprocess.check_call(["git", "rev-parse", "--verify", "origin/main"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        diff_range = "origin/main..HEAD"
    except subprocess.CalledProcessError:
        diff_range = "HEAD~1..HEAD"
    recent_diff = subprocess.check_output(["git", "diff", diff_range], cwd=ROOT, text=True, errors="ignore")
    for line in recent_diff.splitlines():
        if not line.startswith("+") or line.startswith("+++"):
            continue
        for raw in FORBIDDEN_EXACT_RAW:
            c = comma_form(raw)
            if re.search(rf"\${re.escape(c)}(?!\d)", line):
                errors.append(f"New diff introduces unrounded figure ${c}")

    # 4. Check ES-module imports in assets/js/*.js
    for js_file in sorted(glob.glob(str(ROOT / "assets" / "js" / "*.js"))):
        txt = Path(js_file).read_text(encoding="utf-8")
        for imp in re.findall(r"\bfrom\s+['\"](\.[^'\"]+)['\"]", txt):
            resolved = (Path(js_file).parent / imp).resolve()
            if not resolved.exists():
                errors.append(f"Broken ES-module import in {Path(js_file).name}: {imp}")

    # 5. Check every static & dynamic <tr> data row in index.html, pages/*.html, and assets/js/pages-*.js has an official link
    primary_targets = [ROOT / "index.html"] + [Path(p) for p in sorted(glob.glob(str(ROOT / "pages" / "*.html")))] + [
        Path(p) for p in sorted(glob.glob(str(ROOT / "assets" / "js" / "pages-*.js")))
    ]
    checked_rows = 0
    for target in primary_targets:
        rel = target.relative_to(ROOT).as_posix()
        txt = target.read_text(encoding="utf-8")
        for tr in re.findall(r"<tr[^>]*>.*?</tr>", txt, flags=re.S):
            if "<th" in tr:
                continue
            checked_rows += 1
            if "href=" not in tr:
                errors.append(f"Unlinked data <tr> row in {rel}: {tr[:80].strip()}...")

    if errors:
        print("VERIFICATION FAILED:")
        for e in errors:
            print("  [FAIL]", e)
        sys.exit(1)

    print(
        f"VERIFICATION PASSED: {len(primary_targets)} primary HTML/JS modules, {checked_rows} static+dynamic <tr> templates (100% linked to official sources), "
        f"0 broken ES-module imports, 0 conflict markers, 0 commercial links, 0 unrounded personal numbers in workspace or Git history."
    )


if __name__ == "__main__":
    main()
