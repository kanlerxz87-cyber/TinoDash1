#!/usr/bin/env python3
"""Independent, privacy-conscious checks for a static GitHub Pages site.

This is a screening tool, not proof of anonymity, legal accuracy, or runtime
correctness. It never prints a matched potential identifier. Python stdlib only.
"""
from __future__ import annotations

import argparse
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable

SKIP_DIRS = {'.git', 'node_modules', 'verification', '__pycache__', '.next', 'coverage'}
OFFICIAL_EXTRA = ('stlouisfed.org', 'federalreservehistory.org')
# Official agency domains that do not end in .gov. Exact host matches only:
# the county assessor redirects to asr.santaclaracounty.gov; SFMTA and the
# San Francisco Department of Elections publish their own official sites.
OFFICIAL_EXACT = {
    'sccassessor.org', 'www.sccassessor.org',
    'sfmta.com', 'www.sfmta.com',
    'sfelections.org', 'www.sfelections.org',
}
CONFLICT_MARKER = re.compile(r'(?m)^(?:<{7}(?: .*)?|={7}|>{7}(?: .*)?)\s*$')
PRIVACY_PATTERNS = {
    'possible street address': re.compile(
        r'\b\d{1,6}\s+(?:[A-Za-z][\w.\'-]*\s+){1,5}'
        r'(?:street|st\.?|avenue|ave\.?|boulevard|blvd\.?|road|rd\.?|drive|dr\.?|lane|ln\.?)\b',
        re.IGNORECASE,
    ),
    'possible ZIP/postal code': re.compile(
        r'\b(?:9[45]\d{3}(?:-\d{4})?|(?:ZIP(?:\s+code)?|California|CA)\s*[:#-]?\s*\d{5}(?:-\d{4})?)\b',
        re.IGNORECASE,
    ),
    'possible tax ID': re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
    'possible parcel number': re.compile(r'\b\d{3}-\d{2}-\d{3}\b'),
}


def official(url: str) -> bool:
    """Only domains, not claims about a particular row, can be machine-checked."""
    try:
        parsed = urllib.parse.urlsplit(url)
        host = (parsed.hostname or '').lower().rstrip('.')
    except ValueError:
        return False
    if parsed.scheme != 'https' or not host:
        return False
    return (host.endswith('.gov') or host.endswith('.mil') or host in OFFICIAL_EXACT or
            any(host == item or host.endswith('.' + item) for item in OFFICIAL_EXTRA))


@dataclass
class Finding:
    severity: str
    path: str
    line: int
    message: str

    def __str__(self) -> str:
        return f'{self.severity}: {self.path}:{self.line}: {self.message}'


@dataclass
class Ref:
    url: str
    line: int
    kind: str


@dataclass
class Row:
    line: int
    has_data: bool = False
    links: list[str] = field(default_factory=list)


class Document(HTMLParser):
    def __init__(self, path: Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids: set[str] = set()
        self.refs: list[Ref] = []
        self.rows: list[Row] = []
        self._rows: list[Row] = []
        self._in_raw: list[str] = []
        self.visible: list[tuple[int, str]] = []
        self.forms: list[tuple[int, str]] = []
        self.title_found = False
        self.has_viewport = False
        self.has_lang = False
        self.external_scripts: list[Ref] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs)
        line = self.getpos()[0]
        if attrs.get('id'):
            self.ids.add(attrs['id'] or '')
        if tag == 'a' and attrs.get('name'):
            self.ids.add(attrs['name'] or '')
        if tag == 'html' and attrs.get('lang'):
            self.has_lang = True
        if tag == 'title':
            self.title_found = True
        if tag == 'meta' and (attrs.get('name') or '').lower() == 'viewport':
            self.has_viewport = True
        if tag in ('script', 'style'):
            self._in_raw.append(tag)
        if tag == 'tr':
            self._rows.append(Row(line))
        if tag == 'td' and self._rows:
            self._rows[-1].has_data = True
        if tag == 'a' and self._rows and attrs.get('href'):
            self._rows[-1].links.append(attrs['href'] or '')
        if tag == 'form':
            self.forms.append((line, attrs.get('action') or ''))
        attr = 'href' if tag in ('a', 'link') else 'src' if tag in ('script', 'img', 'iframe', 'source') else None
        if attr and attrs.get(attr):
            ref = Ref(attrs[attr] or '', line, tag)
            self.refs.append(ref)
            if tag == 'script':
                try:
                    if urllib.parse.urlsplit(ref.url).scheme in ('http', 'https'):
                        self.external_scripts.append(ref)
                except ValueError:
                    pass  # The reference pass reports malformed URLs without printing them.

    def handle_endtag(self, tag: str) -> None:
        if tag == 'tr' and self._rows:
            self.rows.append(self._rows.pop())
        if tag in ('script', 'style') and self._in_raw and self._in_raw[-1] == tag:
            self._in_raw.pop()

    def handle_data(self, data: str) -> None:
        if not self._in_raw:
            self.visible.append((self.getpos()[0], data))


