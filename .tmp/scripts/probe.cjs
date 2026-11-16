const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8050/'); await p.waitForTimeout(2000);
  console.log(await p.evaluate(() => [...document.querySelectorAll('button, input[type=file]')].map((e) => `${e.tagName} ${e.className} | ${(e.textContent || '').trim().slice(0, 40)}`).join('\n')));
  await b.close();
})();
