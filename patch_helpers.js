const fs = require('fs');
let code = fs.readFileSync('tests/e2e/helpers.ts', 'utf8');
code = code.replace(/await page\.waitForURL\('\*\*\//app\*\*', \{ timeout: 25_000 \}\);/g, "await page.waitForURL('**/app*', { timeout: 25_000 });");
fs.writeFileSync('tests/e2e/helpers.ts', code);
