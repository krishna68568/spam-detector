import { 
  CallRecord, 
  MessageRecord, 
  BlockedNumber, 
  DetectionResult, 
  ProtectionStats, 
  AppSettings,
  NotificationItem,
  UserProfile
} from '../types';

// Initial realistic Indian Call History demo data
const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-1',
    phoneNumber: '+91 98765 43210',
    callerName: 'Potential Telemarketing',
    timestamp: '2026-09-11T10:45:00',
    relativeTime: '12m ago',
    confidence: 94,
    status: 'spam',
    category: 'Telemarketing',
    reportsCount: 142,
    duration: '0s (Auto-screened)',
    callType: 'blocked',
    notes: 'Aggressive credit card sales robot repeatedly flagging numbers.'
  },
  {
    id: 'call-2',
    phoneNumber: '+91 87654 32109',
    callerName: 'Fake Banking Service',
    timestamp: '2026-09-11T09:20:00',
    relativeTime: '1h 37m ago',
    confidence: 98,
    status: 'blocked',
    category: 'Banking Scam',
    reportsCount: 310,
    duration: '0s (Auto-blocked)',
    callType: 'blocked',
    notes: 'Impersonating State Bank branch claiming urgent debit card deactivation.'
  },
  {
    id: 'call-3',
    phoneNumber: '+91 99887 66554',
    callerName: 'Unknown Mobile',
    timestamp: '2026-09-11T08:15:00',
    relativeTime: '2h 42m ago',
    confidence: 76,
    status: 'suspicious',
    category: 'Robocall',
    reportsCount: 48,
    duration: '4s',
    callType: 'incoming',
    notes: 'Automated prerecorded IVR regarding lottery sweepstakes.'
  },
  {
    id: 'call-4',
    phoneNumber: '+91 91234 56789',
    callerName: 'Dr. Anita Roy (Clinic)',
    timestamp: '2026-09-10T17:30:00',
    relativeTime: 'Yesterday, 5:30 PM',
    confidence: 4,
    status: 'safe',
    category: 'Safe Caller',
    reportsCount: 0,
    duration: '1m 24s',
    callType: 'incoming',
    notes: 'Verified contact and clinic appointment confirmation.'
  },
  {
    id: 'call-5',
    phoneNumber: '+91 98111 22334',
    callerName: 'Fast Cash Loan Offer',
    timestamp: '2026-09-10T14:10:00',
    relativeTime: 'Yesterday, 2:10 PM',
    confidence: 91,
    status: 'spam',
    category: 'Job Scam',
    reportsCount: 89,
    duration: '0s (Silenced)',
    callType: 'missed',
    notes: 'Instant loan with high commission upfront scam.'
  },
  {
    id: 'call-6',
    phoneNumber: '+91 70123 45678',
    callerName: 'Electric Bill cut-off Alert',
    timestamp: '2026-09-09T11:05:00',
    relativeTime: '2 days ago',
    confidence: 96,
    status: 'spam',
    category: 'KYC Phishing',
    reportsCount: 224,
    duration: '0s (Auto-blocked)',
    callType: 'blocked',
    notes: 'Power disconnection phishing operation active in Maharashtra/Delhi.'
  },
  {
    id: 'call-7',
    phoneNumber: '+91 94567 89012',
    callerName: 'Aarav Sharma',
    timestamp: '2026-09-08T19:40:00',
    relativeTime: '3 days ago',
    confidence: 2,
    status: 'safe',
    category: 'Safe Caller',
    reportsCount: 0,
    duration: '4m 12s',
    callType: 'incoming',
    notes: 'Saved phonebook contact.'
  }
];

