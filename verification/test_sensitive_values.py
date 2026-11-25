#!/usr/bin/env python3
"""Tests for value-suppressed matching; every amount here is synthetic."""
import json
import subprocess
import sys
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from check_sensitive_values import build_pattern, monetary_numbers, select, variants


SCRIPT = Path(__file__).with_name('check_sensitive_values.py')


class SensitiveValueTests(unittest.TestCase):
    def test_excludes_year_rate_and_boolean_from_history(self):
        fixture = [{'year': 2026, 'tax': 12673, 'assessed': 876543, 'tax_chg': 2024, 'enabled': True}]
        self.assertEqual(monetary_numbers(fixture, Decimal(1000)), {Decimal(12673), Decimal(876543)})

    def test_formatted_and_rounded_matches_without_emitting_values(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'site'
            root.mkdir()
            seed = Path(tmp) / 'private.json'
            seed.write_text(json.dumps({'history': [{'year': 2026, 'tax': 12673}]}))
            (root / 'page.html').write_text('<p>Illustrative only: $12,670</p>')
            result = subprocess.run([sys.executable, str(SCRIPT), '--seed-json', str(seed), '--field', 'history', '--root', str(root)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn('file #1', result.stdout)
            self.assertNotIn('page.html', result.stdout)
            self.assertNotIn('12,670', result.stdout)
            self.assertNotIn('12673', result.stdout)

    def test_matching_filename_is_detected_and_path_is_hidden_by_default(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'site'
            root.mkdir()
            seed = Path(tmp) / 'private.json'
            seed.write_text(json.dumps({'amount': 12673}))
            (root / 'private-12673.html').write_text('<p>Nothing here.</p>')
            base = [sys.executable, str(SCRIPT), '--seed-json', str(seed), '--field', 'amount', '--root', str(root)]
            hidden = subprocess.run(base, capture_output=True, text=True)
            shown = subprocess.run(base + ['--show-paths'], capture_output=True, text=True)
            self.assertEqual(hidden.returncode, 1)
            self.assertIn('1 path match', hidden.stdout)
            self.assertNotIn('private-', hidden.stdout)
            self.assertNotIn('12673', hidden.stdout)
            self.assertIn('private-[number suppressed].html', shown.stdout)
            self.assertNotIn('12673', shown.stdout)

    def test_clean_scan_and_no_seeds_are_distinct(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'site'
            root.mkdir()
            seed = Path(tmp) / 'private.json'
            seed.write_text(json.dumps({'history': [{'year': 2026, 'tax': 12673}], 'empty': []}))
            (root / 'page.html').write_text('<p>Nothing identifiable here.</p>')
            base = [sys.executable, str(SCRIPT), '--seed-json', str(seed), '--root', str(root), '--field']
            clean = subprocess.run(base + ['history'], capture_output=True, text=True)
            empty = subprocess.run(base + ['empty'], capture_output=True, text=True)
            self.assertEqual(clean.returncode, 0)
            self.assertEqual(empty.returncode, 2)

    def test_selector_and_number_boundary(self):
        obj = {'a': {'b': [{'v': 12345}]}}
        self.assertEqual(select(obj, 'a.b.0.v'), 12345)
        self.assertIn('12,350', variants(Decimal('12345')))
        pattern = build_pattern({Decimal('12345')})
        self.assertIsNotNone(pattern)
        self.assertTrue(pattern.search('$12,345'))
        self.assertFalse(pattern.search('9123456'))


if __name__ == '__main__':
    unittest.main()
