'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '@/stores/authStore';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
  profileCompleted: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  profileCompleted: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setAdmin, setProfileCompleted, reset } = useAuthStore();
  const [contextUser, setContextUser] = useState<User | null>(null);
  const [contextUserData, setContextUserData] = useState<any | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextIsAdmin, setContextIsAdmin] = useState(false);
  const [contextProfileCompleted, setContextProfileCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setContextUser(firebaseUser);
        
        try {
          // Check Custom Claims first for secure admin identification
          const tokenResult = await firebaseUser.getIdTokenResult();
          const isClaimAdmin = !!tokenResult.claims.admin || !!tokenResult.claims.sadmin || !!tokenResult.claims.superadmin;
          
          // Fallback checks for the admin account
          const isAdminEmail = firebaseUser.email === 'admin@gmail.com';
          const isUIDAdmin = firebaseUser.uid === 'Y5A51nX94Ifz9UIiYUq9tjxKWDC2';
          
          let isAdminRole = isClaimAdmin || isAdminEmail || isUIDAdmin;

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();
            setContextUserData(data);
            isAdminRole = isAdminRole || ['admin', 'sadmin', 'superadmin'].includes(data.role);
            setContextProfileCompleted(data.profileCompleted);
            setProfileCompleted(data.profileCompleted);
          } else {
             // Initialize minimal profile for the admin to see
             const initialData = {
               email: firebaseUser.email,
               displayName: firebaseUser.displayName || 'New User',
               photoURL: firebaseUser.photoURL || '',
               isVerified: false,
               profileCompleted: false,
               status: 'active',
               role: isAdminRole ? 'admin' : 'user',
               createdAt: serverTimestamp(),
               updatedAt: serverTimestamp(),
             };
             await setDoc(doc(db, 'users', firebaseUser.uid), initialData, { merge: true });
             setContextUserData(initialData);
             setContextProfileCompleted(false);
             setProfileCompleted(false);
          }
          
          setContextIsAdmin(isAdminRole);
          setAdmin(isAdminRole);
          
        } catch (error) {
          console.error('Error fetching user profile/claims:', error);
        }
      } else {
        reset();
        setContextUser(null);
        setContextUserData(null);
        setContextIsAdmin(false);
        setContextProfileCompleted(false);
      }
      setContextLoading(false);
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: contextUser,
        userData: contextUserData,
        loading: contextLoading,
        isAdmin: contextIsAdmin,
        profileCompleted: contextProfileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
