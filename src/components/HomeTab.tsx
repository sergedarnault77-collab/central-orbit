import { useAppStore } from '../lib/store';
import { TileCard } from './TileCard';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import type { ConvexTile, ConvexWorkspace } from '../lib/types';
import { useSubscription } from '../lib/subscription';
import { UsageBanner } from './UsageBanner';
import { SubscriptionBadge } from './SubscriptionBadge';
import { useEffect } from 'react';

export function HomeTab() {
  const { setActiveTab, setActiveWorkspaceId } = useAppStore();
  const { data: session, isPending } = useSession();
  const { tier, openProModal, checkExpiration, initializeIAP } = useSubscription();

  // Initialize IAP and check subscription on mount
  useEffect(() => {
    initializeIAP();
  }, [initializeIAP]);
  checkExpiration();

  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];
  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];

  const favorites = tiles.filter((t: ConvexTile) => t.isFavorite);
  const recents = tiles
    .filter((t: ConvexTile) => t.lastAccessedAt)
    .sort((a: ConvexTile, b: ConvexTile) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0))
    .slice(0, 4);

  if (isPending) {
    return (
      <div className="px-4 pb-28 space-y-6">
        <div className="pt-[env(safe-area-inset-top,12px)]">
          <div className="pt-4 pb-2">
            <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-zinc-100 dark:bg-zinc-800/50 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 p-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-12 h-3 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 space-y-6">
      {/* Header */}
      <div className="pt-[env(safe-area-inset-top,12px)]">
        <div className="flex items-center justify-between pt-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Central Orbit
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {session ? `Welcome back, ${session.user.name || 'User'}` : 'Your web tools workspace'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SubscriptionBadge />
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
              {session?.user.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
          Organize and access your favorite web tools in one place. Create workspaces, save shortcuts, and keep everything you need at your fingertips.
        </p>
      </div>

      {!session && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            Sign in to save your workspaces and tools across devices.
          </p>
        </div>
      )}

      {/* Usage Banner for free tier */}
      <UsageBanner />

      {/* Quick Access - Favorites */}
      {favorites.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              ⭐ Favorites
            </h2>
            <span className="text-xs text-zinc-400">{favorites.length} tools</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {favorites.map((tile: ConvexTile) => (
              <TileCard key={tile._id} tile={tile} variant="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used */}
      {recents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              🕐 Recently Used
            </h2>
            <button
              onClick={() => setActiveTab('recents')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              See all
            </button>
          </div>
          <div className="space-y-2">
            {recents.map((tile: ConvexTile) => (
              <TileCard key={tile._id} tile={tile} variant="list" />
            ))}
          </div>
        </section>
      )}

      {/* Workspaces Overview */}
      {workspaces.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              📂 Workspaces
            </h2>
            <button
              onClick={() => setActiveTab('workspaces')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {workspaces.map((ws: ConvexWorkspace) => {
              const wsTileCount = tiles.filter((t: ConvexTile) => t.workspaceId === ws._id).length;
              return (
                <button
                  key={ws._id}
                  onClick={() => {
                    setActiveWorkspaceId(ws._id);
                    setActiveTab('workspaces');
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: ws.color + '18' }}
                  >
                    {ws.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{ws.name}</p>
                    <p className="text-xs text-zinc-400">{wsTileCount} tools</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {session && workspaces.length === 0 && tiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/15 dark:to-purple-500/15 flex items-center justify-center text-4xl mb-4">
            🚀
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Get Started</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-[260px]">
            Create your first workspace and add your favorite web tools.
          </p>
        </div>
      )}

      {/* Pro Banner */}
      <section>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-5 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚀</span>
              <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Unlock Unlimited</h3>
            <p className="text-sm text-white/80 mb-3">
              Unlimited tiles, workspaces, and advanced organization features.
            </p>
            <button
              onClick={() => openProModal('home_banner')}
              className="px-4 py-2 bg-white text-indigo-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              {tier === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
