import React from 'react';
import { Ban, AlertTriangle, CheckCircle, Trash2, X, Flag } from 'lucide-react';

export type ConfirmationActionType = 'block' | 'unblock' | 'report' | 'delete' | 'markSafe';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: ConfirmationActionType;
  title?: string;
  targetName: string; // e.g., phone number or message sender
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  targetName,
  description,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const configs = {
    block: {
      icon: Ban,
      iconBg: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
      defaultTitle: 'Block Phone Number?',
      defaultDesc: `Future calls and SMS from ${targetName} will be automatically rejected and screened by SpamShield.`,
      confirmText: 'Block Number',
      confirmClass: 'bg-rose-600 hover:bg-rose-500 text-white'
    },
    unblock: {
      icon: CheckCircle,
      iconBg: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
      defaultTitle: 'Unblock Number?',
      defaultDesc: `Allow calls and messages from ${targetName} to ring normally on your phone again.`,
      confirmText: 'Unblock',
      confirmClass: 'bg-blue-600 hover:bg-blue-500 text-white'
    },
    report: {
      icon: Flag,
      iconBg: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
      defaultTitle: 'Report as Spam?',
      defaultDesc: `Submit an anonymous report for ${targetName} to improve our global fraud detection network.`,
      confirmText: 'Submit Report',
      confirmClass: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold'
    },
    delete: {
      icon: Trash2,
      iconBg: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
      defaultTitle: 'Delete Message?',
      defaultDesc: `This detected spam message will be permanently removed from your quarantined records.`,
      confirmText: 'Delete Forever',
      confirmClass: 'bg-rose-600 hover:bg-rose-500 text-white'
    },
    markSafe: {
      icon: CheckCircle,
      iconBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
      defaultTitle: 'Mark as Safe Contact?',
      defaultDesc: `Add ${targetName} to your trusted list so SpamShield will not flag future calls or messages.`,
      confirmText: 'Mark Safe',
      confirmClass: 'bg-emerald-600 hover:bg-emerald-500 text-white'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 ${config.iconBg}`}>
            <Icon className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h3 className="text-lg font-extrabold text-white mb-1.5">
            {title || config.defaultTitle}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {description || config.defaultDesc}
          </p>

          <div className="w-full grid grid-cols-2 gap-3">
            <button
              id="confirm-modal-cancel-btn"
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-modal-action-btn"
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center space-x-1.5 ${config.confirmClass}`}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{config.confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
