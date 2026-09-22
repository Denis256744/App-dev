import React, { useState, useMemo } from 'react';
import { Trash2, RotateCcw, AlertTriangle, X, ShieldAlert, ArrowUpDown } from 'lucide-react';
import { Note, SortOption } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { EmptyState } from './EmptyState';
import { formatDate } from '../utils/date';
import { sortNotes } from '../utils/sort';

interface TrashViewProps {
  notes: Note[];
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  onRestore: (noteId: string) => void;
  onPermanentDelete: (noteId: string) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  notes,
  sortOption = 'newest',
  onSortChange,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [noteToDeletePermanently, setNoteToDeletePermanently] = useState<Note | null>(null);

  const rawDeletedNotes = useMemo(() => notes.filter((n) => n.is_deleted), [notes]);
  const deletedNotes = useMemo(() => {
    return sortNotes(rawDeletedNotes, sortOption);
  }, [rawDeletedNotes, sortOption]);

  return (
    <div id="trash-view" className="space-y-6">
      {/* Header with Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-rose-500" />
            <span>Trash</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {deletedNotes.length}
            </span>
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Deleted notes are stored here. You can restore them or permanently delete them.
          </p>
        </div>

        {rawDeletedNotes.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {onSortChange && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="trash-sort-select"
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1.5"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sort by:</span>
                </label>
                <select
                  id="trash-sort-select"
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 cursor-pointer transition-colors"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="updated">Recently updated</option>
                  <option value="title_asc">Title A–Z</option>
                  <option value="title_desc">Title Z–A</option>
                </select>
              </div>
            )}

            <button
              id="btn-empty-trash"
              type="button"
              onClick={() => setShowEmptyConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 dark:text-rose-300 font-medium text-sm border border-rose-200 dark:border-rose-900/60 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Empty Trash */}
      {showEmptyConfirm && (
        <div
          id="empty-trash-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Empty all notes in Trash?
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  This will permanently delete all {deletedNotes.length} note(s) currently in the trash. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                id="btn-cancel-empty-trash"
                type="button"
                onClick={() => setShowEmptyConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-empty-trash"
                type="button"
                onClick={() => {
                  onEmptyTrash();
                  setShowEmptyConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Permanently Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Single Permanent Delete */}
      {noteToDeletePermanently && (
        <div
          id="single-delete-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Delete Permanently?
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Are you sure you want to permanently delete "{noteToDeletePermanently.title}"? It cannot be recovered later.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                id="btn-cancel-single-delete"
                type="button"
                onClick={() => setNoteToDeletePermanently(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-single-delete"
                type="button"
                onClick={() => {
                  onPermanentDelete(noteToDeletePermanently.id);
                  setNoteToDeletePermanently(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deleted Notes List */}
      {deletedNotes.length === 0 ? (
        <EmptyState
          id="trash-empty-state"
          icon={Trash2}
          title="Trash is empty"
          description="Notes you delete from My Notes will appear here for safe keeping and restoration."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              id={`trash-item-${note.id}`}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <CategoryBadge category={note.category} />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    Deleted
                  </span>
                </div>

                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1.5">
                  {note.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {note.content || <span className="italic text-zinc-400">No content</span>}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span title="Date Deleted">
                  {formatDate(note.updated_at)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-restore-${note.id}`}
                    type="button"
                    onClick={() => onRestore(note.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title="Restore note to active list"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    id={`btn-permanent-delete-${note.id}`}
                    type="button"
                    onClick={() => setNoteToDeletePermanently(note)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    title="Delete permanently from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
