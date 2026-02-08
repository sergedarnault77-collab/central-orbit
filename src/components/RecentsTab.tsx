import { TileCard } from './TileCard';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import type { ConvexTile } from '../lib/types';

export function RecentsTab() {
  const { data: session } = useSession();
  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];

  const recents = tiles
    .filter((t: ConvexTile) => t.lastAccessedAt)
    .sort((a: ConvexTile, b: ConvexTile) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0));

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="px-4 pb-28 space-y-5">
      <div className="pt-[env(safe-area-inset-top,12px)]">
        <div className="pt-4 pb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Recents</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {recents.length} recently accessed tool{recents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {recents.length > 0 ? (
        <div className="space-y-2">
          {recents.map((tile: ConvexTile) => (
            <TileCard key={tile._id} tile={tile} variant="list" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">🕐</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No recent activity</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px]">
            Tools you open will appear here for quick access.
          </p>
        </div>
      )}
    </div>
  );
}
