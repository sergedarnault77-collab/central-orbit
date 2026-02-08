import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';
import { toast } from 'sonner';
import type { Id } from '../../convex/_generated/dataModel';

const TILE_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#0ea5e9', '#8b5cf6', '#f97316', '#171717'];
const TILE_ICONS = ['🌐', '⚡', '🔧', '📊', '💬', '📝', '🎨', '🚀', '📦', '🔒', '🎯', '💡'];
const WORKSPACE_ICONS = ['📂', '⚡', '🎨', '📊', '💬', '🚀', '🔧', '📦', '🎯', '💡', '🏠', '🔬'];

export function EditModal() {
  const { isEditModalOpen, setEditModalOpen, editingTile, setEditingTile, editingWorkspace, setEditingWorkspace } = useAppStore();
  const { data: session } = useSession();

  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];
  const updateTile = useMutation(api.mutations.updateTile);
  const updateWorkspace = useMutation(api.mutations.updateWorkspace);

  const isEditingTile = !!editingTile;
  const icons = isEditingTile ? TILE_ICONS : WORKSPACE_ICONS;

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState(TILE_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTile) {
      setName(editingTile.name);
      setUrl(editingTile.url);
      setSelectedColor(editingTile.color);
      setSelectedIcon(editingTile.icon || TILE_ICONS[0]);
      setSelectedWorkspace(editingTile.workspaceId);
    } else if (editingWorkspace) {
      setName(editingWorkspace.name);
      setSelectedColor(editingWorkspace.color);
      setSelectedIcon(editingWorkspace.icon);
    }
  }, [editingTile, editingWorkspace]);

  if (!isEditModalOpen) return null;

  const handleClose = () => {
    setEditModalOpen(false);
    setEditingTile(null);
    setEditingWorkspace(null);
    setName('');
    setUrl('');
    setSaving(false);
  };

  const handleSave = async () => {
    if (!session) {
      toast.error('Please sign in to save');
      return;
    }
    setSaving(true);
    try {
      if (editingTile && editingTile._id) {
        await updateTile({
          id: editingTile._id as Id<"tiles">,
          name: name.trim(),
          url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
          icon: selectedIcon,
          color: selectedColor,
          workspaceId: (selectedWorkspace || editingTile.workspaceId) as Id<"workspaces">,
        });
        toast.success('Tool updated!');
      } else if (editingWorkspace && editingWorkspace._id) {
        await updateWorkspace({
          id: editingWorkspace._id as Id<"workspaces">,
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        });
        toast.success('Workspace updated!');
      }
      handleClose();
    } catch (err) {
      toast.error('Failed to update. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl animate-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="px-5 pb-8 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {isEditingTile ? 'Edit Tool' : 'Edit Workspace'}
            </h2>
            <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors"
            />
          </div>

          {isEditingTile && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors"
              />
            </div>
          )}

          {isEditingTile && workspaces.length > 0 && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">Workspace</label>
              <select
                value={selectedWorkspace}
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
            disabled={!name.trim() || (isEditingTile && !url.trim()) || saving}
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
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
