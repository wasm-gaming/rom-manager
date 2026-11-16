// A fake launcher origin: / is a blank page, /roms/ is the dist-roms build. COOP/COEP as play.germade.
const http = require('http'), fs = require('fs'), path = require('path');
const ROMS = path.resolve(__dirname, '../../dist-roms');
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const headers = { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' };
  if (!url.startsWith('/roms/')) {
    res.writeHead(200, { ...headers, 'Content-Type': 'text/html' });
    return res.end('<!doctype html><meta charset="utf-8"><title>launcher</title><body style="background:#0b0e12;color:#fff;font-family:sans-serif"><h1>Launcher</h1><p>Biblioteca</p></body>');
  }
  let file = path.join(ROMS, url.slice('/roms/'.length));
  if (file.endsWith('/') || !path.extname(file)) file = path.join(ROMS, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, headers); return res.end('not found'); }
    res.writeHead(200, { ...headers, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8060, () => console.log('listening 8060'));
