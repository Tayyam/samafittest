import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import type { SavedFood } from '../../types/nutrition';

export const getSavedFoods = async (userId: string): Promise<SavedFood[]> => {
  const q = query(
    collection(db, 'saved_foods'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as SavedFood[];
};

export const saveFood = async (food: Omit<SavedFood, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'saved_foods'), {
    ...food,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};