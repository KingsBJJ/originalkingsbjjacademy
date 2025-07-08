/** @type {import('next').NextConfig} */

let webappConfig = {};

try {
  // This will only attempt to parse the variable if it exists.
  // It prevents a warning from being logged if the variable is missing,
  // which was causing the dev server to enter a crash loop.
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    webappConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
  }
} catch (error) {
  console.error(
    "ERROR: Failed to parse FIREBASE_WEBAPP_CONFIG. Check if it's valid JSON.",
    error
  );
  webappConfig = {}; // Ensure it's empty on failure
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
  // Expose Firebase config to the client-side, with fallbacks to prevent errors.
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: webappConfig.apiKey || "",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: webappConfig.authDomain || "",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: webappConfig.projectId || "",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: webappConfig.storageBucket || "",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: webappConfig.messagingSenderId || "",
    NEXT_PUBLIC_FIREBASE_APP_ID: webappConfig.appId || "",
  },
};

module.exports = nextConfig;
