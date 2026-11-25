#!/usr/bin/env node
/**
 * Link, Asset, Relative Path & DOM Binding Audit Script
 * Verifies:
 * 1. Every internal href/src/fetch target in HTML and JS resolves to an existing workspace file.
 * 2. No leading-slash root-absolute links (breaks GitHub Pages /TinoDash1/ subpath).
 * 3. No hardcoded localhost / 127.0.0.1 API calls in browser JS/HTML/JSON.
 * 4. Every DOM ID referenced in assets/js/pages-*.js exists in its corresponding HTML file.
 * 5. Every external URL in data/*.json and HTML uses valid https:// URLs.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

walk(ROOT);

if (htmlFiles.length === 0) {
  console.log('ℹ️ No HTML files yet; skipping HTML link check.');
  process.exit(0);
}

for (const file of htmlFiles) {
  const dir = path.dirname(file);
  const relFile = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');

  const attrRegex = /\b(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const target = match[1];
    if (
      target.startsWith('#') ||
      target.startsWith('mailto:') ||
      target.startsWith('javascript:') ||
      target.startsWith('data:')
    ) {
      continue;
    }
    if (target.startsWith('https://')) {
      if (target.includes('localhost') || target.includes('127.0.0.1')) {
        errors.push(`[Preview Compatibility] ${relFile}: browser URL references localhost/127.0.0.1 -> ${target}`);
      }
      continue;
    }
    if (target.startsWith('http://')) {
      errors.push(`[Insecure URL] ${relFile}: use https:// -> ${target}`);
      continue;
    }
    if (target.startsWith('/')) {
      errors.push(`[GitHub Pages Subpath] ${relFile}: leading "/" breaks subpath hosting -> ${target}`);
      continue;
    }
    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;
    const resolved = path.resolve(dir, cleanTarget);
    if (!fs.existsSync(resolved)) {
      errors.push(`[Broken Internal Link] ${relFile}: target does not exist -> ${target} (resolved ${path.relative(ROOT, resolved)})`);
    }
  }
}

// Verify JS internal page/data targets
const layoutPath = path.join(ROOT, 'assets/js/layout.js');
if (fs.existsSync(layoutPath)) {
  const layoutSrc = fs.readFileSync(layoutPath, 'utf8');
  for (const m of layoutSrc.matchAll(/p\(['"]([^'"]+)['"]\)/g)) {
    const relTarget = m[1];
    if (!fs.existsSync(path.join(ROOT, relTarget))) {
      errors.push(`[Broken JS Nav/Data Target] assets/js/layout.js: missing ${relTarget}`);
    }
  }
}

// Verify every relative ES-module import inside assets/js/*.js resolves to an existing file
const jsDir = path.join(ROOT, 'assets/js');
if (fs.existsSync(jsDir)) {
  for (const fn of fs.readdirSync(jsDir)) {
    if (!fn.endsWith('.js') && !fn.endsWith('.mjs')) continue;
    const fullJs = path.join(jsDir, fn);
    const srcJs = fs.readFileSync(fullJs, 'utf8');
    for (const m of srcJs.matchAll(/\bfrom\s+['"](\.[^'"]+)['"]/g)) {
      const imp = m[1];
      const resolvedImp = path.resolve(jsDir, imp);
      if (!fs.existsSync(resolvedImp)) {
        errors.push(`[Broken ES-Module Import] assets/js/${fn}: target does not exist -> ${imp} (resolved ${path.relative(ROOT, resolvedImp)})`);
      }
    }
  }
}

// Verify DOM ID bindings across page modules
const pageBindings = [
  ['index.html', 'assets/js/pages-overview.js'],
  ['pages/projections.html', 'assets/js/pages-projections.js'],
  ['pages/black-swan.html', 'assets/js/pages-black-swan.js'],
  ['pages/properties.html', 'assets/js/pages-properties.js'],
  ['pages/tax-estate.html', 'assets/js/pages-tax-estate.js'],
  ['pages/decisions.html', 'assets/js/pages-decisions.js'],
  ['pages/suggestions.html', 'assets/js/pages-suggestions.js'],
  ['pages/briefing-sheet.html', 'assets/js/pages-briefing.js'],
  ['pages/glossary.html', 'assets/js/pages-glossary.js'],
  ['pages/pre-commitment.html', 'assets/js/pages-pre-commitment.js'],
  ['pages/investment-policy.html', 'assets/js/pages-investment-policy.js']
];

for (const [htmlRel, jsRel] of pageBindings) {
  const html = fs.readFileSync(path.join(ROOT, htmlRel), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, jsRel), 'utf8');
  for (const shellId of ['site-header', 'privacy-strip', 'site-footer']) {
    if (!html.includes(`id="${shellId}"`)) {
      errors.push(`[Missing Shell ID] ${htmlRel}: missing id="${shellId}"`);
    }
  }
  for (const m of js.matchAll(/getElementById\(['"]([^'"$]+)['"]\)/g)) {
    const id = m[1];
    if (!html.includes(`id="${id}"`)) {
      errors.push(`[Missing DOM Binding] ${htmlRel}: missing id="${id}" used by ${jsRel}`);
    }
  }
}

// Verify projections controls exist in projections.html
const projHtml = fs.readFileSync(path.join(ROOT, 'pages/projections.html'), 'utf8');
const projJs = fs.readFileSync(path.join(ROOT, 'assets/js/pages-projections.js'), 'utf8');
for (const m of projJs.matchAll(/\{\s*id:\s*'([^']+)'/g)) {
  const id = m[1];
  if (!projHtml.includes(`id="ctrl-${id}"`)) {
    errors.push(`[Missing Control Binding] pages/projections.html: missing id="ctrl-${id}"`);
  }
}

// Check JSON files for valid official URLs & no localhost
for (const jsonName of ['verified-sources.json', 'properties.json', 'scenarios.json']) {
  const full = path.join(ROOT, 'data', jsonName);
  if (!fs.existsSync(full)) continue;
  const raw = fs.readFileSync(full, 'utf8');
  if (raw.includes('127.0.0.1') || raw.includes('localhost')) {
    errors.push(`[Preview Compatibility] data/${jsonName} contains localhost/127.0.0.1`);
  }
  if (raw.includes('http://')) {
    errors.push(`[Insecure URL] data/${jsonName} contains http://`);
  }
}

if (errors.length > 0) {
  console.error('❌ Link, Binding & Subpath Audit FAILED:');
  for (const e of errors) console.error('  -', e);
  process.exit(1);
} else {
  console.log(`✅ Link, DOM Binding & Subpath Audit PASSED across ${htmlFiles.length} HTML page(s).`);
}
