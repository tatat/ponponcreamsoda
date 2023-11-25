/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  trailingSlash: true,
  output: 'export',
}

module.exports = nextConfig
