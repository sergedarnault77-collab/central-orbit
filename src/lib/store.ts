import { create } from 'zustand';
import type { TabId, ViewMode, Tile, Workspace } from './types';

interface AppState {
  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Workspace
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;

  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // WebView
  activeTile: Tile | null;
  setActiveTile: (tile: Tile | null) => void;

  // Add modal
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  addModalType: 'tile' | 'workspace';
  setAddModalType: (type: 'tile' | 'workspace') => void;

  // Edit modal
  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  editingTile: Tile | null;
  setEditingTile: (tile: Tile | null) => void;
  editingWorkspace: Workspace | null;
  setEditingWorkspace: (ws: Workspace | null) => void;

  // Delete confirmation
  isDeleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  deleteTarget: { type: 'tile' | 'workspace'; id: string; name: string } | null;
  setDeleteTarget: (target: { type: 'tile' | 'workspace'; id: string; name: string } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeWorkspaceId: null,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  activeTile: null,
  setActiveTile: (tile) => set({ activeTile: tile }),

  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  addModalType: 'tile',
  setAddModalType: (type) => set({ addModalType: type }),

  isEditModalOpen: false,
  setEditModalOpen: (open) => set({ isEditModalOpen: open }),
  editingTile: null,
  setEditingTile: (tile) => set({ editingTile: tile }),
  editingWorkspace: null,
  setEditingWorkspace: (ws) => set({ editingWorkspace: ws }),

  isDeleteConfirmOpen: false,
  setDeleteConfirmOpen: (open) => set({ isDeleteConfirmOpen: open }),
  deleteTarget: null,
  setDeleteTarget: (target) => set({ deleteTarget: target }),
}));
