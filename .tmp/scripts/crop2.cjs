// Side-by-side crop of the same region in two PNGs.
const { chromium } = require('playwright'); const fs = require('fs');
const [a, c, out, x, y, w, h] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  const u = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  await p.setContent(`<body style="margin:0;display:flex;gap:8px;background:#f0f"><div style="width:${w}px;height:${h}px;background:url(${u(a)}) -${x}px -${y}px"></div><div style="width:${w}px;height:${h}px;background:url(${u(c)}) -${x}px -${y}px"></div></body>`);
  await p.setViewportSize({ width: 2*+w+8, height: +h }); await p.screenshot({ path: out }); await b.close(); })();
