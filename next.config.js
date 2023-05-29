/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3000/:path*',
          },
        ]
      },
}

module.exports = nextConfig
