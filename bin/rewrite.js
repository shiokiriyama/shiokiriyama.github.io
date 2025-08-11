const fs = require('fs');
const path = require('path');

// 入力
const parts = [
  // path.join(__dirname, 'src', 'index.html'),
  // path.join(__dirname, 'src', 'header.html'),
  // path.join(__dirname, 'src', 'body.html'),
  // path.join(__dirname, 'src', 'footer.html'),
];

// 出力
const outputDir = path.join(__dirname, '../docs/');
const outputPath = path.join(outputDir, 'index.html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const templatePath = path.join(__dirname, '../src/index.html');
let html = fs.readFileSync(templatePath, 'utf8');

const replacements = {
  '{{PARAGRAPH}}': '静的に書き換えました。',
};

// プレースホルダーの置換
for (const [placeholder, value] of Object.entries(replacements)) {
  html = html.replace(new RegExp(placeholder, 'g'), value);
}

// 上書き保存（あるいは別ファイルに出力しても可）
fs.writeFileSync(outputPath, html, 'utf8');

console.log('HTMLテンプレートを静的に書き換えました。');
