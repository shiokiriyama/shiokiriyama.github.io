// htmlminify.js (ESM)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirnameをESMで再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// input directory
const templatePath = path.join(__dirname, '../src/index.html');
let html = fs.readFileSync(templatePath, 'utf8');

// output directory
const outputDir = path.join(__dirname, '../docs/');
const outputPath = path.join(outputDir, 'index.html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// process
// delete comment (<!-- ～ -->)
html = html.replace(/<!--[\s\S]*?-->/g, ''); // 非貪欲マッチ
// delete line breaks and unnecessary whitespace
html = html.replace(/\s*\n\s*/g, ''); // 改行とその周辺の空白を除去
html = html.replace(/\s{2,}/g, ' ');  // 連続する空白を1つに

// save
fs.writeFileSync(outputPath, html, 'utf8');
console.log('HTMLコメントと改行を削除して軽量化しました。');
