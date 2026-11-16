const { chromium } = require('playwright');
const roms = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  let n = 0;
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => { if (n++ < 90) console.log('console', m.type(), m.text().slice(0, 400)); });
  await p.goto('http://localhost:8050/'); await p.waitForTimeout(1500);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.click('button.welcome-secondary >> nth=0')]);
  await chooser.setFiles(roms);
  await p.waitForSelector('.drop-dialog button.btn-apply:not([disabled])');
  await p.click('.drop-dialog button.btn-apply');
  for (let i = 0; i < 6; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const r = await Promise.race([p.evaluate(() => document.querySelectorAll('.tree-item').length), new Promise((r) => setTimeout(() => r('BUSY'), 2000))]);
    console.log('t', i, r);
  }
  await b.close();
})();
