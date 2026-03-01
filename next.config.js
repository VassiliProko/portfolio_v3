/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Ensure we have sizes for crisp 2x at common viewports (e.g. 600px → 1160px requested for 2x)
    deviceSizes: [560, 640, 750, 828, 1080, 1200, 1920, 2048],
  },
}

module.exports = nextConfig
