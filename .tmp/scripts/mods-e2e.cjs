// Mods end to end: ROMs + a UPS picked together, then an IPS with the game open. node mods-e2e.cjs <shots> <roms...> -- <ups> <ips>
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const out = args[0];
const sep = args.indexOf('--');
const roms = args.slice(1, sep);
const [ups, ips] = args.slice(sep + 1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const opfs = (p, path) => p.evaluate(async (path) => {
  let dir = await navigator.storage.getDirectory();
  const parts = path.split('/');
  try {
    for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part);
    return await (await (await dir.getFileHandle(parts.at(-1))).getFile()).text();
  } catch (e) { return 'MISSING ' + e.message; }
}, path);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8050/'); await sleep(1500);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.click('button.welcome-secondary >> nth=0')]);
  await chooser.setFiles([...roms, ups]);
  await p.waitForSelector('.drop-dialog button.btn-apply:not([disabled])', { timeout: 20000 });
  await p.click('.drop-dialog button.btn-apply'); await sleep(4000);
  console.log('notice after intake:', await p.locator('.tree-notice, .notice, [class*=notice]').allInnerTexts());
  await p.click('.tree-item:has-text("Tetris")'); await sleep(1500);
  await p.screenshot({ path: `${out}/mods-1-game.png` });
  console.log('mods section:', (await p.locator('.game-mods').innerText()).replace(/\n+/g, ' | '));
  // An IPS with the game open: it goes to that game.
  const [c2] = await Promise.all([p.waitForEvent('filechooser'), p.click('.header-prefs[title="Añadir ROMs"]')]);
  await c2.setFiles([ips]); await sleep(2000);
  console.log('mods section 2:', (await p.locator('.game-mods').innerText()).replace(/\n+/g, ' | '));
  await p.screenshot({ path: `${out}/mods-2-ips.png` });
  // Rename the IPS.
  await p.click('.game-mods .mod-row:has-text("Palette Hack") button[title="Renombrar"]'); await sleep(400);
  await p.fill('.prompt-input', 'Paleta azul'); await p.keyboard.press('Enter'); await sleep(1200);
  // Unassign the UPS.
  await p.click('.game-mods .mod-row:has-text("Tetris Turbo") button[title="Quitar del juego"]'); await sleep(1200);
  console.log('mods section 3:', (await p.locator('.game-mods').innerText()).replace(/\n+/g, ' | '));
  await p.screenshot({ path: `${out}/mods-3-unassigned.png` });
  await p.click('.game-mods details summary'); await sleep(300);
  await p.click('.game-mods .mod-assign'); await sleep(1200);
  console.log('mods section 4:', (await p.locator('.game-mods').innerText()).replace(/\n+/g, ' | '));
  const root = 'rom-manager/library/.meta';
  const systems = await p.evaluate(async () => { let d = await navigator.storage.getDirectory(); for (const x of ['rom-manager','library','.meta']) d = await d.getDirectoryHandle(x); const n=[]; for await (const k of d.keys()) n.push(k); return n; });
  console.log('.meta:', systems);
  for (const s of systems) {
    const idx = await opfs(p, `${root}/${s}/index.json`);
    if (!idx.startsWith('MISSING')) console.log(`--- ${s}/index.json\n${idx}`);
    const mods = await opfs(p, `${root}/${s}/mods.json`);
    if (!mods.startsWith('MISSING')) console.log(`--- ${s}/mods.json\n${mods}`);
  }
  // Phone: the game panel shows the same section.
  const phone = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES', hasTouch: true, isMobile: true });
  await phone.close();
  await b.close();
})();
