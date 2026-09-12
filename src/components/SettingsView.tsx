import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  MessageSquare, 
  Lock, 
  Info, 
  Ban, 
  Bell, 
  Star, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Sliders,
  ExternalLink,
  User,
  Smartphone,
  Presentation
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';
import { MobileRunGuideModal } from './MobileRunGuideModal';
import { PresentationModal } from './PresentationModal';

interface SettingsViewProps {
  settings: AppSettings;
  user?: UserProfile;
  onOpenProfile?: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenBlocked: () => void;
  onOpenPermissions: () => void;
  onTriggerSimulatedCall: () => void;
  onTriggerSimulatedSms: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  user,
  onOpenProfile,
  onUpdateSettings,
  onOpenBlocked,
  onOpenPermissions,
  onTriggerSimulatedCall,
  onTriggerSimulatedSms
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showMobileGuideModal, setShowMobileGuideModal] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);

  const toggle = (key: keyof AppSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };

  return (
    <div id="settings-screen" className="space-y-5 pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure security filters, blocking rules, and notification preferences.
        </p>
      </div>

      {/* Account / Cloud Protection Banner */}
      {user && onOpenProfile && (
        <div 
          onClick={onOpenProfile}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3 min-w-0">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-11 h-11 rounded-2xl object-cover ring-1 ring-blue-500/40 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                !user.isGuest 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {user.isGuest ? <User className="w-5 h-5" /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                  {user.isGuest ? 'Guest Protection Mode' : user.name}
                </h4>
                {!user.isGuest && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    CLOUD SYNCED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {!user.isGuest 
                  ? (user.email || 'Signed In • Protection active') 
                  : 'Tap to sign in with Google or Email'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0 ml-2">
            <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300">
              {user.isGuest ? 'Sign In' : 'Manage'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* Simulator Test Sandbox (Section 14 live demo trigger) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-blue-950/40 to-slate-900 border border-blue-600/30 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Spam Detection Simulator</h4>
            <p className="text-[11px] text-slate-300">Test real-time Android caller ID & SMS alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="simulate-call-btn"
            type="button"
            onClick={onTriggerSimulatedCall}
            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Simulate Spam Call</span>
          </button>

          <button
            id="simulate-sms-btn"
            type="button"
            onClick={onTriggerSimulatedSms}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Simulate Spam SMS</span>
          </button>
        </div>
      </div>

      {/* Section 1: Protection (Section 11) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Protection</span>
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          {/* Spam Call Detection */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Spam Call Detection</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically screen unknown callers with cloud reputation database.
              </p>
            </div>
            <button
              id="toggle-spam-call-detection"
              type="button"
              onClick={() => toggle('spamCallDetection')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.spamCallDetection ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.spamCallDetection ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Spam SMS Detection */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Spam SMS Detection</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Analyze incoming text messages for phishing, fake lottery, and banking scams.
              </p>
            </div>
            <button
              id="toggle-spam-sms-detection"
              type="button"
              onClick={() => toggle('spamSmsDetection')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.spamSmsDetection ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.spamSmsDetection ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Auto Block High-Risk Calls */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Auto Block High-Risk Calls</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reject confirmed scam calls without ringing your phone.
              </p>
            </div>
            <button
              id="toggle-auto-block-high-risk"
              type="button"
              onClick={() => toggle('autoBlockHighRisk')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.autoBlockHighRisk ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.autoBlockHighRisk ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Show Spam Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Show Spam Notifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Display instant alert banners when spam calls or SMS are intercepted.
              </p>
            </div>
            <button
              id="toggle-show-spam-notifications"
              type="button"
              onClick={() => toggle('showSpamNotifications')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.showSpamNotifications ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.showSpamNotifications ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Call Settings (Section 11) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center space-x-1.5">
          <Phone className="w-3.5 h-3.5 text-blue-400" />
          <span>Call Settings</span>
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          {/* Block Unknown Numbers */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Block Unknown Numbers</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Block calls from private or hidden numbers without caller ID.
              </p>
            </div>
            <button
              id="toggle-block-unknown-numbers"
              type="button"
              onClick={() => toggle('blockUnknownNumbers')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.blockUnknownNumbers ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.blockUnknownNumbers ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Block Reported Numbers */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Block Reported Numbers</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Block callers with 50+ user fraud complaints in the community database.
              </p>
            </div>
            <button
              id="toggle-block-reported-numbers"
              type="button"
              onClick={() => toggle('blockReportedNumbers')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.blockReportedNumbers ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.blockReportedNumbers ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Allow Contacts */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Always Allow Contacts</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Never screen or block numbers saved in your Android address book.
              </p>
            </div>
            <button
              id="toggle-allow-contacts"
              type="button"
              onClick={() => toggle('allowContacts')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.allowContacts ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.allowContacts ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Manage Blocked Numbers */}
          <button
            onClick={onOpenBlocked}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Manage Blocked Numbers</p>
                <p className="text-[11px] text-slate-400">View or unblock personal blocklist</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Section 3: Message Settings (Section 11) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center space-x-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>Message Settings</span>
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          {/* Automatically move spam SMS */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Automatically Move Spam SMS</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Quarantine detected phishing and lottery messages in the Spam folder.
              </p>
            </div>
            <button
              id="toggle-auto-move-spam-sms"
              type="button"
              onClick={() => toggle('autoMoveSpamSms')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.autoMoveSpamSms ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.autoMoveSpamSms ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Notify about detected spam */}
          <div className="p-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white">Notify About Detected Spam</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Send security warning banner when a suspicious message arrives.
              </p>
            </div>
            <button
              id="toggle-notify-detected-spam"
              type="button"
              onClick={() => toggle('notifyDetectedSpam')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.notifyDetectedSpam ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.notifyDetectedSpam ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Privacy (Section 11) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Privacy & Security</span>
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left"
          >
            <div>
              <p className="text-xs font-bold text-white">Privacy Policy</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Your call audio and contact list are never uploaded to our servers.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onOpenPermissions}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left"
          >
            <div>
              <p className="text-xs font-bold text-white">Android Permissions</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage Phone, SMS, and Notification system privileges.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Section 5: App Information (Section 11) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>About App</span>
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          <button
            onClick={() => setShowPresentationModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left bg-gradient-to-r from-indigo-950/40 to-transparent"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Presentation className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Project Presentation (6 Slides)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">PPT</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Introduction, Problem, Literature, Objective, Methodology & Outcome</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setShowMobileGuideModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left bg-gradient-to-r from-blue-950/40 to-transparent"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>How to Run on Mobile Phone</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">GUIDE</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Android APK build steps, PWA installation, and permissions</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left"
          >
            <div>
              <p className="text-xs font-bold text-white">About SpamShield</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Version 2.4.1 (Build 2026.09)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setShowSupportModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-850 transition-colors text-left"
          >
            <div>
              <p className="text-xs font-bold text-white">Help & Support</p>
              <p className="text-[11px] text-slate-400 mt-0.5">FAQs, reporting false positives, fraud guides</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Rate App section */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Rate the App</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {ratingSubmitted ? 'Thank you for your 5-star rating!' : 'Help us keep Android users safe'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRatingStars(star);
                    setRatingSubmitted(true);
                  }}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-4 h-4 ${star <= ratingStars ? 'fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-white mb-2">Privacy & Data Safeguards</h3>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>• <strong>Zero Audio Interception:</strong> SpamShield cannot and does not record or listen to your voice calls.</p>
              <p>• <strong>On-Device Hash Verification:</strong> SMS messages are scanned on-device. Personal chat contents are never stored in external servers.</p>
              <p>• <strong>Anonymous Telemetry:</strong> Only anonymized spam metadata (number hashes and threat categories) are checked against fraud registries.</p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-600/30">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white">SpamShield Mobile</h3>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">Version 2.4.1 (Official Android Release)</p>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Engineered with advanced telecom pattern analysis and smart spam categorization to shield users from fraudulent calls, fake bank KYC threats, and lottery scams.
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-white mb-2">Help & Support</h3>
            <p className="text-xs text-slate-300 mb-3">
              Need assistance or want to report a false positive?
            </p>
            <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p>📧 Email: <strong>support@spamshield.app</strong></p>
              <p>🌐 Community: <strong>spamshield.app/community</strong></p>
              <p>⚡ Response Time: Usually under 2 hours</p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Mobile Run Guide Modal */}
      <MobileRunGuideModal
        isOpen={showMobileGuideModal}
        onClose={() => setShowMobileGuideModal(false)}
      />

      {/* Project Presentation 6 Slides Modal */}
      <PresentationModal
        isOpen={showPresentationModal}
        onClose={() => setShowPresentationModal(false)}
      />
    </div>
  );
};
