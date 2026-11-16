// Side by side crops of two screenshots: crop.cjs a.png b.png x y w h out.png
const { chromium } = require('playwright');
const fs = require('fs');
const [a, c, x, y, w, h, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2 * +w + 10, height: +h } });
  const src = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  await p.setContent(`<body style="margin:0;display:flex;gap:10px;background:#f0f"><div style="width:${w}px;height:${h}px;background:url(${src(a)}) -${x}px -${y}px"></div><div style="width:${w}px;height:${h}px;background:url(${src(c)}) -${x}px -${y}px"></div></body>`);
  await p.screenshot({ path: out }); await b.close();
})();
