/** @type {import('next').NextConfig} */

let webappConfig = {};

try {
  const firebaseConfigStr = process.env.FIREBASE_WEBAPP_CONFIG;
  if (firebaseConfigStr) {
    webappConfig = JSON.parse(firebaseConfigStr);
  } else {
    // This warning is crucial for debugging in environments where the variable might be missing.
    console.warn(
      "WARNING: The FIREBASE_WEBAPP_CONFIG environment variable is not set. Firebase will not be initialized."
    );
  }
} catch (error) {
  console.error(
    "FATAL ERROR: Failed to parse FIREBASE_WEBAPP_CONFIG. The app cannot start. Check if it's valid JSON.",
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
