// The /roms/ build on a phone: header with the launcher link, a game panel with Play.
const { chromium } = require('playwright');
const out = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES', hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8060/roms/'); await sleep(1500);
  await p.screenshot({ path: `${out}/host-p1.png` });
  console.log('scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth));
  await b.close();
})();
