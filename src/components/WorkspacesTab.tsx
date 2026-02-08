import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { TileCard } from './TileCard';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import type { ConvexTile, ConvexWorkspace } from '../lib/types';

type SortMode = 'name' | 'recent' | 'created';

function sortTiles(tiles: ConvexTile[], mode: SortMode): ConvexTile[] {
  const sorted = [...tiles];
  switch (mode) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'recent':
      return sorted.sort((a, b) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0));
    case 'created':
      return sorted.sort((a, b) => b._creationTime - a._creationTime);
    default:
      return sorted;
  }
}

export function WorkspacesTab() {
  const {
    activeWorkspaceId, setActiveWorkspaceId, viewMode, setViewMode,
    setAddModalOpen, setAddModalType,
    setEditModalOpen, setEditingWorkspace,
    setDeleteConfirmOpen, setDeleteTarget,
  } = useAppStore();
  const { data: session } = useSession();

  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];
  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];

  const [sortMode, setSortMode] = useState<SortMode>('name');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const selectedWorkspace = workspaces.find((w: ConvexWorkspace) => w._id === activeWorkspaceId);
  const filteredTiles = activeWorkspaceId
    ? tiles.filter((t: ConvexTile) => t.workspaceId === activeWorkspaceId)
    : tiles;
  const sortedTiles = sortTiles(filteredTiles, sortMode);
  const favoriteTiles = sortedTiles.filter((t: ConvexTile) => t.isFavorite);
  const regularTiles = sortedTiles.filter((t: ConvexTile) => !t.isFavorite);

  const handleAddTile = () => {
    setAddModalType('tile');
    setAddModalOpen(true);
  };

  const handleAddWorkspace = () => {
    setAddModalType('workspace');
    setAddModalOpen(true);
  };

  const handleEditWorkspace = (ws: ConvexWorkspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWorkspace({
      id: ws._id,
      _id: ws._id,
      name: ws.name,
      icon: ws.icon,
      color: ws.color,
      tileCount: tiles.filter((t: ConvexTile) => t.workspaceId === ws._id).length,
      createdAt: ws._creationTime,
    });
    setEditModalOpen(true);
  };

  const handleDeleteWorkspace = (ws: ConvexWorkspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'workspace', id: ws._id, name: ws.name });
    setDeleteConfirmOpen(true);
  };

  const sortLabels: Record<SortMode, string> = { name: 'Name', recent: 'Recent', created: 'Newest' };

  return (
    <div className="px-4 pb-28 space-y-5">
      {/* Header */}
      <div className="pt-[env(safe-area-inset-top,12px)]">
        <div className="flex items-center justify-between pt-4 pb-2">
          <div className="flex items-center gap-2">
            {selectedWorkspace && (
              <button
                onClick={() => setActiveWorkspaceId(null)}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {selectedWorkspace ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{ backgroundColor: selectedWorkspace.color + '18' }}
                    >
                      {selectedWorkspace.icon}
                    </span>
                    {selectedWorkspace.name}
                  </span>
                ) : (
                  'Workspaces'
                )}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {selectedWorkspace
                  ? `${filteredTiles.length} tool${filteredTiles.length !== 1 ? 's' : ''}`
                  : `${workspaces.length} workspaces · ${tiles.length} tools`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-4.5L16.5 16.5m0 0L12 12m4.5 4.5V7.5" />
                </svg>
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    {(['name', 'recent', 'created'] as SortMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setSortMode(mode); setShowSortMenu(false); }}
                        className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                          sortMode === mode
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {sortLabels[mode]}
                        {sortMode === mode && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace cards (when no workspace selected) */}
      {!selectedWorkspace && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1">
              Your Workspaces
            </p>
            <button
              onClick={handleAddWorkspace}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New
            </button>
          </div>
          {workspaces.map((ws: ConvexWorkspace) => {
            const wsTiles = tiles.filter((t: ConvexTile) => t.workspaceId === ws._id);
            const wsFavorites = wsTiles.filter((t: ConvexTile) => t.isFavorite).length;
            return (
              <div
                key={ws._id}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <button
                  onClick={() => setActiveWorkspaceId(ws._id)}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{ backgroundColor: ws.color + '18' }}
                  >
                    {ws.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">{ws.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {wsTiles.length} tool{wsTiles.length !== 1 ? 's' : ''}
                      </span>
                      {wsFavorites > 0 && (
                        <span className="text-xs text-amber-500 flex items-center gap-0.5">
                          ⭐ {wsFavorites}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                {/* Edit/Delete actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => handleEditWorkspace(ws, e)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteWorkspace(ws, e)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
                <button onClick={() => setActiveWorkspaceId(ws._id)}>
                  <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            );
          })}

          {workspaces.length === 0 && session && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">📂</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No workspaces yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-[240px]">Create your first workspace to organize your tools.</p>
              <button
                onClick={handleAddWorkspace}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Create Workspace
              </button>
            </div>
          )}
        </div>
      )}

      {/* Workspace pills (when a workspace is selected) */}
      {selectedWorkspace && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {workspaces.map((ws: ConvexWorkspace) => (
            <button
              key={ws._id}
              onClick={() => setActiveWorkspaceId(ws._id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeWorkspaceId === ws._id
                  ? 'text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              style={
                activeWorkspaceId === ws._id
                  ? { backgroundColor: ws.color, boxShadow: `0 4px 14px ${ws.color}40` }
                  : undefined
              }
            >
              <span className="text-sm">{ws.icon}</span>
              <span>{ws.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tiles (when a workspace is selected) */}
      {selectedWorkspace && (
        <>
          {favoriteTiles.length > 0 && (
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1 mb-2">⭐ Favorites</p>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-1">
                  {favoriteTiles.map((tile: ConvexTile) => (
                    <TileCard key={tile._id} tile={tile} variant="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {favoriteTiles.map((tile: ConvexTile) => (
                    <TileCard key={tile._id} tile={tile} variant="list" />
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            {favoriteTiles.length > 0 && (
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1 mb-2">All Tools</p>
            )}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-1">
                {regularTiles.map((tile: ConvexTile) => (
                  <TileCard key={tile._id} tile={tile} variant="grid" />
                ))}
                <button
                  onClick={handleAddTile}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200 group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors">
                    <svg className="w-6 h-6 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Add</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {regularTiles.map((tile: ConvexTile) => (
                  <TileCard key={tile._id} tile={tile} variant="list" />
                ))}
                <button
                  onClick={handleAddTile}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700 group-hover:border-indigo-400 transition-colors">
                    <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors">
                    Add a new tool
                  </span>
                </button>
              </div>
            )}
          </div>

          {filteredTiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-4">📂</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No tools yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-[240px]">
                Add your first web tool to this workspace to get started.
              </p>
              <button
                onClick={handleAddTile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Add Tool
              </button>
            </div>
          )}
        </>
      )}

      {/* Stats bar */}
      {!selectedWorkspace && workspaces.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{tiles.length}</p>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Tools</p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{workspaces.length}</p>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Spaces</p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xl font-bold text-amber-500">{tiles.filter((t: ConvexTile) => t.isFavorite).length}</p>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Favorites</p>
          </div>
        </div>
      )}
    </div>
  );
}
