// copy.js (ESM)
import fs from 'fs-extra';

async function main() {
  try {
    await fs.copy('src/example.txt', 'dist/example.txt');
    console.log('コピー完了');
  } catch (err) {
    console.error('コピー失敗:', err);
  }
}

main();
