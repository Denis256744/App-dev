import { Note, User, Category } from '../types';

const NOTES_STORAGE_KEY = 'mynotes_database_v1';
const USERS_STORAGE_KEY = 'mynotes_users_v1';
const CURRENT_USER_KEY = 'mynotes_active_user_v1';
const THEME_STORAGE_KEY = 'mynotes_theme_preference_v1';

export const CATEGORIES: Category[] = ['School', 'Personal', 'Work', 'Ideas', 'Other'];

export const INITIAL_USER: User = {
  id: 'usr_student_alex',
  name: 'Alex Johnson',
  email: 'alex@student.edu',
  password: 'password123',
  created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
};

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    user_id: 'usr_student_alex',
    title: 'Final Year Coursework: Mobile & Web Architecture',
    content: 'Review the project rubric carefully.\n- Clean and modular component structure\n- Persistent data storage\n- Search and category filters\n- Responsive layout with dark mode toggle\n- Strict data isolation per user account.',
    category: 'School',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    is_pinned: true,
    is_favorite: true,
    is_deleted: false,
  },
  {
    id: 'note_2',
    user_id: 'usr_student_alex',
    title: 'Machine Learning Study Guide - Week 4',
    content: 'Key concepts to remember for the upcoming quiz:\n1. Supervised vs Unsupervised learning principles\n2. Cost function minimization and Gradient Descent\n3. Overfitting mitigation: Regularization and Cross-validation.',
    category: 'School',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    is_pinned: true,
    is_favorite: false,
    is_deleted: false,
  },
  {
    id: 'note_3',
    user_id: 'usr_student_alex',
    title: 'Weekend Grocery & Meal Prep List',
    content: '- Rolled oats & almond milk\n- Fresh blueberries and bananas\n- Olive oil and sea salt\n- Chicken breast and fresh broccoli\n- Earl grey tea and sourdough bread',
    category: 'Personal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    is_pinned: false,
    is_favorite: true,
    is_deleted: false,
  },
  {
    id: 'note_4',
    user_id: 'usr_student_alex',
    title: 'Internship Standup Notes & Tickets',
    content: 'Items for Thursday standup:\n- Fixed CSS responsive breakpoint bug on tablet viewports\n- Refactored user profile validation logic\n- Need backend team review on the notes sync endpoint schema.',
    category: 'Work',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    is_pinned: false,
    is_favorite: false,
    is_deleted: false,
  },
  {
    id: 'note_5',
    user_id: 'usr_student_alex',
    title: 'Startup Pitch: Micro-Journaling for Students',
    content: 'Concept: A 60-second evening reflection app that helps students track mental clarity and academic milestones without cognitive overload. Minimalist UI, distraction-free aesthetic.',
    category: 'Ideas',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    is_pinned: false,
    is_favorite: true,
    is_deleted: false,
  },
  {
    id: 'note_6',
    user_id: 'usr_student_alex',
    title: 'Old Draft: Unused Semester Topic Ideas',
    content: 'Discarded research paper draft on historical computing models. Moved to trash to keep workspace clean.',
    category: 'Other',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    is_pinned: false,
    is_favorite: false,
    is_deleted: true,
  },
];

// Initialize storage if empty
export function initializeStorage(): void {
  try {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([INITIAL_USER]));
    }
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem(NOTES_STORAGE_KEY)) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
    }
  } catch (err) {
    console.error('Storage initialization failed:', err);
  }
}

// User Auth Management
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [INITIAL_USER];
  } catch {
    return [INITIAL_USER];
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to set current user:', err);
  }
}

export function registerUser(name: string, email: string, password: string): { user?: User; error?: string } {
  try {
    const users = getUsers();
    const existing = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(newUser);
    return { user: newUser };
  } catch (err) {
    return { error: 'Failed to create user account. Please check browser storage.' };
  }
}

export function loginUser(email: string, password: string): { user?: User; error?: string } {
  try {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      return { error: 'Invalid email or password. Please try again.' };
    }

    setCurrentUser(user);
    return { user };
  } catch {
    return { error: 'Login failed due to storage error.' };
  }
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Notes CRUD Operations (strictly partitioned by user_id)
export function getAllStoredNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAllNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
}

