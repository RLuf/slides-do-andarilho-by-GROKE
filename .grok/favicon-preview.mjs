import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const svg = readFileSync('/workspace/public/favicon.svg', 'utf8');
const src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
const html = `<!doctype html><html><body style="margin:0;background:#3a3a3a;display:flex;gap:20px;padding:24px;align-items:flex-end">
<img src="${src}" width="16" height="16">
<img src="${src}" width="32" height="32">
<img src="${src}" width="64" height="64">
</body></html>`;
const htmlPath = '/workspace/.grok/favicon-preview.html';
writeFileSync(htmlPath, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 260, height: 120 } });
await page.goto(pathToFileURL(htmlPath).href);
await page.screenshot({ path: '/workspace/.grok/favicon-preview.png' });
await browser.close();
console.log('ok');
