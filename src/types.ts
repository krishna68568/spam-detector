export type DetectionStatus = 'safe' | 'spam' | 'suspicious' | 'blocked';

export type CallCategory = 
  | 'Telemarketing' 
  | 'Banking Scam' 
  | 'Lottery Fraud' 
  | 'Robocall' 
  | 'Debt Collector' 
  | 'KYC Phishing' 
  | 'Job Scam' 
  | 'Safe Caller';

export type MessageCategory =
  | 'Bank KYC Scam'
  | 'Promotional Scam'
  | 'Electricity Bill Threat'
  | 'Lottery / Prize Fraud'
  | 'Part-Time Job Scam'
  | 'Loan Approval Phishing'
  | 'Legitimate OTP / Transaction'
  | 'Personal Message';

export interface CallRecord {
  id: string;
  phoneNumber: string;
  callerName?: string;
  timestamp: string;
  relativeTime: string;
  confidence: number; // 0 - 100
  status: DetectionStatus;
  category: CallCategory;
  reportsCount: number;
  duration?: string;
  callType: 'incoming' | 'missed' | 'blocked';
  notes?: string;
}

export interface MessageRecord {
  id: string;
  sender: string;
  senderName?: string;
  body: string;
  timestamp: string;
  relativeTime: string;
  confidence: number; // 0 - 100
  status: DetectionStatus;
  category: MessageCategory;
  reasons: string[];
  recommendedAction: string;
  isRead?: boolean;
}

export interface BlockedNumber {
  id: string;
  phoneNumber: string;
  name?: string;
  category: string;
  blockedAt: string;
  reportsCount: number;
  reason: string;
}

export interface DetectionResult {
  target: string;
  type: 'phone' | 'message';
  status: DetectionStatus;
  confidence: number;
  category: string;
  reasons: string[];
  recommendedAction: string;
  reportsCount?: number;
  previousHistory?: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface ProtectionStats {
  totalCallsChecked: number;
  spamCallsDetected: number;
  spamCallsBlocked: number;
  messagesAnalyzed: number;
  spamMessagesDetected: number;
  protectionScore: number;
  activeSinceDays: number;
  weeklyActivity: {
    day: string;
    dayFull: string;
    spamCalls: number;
    spamMessages: number;
  }[];
  topCategories: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface AppSettings {
  // Protection
  spamCallDetection: boolean;
  spamSmsDetection: boolean;
  autoBlockHighRisk: boolean;
  showSpamNotifications: boolean;
  // Call Settings
  blockUnknownNumbers: boolean;
  blockReportedNumbers: boolean;
  allowContacts: boolean;
  // Message Settings
  autoMoveSpamSms: boolean;
  notifyDetectedSpam: boolean;
  // Security DB
  offlineDatabaseEnabled: boolean;
  dailyAutoUpdate: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  type: 'call' | 'sms' | 'system';
  status: DetectionStatus;
  confidence: number;
  timestamp: string;
  read: boolean;
  meta?: {
    phoneNumber?: string;
    category?: string;
  };
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  isGuest: boolean;
  avatarUrl?: string;
  protectionTier: 'Standard' | 'Pro' | 'Enterprise';
}

export type TabType = 'home' | 'calls' | 'messages' | 'check' | 'settings';
