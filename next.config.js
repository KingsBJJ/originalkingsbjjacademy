
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
  // Expose Firebase config to the client-side, with fallbacks to prevent errors.
  // IMPORTANT: Only variables prefixed with NEXT_PUBLIC_ are exposed to the browser.
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
