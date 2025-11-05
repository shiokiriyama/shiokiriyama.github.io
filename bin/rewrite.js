const fs = require('fs');
const path = require('path');

const parts = [
  // path.join(__dirname, 'src', 'index.html'),
  // path.join(__dirname, 'src', 'header.html'),
  // path.join(__dirname, 'src', 'body.html'),
  // path.join(__dirname, 'src', 'footer.html'),
];

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
const replacements = {
  '{{PARAGRAPH}}': '静的に書き換えました。',
};
for (const [placeholder, value] of Object.entries(replacements)) {
  html = html.replace(new RegExp(placeholder, 'g'), value);
}

// save
fs.writeFileSync(outputPath, html, 'utf8');
console.log('HTMLテンプレートを静的に書き換えました。');
