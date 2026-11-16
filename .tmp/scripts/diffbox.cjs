// Bounding box of the differing pixels between two PNGs.
const { chromium } = require('playwright'); const fs = require('fs');
const [a, c] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  const r = await p.evaluate(async ([a, c]) => {
    const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    const [ia, ic] = await Promise.all([load(a), load(c)]); const w = ia.width, h = ia.height;
    const cv = new OffscreenCanvas(w, h), x = cv.getContext('2d');
    x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, w, h).data; x.clearRect(0,0,w,h); x.drawImage(ic, 0, 0); const dc = x.getImageData(0, 0, w, h).data;
    let x0=w,y0=h,x1=0,y1=0; for (let i=0;i<da.length;i+=4){ if (Math.abs(da[i]-dc[i])+Math.abs(da[i+1]-dc[i+1])+Math.abs(da[i+2]-dc[i+2])>30){const px=(i/4)%w, py=Math.floor(i/4/w); x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py);} }
    return {x0,y0,x1,y1,w,h};
  }, [fs.readFileSync(a).toString('base64'), fs.readFileSync(c).toString('base64')]);
  console.log(JSON.stringify(r)); await b.close(); })();
