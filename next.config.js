/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
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
