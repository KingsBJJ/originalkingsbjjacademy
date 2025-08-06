/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: ["https://6000-firebase-studio-1750624255527.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev"],
  }
};

module.exports = nextConfig;