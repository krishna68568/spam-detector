import React from 'react';
import { ShieldCheck, PhoneOff, MessageSquare, Ban, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  type: 'calls' | 'messages' | 'blocked' | 'safe' | 'search';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction
}) => {
  const configs = {
    calls: {
      icon: ShieldCheck,
      defaultTitle: "You're all clear!",
      defaultDesc: 'No spam calls detected in your recent history.',
      bgColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
    },
    messages: {
      icon: MessageSquare,
      defaultTitle: 'No spam messages detected',
      defaultDesc: 'Your SMS inbox is protected and clean from phishing scams.',
      bgColor: 'bg-blue-950/40 text-blue-400 border-blue-800/40'
    },
    blocked: {
      icon: Ban,
      defaultTitle: 'No blocked numbers',
      defaultDesc: 'You have not added any callers to your blocklist yet.',
      bgColor: 'bg-slate-900 text-slate-400 border-slate-800'
    },
    safe: {
      icon: CheckCircle2,
      defaultTitle: 'No records found',
      defaultDesc: 'Try adjusting your filters or search terms.',
      bgColor: 'bg-slate-900 text-slate-400 border-slate-800'
    },
    search: {
      icon: ShieldCheck,
      defaultTitle: 'No matches found',
      defaultDesc: 'No numbers or messages matched your criteria.',
      bgColor: 'bg-slate-900 text-slate-400 border-slate-800'
    }
  };

  const config = configs[type] || configs.calls;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border mb-4 shadow-lg ${config.bgColor}`}>
        <Icon className="w-8 h-8 stroke-[2.2]" />
      </div>

      <h3 className="text-base font-bold text-white mb-1">
        {title || config.defaultTitle}
      </h3>

      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        {description || config.defaultDesc}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
