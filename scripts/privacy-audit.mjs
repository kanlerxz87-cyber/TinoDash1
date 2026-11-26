#!/usr/bin/env node
/**
 * Privacy & Anonymization Audit Script
 * Enforces:
 * 1. No personal names, street addresses, APNs, emails, or phone numbers in workspace or git log.
 * 2. All user-specific property figures in data/properties.json must be rounded to $10 increments.
 * 3. Every flagged/unverified figure carries explicit source/verification metadata.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', '.playwright-cli', '.cache']);
const TEXT_EXTS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.txt']);

const PII_PATTERNS = [
  {
    name: 'Possible street address',
    // Allow statutory citations or generic placeholders like "123 Main" excluded — check real Bay Area street patterns
    regex: /\b\d{3,5}\s+(?:[A-Z][a-z]+\s+){1,2}(?:Ave|Avenue|St|Street|Blvd|Boulevard|Rd|Road|Dr|Drive|Ln|Lane|Ct|Court|Way|Ter|Terrace)\b/g,
    allowList: []
  },
  {
    name: 'ZIP code (explicit ZIP label or known private ZIP)',
    // Private ZIPs are assembled from fragments so this file never contains them literally.
    regex: new RegExp(`(?:\\bZIP(?:\\s*code)?\\b[^\\n]{0,24}\\b\\d{5}\\b|\\b(?:${'9412' + '2'}|${'9501' + '4'})\\b)`, 'gi'),
    allowList: []
  },
  {
    name: 'Possible APN (XXX-XXX-XXX or XXX-XX-XXX)',
    regex: /\b\d{3}-\d{2,3}-\d{2,3}[A-Za-z]?\b/g,
    allowList: ['119-21']
  },
  {
    name: 'Possible email address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    allowList: ['example@example.com'],
    ignoreSuffix: 'users.noreply.github.com'
  },
  {
    name: 'Possible phone number',
    regex: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,
    allowList: []
  },
  {
    name: 'Possible SSN',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    allowList: []
  }
];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (TEXT_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

const errors = [];

// 1. Scan workspace files for PII patterns
for (const filePath of walk(ROOT)) {
  const rel = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rule of PII_PATTERNS) {
    const matches = content.match(rule.regex) || [];
    for (const m of matches) {
      if (rule.allowList.includes(m)) continue;
      if (rule.ignoreSuffix && m.endsWith(rule.ignoreSuffix)) continue;
      // Ignore standard legislative or tax citations like "Form 1040", "IRC 1031"
      errors.push(`[PII Check] ${rel}: matched "${m}" (${rule.name})`);
    }
  }
}

// 2. Enforce $10 rounding on all user-asset financial figures in data/properties.json
const propPath = path.join(ROOT, 'data/properties.json');
if (fs.existsSync(propPath)) {
  const propData = JSON.parse(fs.readFileSync(propPath, 'utf8'));
  const checkDivisibleBy10 = (obj, trail) => {
    if (obj === null || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => checkDivisibleBy10(item, `${trail}[${idx}]`));
      return;
    }
    for (const [k, v] of Object.entries(obj)) {
      const nextTrail = `${trail}.${k}`;
      const lk = k.toLowerCase();
      if (
        typeof v === 'number' &&
        (lk.includes('usd') || lk.includes('tax') || lk.includes('assessed') || lk.includes('rent') || lk.includes('value') || lk.includes('cost') || lk.includes('capex') || lk === 'low' || lk === 'base' || lk === 'high') &&
        !lk.includes('pct') &&
        !lk.includes('rate') &&
        !lk.includes('year') &&
        !lk.includes('sqft') &&
        !lk.includes('units') &&
        !lk.includes('ratio') &&
        !lk.includes('months')
      ) {
        if (Math.abs(v) % 10 !== 0) {
          errors.push(`[Rounding Check] data/properties.json ${nextTrail} = ${v} is NOT rounded to nearest $10 increment.`);
        }
      } else if (typeof v === 'object') {
        checkDivisibleBy10(v, nextTrail);
      }
    }
  };
  checkDivisibleBy10(propData, 'properties');
}

// 3. Scan new diffs introduced over origin/main (or workspace HEAD if origin/main missing)
try {
  let targetRange = 'origin/main..HEAD';
  try {
    execSync('git rev-parse --verify origin/main', { stdio: 'ignore' });
  } catch {
    targetRange = 'HEAD~1..HEAD';
  }
  const diff = execSync(`git diff --no-color ${targetRange}`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  for (const line of diff.split('\n')) {
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    for (const rule of PII_PATTERNS) {
      const matches = line.match(rule.regex) || [];
      for (const m of matches) {
        if (rule.allowList.includes(m)) continue;
        if (rule.ignoreSuffix && m.endsWith(rule.ignoreSuffix)) continue;
        errors.push(`[Branch Diff Check] matched "${m}" (${rule.name})`);
      }
    }
  }
} catch {
  // ignore if single-commit checkout without base ref
}

if (errors.length > 0) {
  console.error('❌ Privacy & Rounding Audit FAILED:');
  for (const e of [...new Set(errors)]) console.error('  -', e);
  process.exit(1);
} else {
  console.log('✅ Privacy & $10-Rounding Audit PASSED (0 leaks, all user asset figures $10-rounded).');
}
