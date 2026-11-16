const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => console.log('console', m.type(), m.text().slice(0, 300)));
  await p.goto('http://localhost:8050/');
  await p.waitForTimeout(3000);
  const r = await Promise.race([p.evaluate(() => document.body.innerHTML.length), new Promise((r) => setTimeout(() => r('evaluate timed out'), 5000))]);
  console.log('result', r);
  await b.close();
})();
