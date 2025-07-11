
/** @type {import('next').NextConfig} */

// Safely parse the Firebase config to prevent server crashes during startup.
let webappConfig = {};
try {
  const config = process.env.FIREBASE_CONFIG;
  if (config) {
    webappConfig = JSON.parse(config);
  }
} catch (error) {
  // Silently ignore parsing errors. The app will rely on runtime environment variables.
  // This prevents server crashes during startup or build.
}

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
};

module.exports = nextConfig;
