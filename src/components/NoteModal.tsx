import React, { useState, useEffect } from 'react';
import { X, Pin, Star, Trash2, Edit3, ArrowLeft, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import { Note, Category } from '../types';
import { CATEGORIES } from '../services/storage';
import { CategoryBadge } from './CategoryBadge';
import { formatDate } from '../utils/date';

export type NoteModalMode = 'create' | 'view' | 'edit';

interface NoteModalProps {
  isOpen: boolean;
  mode: NoteModalMode;
  note: Note | null;
  defaultCategory?: Category;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    content: string;
    category: Category;
    is_pinned: boolean;
    is_favorite: boolean;
  }) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string, currentPin: boolean) => void;
  onToggleFavorite: (noteId: string, currentFav: boolean) => void;
  onSwitchToEdit: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  mode,
  note,
  defaultCategory = 'School',
  onClose,
  onSave,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onSwitchToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or note changes
  useEffect(() => {
    if (!isOpen) {
      setError('');
      return;
    }

    if (mode === 'create') {
      setTitle('');
      setContent('');
      setCategory(defaultCategory);
      setIsPinned(false);
      setIsFavorite(false);
      setError('');
    } else if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setIsPinned(note.is_pinned);
      setIsFavorite(note.is_favorite);
      setError('');
    }
  }, [isOpen, mode, note, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required to save this note.');
      return;
    }

    setError('');
    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim(),
      category,
      is_pinned: isPinned,
      is_favorite: isFavorite,
    });
  };

  return (
    <div
      id="note-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="note-modal-content"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {mode === 'view' && (
              <button
                id="btn-modal-back"
                type="button"
                onClick={onClose}
                aria-label="Back to notes list"
                className="p-1.5 -ml-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                title="Back to list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {mode === 'create' && 'New Note'}
              {mode === 'edit' && 'Edit Note'}
              {mode === 'view' && 'View Note'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'view' && note && (
              <>
                <button
                  id="btn-modal-toggle-fav"
                  type="button"
                  onClick={() => onToggleFavorite(note.id, note.is_favorite)}
                  title={note.is_favorite ? 'Remove Favorite' : 'Mark as Favorite'}
                  aria-label={note.is_favorite ? 'Remove from favorites' : 'Mark as favorite'}
                  className={`p-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    note.is_favorite
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  <span className="text-xs font-medium hidden sm:inline">
                    {note.is_favorite ? 'Favorite' : 'Add to Favorites'}
                  </span>
                </button>

                <button
                  id="btn-modal-toggle-pin"
                  type="button"
                  onClick={() => onTogglePin(note.id, note.is_pinned)}
                  title={note.is_pinned ? 'Unpin note' : 'Pin to top'}
                  aria-label={note.is_pinned ? 'Unpin note' : 'Pin note to top'}
                  className={`p-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    note.is_pinned
                      ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Pin className={`w-4 h-4 ${note.is_pinned ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-300 rotate-45' : ''}`} />
                  <span className="text-xs font-medium hidden sm:inline">
                    {note.is_pinned ? 'Pinned' : 'Pin Note'}
                  </span>
                </button>

                <button
                  id="btn-modal-edit"
                  type="button"
                  onClick={onSwitchToEdit}
                  className="px-3 py-1.5 rounded-xl text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  id="btn-modal-delete"
                  type="button"
                  onClick={() => {
                    onDelete(note.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  title="Move to Trash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}

            <button
              id="btn-modal-close"
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'view' && note ? (
            <div className="space-y-6">
              {/* Meta information row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category:</span>
                  <CategoryBadge category={note.category} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5" title="Date Created">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Created: {formatDate(note.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Date Last Updated">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Updated: {formatDate(note.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {note.title}
                </h1>
              </div>

              {/* Content */}
              <div className="min-h-[140px] text-zinc-700 dark:text-zinc-200 leading-relaxed text-base whitespace-pre-wrap">
                {note.content || (
                  <p className="italic text-zinc-400 dark:text-zinc-500">This note has no written content.</p>
                )}
              </div>
            </div>
          ) : (
            /* Create / Edit Form */
            <form id="note-editor-form" onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title Field */}
              <div>
                <label htmlFor="note-title-input" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="note-title-input"
                  type="text"
                  required
                  placeholder="e.g. CS201 Assignment Outline..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors shadow-xs"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      id={`btn-select-category-${cat.toLowerCase()}`}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        category === cat
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {category === cat && <Check className="w-3.5 h-3.5" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="note-content-input" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Content
                </label>
                <textarea
                  id="note-content-input"
                  rows={6}
                  placeholder="Write your note, study bullet points, or thoughts here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[160px] px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 leading-relaxed transition-colors shadow-xs resize-y"
                />
              </div>

              {/* Options: Pin & Favorite */}
              <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-zinc-100 dark:border-zinc-800">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">
                  <input
                    id="checkbox-pin-note"
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-zinc-300 dark:border-zinc-700 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Pin className={`w-4 h-4 ${isPinned ? 'text-indigo-600 dark:text-indigo-400 fill-indigo-600 rotate-45' : 'text-zinc-400'}`} />
                    Pin note to top
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">
                  <input
                    id="checkbox-favorite-note"
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-zinc-300 dark:border-zinc-700 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-zinc-400'}`} />
                    Mark as favorite
                  </span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  id="btn-cancel-note"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-note"
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}
        </div>

        {/* View Mode Footer with Close/Back */}
        {mode === 'view' && (
          <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Press Escape or click outside to close
            </span>
            <button
              id="btn-modal-back-footer"
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Back to Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
