import React from 'react';
import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
  School: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    darkBg: 'dark:bg-blue-950/40',
    darkText: 'dark:text-blue-300',
    darkBorder: 'dark:border-blue-800',
  },
  Personal: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    darkBg: 'dark:bg-emerald-950/40',
    darkText: 'dark:text-emerald-300',
    darkBorder: 'dark:border-emerald-800',
  },
  Work: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    darkBg: 'dark:bg-amber-950/40',
    darkText: 'dark:text-amber-300',
    darkBorder: 'dark:border-amber-800',
  },
  Ideas: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    darkBg: 'dark:bg-purple-950/40',
    darkText: 'dark:text-purple-300',
    darkBorder: 'dark:border-purple-800',
  },
  Other: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-200',
    darkBg: 'dark:bg-zinc-800',
    darkText: 'dark:text-zinc-300',
    darkBorder: 'dark:border-zinc-700',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      id={`badge-category-${category.toLowerCase()}`}
      className={`inline-flex items-center font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${style.darkBg} ${style.darkText} ${style.darkBorder} ${sizeClasses} transition-colors`}
    >
      {category}
    </span>
  );
};
