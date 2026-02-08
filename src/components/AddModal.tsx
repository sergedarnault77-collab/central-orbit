import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import { toast } from 'sonner';
import { useSubscriptionGate } from '../lib/subscription';

const TILE_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#0ea5e9', '#8b5cf6', '#f97316', '#171717'];
const TILE_ICONS = ['🌐', '⚡', '🔧', '📊', '💬', '📝', '🎨', '🚀', '📦', '🔒', '🎯', '💡'];
const WORKSPACE_ICONS = ['📂', '⚡', '🎨', '📊', '💬', '🚀', '🔧', '📦', '🎯', '💡', '🏠', '🔬'];

export function AddModal() {
  const { isAddModalOpen, setAddModalOpen, addModalType, setAddModalType, activeWorkspaceId } = useAppStore();
  const { data: session } = useSession();

  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];
  const allTiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];
  const createTile = useMutation(api.mutations.createTile);
  const createWorkspace = useMutation(api.mutations.createWorkspace);
  const { checkWorkspaceLimit, checkTileLimit } = useSubscriptionGate();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState(TILE_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(TILE_ICONS[0]);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    setAddModalOpen(false);
    setName('');
    setUrl('');
    setSelectedColor(TILE_COLORS[0]);
    setSelectedIcon(TILE_ICONS[0]);
    setSelectedWorkspace('');
    setSaving(false);
  };

  const handleSave = async () => {
    if (!session) {
      toast.error('Please sign in to save');
      return;
    }

    // Check subscription limits before saving
    if (isTile) {
      const wsId = selectedWorkspace || activeWorkspaceId || workspaces[0]?._id;
      const wsTileCount = wsId ? allTiles.filter(t => t.workspaceId === wsId).length : 0;
      if (!checkTileLimit(allTiles.length, wsTileCount)) {
        handleClose();
        return;
      }
    } else {
      if (!checkWorkspaceLimit(workspaces.length)) {
        handleClose();
        return;
      }
    }

    setSaving(true);
    try {
      if (isTile) {
        const wsId = selectedWorkspace || activeWorkspaceId || workspaces[0]?._id;
        if (!wsId) {
          toast.error('Please create a workspace first');
          setSaving(false);
          return;
        }
        await createTile({
          name: name.trim(),
          url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
          icon: selectedIcon,
          color: selectedColor,
          workspaceId: wsId as any,
          isFavorite: false,
        });
        toast.success('Tool added!');
      } else {
        await createWorkspace({
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        });
        toast.success('Workspace created!');
      }
      handleClose();
    } catch (err) {
      toast.error('Failed to save. Please try again.');
      setSaving(false);
    }
  };

  const isTile = addModalType === 'tile';
  const icons = isTile ? TILE_ICONS : WORKSPACE_ICONS;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl animate-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="px-5 pb-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {isTile ? 'Add Tool' : 'New Workspace'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() => { setAddModalType('tile'); setSelectedIcon(TILE_ICONS[0]); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isTile
                  ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              🔧 Tool
            </button>
            <button
              onClick={() => { setAddModalType('workspace'); setSelectedIcon(WORKSPACE_ICONS[0]); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isTile
                  ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              📂 Workspace
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isTile ? 'e.g. GitHub Dashboard' : 'e.g. Development'}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors"
            />
          </div>

          {isTile && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors"
              />
            </div>
          )}

          {isTile && workspaces.length > 0 && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Workspace</label>
              <select
                value={selectedWorkspace || activeWorkspaceId || workspaces[0]?._id || ''}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors"
              >
                {workspaces.map((ws) => (
                  <option key={ws._id} value={ws._id}>
                    {ws.icon} {ws.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                    selectedIcon === icon
                      ? 'bg-indigo-100 dark:bg-indigo-500/20 ring-2 ring-indigo-500 scale-110'
                      : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {TILE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!name.trim() || (isTile && !url.trim()) || saving}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : isTile ? 'Add Tool' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </div>
  );
}
