# Central Orbit — App Store & Google Play Submission Guide

Complete guide for submitting Central Orbit to the Apple App Store and Google Play Store.

---

## 📱 App Store Connect Listing (iOS)

### Basic Information
- **App Name:** Central Orbit
- **Subtitle:** Organize Your Web Tools
- **Bundle ID:** com.centralorbit.app
- **SKU:** centralorbit-001
- **Primary Language:** English (U.S.)
- **Category:** Productivity
- **Secondary Category:** Utilities
- **Content Rating:** 4+ (No objectionable content)
- **Price:** Free (with In-App Purchases)

### Description (4000 chars max)
```
Central Orbit is your personal command center for web tools and bookmarks. Organize everything you use daily into beautiful, customizable workspaces — and access them instantly.

KEY FEATURES:

🏠 Smart Home Dashboard
Your most-used tools at a glance. Favorites, recently accessed tools, and workspace overviews — all on one screen.

📂 Workspaces
Group your tools by project, topic, or workflow. Create workspaces like "Design Tools," "Dev Resources," or "Social Media" with custom icons and colors.

🔧 Quick-Access Tool Tiles
Save any web tool or website as a tile with a custom name, icon, and color. Open tools instantly in the built-in browser without leaving the app.

🔍 Universal Search
Find any tool or workspace instantly with real-time search across your entire library.

🕐 Recently Used
Never lose track of what you were working on. Your recent tools are always one tap away.

⭐ Favorites
Pin your most important tools for instant access from the home screen.

🌙 Dark Mode
Beautiful dark theme that's easy on the eyes, with automatic system detection.

PRO SUBSCRIPTION ($29.99/year):
• Unlimited workspaces (free: 3)
• Unlimited tools (free: 15)
• Priority support & early access to new features
• Custom themes & advanced organization

Central Orbit syncs across all your devices so your tools are always with you. Whether you're a developer, designer, marketer, or student — Central Orbit keeps your digital life organized.

Privacy-first: Your data is encrypted and synced securely. We never sell your information.
```

### Promotional Text (170 chars max)
```
Organize all your web tools in one place. Create workspaces, save shortcuts, and access everything you need instantly. Try Pro for unlimited access!
```

### Keywords (100 chars max)
```
productivity,bookmarks,tools,workspace,organize,shortcuts,web,browser,dashboard,favorites
```

### What's New (for updates)
```
• StoreKit 2 integration for seamless subscriptions
• Improved dark mode support
• Bug fixes and performance improvements
```

### Support URL
Use your website or a link to the in-app Report Issue form.

### Privacy Policy URL
**Required.** Host the privacy policy from the app's Settings > Privacy Policy page at a public URL.

### App Review Information
- **Contact:** Your name, email, phone
- **Demo Account:** Not required (app works without sign-in for browsing)
- **Notes for Reviewer:**
```
Central Orbit is a productivity app for organizing web tools and bookmarks into workspaces. 

To test the full experience:
1. Create an account using any email
2. Create a workspace (tap the + button)
3. Add tools/bookmarks to the workspace
4. Try the search, favorites, and recents features
5. The Pro upgrade modal can be accessed from Settings > Subscription > Upgrade

The app uses StoreKit 2 for in-app purchases. The subscription product ID is: com.centralorbit.pro.annual
```

---

## 🤖 Google Play Store Listing (Android)

### Basic Information
- **App Name:** Central Orbit - Organize Web Tools
- **Short Description (80 chars):** Organize your web tools into workspaces. Quick access to everything you need.
- **Category:** Productivity
- **Content Rating:** Everyone
- **Price:** Free (with In-App Purchases)

### Full Description (4000 chars max)
Use the same description as the App Store listing above.

### Tags
Productivity, Organization, Bookmarks, Tools, Workspace, Browser, Dashboard

---

## 📸 Screenshot Requirements

### iOS Screenshots (Required Sizes)

You need screenshots for EACH device size you support:

| Device | Size (pixels) | Required |
|--------|--------------|----------|
| iPhone 6.9" (16 Pro Max) | 1320 × 2868 | ✅ Yes |
| iPhone 6.7" (15 Pro Max) | 1290 × 2796 | ✅ Yes |
| iPhone 6.5" (11 Pro Max) | 1284 × 2778 | ✅ Yes |
| iPhone 5.5" (8 Plus) | 1242 × 2208 | ✅ Yes |
| iPad Pro 12.9" | 2048 × 2732 | If supporting iPad |
| iPad Pro 11" | 1668 × 2388 | If supporting iPad |

