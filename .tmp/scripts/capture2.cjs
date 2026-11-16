// Every screen, desktop and phone, for comparing two builds: node capture.cjs <outDir> <tag> <roms...>
const { chromium } = require('playwright');
const [out, tag, ...roms] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];
async function addRoms(p) {
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.click('button.welcome-secondary >> nth=0')]);
  await chooser.setFiles(roms);
  await p.waitForSelector('.drop-dialog button.btn-apply:not([disabled])', { timeout: 20000 });
}
async function shot(p, name) { await p.screenshot({ path: `${out}/${tag}-${name}.png` }); log.push(name); }
async function tryStep(name, fn) { try { await fn(); } catch (e) { console.log(tag, name, 'FAILED', e.message.split('\n')[0]); } }
(async () => {
  const b = await chromium.launch();
  // Desktop
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.log(tag, 'desktop PAGEERROR', e.message));
    await p.goto('http://localhost:8050/' + (process.env.PAGE || '')); await sleep(1500);
    await shot(p, 'd01-welcome');
    await tryStep('prefs', async () => { await p.click('.header-prefs >> nth=-1'); await sleep(500); await shot(p, 'd02-prefs'); await p.keyboard.press('Escape'); await sleep(300); });
    await tryStep('intake', async () => { await addRoms(p); await sleep(600); await shot(p, 'd03-intake'); await p.click('.drop-dialog button.btn-apply'); await sleep(2500); });
    await shot(p, 'd04-library');
    await tryStep('game', async () => { await p.click('.tree-item:has-text("Super Mario Land")'); await sleep(1200); await shot(p, 'd06-game'); });
    await tryStep('file', async () => { await p.click('.btn-inline:has-text(".gb") >> nth=0', { timeout: 5000 }); await sleep(1000); await shot(p, 'd06b-file'); });
    await tryStep('edit', async () => { await p.click('.btn-primary.icon-label >> nth=0', { timeout: 5000 }); await sleep(800); await shot(p, 'd07-editor'); await p.click('.metadata-editor .btn-cancel'); await sleep(500); });
    await tryStep('delete', async () => { await p.click('.btn-delete-topright >> nth=0', { timeout: 5000 }); await sleep(500); await shot(p, 'd08-delete-confirm'); await p.keyboard.press('Escape'); await sleep(300); });
    await tryStep('hover', async () => { await p.hover('.tree-item:has-text("Tetris")'); await sleep(300); await shot(p, 'd09-tree-hover'); });
    await tryStep('system', async () => { await p.click('.tree-item:has-text("MegaDrive")'); await sleep(800); await shot(p, 'd05-system'); });
    await ctx.close();
  }
  // Phone
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES', hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.log(tag, 'phone PAGEERROR', e.message));
    await p.goto('http://localhost:8050/' + (process.env.PAGE || '')); await sleep(1500);
    await shot(p, 'p01-welcome');
    await tryStep('prefs', async () => { await p.click('.header-prefs >> nth=-1'); await sleep(500); await shot(p, 'p02-prefs'); await p.keyboard.press('Escape'); await sleep(300); });
    await tryStep('intake', async () => { await addRoms(p); await sleep(600); await shot(p, 'p03-intake'); await p.click('.drop-dialog button.btn-apply'); await sleep(2500); });
    await shot(p, 'p04-systems');
    await tryStep('games', async () => { await p.click('.mobile-row >> nth=0'); await sleep(1200); await shot(p, 'p05-games'); });
    await tryStep('game', async () => { await p.click('.mobile-panel:nth-child(2) .mobile-row >> nth=0'); await sleep(1500); await shot(p, 'p06-game'); });
    await tryStep('back', async () => { await p.click('.mobile-back'); await sleep(1000); await shot(p, 'p07-back'); });
    await ctx.close();
  }
  await b.close();
  console.log(tag, 'captured', log.length, 'screens');
})();
