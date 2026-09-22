export type Category = 'School' | 'Personal' | 'Work' | 'Ideas' | 'Other';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: Category;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_favorite: boolean;
  is_deleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at: string;
}

export type NavItem = 'dashboard' | 'notes' | 'favorites' | 'pinned' | 'trash' | 'settings';

export type ThemeMode = 'light' | 'dark';

export type SortOption = 'newest' | 'oldest' | 'updated' | 'title_asc' | 'title_desc';
