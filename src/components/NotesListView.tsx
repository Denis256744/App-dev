import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Pin, Star, FileText, ArrowUpDown, Upload } from 'lucide-react';
import { Note, Category, SortOption } from '../types';
import { CATEGORIES } from '../services/storage';
import { NoteCard } from './NoteCard';
import { EmptyState } from './EmptyState';
import { sortNotes } from '../utils/sort';

export type NotesListMode = 'all' | 'favorites' | 'pinned';

interface NotesListViewProps {
  mode: NotesListMode;
  notes: Note[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onNewNote: () => void;
  onImportNote?: () => void;
  onOpenNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onTogglePin: (noteId: string, currentPin: boolean) => void;
  onToggleFavorite: (noteId: string, currentFav: boolean) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesListView: React.FC<NotesListViewProps> = ({
  mode,
  notes,
  sortOption,
  onSortChange,
  onNewNote,
  onImportNote,
  onOpenNote,
  onEditNote,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Filter out any deleted notes (strictly active)
  const activeNotes = useMemo(() => notes.filter((n) => !n.is_deleted), [notes]);

  // Mode filter (All vs Favorites vs Pinned)
  const modeFilteredNotes = useMemo(() => {
    if (mode === 'favorites') {
      return activeNotes.filter((n) => n.is_favorite);
    }
    if (mode === 'pinned') {
      return activeNotes.filter((n) => n.is_pinned);
    }
    return activeNotes;
  }, [activeNotes, mode]);

  // Combined Search & Category filter
  const filteredNotes = useMemo(() => {
    return modeFilteredNotes.filter((note) => {
      // Category match
      const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;

      // Search match (title and content)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [modeFilteredNotes, selectedCategory, searchQuery]);

  // Sorted notes list according to selected sorting option
  const sortedFilteredNotes = useMemo(() => {
    return sortNotes(filteredNotes, sortOption);
  }, [filteredNotes, sortOption]);

  // Category counts for quick badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: modeFilteredNotes.length };
    CATEGORIES.forEach((cat) => {
      counts[cat] = modeFilteredNotes.filter((n) => n.category === cat).length;
    });
    return counts;
  }, [modeFilteredNotes]);

  // In 'all' mode: separate pinned notes to top (each sorted by chosen sort option)
  const pinnedList = useMemo(() => {
    if (mode !== 'all') return [];
    return sortedFilteredNotes.filter((n) => n.is_pinned);
  }, [sortedFilteredNotes, mode]);

  const unpinnedList = useMemo(() => {
    if (mode !== 'all') return sortedFilteredNotes;
    return sortedFilteredNotes.filter((n) => !n.is_pinned);
  }, [sortedFilteredNotes, mode]);

  // Title and subtitle depending on mode
  const pageTitle = {
    all: 'My Notes',
    favorites: 'Favorites',
    pinned: 'Pinned Notes',
  }[mode];

  const pageDescription = {
    all: 'All your active coursework and personal notes in one place.',
    favorites: 'Starred notes for quick and convenient reference.',
    pinned: 'Notes kept pinned at the top for immediate access.',
  }[mode];

  return (
    <div id={`notes-list-view-${mode}`} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            {mode === 'favorites' && <Star className="w-6 h-6 fill-amber-400 text-amber-500" />}
            {mode === 'pinned' && <Pin className="w-6 h-6 fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400 rotate-45" />}
            {pageTitle}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {filteredNotes.length}
            </span>
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {pageDescription}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onImportNote && (
            <button
              id="btn-import-note"
              type="button"
              onClick={onImportNote}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 font-medium text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Import note from .txt file"
            >
              <Upload className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Import Note</span>
            </button>
          )}

          <button
            id="btn-notes-new"
            type="button"
            onClick={onNewNote}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Note</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Section with Sort by Dropdown */}
      <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        {/* Search Bar and Sort by Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="notes-search-input"
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-zinc-900 transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="notes-sort-select"
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sort by:</span>
            </label>
            <select
              id="notes-sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 cursor-pointer transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="title_asc">Title A–Z</option>
              <option value="title_desc">Title Z–A</option>
            </select>
          </div>
        </div>

        {/* Categories Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mr-1 shrink-0">
            Category:
          </span>
          <button
            id="btn-filter-category-all"
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              selectedCategory === 'All'
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs'
                : 'bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
            }`}
          >
            <span>All</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === 'All' ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500'}`}>
              {categoryCounts.All}
            </span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`btn-filter-category-${cat.toLowerCase()}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-600 dark:border-indigo-600 shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat ? 'bg-indigo-700 text-indigo-100 dark:bg-indigo-700' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500'}`}>
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2 shrink-0 ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          id="notes-empty-state"
          icon={searchQuery || selectedCategory !== 'All' ? Search : mode === 'favorites' ? Star : mode === 'pinned' ? Pin : FileText}
          title={
            searchQuery || selectedCategory !== 'All'
              ? 'No matching notes found'
              : mode === 'favorites'
              ? 'No favorite notes yet'
              : mode === 'pinned'
              ? 'No pinned notes yet'
              : 'No notes yet'
          }
          description={
            searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search query or choosing another category filter.'
              : mode === 'favorites'
              ? 'Click the star icon on any note to mark it as a favorite for fast reference.'
              : mode === 'pinned'
              ? 'Click the pin icon on any note to keep it pinned at the top.'
              : 'Create your first note to start organizing your coursework and ideas.'
          }
          action={
            searchQuery || selectedCategory !== 'All'
              ? {
                  id: 'btn-clear-filters-empty',
                  label: 'Clear filters',
                  onClick: () => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  },
                }
              : {
                  id: 'btn-create-note-empty',
                  label: '+ Create Note',
                  icon: Plus,
                  onClick: onNewNote,
                }
          }
        />
      ) : mode === 'all' && pinnedList.length > 0 ? (
        <div className="space-y-8">
          {/* Pinned Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              <Pin className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400 rotate-45" />
              <span>Pinned Notes ({pinnedList.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedList.map((note) => (
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
          </div>

          {/* Other Notes Section */}
          {unpinnedList.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Other Notes ({unpinnedList.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedList.map((note) => (
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
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFilteredNotes.map((note) => (
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
      )}
    </div>
  );
};
