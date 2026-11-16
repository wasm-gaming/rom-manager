// openAddDialog() from the launcher's origin: pick ROM zips + a UPS + an unknown ROM, read the rows,
// take one off, add, and check the index. node add-dialog-e2e.cjs <files dir> <shots dir> <width>
const { chromium } = require('playwright');
const path = require('path');
const [dir, shots, width = '1280'] = process.argv.slice(2);
const W = Number(width);
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: W, height: W < 600 ? 844 : 800 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()));
  await p.goto('http://localhost:8060/');
  await p.evaluate(async () => {
    const sdk = await import('/roms/roms-sdk.js');
    window.sdk = sdk;
    window.result = sdk.openAddDialog({ system: (name) => (name.endsWith('.gb') ? 'GAMEBOY' : undefined), locale: 'es', theme: 'dark' })
      .then((r) => (window.done = r ?? null));
  });
  await p.locator('dialog.add').waitFor();
  await p.screenshot({ path: `${shots}/add-empty-${W}.png` });
  const f = (n) => path.join(dir, n);
  await p.locator('input[type=file]').setInputFiles([f('Tetris.zip'), f('SML.zip'), f('Tetris Turbo.ups'), f('Homebrew.gb')]);
  await p.locator('li.row').nth(3).waitFor();
  await p.waitForFunction(() => !document.querySelector('[data-rom-manager]').shadowRoot.querySelector('.status'));
  const rows = await p.locator('li.row').allInnerTexts();
  console.log('ROWS', JSON.stringify(rows.map((r) => r.replace(/\s+/g, ' ').trim())));
  await p.screenshot({ path: `${shots}/add-rows-${W}.png` });
  // Taking Tetris off: the UPS no longer fits a ROM on the list.
  await p.locator('li.row').nth(0).locator('button').click();
  console.log('WITHOUT TETRIS', JSON.stringify((await p.locator('li.row').allInnerTexts()).map((r) => r.replace(/\s+/g, ' ').trim())));
  // Dropped back in, by a drop event this time.
  const tetris = require('fs').readFileSync(f('Tetris.zip')).toString('base64');
  await p.evaluate((b64) => {
    const dt = new DataTransfer();
    dt.items.add(new File([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))], 'Tetris.zip'));
    const dialog = document.querySelector('[data-rom-manager]').shadowRoot.querySelector('dialog');
    dialog.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
  }, tetris);
  await p.locator('li.row').nth(3).waitFor();
  await p.waitForFunction(() => !document.querySelector('[data-rom-manager]').shadowRoot.querySelector('.status'));
  console.log('DROPPED BACK', JSON.stringify((await p.locator('li.row').allInnerTexts()).map((r) => r.replace(/\s+/g, ' ').trim())));
  await p.locator('footer button.primary').click();
  await p.locator('.summary').waitFor();
  console.log('SUMMARY', await p.locator('.summary').innerText());
  await p.screenshot({ path: `${shots}/add-done-${W}.png` });
  await p.locator('footer button.primary').click();
  await p.waitForFunction(() => window.done !== undefined);
  const out = await p.evaluate(async () => {
    const index = await window.sdk.readIndex('GAMEBOY');
    return {
      result: window.done,
      hostGone: !document.querySelector('[data-rom-manager]'),
      games: Object.fromEntries(Object.entries(index.games).map(([id, g]) => [id, { versions: g.versions.map((v) => v.path), mods: g.mods.map((m) => `${m.name} fits=${m.fits}`) }])),
    };
  });
  console.log(JSON.stringify(out, null, 2));
  // A second open, closed with Escape: resolves undefined.
  const second = await p.evaluate(async () => {
    const pending = window.sdk.openAddDialog({ locale: 'en' });
    await new Promise((r) => setTimeout(r, 300));
    const root = document.querySelector('[data-rom-manager]').shadowRoot;
    const title = root.querySelector('h2').textContent;
    root.querySelector('dialog').close();
    return { title, result: (await pending) ?? 'undefined', hostGone: !document.querySelector('[data-rom-manager]') };
  });
  console.log('SECOND', JSON.stringify(second));
  await b.close();
})();
