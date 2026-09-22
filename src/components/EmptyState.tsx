import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  id?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    id?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    id?: string;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  id = 'empty-state',
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  const ActionIcon = action?.icon;

  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xs"
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            <button
              id={action.id || `${id}-action-btn`}
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {ActionIcon && <ActionIcon className="w-4 h-4 stroke-[2.2]" />}
              <span>{action.label}</span>
            </button>
          )}

          {secondaryAction && (
            <button
              id={secondaryAction.id || `${id}-secondary-btn`}
              type="button"
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
