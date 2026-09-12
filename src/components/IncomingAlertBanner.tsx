import React, { useEffect } from 'react';
import { PhoneOff, MessageSquareWarning, Ban, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface IncomingAlertBannerProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onBlockAction?: (phoneNumber: string) => void;
  onInspectAction?: () => void;
}

export const IncomingAlertBanner: React.FC<IncomingAlertBannerProps> = ({
  notification,
  onDismiss,
  onBlockAction,
  onInspectAction
}) => {
  useEffect(() => {
    if (!notification) return;
    // Auto dismiss banner after 7 seconds unless interacted with
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isCall = notification.type === 'call';

  return (
    <div 
      id="incoming-alert-banner"
      className="fixed top-12 left-3 right-3 z-50 max-w-md mx-auto animate-bounce-in"
    >
      <div className="rounded-2xl p-4 bg-slate-900/95 backdrop-blur-xl border border-rose-500/50 shadow-2xl shadow-rose-950/60 text-white relative ring-2 ring-rose-500/20">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-white bg-slate-800/80 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start space-x-3 pr-6">
          {/* Pulsing Alert Icon */}
          <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/60 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 animate-pulse">
            {isCall ? (
              <PhoneOff className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <MessageSquareWarning className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs text-rose-300 tracking-wide uppercase flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1" />
                {notification.title}
              </span>
              <span className="text-[10px] font-mono font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-800 text-rose-300">
                {notification.confidence}% Spam
              </span>
            </div>

            <p className="font-mono text-sm font-bold text-white mt-1 truncate">
              {notification.subtitle}
            </p>

            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              {notification.detail}
            </p>

            {/* Quick Actions in Notification Banner */}
            <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-slate-800">
              {notification.meta?.phoneNumber && onBlockAction && (
                <button
                  onClick={() => {
                    onBlockAction(notification.meta!.phoneNumber!);
                    onDismiss();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md transition-colors"
                >
                  <Ban className="w-3 h-3" />
                  <span>Block Now</span>
                </button>
              )}

              {onInspectAction && (
                <button
                  onClick={() => {
                    onInspectAction();
                    onDismiss();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  View Details
                </button>
              )}

              <button
                onClick={onDismiss}
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
