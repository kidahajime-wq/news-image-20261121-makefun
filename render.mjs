// render.mjs — renders page.html (written by compose.mjs) to entry.png with a
// headless Chromium, at exactly the composed size so text stays crisp.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire('/tmp/pw/package.json');
const { chromium } = require('playwright-core');

const W = 1024;
const H = 832;
const exe = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell';
const here = new URL('./', import.meta.url);

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(new URL('./page.html', here).href, { waitUntil: 'load' });
await page.waitForTimeout(300);
const out = fileURLToPath(new URL('./entry.png', here));
await page.screenshot({ path: out });
await browser.close();
console.log('entry.png written:', out);