**Minimum:** 3 screenshots per device size
**Maximum:** 10 screenshots per device size
**Format:** PNG or JPEG, no alpha channel

### Recommended Screenshots (in order)

1. **Home Dashboard** — Show the main screen with favorites, recents, and workspaces
2. **Workspaces View** — Show organized workspace cards with colorful icons
3. **Tool Tiles Grid** — Show tools organized within a workspace
4. **Pro Upgrade** — Show the upgrade modal with features and pricing
5. **Search** — Show the universal search with results
6. **Settings** — Show account and subscription management

### How to Capture Screenshots

**Option A: Xcode Simulator (Recommended)**
```bash
# Build and run in simulator
bun run build
bunx cap sync
bunx cap open ios

# In Xcode:
# 1. Select each device simulator (iPhone 16 Pro Max, etc.)
# 2. Run the app
# 3. Navigate to each screen
# 4. Press Cmd+S to save screenshot
# 5. Screenshots save to Desktop
```

**Option B: Real Device**
- Press Side Button + Volume Up simultaneously
- Screenshots save to Photos app
- AirDrop to Mac

**Option C: Fastlane Snapshot (Automated)**
```bash
# Install fastlane
gem install fastlane

# Set up snapshot
cd ios && fastlane snapshot init

# Configure devices and screens, then run
fastlane snapshot
```

### Android Screenshots

| Device | Size (pixels) | Required |
|--------|--------------|----------|
| Phone | 1080 × 1920 (min) | ✅ Yes |
| 7" Tablet | 1200 × 1920 | Optional |
| 10" Tablet | 1600 × 2560 | Optional |

**Minimum:** 2 screenshots
**Maximum:** 8 screenshots

### Reference Screenshots Generated
The following AI-generated mockups are in `/public/images/` for reference:
- `screenshot-home-dark.png` — Home dashboard
- `screenshot-pro-modal.png` — Pro upgrade modal
- `screenshot-workspaces.png` — Workspaces view

⚠️ **These are reference mockups only.** Apple and Google require actual screenshots from the app running on a device or simulator. Use these as a guide for which screens to capture.

---

## 🔐 Code Signing (Xcode)

