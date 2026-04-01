import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

export async function registerUser(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginUser(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // Using popup for better UX on desktop, but you can switch to redirect if needed
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    // If popup is blocked or fails, fall back to redirect for production stability
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider);
    }
    throw error;
  }
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user || null;
}

export async function signOutUser() {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function getIdToken(user: User) {
  return user.getIdToken();
}
