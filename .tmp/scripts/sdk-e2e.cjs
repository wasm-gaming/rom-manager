// The launcher's side: a page at the origin root imports /roms/roms-sdk.js and drives it.
// node sdk-e2e.cjs <gb zip> <gb zip> <tetris.ups>
const { chromium } = require('playwright');
const fs = require('fs');
const [zipA, zipB, ups] = process.argv.slice(2);
const b64 = (p) => fs.readFileSync(p).toString('base64');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto('http://localhost:8060/');
  const out = await p.evaluate(async ({ files }) => {
    const sdk = await import('/roms/roms-sdk.js');
    const toFile = ([name, data]) => new File([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], name);
    const added = await sdk.addFiles(files.map(toFile));
    const index = await sdk.readIndex('GAMEBOY');
    const tetris = index.games.tetris;
    const mod = tetris.mods[0];
    const patched = await sdk.readRomWithMod(tetris.versions[0].path, mod.path);
    let wrong;
    try { await sdk.readRomWithMod(index.games['super-mario-land'].versions[0].path, mod.path); } catch (e) { wrong = `${e.name} ${e.code}`; }
    const again = await sdk.addFiles(files.slice(0, 1).map(toFile));
    return {
      api: sdk.API_VERSION,
      added: added.added, mods: added.mods.added, systems: added.systems,
      games: Object.keys(index.games),
      targetCrc: mod.targetCrc, patchedCrc: patched.crc, wrong,
      again: again.already,
      migrated: await sdk.migrated(),
      migration: await sdk.migrateFromPlayGermade(),
    };
  }, { files: [['a.zip', b64(zipA)], ['b.zip', b64(zipB)], ['Tetris Turbo.ups', b64(ups)]] });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
