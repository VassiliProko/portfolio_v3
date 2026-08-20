const { execSync } = require('child_process');

function getLastUpdatedFromMain() {
  const refs = ['HEAD', 'origin/main', 'main'];

  for (const ref of refs) {
    try {
      const iso = execSync(`git log -1 --format=%cI ${ref}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();

      if (iso) return iso;
    } catch {
      // Try the next ref.
    }
  }

  return new Date().toISOString();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_LAST_UPDATED: getLastUpdatedFromMain(),
  },
  reactStrictMode: true,
  // Pin the Turbopack workspace root so Next doesn't treat `app/` as the project dir.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Tree-shake heavy barrel packages during dev compile.
    optimizePackageImports: ['@phosphor-icons/react', 'motion', '@rive-app/react-canvas'],
  },
  images: {
    // Assets in `public/images/optimized` are already compressed, so skip
    // the extra Next.js optimization pass that slows first dev renders.
    unoptimized: true,
    // Ensure we have sizes for crisp 2x at common viewports (e.g. 600px → 1160px requested for 2x)
    deviceSizes: [560, 640, 750, 828, 1080, 1200, 1920, 2048],
  },
}

module.exports = nextConfig
