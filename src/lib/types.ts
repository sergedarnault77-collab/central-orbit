// Core data types for Central Orbit
import type { Id, Doc } from '../../convex/_generated/dataModel';

// Convex document types
export type ConvexWorkspace = Doc<"workspaces">;
export type ConvexTile = Doc<"tiles">;

// Legacy types for compatibility during transition
export interface Tile {
  id: string;
  _id?: Id<"tiles">;
  name: string;
  url: string;
  icon?: string;
  color: string;
  workspaceId: string;
  isFavorite: boolean;
  lastAccessedAt?: number;
  createdAt: number;
}

export interface Workspace {
  id: string;
  _id?: Id<"workspaces">;
  name: string;
  icon: string;
  color: string;
  tileCount: number;
  createdAt: number;
}

export interface RecentItem {
  tileId: string;
  tileName: string;
  tileUrl: string;
  tileColor: string;
  tileIcon?: string;
  workspaceName: string;
  accessedAt: number;
}

export type ViewMode = 'grid' | 'list';
export type TabId = 'home' | 'workspaces' | 'search' | 'recents' | 'settings';