def files_under(root: Path, suffixes: Iterable[str]) -> Iterable[Path]:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if path.is_file() and not any(part in SKIP_DIRS for part in relative.parts) and path.suffix.lower() in suffixes:
            yield path


def check_privacy(text: str, path: str, line: int = 1) -> list[Finding]:
    findings: list[Finding] = []
    for label, pattern in PRIVACY_PATTERNS.items():
        if pattern.search(text):
            findings.append(Finding('WARN', path, line, f'{label}; inspect privately (match suppressed)'))
    return findings


def resolve_local(root: Path, source: Path, ref: Ref) -> tuple[Path | None, str | None]:
    parsed = urllib.parse.urlsplit(ref.url)
    if parsed.scheme or parsed.netloc or ref.url.startswith('//'):
        return None, None
    raw_path = urllib.parse.unquote(parsed.path)
    # Absolute paths point to the hostname root, not the repository's project
    # path on GitHub Pages. A relative URL is reliable in both local and Pages.
    if raw_path.startswith('/'):
        return None, 'root-relative URL may escape the GitHub Pages project base'
    target = (source.parent / raw_path).resolve() if raw_path else source.resolve()
    try:
        target.relative_to(root)
    except ValueError:
        return None, 'local URL escapes the site root'
    if target.is_dir():
        target = target / 'index.html'
    return target, None