### Prerequisites
1. **Apple Developer Account** ($99/year) — [developer.apple.com](https://developer.apple.com)
2. **Xcode 15+** installed on your Mac
3. **Apple ID** added to Xcode (Xcode > Settings > Accounts)

### Step-by-Step Code Signing Setup

#### 1. Open the Project in Xcode
```bash
bun run build
bunx cap sync
bunx cap open ios
```

#### 2. Configure Signing
1. In Xcode, select the **App** target in the project navigator
2. Go to the **Signing & Capabilities** tab
3. Check **"Automatically manage signing"**
4. Select your **Team** (your Apple Developer account)
5. Xcode will automatically create:
   - A signing certificate
   - A provisioning profile
   - Register the bundle ID

#### 3. Add In-App Purchase Capability
1. Still in **Signing & Capabilities** tab
2. Click **"+ Capability"**
3. Search for and add **"In-App Purchase"**
4. This enables StoreKit 2 for the app

#### 4. Configure the Product in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create your app (My Apps > + > New App)
3. Go to **Subscriptions** in the sidebar
4. Create a **Subscription Group** called "Central Orbit Pro"
5. Add a subscription:
   - **Reference Name:** Pro Annual
   - **Product ID:** `com.centralorbit.pro.annual`
   - **Duration:** 1 Year
   - **Price:** $29.99 (Tier 30)
   - Add localized display name and description

#### 5. Test with StoreKit Configuration (Local Testing)
1. In Xcode, go to **File > New > File**
2. Choose **StoreKit Configuration File**
3. Name it `CentralOrbit.storekit`
4. Add a subscription:
   - Product ID: `com.centralorbit.pro.annual`
   - Price: $29.99
   - Duration: 1 Year
   - Group: Central Orbit Pro
5. In your scheme (Product > Scheme > Edit Scheme):
   - Under **Run > Options > StoreKit Configuration**
   - Select your `.storekit` file
6. Now purchases work in the simulator without a real App Store connection!

#### 6. Test with Sandbox Accounts (Real Testing)
1. In App Store Connect, go to **Users and Access > Sandbox Testers**
2. Create a sandbox tester account
3. On your test device, sign out of the App Store
4. Run the app and attempt a purchase
5. Sign in with the sandbox account when prompted
6. Purchases are free in sandbox mode

#### 7. Archive and Submit
```bash
# In Xcode:
# 1. Select "Any iOS Device" as build target
# 2. Product > Archive
# 3. Window > Organizer
# 4. Select the archive > Distribute App
# 5. Choose "App Store Connect"
# 6. Upload
```

### Troubleshooting Code Signing

| Issue | Solution |
|-------|----------|
| "No signing certificate" | Xcode > Settings > Accounts > Manage Certificates > + |
| "Provisioning profile" error | Toggle "Automatically manage signing" off then on |
| "Bundle ID already in use" | Change bundle ID in capacitor.config.ts and rebuild |
| "In-App Purchase not available" | Ensure IAP capability is added and product is configured in App Store Connect |

---

## 🛒 StoreKit 2 Integration (Already Implemented)

The app includes a complete StoreKit 2 implementation:

### Files
| File | Purpose |
|------|---------|
| `src/lib/storekit.ts` | JavaScript bridge — calls native plugin from web layer |
| `src/lib/subscription.ts` | Zustand store — manages subscription state, purchase flow |
| `src/components/ProModal.tsx` | UI — shows real App Store pricing, purchase button |
| `ios/App/App/CentralOrbitIAPPlugin.swift` | Native Swift — StoreKit 2 purchase, restore, entitlements |
| `ios/App/App/CentralOrbitIAPPlugin.m` | Obj-C bridge — registers Swift plugin with Capacitor |

### How It Works
1. **App launches** → `initializeIAP()` loads products from App Store
2. **User taps Subscribe** → `purchasePro()` calls native StoreKit 2 purchase sheet
3. **Apple handles payment** → Transaction verified and finished in Swift
4. **Result sent to JS** → Subscription state updated in Zustand store
5. **On next launch** → `verifyEntitlements()` checks active subscriptions with Apple

### Web Fallback
When running in a browser (not native), purchases are simulated for testing. The app detects the platform automatically.

---

## ✅ Submission Checklist

### Before Submitting to Apple
- [ ] Apple Developer Account active ($99/year)
- [ ] App icon: 1024×1024 PNG (no alpha, no rounded corners — Apple adds them)
- [ ] Screenshots for all required device sizes (minimum 3 per size)
- [ ] App Store Connect listing complete (name, description, keywords, etc.)
- [ ] Privacy Policy hosted at a public URL
- [ ] Support URL configured
- [ ] In-App Purchase product created in App Store Connect
- [ ] StoreKit Configuration file for local testing
- [ ] Sandbox tester account created
- [ ] Code signing configured (automatic recommended)
- [ ] In-App Purchase capability added
- [ ] App tested on real device
- [ ] Archive uploaded via Xcode Organizer

### Before Submitting to Google
- [ ] Google Play Developer Account ($25 one-time)
- [ ] App icon: 512×512 PNG
- [ ] Feature graphic: 1024×500 PNG
- [ ] Screenshots (minimum 2, phone size)
- [ ] Store listing complete
- [ ] Privacy Policy hosted at a public URL
- [ ] Content rating questionnaire completed
- [ ] Signed AAB (Android App Bundle) uploaded
- [ ] In-app product created in Google Play Console
- [ ] Internal testing track tested

---

## 🎨 App Icon

Generate all required icon sizes from a single 1024×1024 source image:

**Option A: appicon.co** (free online tool)
1. Upload your 1024×1024 icon
2. Select iOS + Android
3. Download ZIP with all sizes

**Option B: Xcode Asset Catalog**
1. Open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
2. Drag your 1024×1024 image into the "App Store" slot
3. Xcode 15+ auto-generates all other sizes from the 1024×1024

**Option C: Command line (ImageMagick)**
```bash
# Install ImageMagick
brew install imagemagick

# Generate all iOS sizes from source
for size in 20 29 40 58 60 76 80 87 120 152 167 180 1024; do
  convert icon-1024.png -resize ${size}x${size} icon-${size}.png
done
```

---

## 📋 Apple Review Tips

1. **Don't mention other platforms** — Don't say "also on Android" in your iOS listing
2. **Subscription disclosure** — The legal text in ProModal already handles this
3. **Restore Purchases** — Already implemented (Apple requires this)
4. **Privacy Manifest** — Already included at `ios/App/App/PrivacyInfo.xcprivacy`
5. **No placeholder content** — Ensure the app has real functionality on first launch
6. **Login not required** — The app works without sign-in (Apple prefers this)
7. **Review notes** — Always explain how to test IAP in your review notes
