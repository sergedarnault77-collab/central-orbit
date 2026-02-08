/**
 * StoreKit 2 / Google Play Billing bridge for Capacitor
 * 
 * This module provides a unified interface for in-app purchases on iOS and Android.
 * On iOS, it communicates with StoreKit 2 via a native Capacitor plugin.
 * On Android, it communicates with Google Play Billing.
 * On web, it falls back to a simulated purchase flow for testing.
 */

import { Capacitor } from '@capacitor/core';

// Product identifiers - must match App Store Connect / Google Play Console
export const PRODUCT_IDS = {
  PRO_ANNUAL: 'com.centralorbit.pro.annual',
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

export interface StoreProduct {
  id: string;
  title: string;
  description: string;
  price: string;           // Localized price string (e.g., "$29.99")
  priceAmount: number;     // Raw price number
  currency: string;        // Currency code (e.g., "USD")
  period: string;          // Subscription period (e.g., "1 year")
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  productId?: string;
  purchaseDate?: number;
  expiresDate?: number;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  transactions: Array<{
    transactionId: string;
    productId: string;
    purchaseDate: number;
    expiresDate: number;
    isActive: boolean;
  }>;
  error?: string;
}

// Check if running on a native platform
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') return 'ios';
  if (platform === 'android') return 'android';
  return 'web';
}

/**
 * Initialize the store and load products.
 * Call this early in app lifecycle (e.g., on app mount).
 */
export async function initializeStore(): Promise<void> {
  const platform = getPlatform();
  
  if (platform === 'ios') {
    try {
      // Call native StoreKit 2 initialization via Capacitor plugin
      await callNative('CentralOrbitIAP', 'initialize', {
        productIds: Object.values(PRODUCT_IDS),
      });
      console.log('[StoreKit] Initialized successfully');
    } catch (err) {
      console.warn('[StoreKit] Init failed, will retry on purchase:', err);
    }
  } else if (platform === 'android') {
    try {
      await callNative('CentralOrbitIAP', 'initialize', {
        productIds: Object.values(PRODUCT_IDS),
      });
      console.log('[PlayBilling] Initialized successfully');
    } catch (err) {
      console.warn('[PlayBilling] Init failed:', err);
    }
  } else {
    console.log('[Store] Web platform - using simulated purchases');
  }
}

/**
 * Fetch product information from the App Store / Play Store.
 * Returns localized pricing and product details.
 */
export async function getProducts(): Promise<StoreProduct[]> {
  const platform = getPlatform();
  
  if (platform === 'ios' || platform === 'android') {
    try {
      const result = await callNative('CentralOrbitIAP', 'getProducts', {
        productIds: Object.values(PRODUCT_IDS),
      });
      return result.products as StoreProduct[];
    } catch (err) {
      console.error('[Store] Failed to fetch products:', err);
      // Return fallback product info
      return getFallbackProducts();
    }
  }
  
  return getFallbackProducts();
}

/**
 * Purchase a subscription product.
 * On iOS: Triggers StoreKit 2 purchase sheet.
 * On Android: Triggers Google Play purchase flow.
 * On web: Simulates purchase for testing.
 */
export async function purchaseProduct(productId: ProductId): Promise<PurchaseResult> {
  const platform = getPlatform();
  
  if (platform === 'ios') {
    try {
      const result = await callNative('CentralOrbitIAP', 'purchase', {
        productId,
      });
      return {
        success: true,
        transactionId: result.transactionId,
        productId: result.productId,
        purchaseDate: result.purchaseDate,
        expiresDate: result.expiresDate,
      };
    } catch (err: any) {
      // User cancelled
      if (err?.code === 'USER_CANCELLED' || err?.message?.includes('cancel')) {
        return { success: false, error: 'Purchase cancelled.' };
      }
      return { success: false, error: err?.message || 'Purchase failed. Please try again.' };
    }
  }
  
  if (platform === 'android') {
    try {
      const result = await callNative('CentralOrbitIAP', 'purchase', {
        productId,
      });
      return {
        success: true,
        transactionId: result.transactionId,
        productId: result.productId,
        purchaseDate: result.purchaseDate,
        expiresDate: result.expiresDate,
      };
    } catch (err: any) {
      if (err?.code === 'USER_CANCELLED') {
        return { success: false, error: 'Purchase cancelled.' };
      }
      return { success: false, error: err?.message || 'Purchase failed. Please try again.' };
    }
  }
  
  // Web fallback - simulate purchase for testing
  return simulatePurchase(productId);
}

