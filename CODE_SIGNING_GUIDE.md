# Code Signing Guide for Central Orbit iOS Deployment

This guide walks you through code signing in Xcode — the process that allows you to build and submit your app to the App Store.

---

## Prerequisites

Before you start, you need:
1. **Mac with Xcode installed** (from Mac App Store)
2. **Apple Developer Account** ($99/year) at https://developer.apple.com
3. **Your app icons** (generated from appicon.co, placed in Xcode)
4. **Built web app** (`bun run build`)
5. **Capacitor iOS project** (`bunx cap add ios` and `bunx cap sync`)

---

## Step 1: Open Your Project in Xcode

```bash
bunx cap open ios
```

This opens the `ios/App/App.xcworkspace` file in Xcode.

---

## Step 2: Select Your Team (Automatic Signing)

**In Xcode:**

1. **Left sidebar** → Click on **"App"** (the blue project icon)
2. **Main panel** → Select the **"App"** target (not "App" under Targets)
3. **Top tabs** → Click **"Signing & Capabilities"**
4. **Team dropdown** → Select your Apple Developer Team
   - If you don't see your team, click "Add an Account..." and sign in with your Apple ID
5. **Bundle Identifier** → Should be `com.centralorbit.app` (already set in capacitor.config.ts)

**Xcode will automatically:**
- Create a signing certificate
- Generate a provisioning profile
- Download everything to your Mac

✅ **If you see a green checkmark next to "Signing Certificate", you're done with this step!**

---

## Step 3: Add App Icons

1. **Left sidebar** → Expand **"App"** folder
2. **Find** → **"Assets.xcassets"** folder
3. **Right-click** → **"Open in Finder"**
4. **In Finder** → Navigate to the icon pack you downloaded from appicon.co
5. **Drag all icon files** into the **"AppIcon"** folder in Xcode
6. **Xcode will ask** → "Do you want to add these files?" → Click **"Add"**

---

## Step 4: Add In-App Purchase Capability

This is required for StoreKit 2 (Pro subscriptions).

**In Xcode:**

1. **Signing & Capabilities tab** (same as Step 2)
2. **Click** **"+ Capability"** button (top-left)
3. **Search** → Type `in-app purchase`
4. **Double-click** → **"In-App Purchase"**

✅ **You should now see "In-App Purchase" listed under Capabilities**

---

## Step 5: Configure StoreKit Configuration (Local Testing)

This lets you test purchases on the simulator before submitting to App Store.

**In Xcode:**

1. **File** → **New** → **File**
2. **Choose template** → Search for **"StoreKit Configuration"**
3. **Click** → **"Next"**
4. **Save as** → `StoreKitConfig.storekit`
5. **In the file editor**, add your product:
   ```
   Product ID: com.centralorbit.pro
   Type: Auto-Renewable Subscription
   Subscription Period: 1 Month
   Price: $9.99 (or your price)
   ```
6. **File** → **Save**

**Enable for simulator:**

1. **Product** → **Scheme** → **Edit Scheme**
2. **Run** tab → **Options** → **StoreKit Configuration** → Select `StoreKitConfig.storekit`
3. **Click** → **Close**

---

## Step 6: Test on Simulator or Device

**On Simulator:**
1. **Product** → **Destination** → Select **"iPhone 15 Pro"** (or any simulator)
2. **Product** → **Run** (or press ⌘R)
3. Xcode builds and launches the app
4. Test the Pro upgrade flow — it will use the StoreKit Configuration you created

**On Real Device:**
1. **Connect your iPhone** via USB
2. **Product** → **Destination** → Select your device
3. **Product** → **Run**
4. Xcode builds and installs the app on your phone
5. Test the full flow

---

## Step 7: Create App Store Connect Listing

Before archiving, set up your listing on App Store Connect.

**Go to:** https://appstoreconnect.apple.com

1. **Apps** → **Create New App**
2. **Platform** → Select **iOS**
3. **Name** → `Central Orbit`
4. **Bundle ID** → `com.centralorbit.app`
5. **SKU** → `centralorbit` (any unique identifier)
6. **User Access** → Select your access level
7. **Click** → **Create**