// Initial realistic Indian SMS demo data
const INITIAL_MESSAGES: MessageRecord[] = [
  {
    id: 'msg-1',
    sender: '+91 98765 43210',
    senderName: 'AX-PRIZE',
    body: 'Congratulations! You have won a ₹50,000 lottery prize under Digital India Scheme. Click http://bit.ly/claim-in-prize to claim immediately before expiry today!',
    timestamp: '2026-09-11T10:15:00',
    relativeTime: '42m ago',
    confidence: 97,
    status: 'spam',
    category: 'Lottery / Prize Fraud',
    reasons: [
      'Suspicious promotional claim with unrealistic financial award',
      'Unverified shortened hyperlink (bit.ly)',
      'Artificial urgency ("before expiry today")',
      'Sender not registered on official DLT registry'
    ],
    recommendedAction: 'Do not click the link or provide any bank credentials.',
    isRead: false
  },
  {
    id: 'msg-2',
    sender: '+91 87654 32109',
    senderName: 'VK-SBISYS',
    body: 'Dear SBI Customer, your YONO account is suspended due to incomplete KYC! Update PAN card immediately to avoid permanent lock: https://sbi-kyc-reactivate.xyz/login',
    timestamp: '2026-09-11T08:50:00',
    relativeTime: '2h 7m ago',
    confidence: 99,
    status: 'spam',
    category: 'Bank KYC Scam',
    reasons: [
      'High-risk banking phishing domain (.xyz TLD pretending to be SBI)',
      'Threatening language ("suspended immediately", "permanent lock")',
      'Requests sensitive government ID credentials (PAN / NetBanking)',
      'Disguised spoofed alphanumeric sender header'
    ],
    recommendedAction: 'Immediately report and delete. Banks never ask for KYC via SMS links.',
    isRead: false
  },
  {
    id: 'msg-3',
    sender: '+91 99887 66554',
    senderName: 'JD-CAREER',
    body: 'Part-time Work From Home Opportunity! Earn ₹3,000 to ₹8,000 daily by liking YouTube videos. No experience required. WhatsApp HR at +91 91234 00000 now!',
    timestamp: '2026-09-10T16:20:00',
    relativeTime: 'Yesterday',
    confidence: 93,
    status: 'spam',
    category: 'Part-Time Job Scam',
    reasons: [
      'Unrealistic daily income claims for trivial tasks',
      'Directs user to unofficial encrypted messaging apps (WhatsApp / Telegram)',
      'Classic task-based prepayment fraud syndicate pattern'
    ],
    recommendedAction: 'Block number and do not reach out on messaging apps.',
    isRead: true
  },
  {
    id: 'msg-4',
    sender: '+91 94567 11223',
    senderName: 'CP-DISCOM',
    body: 'Dear Consumer, Electricity power supply will be disconnected tonight at 9:30 PM due to unpaid previous month bill. Call Electricity Officer on 98765xxxxx.',
    timestamp: '2026-09-09T14:45:00',
    relativeTime: '2 days ago',
    confidence: 95,
    status: 'spam',
    category: 'Electricity Bill Threat',
    reasons: [
      'Coercive disconnection deadline threat',
      'Personal 10-digit mobile number provided instead of official discom portal',
      'High incidence of APK malware delivery'
    ],
    recommendedAction: 'Verify pending bills only through your official electricity provider app.',
    isRead: true
  },
  {
    id: 'msg-5',
    sender: '+91 98111 44556',
    senderName: 'HDFC-ALERT',
    body: 'Your HDFC Bank A/C ending in 4102 has been debited for INR 450.00 on 10-Sep-26 at SWIGGY. Available balance: INR 24,190.50. If not done by you, SMS BLOCK to 5676712.',
    timestamp: '2026-09-10T12:04:00',
    relativeTime: 'Yesterday',
    confidence: 3,
    status: 'safe',
    category: 'Legitimate OTP / Transaction',
    reasons: [
      'Authentic financial transactional format',
      'Registered banking sender ID header',
      'No suspicious external web links'
    ],
    recommendedAction: 'Safe transactional alert for your records.',
    isRead: true
  },
  {
    id: 'msg-6',
    sender: '+91 78901 23456',
    senderName: 'DEAL-HUB',
    body: 'Special Flash Sale! Flat 70% off on premium apparel and electronics this weekend only. Use coupon code SPAM50 at checkout.',
    timestamp: '2026-09-08T18:00:00',
    relativeTime: '3 days ago',
    confidence: 68,
    status: 'suspicious',
    category: 'Promotional Scam',
    reasons: [
      'Unsolicited bulk marketing push',
      'Unknown merchant identity'
    ],
    recommendedAction: 'Review sender permissions or opt out if unsolicited.',
    isRead: true
  }
];

