import React, { useState, useRef } from 'react';
import {
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { User, Note, ThemeMode } from '../types';
import { CATEGORIES } from '../services/storage';

interface SettingsViewProps {
  user: User;
  theme: ThemeMode;
  notes: Note[];
  onToggleTheme: (newTheme: ThemeMode) => void;
  onLogout: () => void;
  onResetSampleData: () => void;
  onImportNotes: (imported: Note[]) => void;
  onSwitchUser: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  theme,
  notes,
  onToggleTheme,
  onLogout,
  onResetSampleData,
  onImportNotes,
  onSwitchUser,
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeNotes = notes.filter((n) => !n.is_deleted);
  const pinnedNotes = notes.filter((n) => !n.is_deleted && n.is_pinned);
  const favoriteNotes = notes.filter((n) => !n.is_deleted && n.is_favorite);
  const trashNotes = notes.filter((n) => n.is_deleted);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 4000);
  };

  // Export Notes
  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `my_notes_backup_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      notifySuccess('Notes successfully exported as JSON.');
    } catch {
      notifyError('Failed to export notes.');
    }
  };

  // Import Notes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          notifyError('Invalid file format. Expected a JSON array of notes.');
          return;
        }

        // Validate basic note structure and ensure user_id is assigned to current user
        const sanitizedNotes: Note[] = parsed.map((item) => ({
          id: item.id || `note_import_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          user_id: user.id,
          title: String(item.title || 'Untitled Note'),
          content: String(item.content || ''),
          category: CATEGORIES.includes(item.category) ? item.category : 'Other',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
          is_pinned: Boolean(item.is_pinned),
          is_favorite: Boolean(item.is_favorite),
          is_deleted: Boolean(item.is_deleted),
        }));

        onImportNotes(sanitizedNotes);
        notifySuccess(`Successfully imported ${sanitizedNotes.length} note(s)!`);
      } catch {
        notifyError('Failed to parse JSON file. Please ensure it is valid.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="settings-view" className="space-y-8 max-w-4xl">
      <div className="pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your theme, account preferences, and coursework project options.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 text-sm text-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 text-sm text-rose-800 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Appearance / Dark Mode */}
      <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Appearance
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Switch between light and dark visual themes. Your preference is saved locally.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Light Mode Option */}
          <button
            id="btn-theme-light"
            type="button"
            onClick={() => onToggleTheme('light')}
            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div className={`p-2.5 rounded-lg ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Light Mode</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Clean, bright contrast</div>
            </div>
          </button>

          {/* Dark Mode Option */}
          <button
            id="btn-theme-dark"
            type="button"
            onClick={() => onToggleTheme('dark')}
            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-2 ring-indigo-500/30'
                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div className={`p-2.5 rounded-lg ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Dark Mode</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Gentle on the eyes at night</div>
            </div>
          </button>
        </div>
      </section>

      {/* 2. User Authentication Profile */}
      <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            User Account & Authentication
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Every note is isolated by <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">user_id</code>. Only you can view, edit, and manage your notes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {user.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {user.email} • ID: <span className="font-mono">{user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-switch-account"
              type="button"
              onClick={onSwitchUser}
              className="px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Switch User
            </button>
            <button
              id="btn-settings-logout"
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Coursework Project Evaluation Tools */}
      <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Coursework & Data Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Utilities for reviewing coursework features, testing reset states, and backing up data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Reset Sample Data */}
          <button
            id="btn-reset-sample-data"
            type="button"
            onClick={() => {
              onResetSampleData();
              notifySuccess('Sample coursework notes restored for this account.');
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Reset Sample Notes</span>
          </button>

          {/* Export JSON */}
          <button
            id="btn-export-notes"
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Notes (JSON)</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              id="btn-import-notes"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
            >
              <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Import Notes (JSON)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Notes Database Schema & Status */}
      <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Database Status & Schema
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live records breakdown stored for user <span className="font-mono">{user.id}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Active Notes</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{activeNotes.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Pinned</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{pinnedNotes.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Favorites</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{favoriteNotes.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">In Trash</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{trashNotes.length}</span>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-750 font-mono">
          Fields: id, user_id, title, content, category, created_at, updated_at, is_pinned, is_favorite, is_deleted
        </div>
      </section>
    </div>
  );
};