/**
 * Restore previous purchases.
 * On iOS: Checks StoreKit 2 transaction history.
 * On Android: Checks Google Play purchase history.
 */
export async function restorePurchases(): Promise<RestoreResult> {
  const platform = getPlatform();
  
  if (platform === 'ios' || platform === 'android') {
    try {
      const result = await callNative('CentralOrbitIAP', 'restorePurchases', {});
      return {
        success: result.transactions?.length > 0,
        transactions: result.transactions || [],
      };
    } catch (err: any) {
      return {
        success: false,
        transactions: [],
        error: err?.message || 'Could not restore purchases. Please try again.',
      };
    }
  }
  
  // Web fallback
  return simulateRestore();
}

/**
 * Check current entitlements (active subscriptions).
 * Call this on app launch to verify subscription status.
 */
export async function checkEntitlements(): Promise<{
  isProActive: boolean;
  expiresDate?: number;
  transactionId?: string;
}> {
  const platform = getPlatform();
  
  if (platform === 'ios' || platform === 'android') {
    try {
      const result = await callNative('CentralOrbitIAP', 'checkEntitlements', {});
      return {
        isProActive: result.isProActive ?? false,
        expiresDate: result.expiresDate,
        transactionId: result.transactionId,
      };
    } catch {
      return { isProActive: false };
    }
  }
  
  return { isProActive: false };
}

/**
 * Open the platform's subscription management page.
 * iOS: Opens App Store subscription settings.
 * Android: Opens Google Play subscription settings.
 */
export async function openSubscriptionManagement(): Promise<void> {
  const platform = getPlatform();
  
  if (platform === 'ios') {
    // Deep link to App Store subscription management
    window.open('https://apps.apple.com/account/subscriptions', '_blank');
  } else if (platform === 'android') {
    // Deep link to Google Play subscription management
    window.open('https://play.google.com/store/account/subscriptions', '_blank');
  } else {
    // Web - no subscription management
    console.log('[Store] Web platform has no subscription management');
  }
}

// ─── Native Bridge ───────────────────────────────────────────────────────────

/**
 * Call a native Capacitor plugin method.
 * This bridges JavaScript to Swift (StoreKit 2) or Kotlin (Play Billing).
 */
async function callNative(plugin: string, method: string, args: Record<string, unknown>): Promise<any> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Not running on a native platform');
  }
  
  // Use Capacitor's registerPlugin bridge to call native methods
  const { registerPlugin } = await import('@capacitor/core');
  const nativePlugin = registerPlugin<Record<string, (...a: any[]) => Promise<any>>>(plugin);
  
  if (!nativePlugin || typeof nativePlugin[method] !== 'function') {
    throw new Error(`Native plugin ${plugin}.${method} not available. Ensure the native plugin is installed.`);
  }
  
  return await nativePlugin[method](args);
}

// ─── Fallback / Web Simulation ───────────────────────────────────────────────

function getFallbackProducts(): StoreProduct[] {
  return [
    {
      id: PRODUCT_IDS.PRO_ANNUAL,
      title: 'Central Orbit Pro',
      description: 'Unlimited workspaces, tools, and premium features',
      price: '$29.99',
      priceAmount: 29.99,
      currency: 'USD',
      period: '1 year',
    },
  ];
}

async function simulatePurchase(productId: string): Promise<PurchaseResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  
  return {
    success: true,
    transactionId: `web_txn_${crypto.randomUUID().slice(0, 12)}`,
    productId,
    purchaseDate: now,
    expiresDate: now + oneYear,
  };
}

async function simulateRestore(): Promise<RestoreResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  // On web, check if there's a stored transaction in localStorage
  // (This is only for web testing - native uses real receipts)
  return {
    success: false,
    transactions: [],
    error: 'No active subscription found to restore.',
  };
}
