// Host mode end to end: a play.germade-shaped library in OPFS, then /roms/ opens and moves it in.
// node host-e2e.cjs <shots> <tetris.gb> <sml.gb> <tetris.ups> <hack.ips>
const { chromium } = require('playwright');
const fs = require('fs');
const crypto = require('crypto');
const [out, tetrisPath, smlPath, upsPath, ipsPath] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; }
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = T[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const sha1 = (b) => crypto.createHash('sha1').update(b).digest('hex');
const tetris = fs.readFileSync(tetrisPath), sml = fs.readFileSync(smlPath), ups = fs.readFileSync(upsPath), ips = fs.readFileSync(ipsPath);
const homebrew = Buffer.alloc(4096, 7);
const files = {};
const put = (path, buf) => { files[path] = buf.toString('base64'); };
const index = { core: null, games: {}, mods: {} };
for (const [id, title, buf, ext, dat] of [
  ['tetris', 'Tetris', tetris, '.gb', 'Tetris (World) (Rev 1)'],
  ['super-mario-land', 'Super Mario Land', sml, '.gb', 'Super Mario Land (World) (Rev 1)'],
  ['my-homebrew', 'Mi Juego Casero', homebrew, '.gb', null],
]) {
  const h = sha1(buf);
  index.games[id] = { title, renamed: id === 'my-homebrew', core: null, versions: [{ sha1: h, file: h + ext, name: 'World', size: buf.length, crc32: crc(buf), platform: 'gb', dat: dat ? { name: dat, title } : null }] };
  put(`gba/roms/${h}${ext}`, buf);
}
for (const [name, buf, ext, gameId] of [['Tetris Turbo', ups, '.ups', null], ['Palette Hack', ips, '.ips', 'tetris']]) {
  const h = sha1(buf);
  index.mods[h] = { name, file: h + ext, format: ext.slice(1), gameId, target: null };
  put(`gba/patches/${h}${ext}`, buf);
}
put('gba/index.json', Buffer.from(JSON.stringify(index)));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-ES' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8060/');
  await p.evaluate(async (files) => {
    const root = await navigator.storage.getDirectory();
    for (const [path, b64] of Object.entries(files)) {
      const parts = ['library', ...path.split('/')];
      let dir = root;
      for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create: true });
      const w = await (await dir.getFileHandle(parts.at(-1), { create: true })).createWritable();
      await w.write(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))); await w.close();
    }
  }, files);
  await p.goto('http://localhost:8060/roms/');
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    const n = await p.locator('.tree-notice').allInnerTexts().catch(() => []);
    if (n.join(' ').includes('ya está aquí')) { console.log('notice:', n.join(' ')); break; }
  }
  await p.screenshot({ path: `${out}/host-1-migrated.png` });
  const marker = await p.evaluate(async () => {
    let d = await navigator.storage.getDirectory();
    for (const x of ['rom-manager', 'library', '.meta']) d = await d.getDirectoryHandle(x);
    return (await (await d.getFileHandle('migrated-from-play-germade.json')).getFile()).text();
  }).catch((e) => 'NO MARKER ' + e.message);
  console.log('marker:', marker);
  console.log('launcher link:', await p.locator('.header-launcher').getAttribute('href').catch(() => 'none'));
  // Open the library tab if the welcome screen is shown.
  await p.click('.tree-item:has-text("GAMEBOY")').catch(() => {});
  await sleep(1500);
  await p.click('.tree-item:has-text("Tetris")'); await sleep(1500);
  console.log('play links:', await p.locator('.variant-play').evaluateAll((a) => a.map((x) => x.getAttribute('href'))));
  console.log('mod links:', await p.locator('.mod-play').evaluateAll((a) => a.map((x) => x.getAttribute('href'))));
  console.log('mods:', (await p.locator('.game-mods').innerText()).replace(/\n+/g, ' | '));
  await p.screenshot({ path: `${out}/host-2-tetris.png` });
  const tree = await p.locator('.tree-item').allInnerTexts();
  console.log('tree:', tree.map((t) => t.trim()).join(' / '));
  await p.click('.variant-play'); await sleep(800);
  console.log('after Play:', p.url());
  // A reload does not migrate again.
  await p.goto('http://localhost:8060/roms/'); await sleep(3000);
  console.log('second open notice:', await p.locator('.tree-notice').allInnerTexts().catch(() => []));
  await b.close();
})();
