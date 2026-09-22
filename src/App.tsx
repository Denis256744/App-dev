import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Note, NavItem, ThemeMode, Category, SortOption } from './types';
import {
  initializeStorage,
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getUserNotes,
  createNote,
  createMultipleNotes,
  updateNote,
  softDeleteNote,
  restoreNote,
  permanentlyDeleteNote,
  emptyUserTrash,
  resetToSampleData,
  getSavedTheme,
  setSavedTheme,
  getAllStoredNotes,
  saveAllNotes,
} from './services/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NotesListView } from './components/NotesListView';
import { TrashView } from './components/TrashView';
import { SettingsView } from './components/SettingsView';
import { NoteModal, NoteModalMode } from './components/NoteModal';
import { AuthModal } from './components/AuthModal';
import { ImportNoteModal, ImportParsedItem } from './components/ImportNoteModal';
import { parseTxtFiles } from './utils/importHelper';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [theme, setThemeState] = useState<ThemeMode>(() => getSavedTheme());
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Sorting state for notes
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    try {
      const saved = localStorage.getItem('mynotes_sort_preference');
      if (saved && ['newest', 'oldest', 'updated', 'title_asc', 'title_desc'].includes(saved)) {
        return saved as SortOption;
      }
    } catch {
      // Fallback
    }
    return 'newest';
  });

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    try {
      localStorage.setItem('mynotes_sort_preference', newSort);
    } catch {
      // Fallback
    }
  };

  // Note Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<NoteModalMode>('create');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Import Note state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importItems, setImportItems] = useState<ImportParsedItem[]>([]);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerImportFiles = () => {
    if (importFileInputRef.current) {
      importFileInputRef.current.value = '';
      importFileInputRef.current.click();
    }
  };

  const handleFilesChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const parsed = await parseTxtFiles(files);
    setImportItems(parsed);
    setIsImportModalOpen(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesChosen(e.target.files);
    }
    e.target.value = '';
  };

  const handlePerformImport = (
    itemsToImport: Array<{
      title: string;
      content: string;
      category: Category;
      is_pinned: boolean;
      is_favorite: boolean;
    }>
  ) => {
    if (!currentUser || itemsToImport.length === 0) return;

    createMultipleNotes(currentUser.id, itemsToImport);
    reloadNotes(currentUser.id);
    setIsImportModalOpen(false);
    setImportItems([]);
    setActiveTab('notes');
  };

  // Initialize storage, theme, and user on app boot
  useEffect(() => {
    initializeStorage();
    const initialTheme = getSavedTheme();
    setSavedTheme(initialTheme);

    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      setNotes(getUserNotes(user.id));
    }
  }, []);

  // Ensure DOM class and storage are synchronized whenever theme changes
  useEffect(() => {
    setSavedTheme(theme);
  }, [theme]);

  // Reload user's notes whenever currentUser changes
  const reloadNotes = useCallback((userId: string) => {
    setNotes(getUserNotes(userId));
  }, []);

  // Theme toggle
  const handleToggleTheme = (newTheme?: ThemeMode) => {
    setThemeState((prev) => {
      const next = newTheme || (prev === 'light' ? 'dark' : 'light');
      setSavedTheme(next);
      return next;
    });
  };

  // Auth actions
  const handleAuthSuccess = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    reloadNotes(user.id);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setNotes([]);
    setActiveTab('dashboard');
  };

  const handleSwitchUser = () => {
    handleLogout();
  };

  // Modal actions
  const handleOpenCreateModal = () => {
    setSelectedNote(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (note: Note) => {
    setSelectedNote(note);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setSelectedNote(note);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  // Save Note (handles both Create and Edit)
  const handleSaveNote = (data: {
    id?: string;
    title: string;
    content: string;
    category: Category;
    is_pinned: boolean;
    is_favorite: boolean;
  }) => {
    if (!currentUser) return;

    if (data.id) {
      // Edit existing note
      const updated = updateNote(currentUser.id, data.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        is_pinned: data.is_pinned,
        is_favorite: data.is_favorite,
      });

      if (updated) {
        reloadNotes(currentUser.id);
        setSelectedNote(updated);
        // Switch back to view mode or close
        setModalMode('view');
      }
    } else {
      // Create new note
      const created = createNote(currentUser.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        is_pinned: data.is_pinned,
        is_favorite: data.is_favorite,
      });

      reloadNotes(currentUser.id);
      setSelectedNote(created);
      // Show newly created note or return to notes list
      setModalMode('view');
    }
  };

  // Quick Pin Toggle
  const handleTogglePin = (noteId: string, currentPin: boolean) => {
    if (!currentUser) return;
    updateNote(currentUser.id, noteId, { is_pinned: !currentPin });
    reloadNotes(currentUser.id);
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote((prev) => (prev ? { ...prev, is_pinned: !currentPin } : null));
    }
  };

  // Quick Favorite Toggle
  const handleToggleFavorite = (noteId: string, currentFav: boolean) => {
    if (!currentUser) return;
    updateNote(currentUser.id, noteId, { is_favorite: !currentFav });
    reloadNotes(currentUser.id);
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote((prev) => (prev ? { ...prev, is_favorite: !currentFav } : null));
    }
  };

  // Soft Delete (move to Trash)
  const handleDeleteNote = (noteId: string) => {
    if (!currentUser) return;
    softDeleteNote(currentUser.id, noteId);
    reloadNotes(currentUser.id);
  };

  // Restore Note from Trash
  const handleRestoreNote = (noteId: string) => {
    if (!currentUser) return;
    restoreNote(currentUser.id, noteId);
    reloadNotes(currentUser.id);
  };

  // Permanently Delete Note
  const handlePermanentDelete = (noteId: string) => {
    if (!currentUser) return;
    permanentlyDeleteNote(currentUser.id, noteId);
    reloadNotes(currentUser.id);
  };

  // Empty Trash
  const handleEmptyTrash = () => {
    if (!currentUser) return;
    emptyUserTrash(currentUser.id);
    reloadNotes(currentUser.id);
  };

  // Reset sample data for coursework testing
  const handleResetSampleData = () => {
    if (!currentUser) return;
    resetToSampleData(currentUser.id);
    reloadNotes(currentUser.id);
  };

  // Import notes
  const handleImportNotes = (importedNotes: Note[]) => {
    if (!currentUser) return;
    const allNotes = getAllStoredNotes();
    const otherUsersNotes = allNotes.filter((n) => n.user_id !== currentUser.id);
    saveAllNotes([...importedNotes, ...otherUsersNotes]);
    reloadNotes(currentUser.id);
  };

  // If not logged in, show Auth View
  if (!currentUser) {
    return (
      <AuthModal
        onSuccess={handleAuthSuccess}
        theme={theme}
        onToggleTheme={() => handleToggleTheme()}
      />
    );
  }

  return (
    <div id="app-root" className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        notes={notes}
        user={currentUser}
        theme={theme}
        isOpenMobile={isMobileNavOpen}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsMobileNavOpen(false);
        }}
        onNewNote={handleOpenCreateModal}
        onToggleTheme={() => handleToggleTheme()}
        onLogout={handleLogout}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          theme={theme}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onNewNote={handleOpenCreateModal}
          onToggleTheme={() => handleToggleTheme()}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              userName={currentUser.name}
              notes={notes}
              onNavigate={setActiveTab}
              onNewNote={handleOpenCreateModal}
              onOpenNote={handleOpenViewModal}
              onEditNote={handleOpenEditModal}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'notes' && (
            <NotesListView
              mode="all"
              notes={notes}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onNewNote={handleOpenCreateModal}
              onImportNote={handleTriggerImportFiles}
              onOpenNote={handleOpenViewModal}
              onEditNote={handleOpenEditModal}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'favorites' && (
            <NotesListView
              mode="favorites"
              notes={notes}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onNewNote={handleOpenCreateModal}
              onImportNote={handleTriggerImportFiles}
              onOpenNote={handleOpenViewModal}
              onEditNote={handleOpenEditModal}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'pinned' && (
            <NotesListView
              mode="pinned"
              notes={notes}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onNewNote={handleOpenCreateModal}
              onImportNote={handleTriggerImportFiles}
              onOpenNote={handleOpenViewModal}
              onEditNote={handleOpenEditModal}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'trash' && (
            <TrashView
              notes={notes}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onRestore={handleRestoreNote}
              onPermanentDelete={handlePermanentDelete}
              onEmptyTrash={handleEmptyTrash}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              user={currentUser}
              theme={theme}
              notes={notes}
              onToggleTheme={(t) => handleToggleTheme(t)}
              onLogout={handleLogout}
              onResetSampleData={handleResetSampleData}
              onImportNotes={handleImportNotes}
              onSwitchUser={handleSwitchUser}
            />
          )}
        </main>
      </div>

      {/* Hidden file input for native file selection */}
      <input
        ref={importFileInputRef}
        type="file"
        accept=".txt,text/plain"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Import Note Preview & Configuration Modal */}
      <ImportNoteModal
        isOpen={isImportModalOpen}
        initialItems={importItems}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportItems([]);
        }}
        onImport={handlePerformImport}
        onSelectMoreFiles={(files) => handleFilesChosen(files)}
      />

      {/* Note Modal (Create / View / Edit) */}
      <NoteModal
        isOpen={isModalOpen}
        mode={modalMode}
        note={selectedNote}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        onSwitchToEdit={() => setModalMode('edit')}
      />
    </div>
  );
}

