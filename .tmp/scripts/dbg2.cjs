const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console', m.type(), m.text().slice(0, 400)); });
  await p.goto('http://localhost:8050/next.html'); await p.waitForTimeout(1500);
  const state = () => p.evaluate(() => [...document.querySelectorAll('dialog')].map((d) => `${d.className}:${d.open}:${getComputedStyle(d).opacity}`));
  console.log('before', await state());
  await p.click('.header-prefs >> nth=-1');
  for (const ms of [50, 300, 800]) { await p.waitForTimeout(ms); console.log('after', ms, await state()); }
  await b.close();
})();
