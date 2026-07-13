/**
 * AYF 2026 — Screenshot capture script
 * Uses Chrome headless (no npm packages needed)
 * Run: node scripts/take-screenshots.js
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

const PAGES = [
  { name: 'home',            url: 'https://ayf2026.vercel.app',                         width: 1440, height: 900  },
  { name: 'register',        url: 'https://ayf2026.vercel.app/register',                width: 1440, height: 900  },
  { name: 'admin-dashboard', url: 'https://ayf2026.vercel.app/admin',                   width: 1440, height: 900  },
  { name: 'admin-regs',      url: 'https://ayf2026.vercel.app/admin/registrations',     width: 1440, height: 900  },
  { name: 'admin-volunteers',url: 'https://ayf2026.vercel.app/admin/volunteers',        width: 1440, height: 900  },
  { name: 'admin-analytics', url: 'https://ayf2026.vercel.app/admin/analytics',         width: 1440, height: 900  },
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
    `--window-size=${page.width},${page.height}`,
    `--screenshot=${outFile}`,
    page.url,
  ], { timeout: 30000 });

  if (result.status === 0) {
    console.log(`  ✅ Done`);
  } else {
    console.error(`  ❌ Failed (status ${result.status})`);
    if (result.stderr) console.error(result.stderr.toString().slice(0, 300));
  }
}

console.log('\nAll screenshots saved to public/screenshots/');
