import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  X, 
  Check, 
  Shield, 
  ArrowRight, 
  LogOut, 
  Loader2, 
  AlertCircle, 
  KeyRound,
  Sparkles,
  CloudCheck,
  Smartphone
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword, 
  logoutUser,
  mapFirebaseUserToProfile
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: Partial<UserProfile>) => void;
}

type AuthMode = 'profile' | 'signIn' | 'signUp' | 'forgotPassword';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  // If already logged in (not a guest and has email), default to profile view; otherwise default to signIn/profile
  const [authMode, setAuthMode] = useState<AuthMode>(currentUser.isGuest ? 'signIn' : 'profile');
  
  // Form fields
  const [emailInput, setEmailInput] = useState(currentUser.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser.phone || '');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getFriendlyErrorMessage = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Invalid email or password. If you do not have an account, click Sign Up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Try again or reset your password.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completing authentication.';
      case 'auth/popup-blocked':
        return 'Google Sign-In popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      case 'auth/operation-not-allowed':
        return 'Email/Google sign-in is being configured. Please try again in a moment.';
      default:
        return error?.message || 'Authentication failed. Please try again.';
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const fbUser = await loginWithGoogle();
      const mapped = mapFirebaseUserToProfile(fbUser);
      onUpdateUser(mapped);
      setSuccessMessage('Successfully signed in with Google!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fbUser = await loginWithEmail(emailInput, passwordInput);
      const mapped = mapFirebaseUserToProfile(fbUser);
      onUpdateUser(mapped);
      setSuccessMessage('Signed in successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Registration
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setErrorMessage('Please provide an email and password.');
      return;
    }

    if (passwordInput.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fbUser = await registerWithEmail(emailInput, passwordInput, nameInput);
      const mapped = mapFirebaseUserToProfile(fbUser, { name: nameInput });
      onUpdateUser(mapped);
      setSuccessMessage('Account created and cloud protection activated!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Email Sign-Up Error:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Password Reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Please enter your email to receive a password reset link.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await resetPassword(emailInput);
      setSuccessMessage(`Password reset link sent to ${emailInput.trim()}. Check your inbox.`);
      setTimeout(() => {
        setAuthMode('signIn');
      }, 2500);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      onUpdateUser({
        name: 'Guest User',
        email: '',
        isGuest: true,
        avatarUrl: undefined,
        protectionTier: 'Standard'
      });
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
        setAuthMode('signIn');
      }, 1000);
    } catch (err: any) {
      console.error('Logout error:', err);
      setErrorMessage('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Continue as Guest
  const handleContinueAsGuest = () => {
    onUpdateUser({
      name: nameInput.trim() || 'Guest Protection Mode',
      isGuest: true,
      protectionTier: 'Standard'
    });
    onClose();
  };

  // Save local details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: nameInput.trim() || currentUser.name,
      phone: phoneInput.trim()
    });
    setSuccessMessage('Local preferences updated');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {authMode === 'profile' 
                  ? 'Account & Cloud Protection' 
                  : authMode === 'signUp'
                  ? 'Create Spam Shield Account'
                  : authMode === 'forgotPassword'
                  ? 'Reset Password'
                  : 'Sign In to Spam Shield'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {!currentUser.isGuest ? 'Cloud Synchronized' : 'Guest / Offline Mode'}
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

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Global Success Notice */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* VIEW 1: SIGNED-IN PROFILE VIEW */}
        {authMode === 'profile' && !currentUser.isGuest && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-12 h-12 rounded-full border border-blue-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-base shadow-inner">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  {currentUser.phone && (
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{currentUser.phone}</p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bold">Tier: {currentUser.protectionTier}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Cloud Active</span>
                </div>
              </div>
            </div>

            {/* Profile Customization Form */}
            <form onSubmit={handleSaveProfile} className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Caller ID & Device Settings
              </span>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Simulated Protected Mobile</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 00001"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800/80 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 2: SIGN IN (Google + Email) */}
        {authMode === 'signIn' && (
          <div className="space-y-4">
            {/* Google Sign In Button */}
            <button
              id="auth-google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-3 my-1">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                or sign in with email
              </span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setAuthMode('forgotPassword');
                    }}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                id="auth-email-signin-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle to Sign Up & Guest */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('signUp');
                  }}
                  className="font-bold text-blue-400 hover:text-blue-300 ml-1"
                >
                  Create one now
                </button>
              </p>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-[11px] text-slate-500 hover:text-slate-400 underline block mx-auto pt-1"
              >
                Skip & continue as Guest (Local protection only)
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: SIGN UP (Register) */}
        {authMode === 'signUp' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Krishna Sharma"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Create Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              id="auth-email-signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Create Account & Protect</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('signIn');
                  }}
                  className="font-bold text-blue-400 hover:text-blue-300 ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD */}
        {authMode === 'forgotPassword' && (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered email address and we'll send you a password reset link.
            </p>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setAuthMode('signIn');
                }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
