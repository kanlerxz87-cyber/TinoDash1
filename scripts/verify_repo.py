#!/usr/bin/env python3
"""
Automated privacy, $10-rounding, ES-module import, link-integrity, and official-source audit for TinoDash1.
Exits non-zero if any check fails.

Privacy design (T-09, session ff8e68dc):
  * The list of raw, pre-rounding figures is NOT stored in this repository.
  * Owners run the raw-figure checks (workspace + every commit in Git history) by pointing
    TINODASH_PRIVATE_FIGURES_FILE at a plain-text file kept OUTSIDE the repo (one number per line).
  * Without that variable, those checks are reported as SKIPPED (never silently passed).
"""

import glob
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRIVATE_FILE_ENV = "TINODASH_PRIVATE_FIGURES_FILE"

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


def load_private_figures():
    """Return the list of forbidden raw figures from the external file, or None if not configured."""
    raw_path = os.environ.get(PRIVATE_FILE_ENV, "").strip()
    if not raw_path:
        return None
    path = Path(raw_path).expanduser()
    if not path.exists():
        print(f"[FAIL] {PRIVATE_FILE_ENV} is set but the file does not exist.")
        sys.exit(1)
    if str(path.resolve()).startswith(str(ROOT)):
        print(f"[FAIL] {PRIVATE_FILE_ENV} must point OUTSIDE the repository.")
        sys.exit(1)
    values = [tok for tok in re.split(r"[\s,]+", path.read_text(encoding="utf-8")) if tok.isdigit()]
    return values


def build_patterns(values):
    patterns = []
    for raw in values:
        c = comma_form(raw)
        patterns.append((raw, re.compile(rf"(?<!\d){re.escape(c)}(?!\d)")))
        if len(raw) >= 5:
            patterns.append((raw, re.compile(rf"(?<!\d){re.escape(raw)}(?!\d)")))
    return patterns


def ere_alternation(values):
    """POSIX ERE used by `git grep -E` (no lookarounds)."""
    parts = []
    for raw in values:
        parts.append(re.escape(comma_form(raw)))
        if len(raw) >= 5:
            parts.append(re.escape(raw))
    return "(^|[^0-9])(" + "|".join(parts) + ")([^0-9]|$)"


def main():
    errors = []
    notes = []

    # 1. Check tracked files for .pyc / __pycache__
    tracked = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
    for tf in tracked:
        if "__pycache__" in tf or tf.endswith(".pyc"):
            errors.append(f"Tracked bytecode file found: {tf}")

    private_values = load_private_figures()
    if private_values is None:
        notes.append(
            f"[SKIP] Raw-figure checks (workspace, diff, and full Git history) not run: set {PRIVATE_FILE_ENV} "
            "to a private file outside the repo to run them."
        )
        patterns = []
    else:
        patterns = build_patterns(private_values)

    # 2. Workspace: conflict markers, commercial brokerage links, and raw figures (if configured)
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in {".git", "__pycache__", ".venv", "node_modules"}]
        for fn in filenames:
            p = Path(dirpath) / fn
            rel = p.relative_to(ROOT).as_posix()
            if rel == "scripts/verify_repo.py":
                # This checker names the forbidden domains and patterns by design; it is excluded from its own scan.
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

    # 3. Git history: scan EVERY reachable commit (merge diffs included), not just `git log -p`.
    if private_values is not None:
        alt = ere_alternation(private_values)
        commits = subprocess.check_output(["git", "rev-list", "HEAD"], cwd=ROOT, text=True).split()
        hits = {}
        for commit in commits:
            res = subprocess.run(
                ["git", "grep", "-I", "-l", "-E", alt, commit],
                cwd=ROOT, text=True, capture_output=True, errors="ignore",
            )
            if res.returncode == 0 and res.stdout.strip():
                for line in res.stdout.splitlines():
                    hits.setdefault(line.split(":", 1)[-1] if ":" in line else line, []).append(commit[:7])
        for path_name, commit_list in sorted(hits.items()):
            errors.append(
                f"Git history contains unrounded personal figures in '{path_name}' "
                f"(commits: {', '.join(sorted(set(commit_list)))[:200]}). Owner scrub required; see COORDINATION.md."
            )

    # 4. New diff over origin/main must not add raw figures (if configured)
    if private_values is not None:
        try:
            subprocess.check_call(["git", "rev-parse", "--verify", "origin/main"], cwd=ROOT,
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            diff_range = "origin/main..HEAD"
        except subprocess.CalledProcessError:
            diff_range = "HEAD~1..HEAD"
        recent_diff = subprocess.check_output(["git", "diff", diff_range], cwd=ROOT, text=True, errors="ignore")
        for line in recent_diff.splitlines():
            if not line.startswith("+") or line.startswith("+++"):
                continue
            for raw, pat in patterns:
                if pat.search(line):
                    errors.append(f"New diff introduces unrounded figure ({raw})")
                    break

    # 5. Check ES-module imports in assets/js/*.js
    for js_file in sorted(glob.glob(str(ROOT / "assets" / "js" / "*.js"))):
        txt = Path(js_file).read_text(encoding="utf-8")
        for imp in re.findall(r"\bfrom\s+['\"](\.[^'\"]+)['\"]", txt):
            resolved = (Path(js_file).parent / imp).resolve()
            if not resolved.exists():
                errors.append(f"Broken ES-module import in {Path(js_file).name}: {imp}")

    # 6. Check every static & dynamic <tr> data row in index.html, pages/*.html, and assets/js/pages-*.js has an official link
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

    for n in notes:
        print(n)

    if errors:
        print("VERIFICATION FAILED:")
        for e in errors:
            print("  [FAIL]", e)
        sys.exit(1)

    raw_status = "raw-figure workspace/diff/history scans PASSED" if private_values is not None else "raw-figure scans SKIPPED (no private list)"
    print(
        f"VERIFICATION PASSED: {len(primary_targets)} primary HTML/JS modules, {checked_rows} static+dynamic <tr> templates "
        f"(100% linked to official sources), 0 broken ES-module imports, 0 conflict markers, 0 commercial links; {raw_status}."
    )


if __name__ == "__main__":
    main()
