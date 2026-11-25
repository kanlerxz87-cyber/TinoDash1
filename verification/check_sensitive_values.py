#!/usr/bin/env python3
"""Find possible repetitions of existing sensitive numeric values without printing them.

Use only in a private environment. Seed values are read from an existing JSON
file and held in memory. The tool never writes them or includes them in output.
Matches are leads, not proof of a leak; no matches do not prove anonymity.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path

EXCLUDED_DIRS = {'.git', 'node_modules', '__pycache__', 'verification', '.next'}
TEXT_EXTENSIONS = {'.html', '.htm', '.js', '.mjs', '.json', '.css', '.md', '.txt', '.csv', '.py', '.yml', '.yaml'}
# Prevent years, rates and unit counts from being mistaken for monetary seeds.
NON_AMOUNT_KEY = re.compile(r'(?:^|_)(?:year|years|yr|date|rate|ratio|pct|percent|percentage|chg|change|month|months|units|index)(?:_|$)', re.I)


def select(data, path: str):
    current = data
    for part in path.split('.'):
        if isinstance(current, dict) and part in current:
            current = current[part]
        elif isinstance(current, list) and part.isdecimal() and int(part) < len(current):
            current = current[int(part)]
        else:
            raise KeyError(path)
    return current


def monetary_numbers(value, minimum: Decimal, key: str = '') -> set[Decimal]:
    if key and NON_AMOUNT_KEY.search(key):
        return set()
    if isinstance(value, bool) or value is None:
        return set()
    if isinstance(value, dict):
        result: set[Decimal] = set()
        for child_key, child in value.items():
            result |= monetary_numbers(child, minimum, str(child_key))
        return result
    if isinstance(value, list):
        result: set[Decimal] = set()
        for child in value:
            result |= monetary_numbers(child, minimum)
        return result
    if not isinstance(value, (int, float, str)):
        return set()
    if isinstance(value, float) and not math.isfinite(value):
        return set()
    if isinstance(value, str) and not re.fullmatch(r'\s*\$?\d[\d,]*(?:\.\d+)?\s*', value):
        return set()
    try:
        amount = Decimal(str(value).strip().lstrip('$').replace(',', ''))
    except InvalidOperation:
        return set()
    if not amount.is_finite() or amount < minimum:
        return set()
    return {amount}


def variants(amount: Decimal) -> set[str]:
    # Search exact dollars/cents and conventional rounding to the nearest $10.
    # This intentionally cannot infer derived projections or other rounding.
    rounded = (amount / Decimal(10)).quantize(Decimal(1), rounding=ROUND_HALF_UP) * 10
    values = {amount, rounded}
    result = set()
    for value in values:
        plain = format(value, 'f')
        if '.' in plain:
            plain = plain.rstrip('0').rstrip('.')
        whole, dot, fraction = plain.partition('.')
        result.add(plain)
        result.add(format(int(whole), ',d') + (dot + fraction if dot else ''))
    return result


def build_pattern(amounts: set[Decimal]):
    pieces = sorted({item for amount in amounts for item in variants(amount)}, key=len, reverse=True)
    if not pieces:
        return None
    # Digits cannot be part of a longer digit/comma number.
    return re.compile(r'(?<![\d,])(?:' + '|'.join(map(re.escape, pieces)) + r')(?![\d,])')


def scan(root: Path, pattern: re.Pattern):
    hits = []
    root = root.resolve()
    for path in sorted(root.rglob('*')):
        rel = path.relative_to(root)
        if any(part in EXCLUDED_DIRS for part in rel.parts) or not path.is_file() or path.is_symlink() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except (OSError, UnicodeError):
            continue
        count = len(pattern.findall(text))
        if count:
            hits.append((rel.as_posix(), count))
    return hits


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--seed-json', required=True, help='existing private JSON input; values are never printed')
    parser.add_argument('--field', action='append', required=True, help='dot-separated path to a monetary value or history (repeatable)')
    parser.add_argument('--root', default='.', help='directory to check')
    parser.add_argument('--minimum', type=Decimal, default=Decimal('1000'), help='minimum absolute positive amount to match; default 1000')
    args = parser.parse_args()
    if not args.root or not Path(args.root).is_dir() or not args.minimum.is_finite() or args.minimum <= 0:
        print('ERROR: invalid scan directory or minimum', file=sys.stderr)
        return 2
    try:
        data = json.loads(Path(args.seed_json).read_text(encoding='utf-8'))
        selected = [select(data, selector) for selector in args.field]
    except (OSError, UnicodeError, json.JSONDecodeError, KeyError):
        print('ERROR: seed JSON or a selected field could not be read; values suppressed', file=sys.stderr)
        return 2
    amounts: set[Decimal] = set()
    for value in selected:
        amounts |= monetary_numbers(value, args.minimum)
    pattern = build_pattern(amounts)
    if pattern is None:
        print('ERROR: no eligible seed amounts; nothing was checked', file=sys.stderr)
        return 2
    hits = scan(Path(args.root), pattern)
    for path, count in hits:
        print(f'POSSIBLE: {path}: {count} numeric token match(es); content suppressed')
    print(f'Scanned text files against {len(amounts)} numeric seeds; {len(hits)} files have possible matches.')
    print('Matches require private review and may be coincidental. A clean result does not certify privacy, remove history, or detect derived values.')
    return 1 if hits else 0


if __name__ == '__main__':
    raise SystemExit(main())
