import React from 'react';
import { Pin, Star, Trash2, Edit3, Eye } from 'lucide-react';
import { Note } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { formatDate } from '../utils/date';

interface NoteCardProps {
  note: Note;
  onOpen: (note: Note) => void;
  onEdit: (note: Note) => void;
  onTogglePin: (noteId: string, currentPin: boolean) => void;
  onToggleFavorite: (noteId: string, currentFav: boolean) => void;
  onDelete: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onOpen,
  onEdit,
  onTogglePin,
  onToggleFavorite,
  onDelete,
}) => {
  return (
    <div
      id={`note-card-${note.id}`}
      tabIndex={0}
      role="button"
      aria-label={`Note: ${note.title}. Click to view details.`}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        note.is_pinned
          ? 'bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-500/20'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
      onClick={() => onOpen(note)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(note);
        }
      }}
    >
      {/* Top bar: Category + Pin/Favorite status indicators */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <CategoryBadge category={note.category} />

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Favorite Toggle Button */}
          <button
            id={`btn-fav-${note.id}`}
            type="button"
            title={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => onToggleFavorite(note.id, note.is_favorite)}
            className={`p-1.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              note.is_favorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                note.is_favorite ? 'fill-amber-400 text-amber-500' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            />
          </button>

          {/* Pin Toggle Button */}
          <button
            id={`btn-pin-${note.id}`}
            type="button"
            title={note.is_pinned ? 'Unpin note' : 'Pin note to top'}
            aria-label={note.is_pinned ? 'Unpin note' : 'Pin note to top'}
            onClick={() => onTogglePin(note.id, note.is_pinned)}
            className={`p-1.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              note.is_pinned
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Pin
              className={`w-4 h-4 ${
                note.is_pinned
                  ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400 rotate-45'
                  : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Title & Preview */}
      <div className="flex-1 mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {note.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mt-1.5 whitespace-pre-line">
          {note.content || <span className="italic text-zinc-400 dark:text-zinc-500">No content</span>}
        </p>
      </div>

      {/* Card Footer: Date & Quick Actions */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span title={`Updated: ${formatDate(note.updated_at)}`}>
          {formatDate(note.updated_at)}
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            id={`btn-view-${note.id}`}
            type="button"
            title="View note"
            aria-label={`View note: ${note.title}`}
            onClick={() => onOpen(note)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            id={`btn-edit-${note.id}`}
            type="button"
            title="Edit note"
            aria-label={`Edit note: ${note.title}`}
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            id={`btn-delete-${note.id}`}
            type="button"
            title="Delete note (move to trash)"
            aria-label={`Delete note: ${note.title}`}
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