**Fill in the listing:**
1. **App Information**
   - **Category** → Productivity
   - **Subtitle** → `Manage your teams and projects`
   - **Description** → (Use the copy from STORE_ASSETS_GUIDE.md)
   - **Keywords** → `teams, projects, collaboration, workspace`
   - **Support URL** → Your support email or website
   - **Privacy Policy URL** → Link to your privacy policy (already in the app)

2. **Pricing and Availability**
   - **Price Tier** → Free
   - **In-App Purchases** → Add your Pro subscription:
     - **Reference Name** → `Pro Monthly`
     - **Product ID** → `com.centralorbit.pro`
     - **Type** → Auto-Renewable Subscription
     - **Billing Period** → Monthly
     - **Price** → $9.99 (or your price)
     - **Localized Pricing** → Set for other countries if desired

3. **Screenshots**
   - Upload screenshots for each device size (from STORE_ASSETS_GUIDE.md)
   - 6.7" (iPhone 15 Pro Max) — 1290 x 2796
   - 6.5" (iPhone 14 Plus) — 1284 x 2778
   - 5.5" (iPhone 8 Plus) — 1242 x 2208

4. **Preview**
   - Add a short preview video (optional but recommended)

5. **App Review Information**
   - **Contact Email** → Your email
   - **Demo Account** → If needed for testing
   - **Notes for Reviewers** → Explain the app and any special features
   - **Attachments** → Add any supporting documents

6. **Age Rating**
   - **Click** → **Age Rating Questionnaire**
   - Answer the questions (usually all "No" for productivity apps)
   - **Save**

---

## Step 8: Archive and Upload

**In Xcode:**

1. **Product** → **Destination** → Select **"Any iOS Device (arm64)"**
2. **Product** → **Archive**
   - Xcode compiles and creates an archive
   - Wait for completion (may take 2-5 minutes)
3. **Organizer window opens** → Your archive is listed
4. **Click** → **Distribute App**
5. **Choose** → **App Store Connect**
6. **Click** → **Next**
7. **Signing** → Select your team (should be pre-selected)
8. **Click** → **Next**
9. **Review** → Check the details
10. **Click** → **Upload**

Xcode uploads your app to App Store Connect. This may take 5-15 minutes.

---

## Step 9: Submit for Review

**Back on App Store Connect:**

1. **Apps** → **Central Orbit**
2. **Build** section → Your uploaded build should appear
3. **Select** → Your build
4. **Scroll down** → **Submit for Review**
5. **Answer questions:**
   - **Content Rights** → "Yes, my app does not use third-party content"
   - **Advertising** → "No" (unless you have ads)
   - **Encryption** → "No" (unless you use encryption)
   - **IDFA** → "No" (you don't track users)
6. **Click** → **Submit for Review**

✅ **Your app is now in the review queue!**

Apple typically reviews in 24-48 hours. You'll get an email when they approve or request changes.

---

## Troubleshooting

### "No team selected"
- Go to Xcode Preferences → Accounts → Add your Apple ID → Select your team in Signing & Capabilities

### "Provisioning profile doesn't match"
- Delete the provisioning profile from Xcode Preferences → Accounts → Manage Certificates
- Xcode will automatically recreate it

### "Code signing identity not found"
- Xcode → Preferences → Accounts → Download Manual Profiles
- Or: Delete the derived data folder and rebuild

### "In-App Purchase not working on simulator"
- Make sure you added the StoreKit Configuration file
- Make sure you enabled it in the Scheme settings

### "App rejected for privacy reasons"
- Check that your Privacy Policy URL is correct and accessible
- Make sure you declared all data collection in App Store Connect
- Review the rejection email for specific issues

---

## Next Steps After Approval

Once Apple approves your app:

1. **App Store Connect** → **Pricing and Availability** → **Release**
2. Choose **Manual Release** or **Automatic Release** (recommended)
3. Your app appears on the App Store within a few hours

**Congratulations! Your app is live! 🎉**

---

## For Updates

When you make changes to your app:

1. **Update version number** in Xcode (Project → Build Settings → Version)
2. **Rebuild** (`bun run build` → `bunx cap sync`)
3. **Archive and upload** (Steps 8-9 above)
4. **Submit for Review** again

Each update goes through the same review process (usually faster for updates).

