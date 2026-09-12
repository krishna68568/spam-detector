import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Ban } from 'lucide-react';
import { DetectionStatus } from '../types';

interface StatusBadgeProps {
  status: DetectionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const configs = {
    safe: {
      label: 'Safe',
      icon: ShieldCheck,
      classes: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60 ring-1 ring-emerald-500/20',
      dot: 'bg-emerald-400'
    },
    spam: {
      label: 'Spam',
      icon: ShieldAlert,
      classes: 'bg-rose-950/80 text-rose-300 border-rose-700/60 ring-1 ring-rose-500/20',
      dot: 'bg-rose-500'
    },
    suspicious: {
      label: 'Suspicious',
      icon: AlertTriangle,
      classes: 'bg-amber-950/80 text-amber-300 border-amber-700/60 ring-1 ring-amber-500/20',
      dot: 'bg-amber-400'
    },
    blocked: {
      label: 'Blocked',
      icon: Ban,
      classes: 'bg-slate-800/90 text-slate-300 border-slate-700 ring-1 ring-slate-600/20',
      dot: 'bg-slate-400'
    }
  };

  const config = configs[status] || configs.safe;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 space-x-1 font-semibold',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 space-x-2 font-bold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border shadow-sm ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
};
