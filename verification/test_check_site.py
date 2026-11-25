#!/usr/bin/env python3
"""Unit tests for the independent checker; all examples are fictitious."""
import subprocess
import sys
import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest.mock import patch

from check_site import audit, check_privacy, check_remote, official


HEAD = '<!doctype html><html lang="en"><head><title>Test</title><meta name="viewport" content="width=device-width"></head><body>'
TAIL = '</body></html>'


class SiteAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def write(self, path, body):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body, encoding='utf-8')

    def errors(self):
        return [f.message for f in audit(self.root)[0] if f.severity == 'ERROR']

    def test_valid_references_and_official_row(self):
        self.write('index.html', HEAD + '<a href="page.html#ok">Next</a><table><tr><td>Example</td><td><a href="https://www.irs.gov/">source</a></td></tr></table>' + TAIL)
        self.write('page.html', HEAD + '<h1 id="ok">Hello</h1>' + TAIL)
        self.assertEqual(self.errors(), [])

    def test_missing_file_and_fragment_are_errors(self):
        self.write('index.html', HEAD + '<a href="missing.html">Missing</a><a href="page.html#missing">Missing fragment</a>' + TAIL)
        self.write('page.html', HEAD + '<h1>Target</h1>' + TAIL)
        self.assertIn('missing local a target', self.errors())
        self.assertIn('local fragment target not found', self.errors())

    def test_each_data_row_needs_its_own_official_link(self):
        self.write('index.html', HEAD + '<table><tr><th>Header</th></tr><tr><td>One</td><td><a href="https://www.irs.gov/">IRS</a></td></tr><tr><td>Two</td></tr></table>' + TAIL)
        self.assertEqual(self.errors().count('table data row lacks its own HTTPS official-source link'), 1)

    def test_lookalike_domain_not_official(self):
        self.assertTrue(official('https://www.irs.gov/publications/'))
        self.assertTrue(official('https://fred.stlouisfed.org/series/'))
        self.assertTrue(official('https://www.sccassessor.org/'))
        self.assertTrue(official('https://www.sfmta.com/getting-around/muni/parcel'))
        self.assertTrue(official('https://www.sfelections.org/results/'))
        self.assertFalse(official('https://fake.sfmta.com/'))
        self.assertFalse(official('https://irs.gov.example.com/'))
        self.assertFalse(official('http://www.irs.gov/'))
        self.assertFalse(official('https://evilstlouisfed.org/'))

    def test_remote_form_is_error(self):
        self.write('index.html', HEAD + '<form action="https://example.com/submit"></form>' + TAIL)
        self.assertIn('form submits to a remote destination', self.errors())

    def test_root_relative_and_traversal_are_errors(self):
        self.write('index.html', HEAD + '<a href="/missing">absolute</a><a href="../outside">outside</a>' + TAIL)
        self.assertIn('root-relative URL may escape the GitHub Pages project base', self.errors())
        self.assertIn('local URL escapes the site root', self.errors())

    def test_sensitive_match_is_not_printed(self):
        sample = '9876 Fictional Avenue'
        findings = check_privacy(sample, 'page.html')
        self.assertTrue(findings)
        self.assertNotIn(sample, '\n'.join(map(str, findings)))

    def test_malformed_urls_are_errors_not_exceptions(self):
        self.write('index.html', HEAD + '<a href="https://[invalid">source</a><form action="https://[invalid"></form>' + TAIL)
        self.assertFalse(official('https://[invalid'))
        self.assertIn('malformed URL; content suppressed', self.errors())
        self.assertIn('malformed form action; content suppressed', self.errors())

    @patch('check_site.urllib.request.urlopen')
    def test_remote_errors_suppress_urls_and_query_values(self, urlopen):
        url = 'https://example.com/report?private=PRIVATE_TEST_VALUE'
        urlopen.side_effect = urllib.error.HTTPError(url, 404, 'not found', None, None)
        findings = check_remote([url], 1)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].severity, 'ERROR')
        self.assertNotIn('PRIVATE_TEST_VALUE', str(findings[0]))
        self.assertNotIn('example.com', str(findings[0]))

    def test_generated_rows_get_manual_review_warning(self):
        self.write('index.html', HEAD + '<script src="app.js"></script>' + TAIL)
        self.write('app.js', "document.body.innerHTML = '<table><tr><td>sample</td></tr></table>';\n")
        findings, _ = audit(self.root)
        self.assertTrue(any('runtime official-source-link audit' in f.message for f in findings))

    def test_cli_hides_potentially_identifying_filenames_by_default(self):
        self.write('private-filename.html', HEAD + '<table><tr><td>Example</td></tr></table>' + TAIL)
        base = [sys.executable, str(Path(__file__).with_name('check_site.py')), str(self.root)]
        hidden = subprocess.run(base, capture_output=True, text=True)
        shown = subprocess.run(base + ['--show-paths'], capture_output=True, text=True)
        self.assertEqual(hidden.returncode, 1)
        self.assertIn('<file #1>', hidden.stdout)
        self.assertNotIn('private-filename', hidden.stdout)
        self.assertIn('private-filename.html', shown.stdout)

    def test_published_verification_folder_and_extra_text_types_are_screened(self):
        self.write('index.html', HEAD + '<h1>Hello</h1>' + TAIL)
        self.write('verification/fixture.cjs', "const sample = '9876 Fictional Avenue';")
        findings, _ = audit(self.root)
        self.assertTrue(any(f.path == 'verification/fixture.cjs' and 'possible street address' in f.message for f in findings))
        self.assertNotIn('9876 Fictional Avenue', '\n'.join(map(str, findings)))

    def test_merge_conflicts_are_errors(self):
        self.write('index.html', HEAD + '\n<<<<<<< HEAD\nfirst\n=======\nsecond\n>>>>>>> other\n' + TAIL)
        self.assertIn('unresolved merge-conflict marker in published source', self.errors())

    def test_empty_site_is_not_a_success(self):
        findings, _ = audit(self.root)
        self.assertTrue(any(f.severity == 'ERROR' for f in findings))


if __name__ == '__main__':
    unittest.main()
