import React, { useState } from 'react';
import { Phone, MessageSquare, Bell, ShieldCheck, Check, Lock } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  onGrantAll: () => void;
  onDismiss: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onGrantAll,
  onDismiss
}) => {
  const [phoneGranted, setPhoneGranted] = useState(true);
  const [smsGranted, setSmsGranted] = useState(true);
  const [notifGranted, setNotifGranted] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 relative">
        {/* Top security icon */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-white">Enable Protection Privileges</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            SpamShield requires standard Android security permissions to monitor incoming calls and messages in real time.
          </p>
        </div>

        {/* 3 Permission Cards (Section 13) */}
        <div className="space-y-2.5">
          {/* Phone Permission */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">Phone Permission</h4>
                <button
                  type="button"
                  onClick={() => setPhoneGranted(!phoneGranted)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    phoneGranted ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {phoneGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Required to identify incoming calls and match against fraud databases.
              </p>
            </div>
          </div>

          {/* SMS Permission */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">SMS Permission</h4>
                <button
                  type="button"
                  onClick={() => setSmsGranted(!smsGranted)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    smsGranted ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {smsGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Required to analyze incoming messages for malicious links & phishing.
              </p>
            </div>
          </div>

          {/* Notification Permission */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">Notification Permission</h4>
                <button
                  type="button"
                  onClick={() => setNotifGranted(!notifGranted)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    notifGranted ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {notifGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Required to notify you instantly about detected spam and high-risk callers.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
          <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Your personal contacts and private SMS never leave your device.</span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            id="allow-permissions-btn"
            onClick={onGrantAll}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <span>Allow Permissions</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full text-[11px] font-semibold text-slate-400 hover:text-slate-200 py-1 transition-colors text-center block"
          >
            Configure Later
          </button>
        </div>
      </div>
    </div>
  );
};