// Initial Blocked Numbers
const INITIAL_BLOCKED: BlockedNumber[] = [
  {
    id: 'blk-1',
    phoneNumber: '+91 98765 43210',
    name: 'Auto-Spam Telemarketer',
    category: 'Telemarketing',
    blockedAt: '11 Sep 2026, 10:45 AM',
    reportsCount: 142,
    reason: 'Frequent unsolicited insurance and credit card robocalls'
  },
  {
    id: 'blk-2',
    phoneNumber: '+91 87654 32109',
    name: 'SBI Fake KYC Phisher',
    category: 'Scam',
    blockedAt: '11 Sep 2026, 09:22 AM',
    reportsCount: 310,
    reason: 'Aggressive phishing SMS campaign targeting netbanking'
  },
  {
    id: 'blk-3',
    phoneNumber: '+91 70123 45678',
    name: 'Discom Power Extortion',
    category: 'Phishing',
    blockedAt: '09 Sep 2026, 11:10 AM',
    reportsCount: 224,
    reason: 'Threatening false power disconnection message source'
  }
];

// Default App Settings
const DEFAULT_SETTINGS: AppSettings = {
  spamCallDetection: true,
  spamSmsDetection: true,
  autoBlockHighRisk: true,
  showSpamNotifications: true,
  blockUnknownNumbers: false,
  blockReportedNumbers: true,
  allowContacts: true,
  autoMoveSpamSms: true,
  notifyDetectedSpam: true,
  offlineDatabaseEnabled: true,
  dailyAutoUpdate: true,
};

// Default User Profile
export const DEFAULT_USER: UserProfile = {
  name: 'Security Protected User',
  phone: '+91 98765 00000',
  isGuest: true,
  protectionTier: 'Standard',
};

class SpamShieldService {
  private calls: CallRecord[] = [];
  private messages: MessageRecord[] = [];
  private blocked: BlockedNumber[] = [];
  private settings: AppSettings = DEFAULT_SETTINGS;
  private user: UserProfile = DEFAULT_USER;
  private notifications: NotificationItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedCalls = localStorage.getItem('spamshield_calls');
      this.calls = storedCalls ? JSON.parse(storedCalls) : INITIAL_CALLS;

      const storedMessages = localStorage.getItem('spamshield_messages');
      this.messages = storedMessages ? JSON.parse(storedMessages) : INITIAL_MESSAGES;

      const storedBlocked = localStorage.getItem('spamshield_blocked');
      this.blocked = storedBlocked ? JSON.parse(storedBlocked) : INITIAL_BLOCKED;

