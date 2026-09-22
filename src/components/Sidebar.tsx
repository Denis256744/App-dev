import React from 'react';
import {
  Home,
  FileText,
  Star,
  Pin,
  Trash2,
  Settings,
  Plus,
  BookOpen,
  LogOut,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { NavItem, User, ThemeMode, Note } from '../types';

interface SidebarProps {
  activeTab: NavItem;
  notes: Note[];
  user: User;
  theme: ThemeMode;
  isOpenMobile: boolean;
  onNavigate: (tab: NavItem) => void;
  onNewNote: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  notes,
  user,
  theme,
  isOpenMobile,
  onNavigate,
  onNewNote,
  onToggleTheme,
  onLogout,
  onCloseMobile,
}) => {
  const activeNotes = notes.filter((n) => !n.is_deleted);
  const favoriteNotes = activeNotes.filter((n) => n.is_favorite);
  const pinnedNotes = activeNotes.filter((n) => n.is_pinned);
  const trashNotes = notes.filter((n) => n.is_deleted);

  const navItems: { id: NavItem; label: string; icon: React.ReactNode; count?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'notes',
      label: 'My Notes',
      icon: <FileText className="w-4 h-4" />,
      count: activeNotes.length,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="w-4 h-4" />,
      count: favoriteNotes.length,
      badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      id: 'pinned',
      label: 'Pinned',
      icon: <Pin className="w-4 h-4 rotate-45" />,
      count: pinnedNotes.length,
      badgeColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: <Trash2 className="w-4 h-4" />,
      count: trashNotes.length,
      badgeColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between px-2 py-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-50 tracking-tight block">
                  My Notes
                </span>
                <span className="text-[10px] text-zinc-400 font-medium block -mt-0.5">
                  Coursework Edition
                </span>
              </div>
            </div>

            <button
              id="btn-close-sidebar-mobile"
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prominent "+ New Note" Button */}
          <div className="mb-6 px-1">
            <button
              id="btn-sidebar-new-note"
              type="button"
              onClick={() => {
                onNewNote();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ New Note</span>
            </button>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1 px-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold border border-indigo-100/80 dark:border-indigo-900/60 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {typeof item.count === 'number' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-indigo-200/70 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : item.badgeColor || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Theme Toggle & User Info */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {/* Quick Theme Switcher */}
          <button
            id="btn-sidebar-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold uppercase">Toggle</span>
          </button>

          {/* User profile capsule with Logout */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                  {user.name}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate block">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              id="btn-sidebar-logout"
              type="button"
              onClick={onLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
