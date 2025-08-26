const fs = require("fs");
const http = require('http');

const html = fs.readFileSync("./index.html");

const HOST = '127.0.0.1';
const PORT = process.env.PORT || 8000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write(html);
  res.end();
}).listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
