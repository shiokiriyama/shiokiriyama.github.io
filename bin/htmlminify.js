// htmlminify.js (ESM)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// input and output paths
const inputPath = path.join(__dirname, '../src/index.html');
const outputDir = path.join(__dirname, '../docs/');
const outputPath = path.join(outputDir, 'index.html');

// create output directory if needed
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function minifyHtml(source) {
  // 1. remove HTML comments (<!-- ... -->)
  // 2. remove line breaks and extra spaces
  // 3. replace multiple spaces with one
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s{2,}/g, ' ');
}

function buildOnce() {
  try {
    const html = fs.readFileSync(inputPath, 'utf8');
    const minified = minifyHtml(html);
    fs.writeFileSync(outputPath, minified, 'utf8');
    console.log(`[${new Date().toLocaleTimeString()}] HTML minified and saved: ${outputPath}`);
  } catch (err) {
    console.error('Build error occurred:', err);
  }
}

// run once at start
buildOnce();

// watch option (enabled only with --watch or -w)
const watchEnabled = process.argv.includes('--watch') || process.argv.includes('-w');

if (watchEnabled) {
  console.log('Start watching:', inputPath);

  // debounce to avoid multiple triggers
  let timer = null;
  const DEBOUNCE_MS = 100;

  // watch the src directory for stability
  const srcDir = path.dirname(inputPath);
  const watcher = fs.watch(srcDir, { persistent: true }, (eventType, filename) => {
    if (!filename) return; // filename may be missing on some OS
    if (path.join(srcDir, filename) !== inputPath) return; // ignore other files

    // handle change and rename events
    if (eventType === 'change' || eventType === 'rename') {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(`[${new Date().toLocaleTimeString()}] Change detected: ${filename}`);
        buildOnce();
      }, DEBOUNCE_MS);
    }
  });

  // cleanup on exit
  const cleanup = () => {
    watcher.close();
    console.log('\nStopped watching.');
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
