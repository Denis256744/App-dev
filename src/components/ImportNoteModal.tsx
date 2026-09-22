import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  AlertTriangle,
  Pin,
  Star,
  Check,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../services/storage';

export interface ImportParsedItem {
  id: string;
  file: File;
  fileName: string;
  title: string;
  content: string;
  category: Category;
  is_pinned: boolean;
  is_favorite: boolean;
  error?: string;
}

interface ImportNoteModalProps {
  isOpen: boolean;
  initialItems: ImportParsedItem[];
  onClose: () => void;
  onImport: (
    items: Array<{
      title: string;
      content: string;
      category: Category;
      is_pinned: boolean;
      is_favorite: boolean;
    }>
  ) => void;
  onSelectMoreFiles: (files: FileList | null) => void;
}

export const ImportNoteModal: React.FC<ImportNoteModalProps> = ({
  isOpen,
  initialItems,
  onClose,
  onImport,
  onSelectMoreFiles,
}) => {
  const [items, setItems] = useState<ImportParsedItem[]>(initialItems);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with initialItems when modal opens or files change
  React.useEffect(() => {
    setItems(initialItems);
    setSelectedItemIndex(0);
  }, [initialItems]);

  if (!isOpen) return null;

  const validItems = items.filter((item) => !item.error);
  const errorItems = items.filter((item) => Boolean(item.error));

  const currentItem = validItems[selectedItemIndex] || validItems[0];

  const handleUpdateCurrentItem = (updates: Partial<ImportParsedItem>) => {
    if (!currentItem) return;
    setItems((prev) =>
      prev.map((item) => (item.id === currentItem.id ? { ...item, ...updates } : item))
    );
  };

  const handleApplyCategoryToAll = (category: Category) => {
    setItems((prev) => prev.map((item) => ({ ...item, category })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validItems.length === 0) return;

    onImport(
      validItems.map((item) => ({
        title: item.title.trim() || item.fileName.replace(/\.txt$/i, '') || 'Imported Note',
        content: item.content,
        category: item.category,
        is_pinned: item.is_pinned,
        is_favorite: item.is_favorite,
      }))
    );
  };

  const handleTriggerReSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelectMoreFiles(e.target.files);
    }
    // reset input so same file can be re-selected if desired
    e.target.value = '';
  };

  return (
    <div
      id="import-note-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {validItems.length > 1 ? `Import Notes (${validItems.length} Files)` : 'Import Note Preview'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Review and organize notes before adding to My Notes
              </p>
            </div>
          </div>

          <button
            id="btn-import-modal-close"
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Validation Warnings / Errors (if any file failed validation) */}
          {errorItems.length > 0 && (
            <div
              id="import-validation-error-box"
              className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2"
            >
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Validation Message</span>
              </div>
              <div className="space-y-1.5 pl-6 text-xs text-rose-600 dark:text-rose-300/90">
                {errorItems.map((errItem) => (
                  <div key={errItem.id} className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-rose-800 dark:text-rose-200">{errItem.fileName}:</span>
                    <span>{errItem.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If NO valid files could be imported */}
          {validItems.length === 0 ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-rose-600 dark:text-rose-400">
                  {errorItems.length === 1
                    ? errorItems[0].error
                    : 'No valid text files could be imported.'}
                </h3>
                {errorItems.length === 1 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                    File: <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">{errorItems[0].fileName}</code>
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                    Please select one or more non-empty <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">.txt</code> files.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  id="btn-import-reselect"
                  type="button"
                  onClick={handleTriggerReSelect}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Choose Another File</span>
                </button>
                <button
                  id="btn-import-cancel-empty"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Valid Files Preview Form */
            <form id="import-notes-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Multi-file tabs if more than 1 file is selected */}
              {validItems.length > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      Selected Files ({validItems.length})
                    </label>
                    <span className="text-xs text-zinc-400">Click to preview and edit each</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {validItems.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 shrink-0 transition-colors ${
                          selectedItemIndex === idx
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                            : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[120px] truncate">{item.fileName}</span>
                        {item.is_pinned && <span title="Pinned">📌</span>}
                        {item.is_favorite && <span title="Favorite">⭐</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Item Preview & Settings */}
              {currentItem && (
                <div className="space-y-5 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-950/40">
                  {/* File Metadata Info Box */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">File:</span>
                      <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-mono">
                        {currentItem.fileName}
                      </code>
                    </div>
                    <div className="text-zinc-500 dark:text-zinc-400">
                      Size: {(currentItem.file.size / 1024).toFixed(1)} KB ({currentItem.content.length} characters)
                    </div>
                  </div>

                  {/* Note Title Field */}
                  <div>
                    <label
                      htmlFor="import-note-title"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
                    >
                      Note Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="import-note-title"
                      type="text"
                      required
                      value={currentItem.title}
                      onChange={(e) => handleUpdateCurrentItem({ title: e.target.value })}
                      placeholder="Title for this imported note"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors shadow-xs"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Defaulted from filename with .txt extension removed. You can customize it above.
                    </p>
                  </div>

                  {/* Category Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Category
                      </label>
                      {validItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleApplyCategoryToAll(currentItem.category)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          Apply "{currentItem.category}" to all files
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          id={`btn-import-category-${cat.toLowerCase()}`}
                          type="button"
                          onClick={() => handleUpdateCurrentItem({ category: cat })}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                            currentItem.category === cat
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800/80'
                          }`}
                        >
                          {currentItem.category === cat && <Check className="w-3.5 h-3.5" />}
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pin & Favorite Options */}
                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    {/* Pin Option */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="import-checkbox-pinned"
                        type="checkbox"
                        checked={currentItem.is_pinned}
                        onChange={(e) => handleUpdateCurrentItem({ is_pinned: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Pin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 rotate-45" />
                        <span>Pin to top</span>
                      </span>
                    </label>

                    {/* Favorite Option */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="import-checkbox-favorite"
                        type="checkbox"
                        checked={currentItem.is_favorite}
                        onChange={(e) => handleUpdateCurrentItem({ is_favorite: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Mark as Favorite</span>
                      </span>
                    </label>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Content Preview
                      </label>
                      <span className="text-xs text-zinc-400">
                        {currentItem.content.split('\n').length} lines
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        id="import-content-preview"
                        readOnly
                        rows={6}
                        value={currentItem.content}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 text-xs font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  id="btn-import-choose-different"
                  type="button"
                  onClick={handleTriggerReSelect}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Choose other / more files</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    id="btn-import-cancel"
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-import-submit"
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {validItems.length > 1 ? `Import ${validItems.length} Notes` : 'Import Note'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
