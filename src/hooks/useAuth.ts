'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/stores/authStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useAuth() {
  const { user, loading, isAdmin, profileCompleted, setUser, setLoading, setAdmin, setProfileCompleted, reset } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAdmin(data.role === 'admin');
            setProfileCompleted(data.profileCompleted);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        reset();
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setAdmin, setProfileCompleted, reset]);

  return { user: user as User | null, loading, isAdmin, profileCompleted, initialized };
}
