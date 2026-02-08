import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  initializeStore,
  getProducts,
  purchaseProduct,
  restorePurchases,
  checkEntitlements,
  openSubscriptionManagement,
  PRODUCT_IDS,
  type StoreProduct,
  type PurchaseResult,
} from './storekit';

// Subscription tiers
export type SubscriptionTier = 'free' | 'pro';

// Free tier limits
export const FREE_LIMITS = {
  maxWorkspaces: 3,
  maxTilesPerWorkspace: 8,
  maxTotalTiles: 15,
} as const;

// Pro tier limits (effectively unlimited)
export const PRO_LIMITS = {
  maxWorkspaces: Infinity,
  maxTilesPerWorkspace: Infinity,
  maxTotalTiles: Infinity,
} as const;

// Fallback pricing (used when store products haven't loaded yet)
export const SUBSCRIPTION_PRICING = {
  annual: {
    price: 29.99,
    pricePerMonth: 2.50,
    currency: 'USD',
    interval: 'year' as const,
    productId: PRODUCT_IDS.PRO_ANNUAL,
  },
} as const;

export interface SubscriptionState {
  // Tier
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;

  // Pro modal
  isProModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
  proModalTrigger: string | null;

  // Subscription metadata
  subscribedAt: number | null;
  expiresAt: number | null;
  transactionId: string | null;

  // Purchase flow
  isPurchasing: boolean;
  purchaseError: string | null;

  // Store products (loaded from App Store / Play Store)
  storeProducts: StoreProduct[];
  isLoadingProducts: boolean;

  // Actions
  openProModal: (trigger?: string) => void;
  closeProModal: () => void;
  initializeIAP: () => Promise<void>;
  purchasePro: () => Promise<boolean>;
  restorePurchase: () => Promise<boolean>;
  cancelSubscription: () => void;
  checkExpiration: () => void;
  verifyEntitlements: () => Promise<void>;
  manageSubscription: () => void;
}

export const useSubscription = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: 'free',
      setTier: (tier) => set({ tier }),

      isProModalOpen: false,
      setProModalOpen: (open) => set({ isProModalOpen: open }),
      proModalTrigger: null,

      subscribedAt: null,
      expiresAt: null,
      transactionId: null,

      isPurchasing: false,
      purchaseError: null,

      storeProducts: [],
      isLoadingProducts: false,

      openProModal: (trigger?: string) =>
        set({ isProModalOpen: true, proModalTrigger: trigger || null, purchaseError: null }),

      closeProModal: () =>
        set({ isProModalOpen: false, proModalTrigger: null, purchaseError: null }),

      /**
       * Initialize IAP - call on app mount.
       * Loads products from App Store / Play Store and verifies entitlements.
       */
      initializeIAP: async () => {
        set({ isLoadingProducts: true });
        try {
          // Initialize the native store
          await initializeStore();

          // Load product info (localized pricing)
          const products = await getProducts();
          set({ storeProducts: products, isLoadingProducts: false });

          // Verify current entitlements
          await get().verifyEntitlements();
        } catch {
          set({ isLoadingProducts: false });
        }
      },

      /**
       * Purchase Pro subscription via StoreKit 2 / Play Billing.
       */
      purchasePro: async () => {
        set({ isPurchasing: true, purchaseError: null });
        try {
          const result: PurchaseResult = await purchaseProduct(PRODUCT_IDS.PRO_ANNUAL);

          if (result.success) {
            set({
              tier: 'pro',
              subscribedAt: result.purchaseDate || Date.now(),
              expiresAt: result.expiresDate || null,
              transactionId: result.transactionId || null,
              isPurchasing: false,
              isProModalOpen: false,
              proModalTrigger: null,
            });
            return true;
          } else {
            set({
              isPurchasing: false,
              purchaseError: result.error || 'Purchase failed. Please try again.',
            });
            return false;
          }
        } catch {
          set({
            isPurchasing: false,
            purchaseError: 'Purchase failed. Please try again.',
          });
          return false;
        }
      },

      /**
       * Restore previous purchases from App Store / Play Store.
       */
      restorePurchase: async () => {
        set({ isPurchasing: true, purchaseError: null });
        try {
          const result = await restorePurchases();

          if (result.success && result.transactions.length > 0) {
            // Find the most recent active Pro subscription
            const activeProTx = result.transactions
              .filter((tx) => tx.isActive && tx.productId === PRODUCT_IDS.PRO_ANNUAL)
              .sort((a, b) => b.purchaseDate - a.purchaseDate)[0];

            if (activeProTx) {
              set({
                tier: 'pro',
                subscribedAt: activeProTx.purchaseDate,
                expiresAt: activeProTx.expiresDate,
                transactionId: activeProTx.transactionId,
                isPurchasing: false,
                isProModalOpen: false,
              });
              return true;
            }
          }

          set({
            isPurchasing: false,
            purchaseError: result.error || 'No active subscription found to restore.',
          });
          return false;
        } catch {
          set({
            isPurchasing: false,
            purchaseError: 'Could not restore purchase. Please try again.',
          });
          return false;
        }
      },

      /**
       * Open platform subscription management (App Store / Play Store).
       */
      cancelSubscription: () => {
        openSubscriptionManagement();
      },

      /**
       * Manage subscription - opens platform settings.
       */
      manageSubscription: () => {
        openSubscriptionManagement();
      },

      /**
       * Check if subscription has expired (local check).
       */
      checkExpiration: () => {
        const state = get();
        if (state.tier === 'pro' && state.expiresAt && state.expiresAt < Date.now()) {
          set({
            tier: 'free',
            subscribedAt: null,
            expiresAt: null,
            transactionId: null,
          });
        }
      },

      /**
       * Verify entitlements with the native store.
       * This checks the actual subscription status from Apple/Google.
       */
      verifyEntitlements: async () => {
        try {
          const entitlements = await checkEntitlements();

          if (entitlements.isProActive) {
            set({
              tier: 'pro',
              expiresAt: entitlements.expiresDate || null,
              transactionId: entitlements.transactionId || null,
            });
          } else {
            // If native says not active but we think we're pro, downgrade
            const state = get();
            if (state.tier === 'pro') {
              set({
                tier: 'free',
                subscribedAt: null,
                expiresAt: null,
                transactionId: null,
              });
            }
          }
        } catch {
          // If verification fails, fall back to local expiration check
          get().checkExpiration();
        }
      },
    }),
    {
      name: 'central-orbit-subscription',
      partialize: (state) => ({
        tier: state.tier,
        subscribedAt: state.subscribedAt,
        expiresAt: state.expiresAt,
        transactionId: state.transactionId,
      }),
    }
  )
);

