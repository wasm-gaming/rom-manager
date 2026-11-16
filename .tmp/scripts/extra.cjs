// What the screen captures do not cover: language and theme switched live, region order,
// organize preview, multi-select + batch editor, the lookup button state.
const { chromium } = require('playwright');
const [out, page, ...roms] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await p.goto('http://localhost:8050/' + page); await sleep(1500);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.click('button.welcome-secondary >> nth=0')]);
  await chooser.setFiles(roms);
  await p.waitForSelector('.drop-dialog button.btn-apply:not([disabled])');
  await p.click('.drop-dialog button.btn-apply'); await sleep(2500);
  // language, live
  await p.click('.header-prefs >> nth=-1'); await sleep(400);
  await p.click('.prefs-segment:has-text("English")'); await sleep(400);
  const english = await p.textContent('.modal-dialog[open] h3');
  await p.click('.prefs-segment:has-text("Oscuro"), .prefs-segment:has-text("Dark")'); await sleep(400);
  const theme = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.screenshot({ path: `${out}/${page || 'base'}-x1-english-dark.png` });
  await p.click('.prefs-segment:has-text("Español")'); await sleep(300);
  await p.click('.prefs-segment:has-text("Claro")'); await sleep(300);
  await p.keyboard.press('Escape'); await sleep(300);
  // region order
  await p.click('.header-region:has-text("JP")'); await sleep(600);
  const region = await p.textContent('.header-region.on');
  await p.click('.header-region:has-text("EU")'); await sleep(400);
  // multi-select files in flat mode: toggle grouping of GAMEBOY off, select two files
  await p.click('.tree-item:has-text("GAMEBOY") .tree-group-toggle'); await sleep(1200);
  await p.click('.tree-item:has-text("Tetris")'); await sleep(500);
  await p.click('.tree-item:has-text("Super Mario")', { modifiers: ['Shift'] }); await sleep(800);
  await p.screenshot({ path: `${out}/${page || 'base'}-x2-multi.png` });
  const multi = await p.textContent('.details-pane h3').catch(() => null);
  await p.click('.details-pane .btn-primary.icon-label').catch(() => {}); await sleep(600);
  await p.screenshot({ path: `${out}/${page || 'base'}-x3-batch.png` });
  // organize preview on the system folder
  await p.click('.tree-item:has-text("GAMEBOY") .tree-group-toggle'); await sleep(1500);
  await p.click('.tree-item:has-text("GAMEBOY") .tree-organize').catch((e) => errors.push('no organize button')); await sleep(2500);
  await p.screenshot({ path: `${out}/${page || 'base'}-x4-organize.png` });
  const organize = await p.textContent('.organize-header h2').catch(() => null);
  console.log(JSON.stringify({ english, theme, region, multi, organize, errors }, null, 1));
  await b.close();
})();
