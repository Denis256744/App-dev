import React from 'react';
import { Plus, FileText, ArrowRight, Clock } from 'lucide-react';
import { Note, NavItem } from '../types';
import { NoteCard } from './NoteCard';
import { EmptyState } from './EmptyState';

interface DashboardViewProps {
  userName?: string;
  notes: Note[];
  onNavigate: (item: NavItem) => void;
  onNewNote: () => void;
  onOpenNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onTogglePin: (noteId: string, currentPin: boolean) => void;
  onToggleFavorite: (noteId: string, currentFav: boolean) => void;
  onDeleteNote: (noteId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  onNavigate,
  onNewNote,
  onOpenNote,
  onEditNote,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
}) => {
  const activeNotes = notes.filter((n) => !n.is_deleted);

  // Recent notes sorted by updated_at descending (active only)
  const recentNotes = [...activeNotes]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Header Bar of Recent Notes: Clean, attractive, easy to scan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              Recent Notes
              {activeNotes.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {Math.min(recentNotes.length, 6)} of {activeNotes.length}
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeNotes.length > 0 && (
            <button
              id="btn-view-all-notes"
              type="button"
              onClick={() => onNavigate('notes')}
              className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline"
            >
              <span>View all notes</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          )}

          <button
            id="btn-dashboard-new-note"
            type="button"
            onClick={onNewNote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Note</span>
          </button>
        </div>
      </div>

      {recentNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpen={onOpenNote}
              onEdit={onEditNote}
              onTogglePin={onTogglePin}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          id="dashboard-empty-state"
          icon={FileText}
          title="No notes created yet"
          description="Create your first note to start organizing your coursework, study points, and ideas."
          action={{
            label: '+ Create your first note',
            icon: Plus,
            onClick: onNewNote,
            id: 'btn-empty-dashboard-new-note',
          }}
        />
      )}
    </div>
  );
};

