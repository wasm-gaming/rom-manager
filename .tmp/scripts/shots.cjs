// Screenshots of rom-manager at several widths: welcome, systems, games, game.
const { chromium } = require('playwright');
const [out, tag, ...roms] = process.argv.slice(2);
const sizes = [[1280, 800], [768, 1024], [767, 1024], [460, 900], [390, 844], [320, 640], [844, 390]];
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of sizes) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, locale: 'es-ES', hasTouch: w < 900, isMobile: w < 900 && w !== 768 && w !== 767 });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.log(w, 'PAGEERROR', e.message));
    await p.goto('http://localhost:8050/'); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/${tag}-${w}x${h}-0-welcome.png` });
    const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.click('button.welcome-secondary >> nth=0')]);
    await chooser.setFiles(roms);
    await p.waitForSelector('.drop-dialog button.btn-apply:not([disabled])', { timeout: 20000 }).catch(() => console.log(w, 'no intake confirm'));
    await p.screenshot({ path: `${out}/${tag}-${w}x${h}-1-intake.png` });
    await p.click('.drop-dialog button.btn-apply', { timeout: 5000 }).catch(() => console.log(w, 'no apply'));
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${out}/${tag}-${w}x${h}-2-library.png` });
    if (await p.$('.mobile-row')) {
      await p.click('.mobile-row >> nth=0'); await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/${tag}-${w}x${h}-3-games.png` });
      await p.click('.mobile-panel:nth-child(2) .mobile-row >> nth=0').catch(() => console.log(w, 'no game row'));
      await p.waitForTimeout(1500);
      await p.screenshot({ path: `${out}/${tag}-${w}x${h}-4-game.png` });
    }
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${w}x${h}`, 'phone layout:', !!(await p.$('.mobile-panels')), 'horizontal overflow:', overflow, 'root font-size:', await p.evaluate(() => getComputedStyle(document.documentElement).fontSize));
    await ctx.close();
  }
  await b.close();
})();
