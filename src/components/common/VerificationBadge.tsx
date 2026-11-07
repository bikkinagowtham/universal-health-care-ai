import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface Props {
  status: VerificationStatus;
  lastVerifiedDate?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<Props> = ({ status, lastVerifiedDate, size = 'md' }) => {
  const configs: Record<VerificationStatus, { bg: string; icon: any; iconColor: string; label: string; tooltip: string }> = {
    VERIFIED: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      label: 'VERIFIED',
      tooltip: 'Official registration, qualifications, and council records verified by platform administrators.',
    },
    PENDING_VERIFICATION: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: Clock,
      iconColor: 'text-amber-600 dark:text-amber-400',
      label: 'PENDING VERIFICATION',
      tooltip: 'Registration documents submitted. Awaiting council and physical clinic audit.',
    },
    NOT_VERIFIED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      label: 'NOT VERIFIED',
      tooltip: 'Provider credentials have not been confirmed against official registers.',
    },
    REJECTED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      label: 'REGISTRATION REJECTED',
      tooltip: 'Provider credentials failed official council verification audit.',
    },
    EXPIRED: {
      bg: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
      icon: AlertTriangle,
      iconColor: 'text-zinc-500 dark:text-zinc-400',
      label: 'LICENSE EXPIRED',
      tooltip: 'State medical council registration has expired and is pending renewal.',
    },
    INFORMATION_OUTDATED: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: AlertTriangle,
      iconColor: 'text-slate-500 dark:text-slate-400',
      label: 'INFORMATION OUTDATED',
      tooltip: 'Provider details are due for re-verification. Consult clinic directly to confirm schedule.',
    },
  };

  const config = configs[status] || configs.NOT_VERIFIED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <div className="inline-flex flex-col items-start gap-0.5" title={config.tooltip}>
      <span
        className={`inline-flex items-center rounded-full border shadow-xs tracking-wider uppercase ${config.bg} ${sizeClasses[size]}`}
      >
        <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{config.label}</span>
      </span>
      {lastVerifiedDate && status === 'VERIFIED' && (
        <span className="text-[10px] text-slate-500 font-medium pl-1">
          Verified on {new Date(lastVerifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )}
    </div>
  );
};
