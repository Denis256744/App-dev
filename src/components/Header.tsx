import React from 'react';
import { Menu, Plus, Sun, Moon } from 'lucide-react';
import { NavItem, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: NavItem;
  theme: ThemeMode;
  onOpenMobileMenu: () => void;
  onNewNote: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  theme,
  onOpenMobileMenu,
  onNewNote,
  onToggleTheme,
}) => {
  const titles: Record<NavItem, string> = {
    dashboard: 'Dashboard',
    notes: 'My Notes',
    favorites: 'Favorites',
    pinned: 'Pinned Notes',
    trash: 'Trash',
    settings: 'Settings',
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <button
          id="btn-open-sidebar-mobile"
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
          {titles[activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick theme toggle */}
        <button
          id="btn-header-theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Quick + New Note button on Header */}
        <button
          id="btn-header-new-note"
          type="button"
          onClick={onNewNote}
          aria-label="Create new note"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Note</span>
        </button>
      </div>
    </header>
  );
};
