# Central Orbit — iOS & Android Deployment Guide

## ✅ Apple iOS Compliance Checklist

This app has been configured to meet Apple's App Store Review Guidelines:

### Already Implemented
- [x] **Privacy Manifest** (`ios/App/App/PrivacyInfo.xcprivacy`) — Required since May 2024
- [x] **Safe Area Insets** — All views respect `env(safe-area-inset-*)` for notch/Dynamic Island
- [x] **Viewport Configuration** — `viewport-fit=cover` with `maximum-scale=1.0` and `user-scalable=no`
- [x] **Status Bar** — Overlays web view with dark style for edge-to-edge display
- [x] **Splash Screen** — Configured with proper fade-out and full-screen immersive mode
- [x] **Keyboard Handling** — Body resize mode for proper input behavior
- [x] **Dynamic Viewport Height** — Uses `100dvh` instead of `100vh` for iOS Safari compatibility
- [x] **Apple Meta Tags** — `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`
- [x] **Theme Color** — Adapts to light/dark mode via `theme-color` meta tags
- [x] **Privacy Policy** — Accessible from Settings tab (required for App Store)
- [x] **Terms of Service** — Accessible from Settings tab
- [x] **Contact/Support** — Report Issue form in Settings tab
- [x] **No Tracking** — Privacy manifest declares `NSPrivacyTracking = false`
- [x] **Data Collection Disclosure** — Email and name declared for app functionality only

### Before Submission — You Must Do
- [ ] **Apple Developer Account** — Enroll at https://developer.apple.com ($99/year)
- [ ] **App Icons** — Generate all required sizes (use https://appicon.co)
  - 1024x1024 App Store icon
  - 180x180, 120x120, 87x87, 80x80, 60x60, 58x58, 40x40, 29x29, 20x20
- [ ] **Launch Screen** — Configure in Xcode (storyboard or color)
- [ ] **Screenshots** — Required for each supported device size:
  - 6.7" (iPhone 15 Pro Max) — 1290 x 2796
  - 6.5" (iPhone 14 Plus) — 1284 x 2778
  - 5.5" (iPhone 8 Plus) — 1242 x 2208
- [ ] **App Store Connect Listing** — Description, keywords, category, age rating
- [ ] **In-App Purchase** — If using Pro subscription, configure in App Store Connect and use StoreKit
- [ ] **Code Signing** — Set up provisioning profiles and certificates in Xcode

---

## 🚀 Build & Deploy Steps

### Prerequisites
```bash
# Install Xcode (iOS) from Mac App Store
# Install Android Studio (Android) from https://developer.android.com/studio

# Install Capacitor CLI
npm install -g @capacitor/cli
```

### 1. Build the Web App
```bash
bun run build
```

### 2. Add Native Platforms
```bash
# First time only
bunx cap add ios
bunx cap add android
```

### 3. Sync Web Assets to Native
```bash
bunx cap sync
```

### 4. Open in IDE

**iOS (Xcode):**
```bash
bunx cap open ios
```
- Select your Team in Signing & Capabilities
- Set the Bundle Identifier to `com.centralorbit.app`
- Choose a real device or simulator
- Product → Run to test
- Product → Archive to build for App Store

**Android (Android Studio):**
```bash
bunx cap open android
```
- Wait for Gradle sync
- Run on emulator or device
- Build → Generate Signed Bundle for Play Store

### 5. Submit to App Store
1. In Xcode: Product → Archive
2. Window → Organizer → Distribute App
3. Choose "App Store Connect"
4. Upload and wait for processing
5. Go to https://appstoreconnect.apple.com
6. Fill in listing details, screenshots, privacy URL
7. Submit for Review (typically 24-48 hours)

### 6. Submit to Google Play
1. In Android Studio: Build → Generate Signed Bundle (AAB)
2. Go to https://play.google.com/console
3. Create app listing
4. Upload AAB file
5. Fill in listing details, screenshots, privacy URL
6. Submit for Review (typically a few hours to days)

---

## 🔒 Privacy & Compliance Notes

### Apple Privacy Manifest
The `PrivacyInfo.xcprivacy` file declares:
- **No tracking** — App does not track users across apps/websites
- **Collected data** — Email address and name (for account functionality only)
- **API usage reasons** — UserDefaults (app preferences), SystemBootTime (Capacitor internals)

### Data Collection for App Store Connect
When filling out the App Privacy section in App Store Connect, declare:
- **Contact Info → Email Address** — Used for account creation/login
- **Contact Info → Name** — Used for personalization
- **Not linked to identity** — No analytics or advertising data collected

### In-App Purchases (Pro Subscription)
If you want Apple/Google to handle payments:
1. Remove the current mock subscription system
2. Implement StoreKit 2 (iOS) / Google Play Billing (Android)
3. Use `@capacitor-community/in-app-purchases` or RevenueCat
4. Apple takes 15-30% commission on in-app purchases

---

## 📱 Testing Checklist
- [ ] Test on iPhone with notch (safe areas)
- [ ] Test on iPhone with Dynamic Island
- [ ] Test on older iPhone (SE, 8)
- [ ] Test dark mode toggle
- [ ] Test keyboard behavior on input fields
- [ ] Test all navigation tabs
- [ ] Test WebView opening/closing
- [ ] Test sign up / sign in / sign out flow
- [ ] Test offline behavior (graceful error handling)
- [ ] Test landscape orientation (if supported)
