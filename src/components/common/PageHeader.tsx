import React from 'react';
import { ArrowLeft, Home, ChevronRight, LayoutDashboard, LucideIcon } from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  onBack?: () => void;
  onHome?: () => void;
  onDashboard?: () => void;
  userRole?: UserRole;
  actionButton?: React.ReactNode;
  icon?: LucideIcon;
}

export const PageHeader: React.FC<Props> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
  onBack,
  onHome,
  onDashboard,
  userRole,
  actionButton,
  icon: Icon,
}) => {
  return (
    <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer active:scale-95"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {onHome && (
            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Return to Home Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          )}

          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">{title}</span>
        </div>

        {onDashboard && (
          <button
            type="button"
            onClick={onDashboard}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold transition hover:bg-sky-100 cursor-pointer"
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>{userRole ? `${userRole.replace('_', ' ').toUpperCase()} Dashboard` : 'Dashboard'}</span>
          </button>
        )}
      </div>

      {/* Main Title & Subtitle & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {badge && (
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${badgeColor}`}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {actionButton && <div className="self-start sm:self-auto flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  );
};
