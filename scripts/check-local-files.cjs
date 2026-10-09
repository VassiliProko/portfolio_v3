const { execFileSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

if (!existsSync(path.join(root, 'node_modules/next/package.json'))) {
  console.error('Dependencies are missing. Run npm ci before starting development.');
  process.exit(1);
}

// macOS exposes cloud placeholders via SF_DATALESS. Inspect metadata only:
// reading their contents would itself block while the provider downloads them.
if (process.platform === 'darwin') {
  const inputs = ['node_modules', 'app', 'src', 'lib', 'public', 'next.config.js', 'tsconfig.json']
    .filter((entry) => existsSync(path.join(root, entry)));
  let placeholder;
  try {
    placeholder = execFileSync('/usr/bin/find', [
      ...inputs, '-type', 'f', '-flags', '+dataless', '-print', '-quit',
    ], { cwd: root, encoding: 'utf8', timeout: 15000 }).trim();
  } catch (error) {
    console.error('Cannot verify that development files are local. Check cloud storage availability.');
    console.error(error.message);
    process.exit(1);
  }

  if (placeholder) {
    console.error(`\nDevelopment cannot start: macOS has offloaded project files to cloud storage.\nExample: ${placeholder}\n\nNext.js can silently hang while reading these placeholders.\nMove the project outside cloud-managed folders (for example ~/Developer),\nthen run npm ci there. Alternatively, choose Keep Downloaded on the project\nin Finder and wait for the download to finish. See README.md for details.\n`);
    process.exit(1);
  }
}
