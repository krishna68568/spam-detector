import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PhoneCall, 
  MessageSquare, 
  SearchCode, 
  Settings, 
  ArrowRight, 
  PhoneOff, 
  MessageSquareWarning, 
  CheckCircle, 
  Ban, 
  Sparkles, 
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Smartphone
} from 'lucide-react';
import { 
  TabType, 
  CallRecord, 
  MessageRecord, 
  BlockedNumber, 
  ProtectionStats, 
  AppSettings, 
  NotificationItem, 
  UserProfile,
  DetectionStatus 
} from './types';
import { spamShieldService, DEFAULT_USER } from './services/spamShieldService';
import { auth, onAuthStateChanged, mapFirebaseUserToProfile } from './services/firebase';
import { nativeMobileService } from './services/nativeMobileService';

import { AndroidStatusBar } from './components/AndroidStatusBar';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { ProtectionCard } from './components/ProtectionCard';
import { CallCard } from './components/CallCard';
import { MessageCard } from './components/MessageCard';
import { StatusBadge } from './components/StatusBadge';
import { EmptyState } from './components/EmptyState';
import { ConfirmationModal, ConfirmationActionType } from './components/ConfirmationModal';
import { ManualCheckView } from './components/ManualCheckView';
import { BlockedManagerModal } from './components/BlockedManagerModal';
import { StatisticsModal } from './components/StatisticsModal';
import { SettingsView } from './components/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';
import { PermissionModal } from './components/PermissionModal';
import { IncomingAlertBanner } from './components/IncomingAlertBanner';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthModal } from './components/AuthModal';
import { DetailedAnalysisModal } from './components/DetailedAnalysisModal';
import { PresentationModal } from './components/PresentationModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isProtectionActive, setIsProtectionActive] = useState(true);

  // Core Data
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [blockedNumbers, setBlockedNumbers] = useState<BlockedNumber[]>([]);
  const [stats, setStats] = useState<ProtectionStats | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Filter & Search states
  const [callFilter, setCallFilter] = useState<'all' | 'spam' | 'blocked' | 'safe'>('all');
  const [callSearch, setCallSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'spam' | 'safe' | 'suspicious'>('all');
  const [messageSearch, setMessageSearch] = useState('');

  // Modals & Overlays
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPresentationDeck, setShowPresentationDeck] = useState(false);

  // Detailed Analysis modal
  const [analysisItem, setAnalysisItem] = useState<{
    item: CallRecord | MessageRecord;
    type: 'call' | 'message';
  } | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ConfirmationActionType;
    targetName: string;
    targetId?: string;
    targetPayload?: any;
  }>({
    isOpen: false,
    type: 'block',
    targetName: ''
  });

  // Simulated Alert Banner (Section 14)
  const [activeAlert, setActiveAlert] = useState<NotificationItem | null>(null);

  // Load initial data from service
  useEffect(() => {
    const initData = async () => {
      const [c, m, b, s, st, u, n] = await Promise.all([
        spamShieldService.getCallHistory(),
        spamShieldService.getMessageHistory(),
        spamShieldService.getBlockedNumbers(),
        spamShieldService.getProtectionStats(),
        spamShieldService.getSettings(),
        spamShieldService.getUser(),
        spamShieldService.getNotifications()
      ]);
      setCalls(c);
      setMessages(m);
      setBlockedNumbers(b);
      setStats(s);
      setSettings(st);
      setUser(u);
      setNotifications(n);

      // Initialize native hardware services (Status bar, notifications, etc.)
      await nativeMobileService.init();

      // Check if user has seen onboarding
      const onboarded = localStorage.getItem('spamshield_onboarded');
      if (!onboarded) {
        setShowOnboarding(true);
      }
    };
    initData();

    // Listen to real-time Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mapped = mapFirebaseUserToProfile(fbUser);
        setUser(mapped);
        spamShieldService.updateUser(mapped);
      }
    });

    // Native Android hardware back-button support
    const removeBack = nativeMobileService.registerBackButtonHandler(() => {
      if (activeAlert) {
        setActiveAlert(null);
      } else if (analysisItem) {
        setAnalysisItem(null);
      } else if (showBlockedModal) {
        setShowBlockedModal(false);
      } else if (showStatsModal) {
        setShowStatsModal(false);
      } else if (showNotificationsModal) {
        setShowNotificationsModal(false);
      } else if (showAuthModal) {
        setShowAuthModal(false);
      } else if (showPresentationDeck) {
        setShowPresentationDeck(false);
      } else if (showPermissions) {
        setShowPermissions(false);
      } else if (activeTab !== 'home') {
        setActiveTab('home');
      }
    });

    return () => {
      unsubscribeAuth();
      removeBack();
    };
  }, [activeAlert, analysisItem, showBlockedModal, showStatsModal, showNotificationsModal, showAuthModal, showPresentationDeck, showPermissions, activeTab]);

  // Handlers for Confirmation Actions
  const handleOpenConfirm = (type: ConfirmationActionType, targetName: string, targetId?: string, targetPayload?: any) => {
    setConfirmModal({
      isOpen: true,
      type,
      targetName,
      targetId,
      targetPayload
    });
  };

  const handleConfirmAction = async () => {
    const { type, targetName, targetId, targetPayload } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isOpen: false }));

    if (type === 'block') {
      await spamShieldService.blockNumber(targetName, targetPayload?.name || 'Blocked Caller', 'Manual Block');
      const updatedBlocked = await spamShieldService.getBlockedNumbers();
      const updatedCalls = await spamShieldService.getCallHistory();
      setBlockedNumbers(updatedBlocked);
      setCalls(updatedCalls);
    } else if (type === 'unblock') {
      await spamShieldService.unblockNumber(targetName);
      const updatedBlocked = await spamShieldService.getBlockedNumbers();
      const updatedCalls = await spamShieldService.getCallHistory();
      setBlockedNumbers(updatedBlocked);
      setCalls(updatedCalls);
    } else if (type === 'report') {
      await spamShieldService.reportNumber(targetName, 'Fraud / Telemarketing');
      const updatedCalls = await spamShieldService.getCallHistory();
      setCalls(updatedCalls);
    } else if (type === 'delete' && targetId) {
      await spamShieldService.deleteMessage(targetId);
      const updatedMessages = await spamShieldService.getMessageHistory();
      setMessages(updatedMessages);
    } else if (type === 'markSafe' && targetId) {
      const isCall = targetPayload?.type === 'call';
      await spamShieldService.markAsSafe(targetId, isCall ? 'call' : 'sms');
      if (isCall) {
        const updatedCalls = await spamShieldService.getCallHistory();
        setCalls(updatedCalls);
      } else {
        const updatedMessages = await spamShieldService.getMessageHistory();
        setMessages(updatedMessages);
      }
    }
  };

  // Simulate Incoming Spam Call (Section 14 & 11)
  const handleSimulateSpamCall = async () => {
    const alert: NotificationItem = {
      id: `alert-${Date.now()}`,
      title: '🚨 Spam Call Detected',
      subtitle: '+91 98765 43210',
      detail: 'Potential telemarketing call screened and blocked by SpamShield.',
      type: 'call',
      status: 'spam',
      confidence: 94,
      timestamp: 'Just now',
      read: false,
      meta: { phoneNumber: '+91 98765 43210', category: 'Telemarketing' }
    };
    setActiveAlert(alert);
    setNotifications(prev => [alert, ...prev]);

    // Native mobile haptic vibration and system notification
    nativeMobileService.triggerHapticAlert('danger');
    nativeMobileService.sendSystemNotification(
      '🚨 Spam Call Detected',
      '+91 98765 43210: Potential telemarketing call screened and blocked.'
    );

    // Also inject into calls
    const newCall = await spamShieldService.addSimulatedCall('+91 98765 43210', 'High Risk Telemarketer');
    setCalls(prev => [newCall, ...prev]);
  };

  // Simulate Incoming Spam SMS (Section 14 & 11)
  const handleSimulateSpamSms = async () => {
    const alert: NotificationItem = {
      id: `alert-${Date.now()}`,
      title: '🚨 Spam Message Detected',
      subtitle: 'AX-PRIZE (+91 98765 43210)',
      detail: '"Congratulations! You won ₹50,000 lottery prize..." Quarantined.',
      type: 'sms',
      status: 'spam',
      confidence: 97,
      timestamp: 'Just now',
      read: false,
      meta: { phoneNumber: '+91 98765 43210', category: 'Lottery / Prize Fraud' }
    };
    setActiveAlert(alert);
    setNotifications(prev => [alert, ...prev]);

    // Native mobile haptic vibration and system notification
    nativeMobileService.triggerHapticAlert('danger');
    nativeMobileService.sendSystemNotification(
      '🚨 Spam Message Detected',
      'AX-PRIZE: Fake ₹50,000 lottery scheme quarantined.'
    );

    // Also inject into messages
    const newMsg = await spamShieldService.addSimulatedMessage(
      'Congratulations! You have won a ₹50,000 prize under Digital India Scheme. Click http://bit.ly/claim-prize now before midnight!',
      '+91 98765 43210'
    );
    setMessages(prev => [newMsg, ...prev]);
  };

  // Filtered Calls
  const filteredCalls = calls.filter(call => {
    const matchesFilter = 
      callFilter === 'all' 
        ? true 
        : callFilter === 'spam'
        ? call.status === 'spam'
        : callFilter === 'blocked'
        ? call.status === 'blocked'
        : call.status === 'safe';

    const matchesSearch = 
      call.phoneNumber.toLowerCase().includes(callSearch.toLowerCase()) ||
      (call.callerName && call.callerName.toLowerCase().includes(callSearch.toLowerCase())) ||
      call.category.toLowerCase().includes(callSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Filtered Messages
  const filteredMessages = messages.filter(msg => {
    const matchesFilter = 
      messageFilter === 'all' 
        ? true 
        : messageFilter === 'spam'
        ? msg.status === 'spam'
        : messageFilter === 'safe'
        ? msg.status === 'safe'
        : msg.status === 'suspicious';

    const matchesSearch = 
      msg.sender.toLowerCase().includes(messageSearch.toLowerCase()) ||
      (msg.senderName && msg.senderName.toLowerCase().includes(messageSearch.toLowerCase())) ||
      msg.body.toLowerCase().includes(messageSearch.toLowerCase()) ||
      msg.category.toLowerCase().includes(messageSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:py-6">
      {/* Android Mobile Phone Container */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-slate-950 sm:rounded-[44px] sm:border-[8px] sm:border-slate-800/90 shadow-2xl flex flex-col overflow-hidden relative sm:ring-1 sm:ring-slate-700/60">
        
        {/* Android Status Bar (Section 2) */}
        <AndroidStatusBar />

        {/* Global Floating Heads-Up Notification Banner (Section 14) */}
        <IncomingAlertBanner
          notification={activeAlert}
          onDismiss={() => setActiveAlert(null)}
          onBlockAction={(num) => handleOpenConfirm('block', num)}
          onInspectAction={() => {
            if (activeAlert?.type === 'call') {
              const matchedCall = calls.find(c => c.phoneNumber === activeAlert.meta?.phoneNumber);
              if (matchedCall) setAnalysisItem({ item: matchedCall, type: 'call' });
            } else if (activeAlert?.type === 'sms') {
              const matchedMsg = messages.find(m => m.sender === activeAlert.meta?.phoneNumber);
              if (matchedMsg) setAnalysisItem({ item: matchedMsg, type: 'message' });
            }
          }}
        />

        {/* Top Header */}
        <Header
          user={user}
          unreadCount={unreadNotifCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenProfile={() => setShowAuthModal(true)}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenPresentation={() => setShowPresentationDeck(true)}
        />

        {/* Main Content Area (Scrollable per Tab) */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          
          {/* TAB 1: HOME SCREEN (Section 4) */}
          {activeTab === 'home' && (
            <div id="home-screen-view" className="space-y-5 animate-fadeIn">
              {/* Main Protection Card */}
              <ProtectionCard
                isProtectionActive={isProtectionActive}
                onToggleProtection={() => setIsProtectionActive(!isProtectionActive)}
                spamCallsBlocked={calls.filter(c => c.status === 'blocked').length + 18}
                spamMessagesDetected={messages.filter(m => m.status === 'spam').length + 29}
                blockedCount={blockedNumbers.length}
                onViewBlocked={() => setShowBlockedModal(true)}
                onViewCalls={() => {
                  setCallFilter('spam');
                  setActiveTab('calls');
                }}
                onViewMessages={() => {
                  setMessageFilter('spam');
                  setActiveTab('messages');
                }}
                onManualScan={() => setActiveTab('check')}
              />

              {/* Quick Manual Check Banner Shortcut */}
              <div 
                onClick={() => setActiveTab('check')}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-700/40 flex items-center justify-between cursor-pointer hover:border-blue-500/60 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <SearchCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Manual Spam Check</h4>
                    <p className="text-[11px] text-slate-300">Paste an unknown number or SMS to verify</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Recent Activity (Section 4) */}
              <div id="recent-activity-section" className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recent Activity
                  </h3>
                  <button
                    id="view-all-activity-btn"
                    onClick={() => setActiveTab('calls')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Item 1: +91 98765 43210 — Spam Call */}
                  <div 
                    onClick={() => {
                      const c = calls[0];
                      if (c) setAnalysisItem({ item: c, type: 'call' });
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0">
                        <PhoneOff className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-xs font-bold text-white truncate">+91 98765 43210</p>
                          <span className="text-[10px] text-slate-400 font-semibold">• Spam Call</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">12m ago • Potential Telemarketing</p>
                      </div>
                    </div>
                    <StatusBadge status="spam" size="sm" />
                  </div>

                  {/* Item 2: +91 87654 32109 — Promotional SMS */}
                  <div 
                    onClick={() => {
                      const m = messages[0];
                      if (m) setAnalysisItem({ item: m, type: 'message' });
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                        <MessageSquareWarning className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-xs font-bold text-white truncate">+91 87654 32109</p>
                          <span className="text-[10px] text-slate-400 font-semibold">• Promotional SMS</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">45m ago • Lottery ₹50,000 Fraud</p>
                      </div>
                    </div>
                    <StatusBadge status="spam" size="sm" />
                  </div>

                  {/* Item 3: +91 99887 66554 — Suspicious Call */}
                  <div 
                    onClick={() => {
                      const c = calls[2];
                      if (c) setAnalysisItem({ item: c, type: 'call' });
                    }}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-xs font-bold text-white truncate">+91 99887 66554</p>
                          <span className="text-[10px] text-slate-400 font-semibold">• Suspicious Call</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">2h ago • Automated IVR Robocall</p>
                      </div>
                    </div>
                    <StatusBadge status="suspicious" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALLS SCREEN (Section 5) */}
          {activeTab === 'calls' && (
            <div id="calls-screen-view" className="space-y-4 animate-fadeIn">
              {/* Header Title */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Spam Calls
                  </h2>
                  <p className="text-xs text-slate-400">Caller ID protection & call screening</p>
                </div>
                <button
                  onClick={() => setShowBlockedModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 flex items-center space-x-1"
                >
                  <Ban className="w-3 h-3 text-rose-400" />
                  <span>Blocked ({blockedNumbers.length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search number, caller name, or category..."
                  value={callSearch}
                  onChange={(e) => setCallSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Tabs: All, Spam, Blocked, Safe (Section 5) */}
              <div className="flex space-x-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                {(['all', 'spam', 'blocked', 'safe'] as const).map((filter) => (
                  <button
                    key={filter}
                    id={`filter-call-${filter}`}
                    onClick={() => setCallFilter(filter)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      callFilter === filter
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Calls List */}
              <div className="space-y-3 pb-8">
                {filteredCalls.length === 0 ? (
                  <EmptyState 
                    type={callFilter === 'safe' ? 'safe' : 'calls'} 
                    actionText="Check a Number Manually"
                    onAction={() => setActiveTab('check')}
                  />
                ) : (
                  filteredCalls.map((call) => (
                    <CallCard
                      key={call.id}
                      call={call}
                      onBlock={(c) => handleOpenConfirm('block', c.phoneNumber, c.id, { name: c.callerName })}
                      onUnblock={(c) => handleOpenConfirm('unblock', c.phoneNumber, c.id)}
                      onReport={(c) => handleOpenConfirm('report', c.phoneNumber, c.id)}
                      onMarkSafe={(c) => handleOpenConfirm('markSafe', c.phoneNumber, c.id, { type: 'call' })}
                      onInspect={(c) => setAnalysisItem({ item: c, type: 'call' })}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MESSAGES SCREEN (Section 6) */}
          {activeTab === 'messages' && (
            <div id="messages-screen-view" className="space-y-4 animate-fadeIn">
              {/* Header Title */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Messages
                  </h2>
                  <p className="text-xs text-slate-400">AI SMS threat detection & quarantine</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                  {messages.length} Scanned
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search SMS body, sender, or scam type..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Tabs: All, Spam, Safe, Suspicious (Section 6) */}
              <div className="flex space-x-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
                {(['all', 'spam', 'safe', 'suspicious'] as const).map((filter) => (
                  <button
                    key={filter}
                    id={`filter-msg-${filter}`}
                    onClick={() => setMessageFilter(filter)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      messageFilter === filter
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Messages List */}
              <div className="space-y-3 pb-8">
                {filteredMessages.length === 0 ? (
                  <EmptyState 
                    type="messages" 
                    actionText="Check an SMS Manually"
                    onAction={() => setActiveTab('check')}
                  />
                ) : (
                  filteredMessages.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onReport={(m) => handleOpenConfirm('report', m.sender, m.id)}
                      onDelete={(m) => handleOpenConfirm('delete', m.sender, m.id)}
                      onMarkSafe={(m) => handleOpenConfirm('markSafe', m.sender, m.id, { type: 'message' })}
                      onInspect={(m) => setAnalysisItem({ item: m, type: 'message' })}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CHECK SCREEN (Section 7 & 8) */}
          {activeTab === 'check' && (
            <ManualCheckView
              onBlockNumber={(num) => handleOpenConfirm('block', num)}
              onReportNumber={(num) => handleOpenConfirm('report', num)}
            />
          )}

          {/* TAB 5: SETTINGS SCREEN (Section 11) */}
          {activeTab === 'settings' && settings && (
            <SettingsView
              settings={settings}
              user={user}
              onOpenProfile={() => setShowAuthModal(true)}
              onUpdateSettings={async (updated) => {
                const s = await spamShieldService.updateSettings(updated);
                setSettings(s);
              }}
              onOpenBlocked={() => setShowBlockedModal(true)}
              onOpenPermissions={() => setShowPermissions(true)}
              onTriggerSimulatedCall={handleSimulateSpamCall}
              onTriggerSimulatedSms={handleSimulateSpamSms}
            />
          )}

        </main>

        {/* Bottom Navigation (Section 3) */}
        <BottomNavigation
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          spamCallCount={calls.filter(c => c.status === 'spam' && c.callType === 'blocked').length}
          spamMsgCount={messages.filter(m => m.status === 'spam' && !m.isRead).length}
        />

        {/* --- GLOBAL POPUPS & MODALS --- */}

        {/* Confirmation Modal (Section 5) */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type}
          targetName={confirmModal.targetName}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />

        {/* Detailed Analysis Modal (Section 8) */}
        {analysisItem && (
          <DetailedAnalysisModal
            isOpen={!!analysisItem}
            onClose={() => setAnalysisItem(null)}
            item={analysisItem.item}
            itemType={analysisItem.type}
            onBlock={(num) => handleOpenConfirm('block', num)}
            onReport={(id) => handleOpenConfirm('report', id)}
            onMarkSafe={(id, type) => handleOpenConfirm('markSafe', id, id, { type })}
          />
        )}

        {/* Blocked Manager Modal (Section 9) */}
        <BlockedManagerModal
          isOpen={showBlockedModal}
          onClose={() => setShowBlockedModal(false)}
          blockedList={blockedNumbers}
          onUnblock={(num) => handleOpenConfirm('unblock', num)}
          onAddNewBlocked={async (num, name, cat) => {
            await spamShieldService.blockNumber(num, name, cat);
            const b = await spamShieldService.getBlockedNumbers();
            setBlockedNumbers(b);
          }}
        />

        {/* Statistics Modal (Section 10) */}
        {stats && (
          <StatisticsModal
            isOpen={showStatsModal}
            onClose={() => setShowStatsModal(false)}
            stats={stats}
          />
        )}

        {/* Notification Center Modal */}
        <NotificationCenterModal
          isOpen={showNotificationsModal}
          onClose={() => setShowNotificationsModal(false)}
          notifications={notifications}
          onMarkRead={async (id) => {
            await spamShieldService.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
          }}
          onClearAll={async () => {
            await spamShieldService.clearAllNotifications();
            setNotifications([]);
          }}
          onSelectNotification={(item) => {
            setShowNotificationsModal(false);
            if (item.type === 'call') {
              const matchedCall = calls.find(c => c.phoneNumber === item.meta?.phoneNumber);
              if (matchedCall) setAnalysisItem({ item: matchedCall, type: 'call' });
            } else if (item.type === 'sms') {
              const matchedMsg = messages.find(m => m.sender === item.meta?.phoneNumber);
              if (matchedMsg) setAnalysisItem({ item: matchedMsg, type: 'message' });
            }
          }}
        />

        {/* Authentication Modal (Section 17) */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          currentUser={user}
          onUpdateUser={async (upd) => {
            const u = await spamShieldService.updateUser(upd);
            setUser(u);
          }}
        />

        {/* Onboarding Flow (Section 12) */}
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('spamshield_onboarded', 'true');
            // Show permission explainer after onboarding as required by Section 13
            setShowPermissions(true);
          }}
        />

        {/* Permission Setup Screen (Section 13) */}
        <PermissionModal
          isOpen={showPermissions}
          onGrantAll={async () => {
            await nativeMobileService.requestNotificationPermissions();
            setShowPermissions(false);
          }}
          onDismiss={() => {
            setShowPermissions(false);
          }}
        />

        {/* Project Presentation 6 Slides Deck Modal */}
        <PresentationModal
          isOpen={showPresentationDeck}
          onClose={() => setShowPresentationDeck(false)}
        />

      </div>
    </div>
  );
}
