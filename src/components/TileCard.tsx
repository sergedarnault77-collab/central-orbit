import { useAppStore } from '../lib/store';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { ConvexTile } from '../lib/types';

interface TileCardProps {
  tile: ConvexTile;
  variant?: 'grid' | 'list';
}

export function TileCard({ tile, variant = 'grid' }: TileCardProps) {
  const { setActiveTile, setEditModalOpen, setEditingTile, setDeleteConfirmOpen, setDeleteTarget } = useAppStore();
  const toggleFavorite = useMutation(api.mutations.toggleFavorite);
  const recordTileAccess = useMutation(api.mutations.recordTileAccess);

  const handleOpen = () => {
    recordTileAccess({ id: tile._id }).catch(() => {});
    setActiveTile({
      id: tile._id,
      _id: tile._id,
      name: tile.name,
      url: tile.url,
      icon: tile.icon ?? undefined,
      color: tile.color,
      workspaceId: tile.workspaceId,
      isFavorite: tile.isFavorite,
      lastAccessedAt: tile.lastAccessedAt ?? undefined,
      createdAt: tile._creationTime,
    });
  };

  const handleFavorite = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite({ id: tile._id }).catch(() => {});
  };

  const handleEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingTile({
      id: tile._id,
      _id: tile._id,
      name: tile.name,
      url: tile.url,
      icon: tile.icon ?? undefined,
      color: tile.color,
      workspaceId: tile.workspaceId,
      isFavorite: tile.isFavorite,
      lastAccessedAt: tile.lastAccessedAt ?? undefined,
      createdAt: tile._creationTime,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteTarget({ type: 'tile', id: tile._id, name: tile.name });
    setDeleteConfirmOpen(true);
  };

  const handleKeyDown = (handler: (e: React.KeyboardEvent) => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handler(e);
    }
  };

  let hostname = '';
  try { hostname = new URL(tile.url).hostname; } catch { hostname = tile.url; }

  if (variant === 'list') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown(handleOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200 group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
          style={{ backgroundColor: tile.color + '18', color: tile.color }}
        >
          {tile.icon || tile.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{tile.name}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{hostname}</p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            role="button"
            tabIndex={0}
            onClick={handleFavorite}
            onKeyDown={handleKeyDown(handleFavorite)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label={tile.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-4 h-4" fill={tile.isFavorite ? '#f59e0b' : 'none'} viewBox="0 0 24 24" stroke={tile.isFavorite ? '#f59e0b' : 'currentColor'} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={handleEdit}
            onKeyDown={handleKeyDown(handleEdit)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label="Edit tile"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={handleDelete}
            onKeyDown={handleKeyDown(handleDelete)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Delete tile"
          >
            <svg className="w-4 h-4 text-zinc-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </span>
        </div>
        <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown(handleOpen)}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200 group relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1"
    >
      {tile.isFavorite && (
        <div className="absolute top-1.5 right-1.5">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
      )}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200"
        style={{ backgroundColor: tile.color + '18', color: tile.color }}
      >
        {tile.icon || tile.name.charAt(0).toUpperCase()}
      </div>
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[72px] text-center">
        {tile.name}
      </span>
    </div>
  );
}
