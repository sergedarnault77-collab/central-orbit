import { useSubscription, FREE_LIMITS, SUBSCRIPTION_PRICING, getUsagePercent } from '../lib/subscription';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import { toast } from 'sonner';
import { getPlatform } from '../lib/storekit';

export function ProModal() {
  const {
    isProModalOpen,
    closeProModal,
    tier,
    proModalTrigger,
    isPurchasing,
    purchaseError,
    purchasePro,
    restorePurchase,
    manageSubscription,
    subscribedAt,
    expiresAt,
    storeProducts,
  } = useSubscription();

  const { data: session } = useSession();
  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];
  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];

  if (!isProModalOpen) return null;

  const isPro = tier === 'pro';
  const platform = getPlatform();

  // Use real App Store / Play Store pricing if available, otherwise fallback
  const storeProduct = storeProducts.find((p) => p.id === SUBSCRIPTION_PRICING.annual.productId);
  const displayPrice = storeProduct?.price || `$${SUBSCRIPTION_PRICING.annual.price}`;
  const displayPriceAmount = storeProduct?.priceAmount || SUBSCRIPTION_PRICING.annual.price;
  const displayPeriod = storeProduct?.period || '1 year';
  const monthlyPrice = (displayPriceAmount / 12).toFixed(2);

  const workspaceUsage = getUsagePercent('free', workspaces.length, 'maxWorkspaces');
  const tileUsage = getUsagePercent('free', tiles.length, 'maxTotalTiles');

  const handleUpgrade = async () => {
    const success = await purchasePro();
    if (success) {
      toast.success('Welcome to Pro! 🚀 Enjoy unlimited access.');
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchase();
    if (success) {
      toast.success('Subscription restored successfully!');
    } else {
      toast.error('No active subscription found.');
    }
  };

  // Trigger-specific messaging
  const triggerMessages: Record<string, { title: string; subtitle: string }> = {
    workspace_limit: {
      title: 'Workspace Limit Reached',
      subtitle: `You\'ve used all ${FREE_LIMITS.maxWorkspaces} free workspaces. Upgrade to create unlimited workspaces.`,
    },
    tile_limit: {
      title: 'Tool Limit Reached',
      subtitle: `You\'ve reached the ${FREE_LIMITS.maxTotalTiles} tool limit. Upgrade for unlimited tools.`,
    },
  };

  const triggerMsg = proModalTrigger ? triggerMessages[proModalTrigger] : null;

  // Platform-specific legal text
  const legalText = platform === 'ios'
    ? 'Payment will be charged to your Apple ID account. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage subscriptions in Settings > Apple ID > Subscriptions.'
    : platform === 'android'
    ? 'Payment will be charged to your Google Play account. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage subscriptions in Google Play > Subscriptions.'
    : 'Payment will be charged to your account. Subscription auto-renews unless cancelled at least 24 hours before the end of the current period.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProModal} />
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Gradient header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 pt-8 pb-10 text-white text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="text-4xl mb-3">{isPro ? '✨' : '🚀'}</div>
            <h2 className="text-2xl font-bold mb-1">
              {isPro ? 'You\'re Pro!' : (triggerMsg?.title || 'Upgrade to Pro')}
            </h2>
            <p className="text-sm text-white/80">
              {isPro
                ? 'Enjoy unlimited access to all features.'
                : (triggerMsg?.subtitle || 'Unlock the full power of Central Orbit')}
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {!isPro && (
            <>
              {/* Usage bars for free tier */}
              {!triggerMsg && (
                <div className="space-y-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Current Usage</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-600 dark:text-zinc-300">Workspaces</span>
                        <span className="text-xs font-medium text-zinc-500">{workspaces.length}/{FREE_LIMITS.maxWorkspaces}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${workspaceUsage >= 100 ? 'bg-red-500' : workspaceUsage >= 66 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${workspaceUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-600 dark:text-zinc-300">Tools</span>
                        <span className="text-xs font-medium text-zinc-500">{tiles.length}/{FREE_LIMITS.maxTotalTiles}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${tileUsage >= 100 ? 'bg-red-500' : tileUsage >= 66 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${tileUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features list */}
              <div className="space-y-3">
                {[
                  { icon: '📂', text: `Unlimited workspaces (free: ${FREE_LIMITS.maxWorkspaces})` },
                  { icon: '🔧', text: `Unlimited tools (free: ${FREE_LIMITS.maxTotalTiles})` },
                  { icon: '⭐', text: 'Priority support & early features' },
                  { icon: '🎨', text: 'Custom themes & advanced organization' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Price - shows real App Store price when available */}
              <div className="text-center py-3">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{displayPrice}</span>
                  <span className="text-sm text-zinc-500">/{displayPeriod}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Less than ${monthlyPrice}/month</p>
              </div>

              {/* Error message */}
              {purchaseError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center">{purchaseError}</p>
                </div>
              )}

              {/* Upgrade button */}
              <button
                onClick={handleUpgrade}
                disabled={isPurchasing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {isPurchasing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>

              {/* Restore */}
              <button
                onClick={handleRestore}
                disabled={isPurchasing}
                className="w-full py-2.5 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-40 transition-colors"
              >
                Restore Purchase
              </button>

              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                {legalText}
              </p>
            </>
          )}

          {isPro && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/15 flex items-center justify-center text-3xl mx-auto mb-3">
                ✅
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Pro subscription active
              </p>
              {subscribedAt && (
                <p className="text-xs text-zinc-400 mb-1">
                  Subscribed {new Date(subscribedAt).toLocaleDateString()}
                </p>
              )}
              {expiresAt && (
                <p className="text-xs text-zinc-400 mb-4">
                  Renews {new Date(expiresAt).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                You have full access to all Pro features.
              </p>
              <div className="space-y-2">
                <button
                  onClick={manageSubscription}
                  className="w-full px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Manage Subscription
                </button>
                <button
                  onClick={closeProModal}
                  className="w-full px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
