# Capacitor Mobile Build Instructions

This project is a **Capacitor hybrid mobile app** (not a pure Flutter app). The error you encountered was due to trying to run Flutter commands on a Capacitor project.

## Correct Build Process

### Prerequisites
- Node.js and npm installed
- Android Studio with Android SDK (for Android builds)
- Xcode (for iOS builds, macOS only)

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Web App
```bash
npm run build
```

### 3. Sync with Mobile Platforms
```bash
npx cap sync android
# For iOS: npx cap sync ios
```

### 4. Run on Mobile Device/Emulator

#### Option A: Using Capacitor CLI
```bash
npx cap run android
# For iOS: npx cap run ios
```

#### Option B: Using Android Studio
```bash
npx cap open android
```
Then build and run from Android Studio.

#### Option C: Build APK directly
```bash
cd android
./gradlew assembleDebug
```

## What Was Fixed

1. **Project Type**: Identified this as a Capacitor project, not Flutter
2. **Next.js Configuration**: Updated for static export compatibility
3. **Dependencies**: Added missing Capacitor packages
4. **Build Configuration**: Removed server-side features incompatible with static builds
5. **Font Dependencies**: Removed Google Fonts dependency for offline builds
6. **Dynamic Routes**: Added `generateStaticParams` for static export
7. **API Routes**: Removed server actions and API routes

## Key Configuration Changes

- `capacitor.config.ts`: Updated app ID and web directory
- `next.config.js`: Added static export configuration
- Removed `'use server'` directives
- Fixed dynamic route configurations
- Updated font handling for offline compatibility

## Why Flutter Commands Don't Work

This is a **Capacitor project**, which:
- Uses Next.js for the web layer
- Packages the web app into native mobile containers
- Does not use Flutter's Dart language or build system

Use `npx cap` commands instead of `flutter` commands for mobile development.