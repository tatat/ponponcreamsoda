/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  trailingSlash: true,
  output: 'export',
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN ?? 'http://localhost:3000',
  },
}

module.exports = nextConfig