// Helper functions
export function getLimits(tier: SubscriptionTier) {
  return tier === 'pro' ? PRO_LIMITS : FREE_LIMITS;
}

export function canAddWorkspace(tier: SubscriptionTier, currentCount: number): boolean {
  const limits = getLimits(tier);
  return currentCount < limits.maxWorkspaces;
}

export function canAddTile(tier: SubscriptionTier, totalTiles: number, workspaceTiles: number): boolean {
  const limits = getLimits(tier);
  return totalTiles < limits.maxTotalTiles && workspaceTiles < limits.maxTilesPerWorkspace;
}

export function getUsagePercent(tier: SubscriptionTier, current: number, limitKey: keyof typeof FREE_LIMITS): number {
  const limits = getLimits(tier);
  const max = limits[limitKey];
  if (max === Infinity) return 0;
  return Math.min(100, Math.round((current / max) * 100));
}

export function getRemainingCount(tier: SubscriptionTier, current: number, limitKey: keyof typeof FREE_LIMITS): number | null {
  const limits = getLimits(tier);
  const max = limits[limitKey];
  if (max === Infinity) return null;
  return Math.max(0, max - current);
}

export function isAtLimit(tier: SubscriptionTier, current: number, limitKey: keyof typeof FREE_LIMITS): boolean {
  const limits = getLimits(tier);
  const max = limits[limitKey];
  if (max === Infinity) return false;
  return current >= max;
}

// Hook to check subscription and show upgrade prompt if needed
export function useSubscriptionGate() {
  const { tier, openProModal } = useSubscription();

  const checkWorkspaceLimit = (currentCount: number): boolean => {
    if (!canAddWorkspace(tier, currentCount)) {
      openProModal('workspace_limit');
      return false;
    }
    return true;
  };

  const checkTileLimit = (totalTiles: number, workspaceTiles: number): boolean => {
    if (!canAddTile(tier, totalTiles, workspaceTiles)) {
      openProModal('tile_limit');
      return false;
    }
    return true;
  };

  return {
    tier,
    isPro: tier === 'pro',
    checkWorkspaceLimit,
    checkTileLimit,
  };
}
