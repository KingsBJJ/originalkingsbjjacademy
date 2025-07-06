/** @type {import('next').NextConfig} */

// Parse the Firebase web app config from the environment variable
const webappConfig = process.env.FIREBASE_WEBAPP_CONFIG 
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG) 
  : {};

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
  // Expose Firebase config to the client-side
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: webappConfig.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: webappConfig.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: webappConfig.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: webappConfig.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: webappConfig.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: webappConfig.appId,
  },
};

module.exports = nextConfig;
