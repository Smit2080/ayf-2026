/**
 * AYF 2026 — Screenshot capture script
 * Uses Chrome headless (no npm packages needed)
 * Run: node scripts/take-screenshots.js
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

// Public pages only — admin requires auth session
const PAGES = [
  { name: 'home',       url: 'https://ayf2026-chi.vercel.app/',          width: 1440, height: 900  },
  { name: 'home-tall',  url: 'https://ayf2026-chi.vercel.app/',          width: 1440, height: 2400 },
  { name: 'register',   url: 'https://ayf2026-chi.vercel.app/register',  width: 1440, height: 900  },
  { name: 'mobile-home',url: 'https://ayf2026-chi.vercel.app/',          width: 390,  height: 844  },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('Created directory:', OUTPUT_DIR);
}

for (const page of PAGES) {
  const outFile = path.join(OUTPUT_DIR, `${page.name}.png`);
  console.log(`📸 Capturing ${page.name}  →  ${outFile}`);

  const result = spawnSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--virtual-time-budget=6000',
    `--window-size=${page.width},${page.height}`,
    `--screenshot=${outFile}`,
    page.url,
  ], { timeout: 45000 });

  if (result.status === 0) {
    const kb = (fs.statSync(outFile).size / 1024).toFixed(1);
    console.log(`  ✅ Done  (${kb} KB)`);
  } else {
    console.error(`  ❌ Failed (status ${result.status})`);
    if (result.stderr) console.error(result.stderr.toString().slice(0, 300));
  }
}

console.log('\nAll screenshots saved to public/screenshots/');