export function getUserNotes(userId: string): Note[] {
  const allNotes = getAllStoredNotes();
  return allNotes.filter((note) => note.user_id === userId);
}

export function createNote(
  userId: string,
  data: {
    title: string;
    content: string;
    category: Category;
    is_pinned?: boolean;
    is_favorite?: boolean;
  }
): Note {
  const allNotes = getAllStoredNotes();
  const now = new Date().toISOString();

  const newNote: Note = {
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    title: data.title.trim(),
    content: data.content || '',
    category: data.category,
    created_at: now,
    updated_at: now,
    is_pinned: Boolean(data.is_pinned),
    is_favorite: Boolean(data.is_favorite),
    is_deleted: false,
  };

  allNotes.unshift(newNote);
  saveAllNotes(allNotes);
  return newNote;
}

export function createMultipleNotes(
  userId: string,
  notesData: Array<{
    title: string;
    content: string;
    category: Category;
    is_pinned?: boolean;
    is_favorite?: boolean;
  }>
): Note[] {
  const allNotes = getAllStoredNotes();
  const now = new Date().toISOString();
  const newNotes: Note[] = [];

  for (let i = 0; i < notesData.length; i++) {
    const data = notesData[i];
    const newNote: Note = {
      id: `note_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      title: data.title.trim() || 'Untitled Note',
      content: data.content || '',
      category: data.category,
      created_at: now,
      updated_at: now,
      is_pinned: Boolean(data.is_pinned),
      is_favorite: Boolean(data.is_favorite),
      is_deleted: false,
    };
    newNotes.push(newNote);
  }

  allNotes.unshift(...newNotes);
  saveAllNotes(allNotes);
  return newNotes;
}

export function updateNote(
  userId: string,
  noteId: string,
  updates: Partial<Pick<Note, 'title' | 'content' | 'category' | 'is_pinned' | 'is_favorite'>>
): Note | null {
  const allNotes = getAllStoredNotes();
  const index = allNotes.findIndex((n) => n.id === noteId && n.user_id === userId);

  if (index === -1) return null;

  const existing = allNotes[index];
  const updatedNote: Note = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  allNotes[index] = updatedNote;
  saveAllNotes(allNotes);
  return updatedNote;
}

export function softDeleteNote(userId: string, noteId: string): boolean {
  const allNotes = getAllStoredNotes();
  const index = allNotes.findIndex((n) => n.id === noteId && n.user_id === userId);

  if (index === -1) return false;

  allNotes[index].is_deleted = true;
  allNotes[index].updated_at = new Date().toISOString();
  saveAllNotes(allNotes);
  return true;
}

export function restoreNote(userId: string, noteId: string): boolean {
  const allNotes = getAllStoredNotes();
  const index = allNotes.findIndex((n) => n.id === noteId && n.user_id === userId);

  if (index === -1) return false;

  allNotes[index].is_deleted = false;
  allNotes[index].updated_at = new Date().toISOString();
  saveAllNotes(allNotes);
  return true;
}

export function permanentlyDeleteNote(userId: string, noteId: string): boolean {
  const allNotes = getAllStoredNotes();
  const filtered = allNotes.filter((n) => !(n.id === noteId && n.user_id === userId));

  if (filtered.length === allNotes.length) return false;

  saveAllNotes(filtered);
  return true;
}

export function emptyUserTrash(userId: string): number {
  const allNotes = getAllStoredNotes();
  const remaining = allNotes.filter((n) => !(n.user_id === userId && n.is_deleted));
  const countDeleted = allNotes.length - remaining.length;
  saveAllNotes(remaining);
  return countDeleted;
}

export function resetToSampleData(userId: string): void {
  const allNotes = getAllStoredNotes();
  // Remove current user's notes
  const othersNotes = allNotes.filter((n) => n.user_id !== userId);
  // Add fresh copies of initial notes for this user
  const freshNotes = INITIAL_NOTES.map((n, idx) => ({
    ...n,
    id: `note_${Date.now()}_${idx}`,
    user_id: userId,
  }));
  saveAllNotes([...freshNotes, ...othersNotes]);
}

// Theme storage
export function getSavedTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {}
  return 'light';
}

export function setSavedTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}