def audit(root: Path) -> tuple[list[Finding], set[str]]:
    root = root.resolve()
    findings: list[Finding] = []
    external: set[str] = set()
    docs: dict[Path, Document] = {}
    html_files = list(files_under(root, {'.html', '.htm'}))
    if not html_files:
        return [Finding('ERROR', '.', 1, 'no static HTML files found')], external
    for path in html_files:
        name = path.relative_to(root).as_posix()
        doc = Document(path)
        try:
            raw_html = path.read_text(encoding='utf-8')
            doc.feed(raw_html)
            doc.close()
        except (UnicodeError, ValueError) as exc:
            findings.append(Finding('ERROR', name, 1, f'cannot parse HTML: {type(exc).__name__}'))
            continue
        docs[path.resolve()] = doc
        if not doc.has_lang:
            findings.append(Finding('WARN', name, 1, 'missing html language'))
        if not doc.title_found:
            findings.append(Finding('WARN', name, 1, 'missing page title'))
        if not doc.has_viewport:
            findings.append(Finding('WARN', name, 1, 'missing mobile viewport'))
        # Include attributes, embedded JSON, and inline scripts, not just text.
        # All matches are suppressed. Warnings are leads, not verdicts.
        findings.extend(check_privacy(raw_html, name))
        for row in doc.rows:
            if row.has_data and not any(official(url) for url in row.links):
                findings.append(Finding('ERROR', name, row.line, 'table data row lacks its own HTTPS official-source link'))
        for line, action in doc.forms:
            try:
                parsed = urllib.parse.urlsplit(action)
            except ValueError:
                findings.append(Finding('ERROR', name, line, 'malformed form action; content suppressed'))
                continue
            if parsed.scheme in ('http', 'https') or parsed.netloc:
                findings.append(Finding('ERROR', name, line, 'form submits to a remote destination'))
            elif action:
                findings.append(Finding('WARN', name, line, 'form action requires privacy review'))
        for ref in doc.external_scripts:
            findings.append(Finding('WARN', name, ref.line, 'remote script can transmit data; review or remove'))

    for path, doc in docs.items():
        name = path.relative_to(root).as_posix()
        for ref in doc.refs:
            try:
                parsed = urllib.parse.urlsplit(ref.url)
            except ValueError:
                findings.append(Finding('ERROR', name, ref.line, 'malformed URL; content suppressed'))
                continue
            if parsed.scheme in ('http', 'https'):
                external.add(urllib.parse.urldefrag(ref.url)[0])
                if parsed.scheme != 'https':
                    findings.append(Finding('WARN', name, ref.line, 'external link is not HTTPS'))
                continue
            if parsed.scheme in ('mailto', 'tel', 'data'):
                continue
            if parsed.scheme or parsed.netloc:
                findings.append(Finding('ERROR', name, ref.line, 'unsupported or protocol-relative URL'))
                continue
            target, error = resolve_local(root, path, ref)
            if error:
                findings.append(Finding('ERROR', name, ref.line, error))
            elif target is not None and not target.is_file():
                findings.append(Finding('ERROR', name, ref.line, f'missing local {ref.kind} target'))
            elif target is not None and parsed.fragment and target.suffix.lower() in ('.html', '.htm'):
                fragment = urllib.parse.unquote(parsed.fragment)
                if target in docs and fragment not in docs[target].ids:
                    findings.append(Finding('ERROR', name, ref.line, 'local fragment target not found'))

    text_extensions = {'.html', '.htm', '.js', '.mjs', '.json', '.css', '.md', '.py', '.yaml', '.yml'}
    for path in files_under(root, text_extensions):
        name = path.relative_to(root).as_posix()
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeError:
            continue
        if CONFLICT_MARKER.search(text):
            findings.append(Finding('ERROR', name, 1, 'unresolved merge-conflict marker in published source'))
        if path.suffix.lower() in {'.js', '.mjs', '.json'}:
            # Do not emit the matching data, which could itself be sensitive.
            findings.extend(check_privacy(text, name))
        if path.suffix.lower() in {'.js', '.mjs'}:
            if re.search(r'\b(fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket\s*\()', text):
                findings.append(Finding('WARN', name, 1, 'network API present; verify no private data leaves the browser'))
            if re.search(r'\b(localStorage|sessionStorage|indexedDB)\b', text):
                findings.append(Finding('WARN', name, 1, 'browser storage present; inspect retention and privacy'))
            if re.search(r'<tr(?:\s|>)', text, re.IGNORECASE):
                findings.append(Finding('WARN', name, 1, 'generated table rows require a runtime official-source-link audit'))
    return findings, external


def check_remote(urls: Iterable[str], timeout: float) -> list[Finding]:
    """Opt-in network checks; URLs are sent to remote servers but never logged.

    The caller must first inspect every URL privately, since path/query data may
    itself be sensitive. Robots/403/timeouts are unconfirmed, not broken.
    """
    findings: list[Finding] = []
    for index, url in enumerate(sorted(urls), 1):
        label = f'external link #{index}; URL suppressed'
        try:
            request = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'DecisionDeskLinkAudit/1.0'})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                status = response.status
                if status >= 400:
                    findings.append(Finding('WARN', '<remote>', 1, f'HTTP {status}; {label}'))
        except urllib.error.HTTPError as exc:
            severity = 'ERROR' if exc.code in (404, 410) else 'WARN'
            findings.append(Finding(severity, '<remote>', 1, f'HTTP {exc.code}; {label}'))
        except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
            findings.append(Finding('WARN', '<remote>', 1, f'unconfirmed ({type(exc).__name__}); {label}'))
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', default='.', help='static site root to audit')
    parser.add_argument('--remote', action='store_true', help='also check external HTTP URLs; blocked requests remain unconfirmed')
    parser.add_argument('--timeout', type=float, default=8.0, help='timeout per remote request in seconds')
    args = parser.parse_args()
    root = Path(args.root)
    if not root.is_dir():
        print('ERROR: site root is not a directory', file=sys.stderr)
        return 2
    findings, urls = audit(root)
    if args.remote:
        findings.extend(check_remote(urls, args.timeout))
    for finding in findings:
        print(finding)
    errors = sum(item.severity == 'ERROR' for item in findings)
    warnings = sum(item.severity == 'WARN' for item in findings)
    print(f'Checked {len(list(files_under(root.resolve(), {".html", ".htm"})))} HTML files; '
          f'{len(urls)} external URLs collected; {errors} errors, {warnings} warnings.')
    if not args.remote:
        print('External URLs were not fetched; source accuracy and all runtime content still need independent review.')
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
