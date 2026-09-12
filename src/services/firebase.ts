import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);

// Google Auth Provider configured with account chooser
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore instance
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Map Firebase User to App UserProfile
export const mapFirebaseUserToProfile = (
  fbUser: FirebaseUser | null, 
  extraData?: Partial<UserProfile>
): UserProfile => {
  if (!fbUser) {
    return {
      name: 'Guest User',
      email: '',
      isGuest: true,
      protectionTier: 'Standard'
    };
  }

  return {
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'SpamShield User',
    email: fbUser.email || '',
    phone: fbUser.phoneNumber || extraData?.phone || '',
    isGuest: false,
    avatarUrl: fbUser.photoURL || undefined,
    protectionTier: extraData?.protectionTier || 'Pro'
  };
};

// Sync profile to Firestore
export const syncUserProfileToFirestore = async (fbUser: FirebaseUser, extra?: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', fbUser.uid);
    await setDoc(userRef, {
      uid: fbUser.uid,
      displayName: fbUser.displayName || '',
      email: fbUser.email || '',
      photoURL: fbUser.photoURL || '',
      phoneNumber: fbUser.phoneNumber || extra?.phone || '',
      protectionTier: extra?.protectionTier || 'Pro',
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync user profile to Firestore (may be offline or permissions):', err);
  }
};

// Fetch extra profile data from Firestore
export const fetchUserProfileFromFirestore = async (uid: string): Promise<Partial<UserProfile> | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err);
  }
  return null;
};

// Authentication Helper APIs
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserProfileToFirestore(result.user);
  return result.user;
};

export const loginWithEmail = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
};

export const registerWithEmail = async (email: string, pass: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName.trim()) {
    await updateProfile(result.user, {
      displayName: displayName.trim()
    });
  }
  await syncUserProfileToFirestore(result.user, { name: displayName.trim() });
  return result.user;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const logoutUser = async () => {
  await signOut(auth);
};

export { onAuthStateChanged };
export type { FirebaseUser };
