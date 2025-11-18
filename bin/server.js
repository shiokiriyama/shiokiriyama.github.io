// server.js (ESM)
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirnameをESMで再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// input directory
const html = fs.readFileSync(join(__dirname, 'index.html'), 'utf-8');

// process
const HOST = '127.0.0.1';
const PORT = process.env.PORT || 8000;
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

/*
 * 開発時の自動リロード
 * HTMLを編集したときにサーバーを再起動せず反映できるよう、`nodemon`などのツールを利用すると便利。
 */
