import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { TileCard } from './TileCard';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import type { ConvexTile, ConvexWorkspace } from '../lib/types';

export function SearchTab() {
  const { searchQuery, setSearchQuery } = useAppStore();
  const { data: session } = useSession();
  const [focused, setFocused] = useState(false);

  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];
  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];

  const query = searchQuery.toLowerCase().trim();
  const filteredTiles = query
    ? tiles.filter((t: ConvexTile) =>
        t.name.toLowerCase().includes(query) || t.url.toLowerCase().includes(query)
      )
    : [];
  const filteredWorkspaces = query
    ? workspaces.filter((w: ConvexWorkspace) => w.name.toLowerCase().includes(query))
    : [];

  const getWorkspaceName = (wsId: string) => {
    const ws = workspaces.find((w: ConvexWorkspace) => w._id === wsId);
    return ws?.name ?? '';
  };

  return (
    <div className="px-4 pb-28 space-y-5">
      <div className="pt-[env(safe-area-inset-top,12px)]">
        <div className="pt-4 pb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Search</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Find tools and workspaces</p>
        </div>
      </div>

      <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.02]' : ''}`}>
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search tools, workspaces..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-all shadow-sm focus:shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {!query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Search your tools</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px]">
            Type to find tools and workspaces across all your collections.
          </p>
        </div>
      )}

      {query && filteredWorkspaces.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1 mb-2">Workspaces</p>
          <div className="space-y-2">
            {filteredWorkspaces.map((ws: ConvexWorkspace) => (
              <div
                key={ws._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: ws.color + '18' }}
                >
                  {ws.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{ws.name}</p>
                  <p className="text-xs text-zinc-400">Workspace</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && filteredTiles.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1 mb-2">
            Tools ({filteredTiles.length})
          </p>
          <div className="space-y-2">
            {filteredTiles.map((tile: ConvexTile) => (
              <TileCard key={tile._id} tile={tile} variant="list" />
            ))}
          </div>
        </div>
      )}

      {query && filteredTiles.length === 0 && filteredWorkspaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">😔</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No results</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px]">
            No tools or workspaces match "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
}
