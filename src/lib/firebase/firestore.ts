import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';

export async function getDocument(col: string, id: string) {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createDocument(col: string, data: DocumentData) {
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(col: string, id: string, data: Partial<DocumentData>) {
  await setDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteDocument(col: string, id: string) {
  await deleteDoc(doc(db, col, id));
}

export async function queryDocuments(
  col: string,
  constraints: QueryConstraint[],
  lastDoc?: DocumentData
) {
  const q = query(collection(db, col), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function queryPaginated(
  col: string,
  constraints: QueryConstraint[],
  lastDocSnap?: DocumentData
) {
  const q = query(
    collection(db, col),
    ...constraints,
    ...(lastDocSnap ? [startAfter(lastDocSnap)] : [])
  );
  const snap = await getDocs(q);
  return {
    docs: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length > 0,
  };
}
