#!/usr/bin/env node
'use strict';

/*
 * Offline real-browser screen for a trusted static site. It serves files from a
 * virtual GitHub Pages project path by intercepting requests; no external
 * requests are allowed. No page contents, entered values, or URLs are printed.
 * This is a screening tool, not a proof of privacy or source/legal correctness.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const chromiumBundle = require('@sparticuz/chromium');
const chromium = chromiumBundle.default;

const ORIGIN = 'https://verification.invalid';
const BASE = '/project/';
const SKIP = new Set(['.git', 'node_modules', 'verification', '__pycache__', '.next', 'coverage']);
const EXACT_OFFICIAL = new Set([
  'sccassessor.org', 'www.sccassessor.org', 'sfmta.com', 'www.sfmta.com',
  'sfelections.org', 'www.sfelections.org'
]);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

function official(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    return url.protocol === 'https:' && (
      host.endsWith('.gov') || host.endsWith('.mil') || EXACT_OFFICIAL.has(host) ||
      host === 'stlouisfed.org' || host.endsWith('.stlouisfed.org') ||
      host === 'federalreservehistory.org' || host.endsWith('.federalreservehistory.org')
    );
  } catch { return false; }
}

function collectHtml(root, current = root) {
  let result = [];
  for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
    if (SKIP.has(entry.name) || entry.isSymbolicLink()) continue;
    const full = path.join(current, entry.name);
    if (entry.isDirectory()) result = result.concat(collectHtml(root, full));
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) result.push(full);
  }
  return result.sort();
}

function localTarget(root, rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return null; }
  if (url.origin !== ORIGIN || !url.pathname.startsWith(BASE)) return null;
  let relative;
  try { relative = decodeURIComponent(url.pathname.slice(BASE.length)); } catch { return null; }
  let target = path.resolve(root, relative || 'index.html');
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  try {
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    const real = fs.realpathSync(target);
    if (real !== root && !real.startsWith(root + path.sep)) return null;
    return real;
  } catch { return null; }
}

async function makeBrowser() {
  // The npm package contains matching NSS/NSPR libraries. They are unpacked to
  // the OS temporary directory, never committed or uploaded with the site.
  const moduleDir = path.dirname(path.dirname(require.resolve('@sparticuz/chromium')));
  const libraryRoot = await chromiumBundle.inflate(path.join(moduleDir, 'bin', 'al2023.tar.br'));
  const env = {...process.env, LD_LIBRARY_PATH: [path.join(libraryRoot, 'lib'), process.env.LD_LIBRARY_PATH].filter(Boolean).join(path.delimiter)};
  return puppeteer.launch({
    executablePath: await chromium.executablePath(),
    headless: 'shell',
    args: [...chromium.args, '--disable-background-networking', '--host-resolver-rules=MAP * ~NOTFOUND'],
    env
  });
}

async function checkPage(browser, root, file, delayMs) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const url = ORIGIN + BASE + relative.split('/').map(encodeURIComponent).join('/');
  const events = {remote: 0, nonGet: 0, missing: 0, js: 0};
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  let result = null;
  try {
    await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 1});
    await page.setCacheEnabled(false);
    await page.setBypassServiceWorker(true);
    await page.setRequestInterception(true);
    page.on('pageerror', () => { events.js++; });
    page.on('request', request => {
      const requestUrl = request.url();
      if (requestUrl.startsWith('data:') || requestUrl.startsWith('blob:')) {
        request.continue().catch(() => {});
        return;
      }
      if (request.method() !== 'GET' && request.method() !== 'HEAD') {
        events.nonGet++;
        request.abort('blockedbyclient').catch(() => {});
        return;
      }
      let parsed;
      try { parsed = new URL(requestUrl); } catch { parsed = null; }
      if (!parsed || parsed.origin !== ORIGIN || !parsed.pathname.startsWith(BASE)) {
        events.remote++;
        request.abort('blockedbyclient').catch(() => {});
        return;
      }
      const target = localTarget(root, requestUrl);
      if (!target) {
        events.missing++;
        request.respond({status: 404, contentType: 'text/plain', body: ''}).catch(() => {});
        return;
      }
      try {
        const body = request.method() === 'HEAD' ? Buffer.alloc(0) : fs.readFileSync(target);
        request.respond({status: 200, contentType: MIME[path.extname(target).toLowerCase()] || 'application/octet-stream',
          headers: {'Cache-Control': 'no-store'}, body}).catch(() => {});
      } catch {
        events.missing++;
        request.respond({status: 404, contentType: 'text/plain', body: ''}).catch(() => {});
      }
    });
    await page.evaluateOnNewDocument(() => {
      const record = {storageWrites: 0, beaconAttempts: 0, socketAttempts: 0, rtcAttempts: 0};
      Object.defineProperty(window, '__verificationAudit', {value: record, writable: false});
      try {
        const originalSet = Storage.prototype.setItem;
        Storage.prototype.setItem = function (...args) { record.storageWrites++; return originalSet.apply(this, args); };
      } catch {}
      try {
        Object.defineProperty(navigator, 'sendBeacon', {value() { record.beaconAttempts++; return false; }});
      } catch {}
      window.WebSocket = class { constructor() { record.socketAttempts++; throw new Error('Blocked by offline audit'); } };
      window.EventSource = class { constructor() { record.socketAttempts++; throw new Error('Blocked by offline audit'); } };
      if (window.RTCPeerConnection) window.RTCPeerConnection = class { constructor() { record.rtcAttempts++; throw new Error('Blocked by offline audit'); } };
      window.open = () => null;
      window.print = () => {};
    });
    const response = await page.goto(url, {waitUntil: 'load', timeout: 10000});
    if (!response || response.status() !== 200) events.missing++;
    if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
    // Re-dispatch current, pre-existing synthetic/default values only. No
    // personal inputs are entered by this tool, and POST requests are blocked.
    const interactions = await page.evaluate(() => {
      let controls = 0, buttons = 0;
      for (const control of document.querySelectorAll('input[type="range"], input[type="number"], select')) {
        control.dispatchEvent(new Event('input', {bubbles: true}));
        control.dispatchEvent(new Event('change', {bubbles: true}));
        controls++;
      }
      for (const button of document.querySelectorAll('button, input[type="button"]')) {
        const label = ((button.textContent || '') + ' ' + (button.value || '') + ' ' + (button.id || '')).trim();
        if (button.closest('form') && (!button.getAttribute('type') || button.getAttribute('type').toLowerCase() === 'submit')) continue;
        if (/\b(run|calculate|recalculate|simulate)\b/i.test(label)) { button.click(); buttons++; }
      }
      return {controls, buttons};
    });
    if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs));
    result = await page.evaluate(() => ({
      rowLinks: [...document.querySelectorAll('tr')].filter(row => row.querySelector('td')).map(
        row => [...row.querySelectorAll('a[href]')].map(link => link.getAttribute('href'))
      ),
      anchors: [...document.querySelectorAll('a[href]')].map(link => link.getAttribute('href')),
      data: window.__verificationAudit,
      noHeading: !document.querySelector('h1'),
      overflowDesktop: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    }));
    await page.setViewport({width: 390, height: 844, deviceScaleFactor: 1});
    result.overflowMobile = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    result.cookies = (await page.cookies()).length;
    result.unlinkedRows = result.rowLinks.filter(links => !links.some(official)).length;
    result.interactions = interactions;
    result.brokenDynamicLinks = 0;
    for (const href of result.anchors) {
      if (!href || href.startsWith('#') || /^(mailto:|tel:|data:)/i.test(href)) continue;
      let target;
      try { target = new URL(href, url); } catch { result.brokenDynamicLinks++; continue; }
      if (target.origin === ORIGIN && !localTarget(root, target.href)) result.brokenDynamicLinks++;
      else if (!['https:', 'http:'].includes(target.protocol)) result.brokenDynamicLinks++;
    }
    return {relative, events, result};
  } catch {
    return {relative, events, result: null};
  } finally {
    await context.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help')) {
    console.log('Usage: node verification/check_browser.cjs SITE_ROOT [--wait-ms N]');
    return args.includes('--help') ? 0 : 2;
  }
  const rootArg = args[0];
  let delayMs = 150;
  if (args[1] === '--wait-ms') delayMs = Number(args[2]);
  if (!Number.isFinite(delayMs) || delayMs < 0 || delayMs > 5000) {
    console.error('ERROR: invalid delay'); return 2;
  }
  let root;
  try { root = fs.realpathSync(rootArg); if (!fs.statSync(root).isDirectory()) throw new Error(); }
  catch { console.error('ERROR: invalid site root'); return 2; }
  const pages = collectHtml(root);
  if (!pages.length) { console.error('ERROR: no HTML files found'); return 2; }
  let browser;
  try { browser = await makeBrowser(); }
  catch (error) { console.error(`ERROR: browser could not launch (${error.name}); check platform and shared-library prerequisites`); return 2; }
  let errors = 0, warnings = 0, controlCount = 0, buttonCount = 0;
  try {
    for (const file of pages) {
      const {relative, events, result} = await checkPage(browser, root, file, delayMs);
      function report(level, message) {
        console.log(`${level}: ${relative}: ${message}`);
        if (level === 'ERROR') errors++; else warnings++;
      }
      if (!result) { report('ERROR', 'page did not finish loading or executing'); continue; }
      if (events.js) report('ERROR', `${events.js} uncaught browser script error(s); details suppressed`);
      if (events.remote) report('ERROR', `${events.remote} external resource or network request(s) blocked; URLs suppressed`);
      if (events.nonGet) report('ERROR', `${events.nonGet} non-GET request(s) blocked`);
      if (events.missing) report('ERROR', `${events.missing} missing local browser resource(s)`);
      if (result.unlinkedRows) report('ERROR', `${result.unlinkedRows} rendered table data row(s) lack their own official HTTPS link`);
      if (result.brokenDynamicLinks) report('ERROR', `${result.brokenDynamicLinks} rendered local or unsupported link(s) need review`);
      const audit = result.data || {};
      if (audit.beaconAttempts || audit.socketAttempts || audit.rtcAttempts) report('ERROR', 'a beacon, socket or peer connection was blocked');
      if (audit.storageWrites || result.cookies) report('WARN', 'browser storage or cookies written; inspect retention and content privately');
      if (result.noHeading) report('WARN', 'page has no h1 heading');
      if (result.overflowDesktop || result.overflowMobile) report('WARN', 'document overflows the viewport; inspect responsive layout');
      controlCount += result.interactions.controls;
      buttonCount += result.interactions.buttons;
    }
  } finally { await browser.close(); }
  console.log(`Browser checked ${pages.length} HTML page(s), dispatched ${controlCount} controls and ${buttonCount} scenario button(s): ${errors} errors, ${warnings} warnings.`);
  console.log('External requests were blocked. Visual quality, all interactions, privacy and source accuracy still require independent review.');
  return errors ? 1 : 0;
}

if (require.main === module) main().then(code => { process.exitCode = code; }).catch(() => {
  console.error('ERROR: browser audit failed unexpectedly; details suppressed'); process.exitCode = 2;
});
module.exports = {official, localTarget};
