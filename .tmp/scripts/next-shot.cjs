const { chromium } = require('playwright');
const [url, out, w = 1280, h = 800] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console', m.type(), m.text().slice(0, 300)); });
  await p.goto(url); await p.waitForTimeout(1500);
  await p.screenshot({ path: out });
  await b.close();
})();
