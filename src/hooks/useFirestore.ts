'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, orderBy, limit, startAfter, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useFirestore<T>(collectionName: string, constraints: QueryConstraint[] = [], deps: any[] = []) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string })));
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(deps)]);

  return { data, loading, error };
}

export async function getDocById<T>(col: string, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as T & { id: string } : null;
}

export async function createDoc(col: string, data: DocumentData): Promise<string> {
  const ref = await addDoc(collection(db, col), { ...data, createdAt: new Date(), updatedAt: new Date() });
  return ref.id;
}

export async function updateDocById(col: string, id: string, data: Partial<DocumentData>): Promise<void> {
  await setDoc(doc(db, col, id), { ...data, updatedAt: new Date() }, { merge: true });
}

export async function deleteDocById(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}