      const storedSettings = localStorage.getItem('spamshield_settings');
      this.settings = storedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) } : DEFAULT_SETTINGS;

      const storedUser = localStorage.getItem('spamshield_user');
      this.user = storedUser ? JSON.parse(storedUser) : DEFAULT_USER;

      // Seed initial notification items
      this.notifications = [
        {
          id: 'notif-1',
          title: '🚨 Spam Call Detected',
          subtitle: '+91 98765 43210',
          detail: 'Potential telemarketing call screened and blocked.',
          type: 'call',
          status: 'spam',
          confidence: 94,
          timestamp: '12m ago',
          read: false,
          meta: { phoneNumber: '+91 98765 43210', category: 'Telemarketing' }
        },
        {
          id: 'notif-2',
          title: '🚨 Spam Message Detected',
          subtitle: 'Congratulations! You won ₹50,000...',
          detail: 'High risk lottery fraud message quarantined.',
          type: 'sms',
          status: 'spam',
          confidence: 97,
          timestamp: '45m ago',
          read: false,
          meta: { phoneNumber: '+91 98765 43210', category: 'Lottery / Prize Fraud' }
        },
        {
          id: 'notif-3',
          title: '🛡️ Offline Database Updated',
          subtitle: 'Over 14,000 new flagged spam numbers synced.',
          detail: 'Your on-device spam detection rules are up to date.',
          type: 'system',
          status: 'safe',
          confidence: 100,
          timestamp: '3h ago',
          read: true
        }
      ];
    } catch {
      this.calls = INITIAL_CALLS;
      this.messages = INITIAL_MESSAGES;
      this.blocked = INITIAL_BLOCKED;
      this.settings = DEFAULT_SETTINGS;
      this.user = DEFAULT_USER;
    }
  }

  private saveCalls() {
    try {
      localStorage.setItem('spamshield_calls', JSON.stringify(this.calls));
    } catch (e) {
      console.warn('Storage quota or private mode', e);
    }
  }

  private saveMessages() {
    try {
      localStorage.setItem('spamshield_messages', JSON.stringify(this.messages));
    } catch (e) {
      console.warn('Storage quota', e);
    }
  }

  private saveBlocked() {
    try {
      localStorage.setItem('spamshield_blocked', JSON.stringify(this.blocked));
    } catch (e) {
      console.warn('Storage quota', e);
    }
  }

  private saveSettingsToStorage() {
    try {
      localStorage.setItem('spamshield_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Storage quota', e);
    }
  }

  // --- API Endpoints ---

  /**
   * Check phone number for spam confidence and history
   */
  async checkPhoneNumber(rawNumber: string): Promise<DetectionResult> {
    // Artificial latency simulating AI / Cloud security verification
    await new Promise((resolve) => setTimeout(resolve, 850));

    const cleaned = rawNumber.trim().replace(/\s+/g, '');
    
    // Check if already blocked in our database
    const isAlreadyBlocked = this.blocked.some(
      b => b.phoneNumber.replace(/\s+/g, '') === cleaned
    );

    // Known spam list detection
    const isKnownSpam = 
      cleaned.includes('9876543210') ||
      cleaned.includes('8765432109') ||
      cleaned.includes('9811122334') ||
      cleaned.includes('7012345678') ||
      cleaned.endsWith('0000') ||
      cleaned.endsWith('6666') ||
      cleaned.endsWith('43210');

    const isSuspicious = 
      cleaned.includes('99887') ||
      cleaned.includes('78901') ||
      cleaned.length < 10;

    if (isAlreadyBlocked) {
      return {
        target: rawNumber,
        type: 'phone',
        status: 'blocked',
        confidence: 96,
        category: 'Telemarketing / Scam',
        reasons: [
          'Directly located on your personal Blocked Numbers list',
          'Over 140+ community reports for unsolicited marketing',
          'High frequency outbound call activity detected in telecom network'
        ],
        recommendedAction: 'Keep blocked. Number has repeated harassment violations.',
        reportsCount: 142,
        previousHistory: 'Blocked 3 times previously. Flagged across 12 telecom circles.',
        riskLevel: 'Critical'
      };
    }

    if (isKnownSpam) {
      return {
        target: rawNumber,
        type: 'phone',
        status: 'spam',
        confidence: 94,
        category: 'Telemarketing',
        reasons: [
          'High outbound robocall ratio (98.4% short calls)',
          '128 verified user complaints in the last 7 days',
          'Identified as unverified financial telemarketer',
          'Caller ID signature spoofing risk'
        ],
        recommendedAction: 'Block number immediately and do not return missed calls.',
        reportsCount: 128,
        previousHistory: 'Active spam campaign since August 2026.',
        riskLevel: 'High'
      };
    }

    if (isSuspicious) {
      return {
        target: rawNumber,
        type: 'phone',
        status: 'suspicious',
        confidence: 68,
        category: 'Unverified Unknown Caller',
        reasons: [
          'New number registered recently with irregular calling patterns',
          '14 recent user queries recorded on national spam database',
          'Not linked to any verified business or registered entity'
        ],
        recommendedAction: 'Answer with caution. Never share OTP or personal information.',
        reportsCount: 14,
        previousHistory: 'First observed 12 days ago.',
        riskLevel: 'Moderate'
      };
    }

    // Default Safe Number
    return {
      target: rawNumber,
      type: 'phone',
      status: 'safe',
      confidence: 98,
      category: 'Safe Caller',
      reasons: [
        'No malicious activity or spam reports logged',
        'Standard personal or verified corporate call pattern',
        'Passing all telecom STIR/SHAKEN and DLT verification checks'
      ],
      recommendedAction: 'Safe to answer. No security flags found.',
      reportsCount: 0,
      previousHistory: 'Clear reputation across all national security filters.',
      riskLevel: 'Low'
    };
  }

  /**
   * Analyze message text for phishing, lottery, KYC fraud, or spam patterns
   */
  async analyzeMessage(messageText: string): Promise<DetectionResult> {
    await new Promise((resolve) => setTimeout(resolve, 950));

    const lower = messageText.toLowerCase();

    const hasUrgency = lower.includes('urgent') || lower.includes('immediately') || lower.includes('expire') || lower.includes('suspended') || lower.includes('tonight') || lower.includes('lock');
    const hasPrize = lower.includes('won') || lower.includes('lottery') || lower.includes('prize') || lower.includes('₹') || lower.includes('claim') || lower.includes('50,000') || lower.includes('reward');
    const hasPhishingLink = lower.includes('http') || lower.includes('.xyz') || lower.includes('bit.ly') || lower.includes('.link') || lower.includes('click') || lower.includes('.ru');
    const hasBankKyc = lower.includes('kyc') || lower.includes('sbi') || lower.includes('pan card') || lower.includes('yono') || lower.includes('bank account') || lower.includes('debit card') || lower.includes('otp');
    const hasJobScam = lower.includes('work from home') || lower.includes('daily') || lower.includes('earn') || lower.includes('telegram') || lower.includes('whatsapp hr');

    if (hasBankKyc || (hasUrgency && hasPhishingLink)) {
      return {
        target: messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText,
        type: 'message',
        status: 'spam',
        confidence: 98,
        category: 'Bank KYC Scam',
        reasons: [
          'Suspicious spoofed bank brand claiming urgent deactivation',
          'Unverified hyperlink leading to malicious credential-harvesting site',
          'Coercive urgency tactics ("immediately", "avoid permanent lock")',
          'Legitimate Indian banks never solicit PAN or KYC updates via SMS links'
        ],
        recommendedAction: 'Do not respond, do not click any links, and do not disclose banking PINs.',
        riskLevel: 'Critical'
      };
    }

    if (hasPrize || hasJobScam) {
      return {
        target: messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText,
        type: 'message',
        status: 'spam',
        confidence: 96,
        category: 'Promotional Scam',
        reasons: [
          'Suspicious promotional language offering unrealistic monetary rewards',
          'Unknown unverified sender signature',
          'Classic prize / task-based prepayment fraudulent pattern',
          'Urgency-based wording intended to bypass rational scrutiny'
        ],
        recommendedAction: 'Do not respond or click any links. Delete this message.',
        riskLevel: 'High'
      };
    }

    if (hasUrgency || lower.includes('discount') || lower.includes('sale') || lower.includes('cashback')) {
      return {
        target: messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText,
        type: 'message',
        status: 'suspicious',
        confidence: 72,
        category: 'Unsolicited Promotion',
        reasons: [
          'High density of commercial promotion keywords',
          'Lacks official Indian DLT registration header'
        ],
        recommendedAction: 'Verify sender authenticity before clicking promotional links.',
        riskLevel: 'Moderate'
      };
    }

    // Default Safe message
    return {
      target: messageText.length > 80 ? messageText.substring(0, 80) + '...' : messageText,
      type: 'message',
      status: 'safe',
      confidence: 99,
      category: 'Safe Message',
      reasons: [
        'No deceptive financial or phishing indicators found',
        'Normal conversational or legitimate transactional text syntax',
        'Zero dangerous URLs detected'
      ],
      recommendedAction: 'Safe to read and respond.',
      riskLevel: 'Low'
    };
  }

  async getCallHistory(): Promise<CallRecord[]> {
    return [...this.calls];
  }

  async getMessageHistory(): Promise<MessageRecord[]> {
    return [...this.messages];
  }

  async getBlockedNumbers(): Promise<BlockedNumber[]> {
    return [...this.blocked];
  }

  async blockNumber(phoneNumber: string, name = 'Blocked Caller', category = 'Manual Block', reason = 'Manually blocked by user'): Promise<BlockedNumber> {
    const existingIndex = this.blocked.findIndex(b => b.phoneNumber === phoneNumber);
    if (existingIndex >= 0) {
      return this.blocked[existingIndex];
    }

    const newBlocked: BlockedNumber = {
      id: `blk-${Date.now()}`,
      phoneNumber,
      name,
      category,
      blockedAt: 'Just now',
      reportsCount: 1,
      reason
    };

    this.blocked = [newBlocked, ...this.blocked];
    this.saveBlocked();

    // Update status in call list if present
    this.calls = this.calls.map(c => 
      c.phoneNumber === phoneNumber ? { ...c, status: 'blocked' as const } : c
    );
    this.saveCalls();

    return newBlocked;
  }

  async unblockNumber(phoneNumber: string): Promise<boolean> {
    this.blocked = this.blocked.filter(b => b.phoneNumber !== phoneNumber);
    this.saveBlocked();

    // Revert status in call list
    this.calls = this.calls.map(c => 
      c.phoneNumber === phoneNumber ? { ...c, status: 'spam' as const } : c
    );
    this.saveCalls();

    return true;
  }

  async reportNumber(phoneNumber: string, category: string, note = ''): Promise<boolean> {
    // Increment local report count
    this.calls = this.calls.map(c => {
      if (c.phoneNumber === phoneNumber) {
        return {
          ...c,
          reportsCount: (c.reportsCount || 0) + 1,
          notes: note || c.notes
        };
      }
      return c;
    });
    this.saveCalls();
    return true;
  }

  async markAsSafe(id: string, type: 'call' | 'sms'): Promise<boolean> {
    if (type === 'call') {
      this.calls = this.calls.map(c => c.id === id ? { ...c, status: 'safe' as const, confidence: 2 } : c);
      this.saveCalls();
    } else {
      this.messages = this.messages.map(m => m.id === id ? { ...m, status: 'safe' as const, confidence: 1 } : m);
      this.saveMessages();
    }
    return true;
  }

  async deleteMessage(id: string): Promise<boolean> {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveMessages();
    return true;
  }

  async addSimulatedCall(phoneNumber = '+91 98765 43210', callerName = 'Potential Telemarketer'): Promise<CallRecord> {
    const newCall: CallRecord = {
      id: `call-${Date.now()}`,
      phoneNumber,
      callerName,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      confidence: 93,
      status: 'spam',
      category: 'Telemarketing',
      reportsCount: 165,
      duration: '0s (Auto-screened)',
      callType: 'blocked',
      notes: 'Real-time test call triggered.'
    };
    this.calls = [newCall, ...this.calls];
    this.saveCalls();
    return newCall;
  }

  async addSimulatedMessage(body: string, sender = '+91 87654 32109'): Promise<MessageRecord> {
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: 'VK-ALERT',
      body,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
      confidence: 98,
      status: 'spam',
      category: 'Bank KYC Scam',
      reasons: [
        'Urgent threat of service suspension',
        'Suspicious unverified URL link detected'
      ],
      recommendedAction: 'Quarantined by SpamShield. Do not open.',
      isRead: false
    };
    this.messages = [newMsg, ...this.messages];
    this.saveMessages();
    return newMsg;
  }

  async getProtectionStats(): Promise<ProtectionStats> {
    const spamCalls = this.calls.filter(c => c.status === 'spam' || c.status === 'blocked').length;
    const blockedCalls = this.calls.filter(c => c.status === 'blocked').length;
    const spamMessages = this.messages.filter(m => m.status === 'spam').length;

    return {
      totalCallsChecked: this.calls.length + 128,
      spamCallsDetected: spamCalls + 24,
      spamCallsBlocked: blockedCalls + 18,
      messagesAnalyzed: this.messages.length + 210,
      spamMessagesDetected: spamMessages + 37,
      protectionScore: 94,
      activeSinceDays: 45,
      weeklyActivity: [
        { day: 'Mon', dayFull: 'Monday', spamCalls: 5, spamMessages: 8 },
        { day: 'Tue', dayFull: 'Tuesday', spamCalls: 8, spamMessages: 11 },
        { day: 'Wed', dayFull: 'Wednesday', spamCalls: 3, spamMessages: 6 },
        { day: 'Thu', dayFull: 'Thursday', spamCalls: 7, spamMessages: 9 },
        { day: 'Fri', dayFull: 'Friday', spamCalls: 10, spamMessages: 14 },
        { day: 'Sat', dayFull: 'Saturday', spamCalls: 4, spamMessages: 5 },
        { day: 'Sun', dayFull: 'Sunday', spamCalls: 6, spamMessages: 7 }
      ],
      topCategories: [
        { name: 'Telemarketing', count: 42, percentage: 38, color: '#3B82F6' },
        { name: 'Bank KYC Phishing', count: 32, percentage: 29, color: '#EF4444' },
        { name: 'Lottery & Prize', count: 21, percentage: 19, color: '#F59E0B' },
        { name: 'Part-Time Job Scam', count: 16, percentage: 14, color: '#8B5CF6' }
      ]
    };
  }

  async getSettings(): Promise<AppSettings> {
    return { ...this.settings };
  }

  async updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettingsToStorage();
    return { ...this.settings };
  }

  async getUser(): Promise<UserProfile> {
    return { ...this.user };
  }

  async updateUser(userUpdates: Partial<UserProfile>): Promise<UserProfile> {
    this.user = { ...this.user, ...userUpdates };
    try {
      localStorage.setItem('spamshield_user', JSON.stringify(this.user));
    } catch {
      // ignore
    }
    return { ...this.user };
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async markNotificationRead(id: string): Promise<void> {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
  }

  async clearAllNotifications(): Promise<void> {
    this.notifications = [];
  }
}

export const spamShieldService = new SpamShieldService();
