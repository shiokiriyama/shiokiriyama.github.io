const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'docs/');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const templatePath = path.join(__dirname, 'src', 'template.html');
const headerPath = path.join(__dirname, 'src', 'header.html');
const footerPath = path.join(__dirname, 'src', 'footer.html');

// 共通パーツの読み込み
const header = fs.readFileSync(headerPath, 'utf8');
const footer = fs.readFileSync(footerPath, 'utf8');

// ページごとの設定
const pages = [
  {
    output: 'index.html',
    head: `
      <head>
        <meta charset="UTF-8" />
        <title>トップページ</title>
        <link rel="stylesheet" href="style.css">
      </head>
    `,
    body: '<p>ようこそトップページへ。</p>',
  },
  {
    output: 'about.html',
    head: `
      <head>
        <meta charset="UTF-8" />
        <title>このサイトについて</title>
        <link rel="stylesheet" href="about.css">
      </head>
    `,
    body: '<p>このサイトは静的サイトジェネレータのサンプルです。</p>',
  }
];

for (const page of pages) {
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{HEAD}}': page.head,
    '{{HEADER}}': header,
    '{{FOOTER}}': footer,
    '{{BODY}}': page.body,
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(placeholder, 'g'), value);
  }

  const outputPath = path.join(outputDir, page.output);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`${page.output} を生成しました。`);
}
