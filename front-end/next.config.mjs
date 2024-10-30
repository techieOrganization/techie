/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
