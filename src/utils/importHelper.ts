import { ImportParsedItem } from '../components/ImportNoteModal';

export async function parseTxtFiles(files: FileList | File[]): Promise<ImportParsedItem[]> {
  const results: ImportParsedItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isTxt = file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain';

    if (!isTxt) {
      results.push({
        id: `import_err_${i}_${Date.now()}`,
        file,
        fileName: file.name,
        title: file.name,
        content: '',
        category: 'Other',
        is_pinned: false,
        is_favorite: false,
        error: 'Please select a .txt text file.',
      });
      continue;
    }

    try {
      const content = await file.text();
      if (!content.trim()) {
        results.push({
          id: `import_empty_${i}_${Date.now()}`,
          file,
          fileName: file.name,
          title: file.name.replace(/\.txt$/i, ''),
          content: '',
          category: 'Other',
          is_pinned: false,
          is_favorite: false,
          error: 'This file is empty and cannot be imported.',
        });
        continue;
      }

      const defaultTitle = file.name.replace(/\.txt$/i, '').trim() || 'Untitled Note';

      results.push({
        id: `import_${i}_${Date.now()}`,
        file,
        fileName: file.name,
        title: defaultTitle,
        content: content,
        category: 'Personal',
        is_pinned: false,
        is_favorite: false,
      });
    } catch {
      results.push({
        id: `import_read_err_${i}_${Date.now()}`,
        file,
        fileName: file.name,
        title: file.name,
        content: '',
        category: 'Other',
        is_pinned: false,
        is_favorite: false,
        error: 'Please select a .txt text file.',
      });
    }
  }

  return results;
}
