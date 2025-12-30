# 🚀 Deployment Guide - Zombie Subscriptions

This guide covers how to deploy your app for portfolio showcase.

---

## Quick Options Overview

| Option | Best For | Cost | Difficulty |
|--------|----------|------|------------|
| **Web Demo** | Portfolio website | Free | Easy |
| **APK (Android)** | Direct sharing | Free | Medium |
| **EAS Build** | App stores | Free tier available | Medium |
| **Play Store** | Public release | $25 one-time | Advanced |

---

## Option 1: Web Demo (Recommended for Portfolio)

Deploy a web version that anyone can access from a browser.

### Step 1: Build for Web
```bash
npx expo export --platform web
```

### Step 2: Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd dist
vercel
```

Or deploy to **Netlify**:
1. Drag the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Get instant URL like `your-app.netlify.app`

---

## Option 2: Android APK (Share directly)

Build an APK file that people can install on Android phones.

### Prerequisites
1. Create an Expo account: https://expo.dev/signup
2. Install EAS CLI:
```bash
npm install -g eas-cli
eas login
```

### Build APK
```bash
# Initialize EAS
eas build:configure

# Build APK (not optimized for store, just for sharing)
eas build --platform android --profile preview
```

### Download & Share
After ~15 minutes, download the APK from Expo dashboard and share it!

---

## Option 3: EAS Build (Full Build)

Professional builds for both Android and iOS.

### Configure EAS
Create `eas.json` in project root:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Build Commands
```bash
# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build (for Play Store)
eas build --platform android --profile production
```

---

## Option 4: Google Play Store

### Requirements
- Google Play Developer account ($25 one-time fee)
- Privacy policy URL
- App screenshots and graphics

### Steps
1. Build production AAB: `eas build --platform android --profile production`
2. Go to [play.google.com/console](https://play.google.com/console)
3. Create new app
4. Upload the `.aab` file
5. Fill in store listing details

---

## Before Deploying: Checklist

- [ ] Replace Supabase credentials with production keys
- [ ] Update `app.json` with final app name and icons
- [ ] Test all features work correctly
- [ ] Add privacy policy if publishing to store
- [ ] Create app store graphics (if needed)

---

## Portfolio Recommendation

For a portfolio showcase, I recommend:

1. **Web Demo** - Deploy to Vercel/Netlify for easy browser access
2. **APK Download** - Provide APK link for Android users
3. **GitHub Repo** - Make the code public (remove sensitive keys first!)

### Example Portfolio Description:
> **Zombie Subscriptions** - A mobile-first subscription tracker built with React Native & Expo. Features include dark/light themes, multi-language support, renewal reminders, and Supabase authentication.
> 
> 🔗 [Live Demo](your-url.vercel.app) | 📱 [Download APK](link) | 💻 [Source Code](github-link)

---

## Need Help?

Run these commands to get started:

```bash
# For Web deployment
npx expo export --platform web

# For Android APK
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```
