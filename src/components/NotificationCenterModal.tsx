import React from 'react';
import { Bell, X, Trash2, CheckCircle2, PhoneOff, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onClearAll,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Security Notifications</h3>
              <p className="text-[11px] text-slate-400">{notifications.length} alerts logged</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors px-2 py-1 rounded-lg"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-white">No notifications</p>
              <p className="text-[11px] text-slate-400 mt-1">All detected spam alerts will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkRead(item.id);
                  if (onSelectNotification) onSelectNotification(item);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  !item.read 
                    ? 'bg-slate-950/90 border-blue-900/60 hover:bg-slate-950 ring-1 ring-blue-500/20' 
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/80'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'call' 
                      ? 'bg-rose-950/80 text-rose-400 border border-rose-800/50' 
                      : item.type === 'sms'
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                      : 'bg-blue-950/80 text-blue-400 border border-blue-800/50'
                  }`}>
                    {item.type === 'call' ? (
                      <PhoneOff className="w-4 h-4" />
                    ) : item.type === 'sms' ? (
                      <MessageSquareWarning className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{item.subtitle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.detail}</p>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
