const { chromium } = require('playwright');
const roms = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8050/'); await p.waitForTimeout(1500);
  console.log('welcome buttons', await p.$$eval('button.welcome-secondary', (b) => b.map((x) => x.textContent.trim())));
  const chooserP = p.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
  await p.click('button.welcome-secondary >> nth=0', { timeout: 5000 }).catch((e) => console.log('click fail', e.message.slice(0, 200)));
  const chooser = await chooserP;
  console.log('chooser', !!chooser);
  if (chooser) { await chooser.setFiles(roms); }
  await p.waitForTimeout(6000);
  console.log(await p.evaluate(() => [...document.querySelectorAll('.modal-dialog, dialog[open], button.btn-apply')].map((e) => e.className + ' | ' + e.textContent.trim().slice(0, 120)).join('\n')));
  await b.close();
})();
