/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org', 'assets.coingecko.com', 'www.coinlore.com'],
  },
}

module.exports = nextConfig