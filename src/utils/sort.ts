import { Note, SortOption } from '../types';

export function sortNotes(notes: Note[], sortOption: SortOption): Note[] {
  return [...notes].sort((a, b) => {
    switch (sortOption) {
      case 'newest': {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
      }
      case 'oldest': {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeA - timeB;
      }
      case 'updated': {
        const timeA = new Date(a.updated_at).getTime();
        const timeB = new Date(b.updated_at).getTime();
        return timeB - timeA;
      }
      case 'title_asc': {
        return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
      }
      case 'title_desc': {
        return b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
      }
      default:
        return 0;
    }
  });
}
