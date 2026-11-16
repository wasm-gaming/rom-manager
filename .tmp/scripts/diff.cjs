// Pixel difference between base-* and <tag>-* screenshots (needs playwright's bundled browser to decode PNGs).
const { chromium } = require('playwright');
const fs = require('fs');
const [dir, tag] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const names = fs.readdirSync(dir).filter((n) => n.startsWith('base-')).map((n) => n.slice(5));
  for (const name of names) {
    const other = `${dir}/${tag}-${name}`;
    if (!fs.existsSync(other)) { console.log(name.padEnd(28), 'missing'); continue; }
    const a = fs.readFileSync(`${dir}/base-${name}`).toString('base64');
    const c = fs.readFileSync(other).toString('base64');
    const r = await p.evaluate(async ([a, c]) => {
      const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ic] = await Promise.all([load(a), load(c)]);
      if (ia.width !== ic.width || ia.height !== ic.height) return 'size differs';
      const cv = new OffscreenCanvas(ia.width, ia.height), x = cv.getContext('2d');
      x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, ia.width, ia.height).data;
      x.clearRect(0, 0, ia.width, ia.height); x.drawImage(ic, 0, 0); const dc = x.getImageData(0, 0, ia.width, ia.height).data;
      let diff = 0; for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - dc[i]) + Math.abs(da[i+1] - dc[i+1]) + Math.abs(da[i+2] - dc[i+2]) > 30) diff++;
      return (diff / (da.length / 4) * 100).toFixed(2) + '%';
    }, [a, c]);
    console.log(name.padEnd(28), r);
  }
  await b.close();
})();
