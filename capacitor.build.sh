#!/bin/bash

# Build script for Capacitor iOS and Android apps

echo "Building web assets..."
bun run build

echo "Syncing Capacitor..."
bunx cap sync

echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo ""
echo "📱 For iOS:"
echo "  1. Open in Xcode: bunx cap open ios"
echo "  2. Select 'Central Orbit' scheme"
echo "  3. Select your device or simulator"
echo "  4. Click Play to build and run"
echo "  5. To submit to App Store: Archive > Distribute App"
echo ""
echo "🤖 For Android:"
echo "  1. Open in Android Studio: bunx cap open android"
echo "  2. Select your device or emulator"
echo "  3. Click Play to build and run"
echo "  4. To submit to Play Store: Build > Generate Signed Bundle"
echo ""
