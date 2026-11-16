// A synthetic library of N files in one folder, browsed flat: expand it, pick a row,
// arrow down 20 rows. Prints the time each took. node perf.cjs <url> <N>
const { chromium } = require('playwright');
const [url, N = '5000'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto(url); await p.waitForTimeout(800);
  // A folder that is no system, so it is browsed flat (no catalogue, no hashing).
  await p.evaluate(async (n) => {
    let dir = await navigator.storage.getDirectory();
    for (const part of ['rom-manager', 'library', 'Collection']) dir = await dir.getDirectoryHandle(part, { create: true });
    const bytes = new Uint8Array(16);
    for (let i = 0; i < n; i++) {
      const w = await (await dir.getFileHandle(`Game ${String(i).padStart(5, '0')}.gb`, { create: true })).createWritable();
      await w.write(bytes); await w.close();
    }
  }, +N);
  await p.reload(); await p.waitForTimeout(800);
  await p.click('.welcome-cta'); await p.waitForSelector('.tree-item:has-text("Collection")');
  const t0 = Date.now();
  await p.click('.tree-item:has-text("Collection") .tree-item-left');
  await p.waitForFunction((n) => document.querySelectorAll('.tree-item').length >= n, +N, { timeout: 120000 });
  const expand = Date.now() - t0;
  const t1 = Date.now();
  await p.click('.tree-item:has-text("Game 00010.gb")');
  await p.waitForSelector('.tree-item.selected:has-text("Game 00010.gb")');
  await p.waitForFunction(() => document.querySelector('.details-pane h3')?.textContent?.includes('Game 00010'));
  const select = Date.now() - t1;
  const t2 = Date.now();
  for (let i = 0; i < 20; i++) await p.keyboard.press('ArrowDown');
  const arrived = await p.waitForSelector('.tree-item.selected:has-text("Game 00030.gb")', { timeout: 120000 }).then(() => true, () => false);
  const arrows = arrived ? Date.now() - t2 : `never (selected: ${await p.textContent('.tree-item.selected')})`;
  console.log(JSON.stringify({ url, rows: await p.evaluate(() => document.querySelectorAll('.tree-item').length), expandMs: expand, selectMs: select, arrows20Ms: arrows }));
  await b.close();
})();
