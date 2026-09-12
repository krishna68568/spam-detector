import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Flame, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { nativeMobileService } from '../services/nativeMobileService';

interface MobileRunGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileRunGuideModal: React.FC<MobileRunGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const isNative = nativeMobileService.isMobileApp;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Mobile Integration & Run Guide
              </h3>
              <p className="text-[11px] text-slate-400">
                {isNative ? 'Running inside Native Container' : 'Web & Android APK Deployment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Stack Status Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>Capacitor Android</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Platform: <span className="font-mono text-white">v8.5 (SDK 34)</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5" />
              <span>Firebase Services</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Auth + Firestore <span className="text-emerald-400 font-bold">Active</span>
            </p>
          </div>
        </div>

        {/* Section: 2 Ways to Run */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>How to run on your phone</span>
          </h4>

          {/* Option 1: Instant Mobile Web / PWA */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">Method 1: Open Directly in Phone Browser (Fastest)</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">Instant</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open your phone's browser (Chrome on Android or Safari on iPhone) and enter the deployment link:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300 truncate mr-2">
                {window.location.origin}
              </span>
              <button
                onClick={() => copyToClipboard(window.location.origin, 'url')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center space-x-1 shrink-0"
              >
                {copiedCmd === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedCmd === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              💡 <strong>Tip:</strong> Tap Chrome's menu (3 dots) &rarr; select <strong>"Add to Home Screen"</strong> to run it full-screen without address bars like an installed app.
            </p>
          </div>

          {/* Option 2: Native Android Studio Build */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">Method 2: Install as Native Android APK</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">Hardware APK</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The native Android module is pre-configured with AndroidManifest permissions and `google-services.json`. Follow these 3 steps:
            </p>

            <ol className="space-y-2 text-xs text-slate-300 list-decimal pl-4 leading-relaxed">
              <li>
                <strong>Export the code:</strong> Click <strong>Export &gt; Download ZIP</strong> or push to GitHub from the top-right menu of AI Studio.
              </li>
              <li>
                <strong>Sync & Open in Android Studio:</strong> In your terminal inside the extracted project folder, run:
                <div className="mt-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <code className="text-[11px] font-mono text-emerald-400">npx cap open android</code>
                  <button
                    onClick={() => copyToClipboard('npx cap open android', 'cmd')}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {copiedCmd === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </li>
              <li>
                <strong>Build & Run on Phone:</strong> Connect your phone with a USB cable (with USB Debugging enabled in phone Developer Options), then click <strong>Run ▶</strong> in Android Studio, or click <strong>Build &gt; Build APK(s)</strong>.
              </li>
            </ol>
          </div>

          {/* Integrated Android Permissions */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-slate-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Configured Android Permissions</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              The project's <code className="text-blue-300 font-mono">AndroidManifest.xml</code> includes:
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {['READ_PHONE_STATE', 'READ_CALL_LOG', 'RECEIVE_SMS', 'READ_SMS', 'POST_NOTIFICATIONS', 'VIBRATE'].map((perm) => (
                <span key={perm} className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
