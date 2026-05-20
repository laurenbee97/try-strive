/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensures _next/static assets use absolute URLs when pages are served via reverse proxy
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://try.strivemath.com' : '',
}

module.exports = nextConfig
