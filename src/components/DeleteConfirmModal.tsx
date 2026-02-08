import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import type { Id } from '../../convex/_generated/dataModel';

export function DeleteConfirmModal() {
  const { isDeleteConfirmOpen, setDeleteConfirmOpen, deleteTarget, setDeleteTarget } = useAppStore();
  const deleteTile = useMutation(api.mutations.deleteTile);
  const deleteWorkspace = useMutation(api.mutations.deleteWorkspace);
  const [deleting, setDeleting] = useState(false);

  if (!isDeleteConfirmOpen || !deleteTarget) return null;

  const handleClose = () => {
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setDeleting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.type === 'tile') {
        await deleteTile({ id: deleteTarget.id as Id<"tiles"> });
        toast.success('Tool deleted');
      } else {
        await deleteWorkspace({ id: deleteTarget.id as Id<"workspaces"> });
        toast.success('Workspace deleted');
      }
      handleClose();
    } catch (err) {
      toast.error('Failed to delete. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Delete {deleteTarget.type === 'tile' ? 'Tool' : 'Workspace'}?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              This will permanently delete <span className="font-medium text-zinc-700 dark:text-zinc-300">{deleteTarget.name}</span>.
              {deleteTarget.type === 'workspace' && ' All tools inside will also be deleted.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </span>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
