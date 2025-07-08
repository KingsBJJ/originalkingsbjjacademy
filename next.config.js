/** @type {import('next').NextConfig} */

// Safely parse the Firebase config to prevent server crashes during startup.
const getFirebaseConfig = () => {
  try {
    const config = process.env.FIREBASE_WEBAPP_CONFIG;
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    // This warning is for debugging and will not crash the server.
    console.warn(
      "Warning: Could not parse FIREBASE_WEBAPP_CONFIG. Firebase might not be initialized properly.",
      error
    );
  }
  return {}; // Return an empty object on failure to ensure stability.
};

const webappConfig = getFirebaseConfig();

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
