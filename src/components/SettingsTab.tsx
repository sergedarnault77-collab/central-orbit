import { useSession, signOutUser } from '../lib/auth-client';
import { useSubscription } from '../lib/subscription';
import { SettingsLegalSection } from './LegalPages';
import { useAppStore } from '../lib/store';
import { toast } from 'sonner';

export function SettingsTab() {
  const { data: session } = useSession();
  const { tier, openProModal, expiresAt } = useSubscription();
  const { setActiveTab } = useAppStore();

  const handleSignOut = async () => {
    await signOutUser();
    toast.success('Signed out successfully');
    setActiveTab('home');
  };

  return (
    <div className="px-4 pb-28 space-y-6">
      <div className="pt-[env(safe-area-inset-top,12px)]">
        <div className="pt-4 pb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Manage your account and preferences</p>
        </div>
      </div>

      {/* Account section */}
      {session && (
        <section className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {session.user.name || 'User'}
              </p>
              <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
            </div>
            {tier === 'pro' && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold">
                ✨ PRO
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Sign Out
          </button>
        </section>
      )}

      {/* Subscription section */}
      <section className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Subscription</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </p>
            {tier === 'pro' && expiresAt && (
              <p className="text-xs text-zinc-400 mt-0.5">
                Renews {new Date(expiresAt).toLocaleDateString()}
              </p>
            )}
            {tier === 'free' && (
              <p className="text-xs text-zinc-400 mt-0.5">Limited workspaces and tools</p>
            )}
          </div>
          <button
            onClick={() => openProModal('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tier === 'pro'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {tier === 'pro' ? 'Manage' : 'Upgrade'}
          </button>
        </div>
      </section>

      {/* Legal & Support */}
      <section className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <SettingsLegalSection />
      </section>

      {/* App info */}
      <div className="text-center py-4">
        <p className="text-xs text-zinc-400">Central Orbit v1.0.0</p>
        <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-1">Made with ❤️ for productivity</p>
      </div>
    </div>
  );
}
