import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc,
  doc,
  startOf,
  endOf
} from 'firebase/firestore';
import { db } from './config';
import type { SavedFood } from '../../types/nutrition';
import { auth } from './config';
import type { NutritionEntry } from '../../types';
import { findNutritionProperty } from './nutritionProperties';
import { analyzeNutrition } from '../openai/nutrition';
import { startOfDay, endOfDay } from 'date-fns';

const COLLECTION_NAME = 'nutritionEntries';

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

export const getUserPreviousMeals = async () => {
  const { currentUser } = auth;
  if (!currentUser) throw new Error('No user logged in');

  const mealsRef = collection(db, 'nutrition');
  const q = query(
    mealsRef,
    where('userId', '==', currentUser.uid),
    orderBy('date', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NutritionEntry[];
};

export const getNutritionEntriesByDate = async (date: Date) => {
  const entriesRef = collection(db, COLLECTION_NAME);
  const start = startOfDay(date);
  const end = endOfDay(date);
  
  const q = query(
    entriesRef,
    where('date', '>=', start),
    where('date', '<=', end)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NutritionEntry[];
};

export const addNutritionEntry = async (data: Omit<NutritionEntry, 'id'>) => {
  const entriesRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(entriesRef, {
    ...data,
    createdAt: serverTimestamp()
  });
  
  return {
    id: docRef.id,
    ...data
  } as NutritionEntry;
};

export const addNutritionProperty = async (data: NutritionPropertyInput) => {
  try {
    if (!auth.currentUser?.uid) throw new Error('No user logged in');

    const propertiesRef = collection(db, 'nutritionProperties');
    const q = query(propertiesRef, where('name', '==', data.name));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(propertiesRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      console.log('Added new nutrition property:', data.name);
    }
  } catch (error) {
    console.error('Error adding nutrition property:', error);
    throw error;
  }
};

export const deleteNutritionEntry = async (id: string) => {
  const entryRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(entryRef);
};

export const deleteAllNutritionEntries = async (date: Date) => {
  const entries = await getNutritionEntriesByDate(date);
  await Promise.all(entries.map(entry => deleteNutritionEntry(entry.id)));
};

export const copyNutritionEntries = async (sourceDate: Date, targetDate: Date) => {
  try {
    const entries = await getNutritionEntriesByDate(sourceDate);
    
    const copiedEntries = await Promise.all(
      entries.map(entry => {
        const { id, ...entryData } = entry;
        const newEntry = {
          ...entryData,
          date: targetDate,
          createdAt: serverTimestamp()
        };
        return addNutritionEntry(newEntry);
      })
    );

    return copiedEntries;
  } catch (error) {
    console.error('Error copying nutrition entries:', error);
    throw new Error('فشل في نسخ الوجبات');
  }
};

export const getNutritionHistory = async (userId: string) => {
  const entriesRef = collection(db, COLLECTION_NAME);
  const q = query(
    entriesRef,
    where('userId', '==', userId),
    where('date', '<=', new Date())
  );
  
  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NutritionEntry[];

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateStr = new Date(entry.date).toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: new Date(entry.date),
        meals: []
      };
    }
    acc[dateStr].meals.push(entry);
    return acc;
  }, {} as Record<string, { date: Date; meals: NutritionEntry[] }>);

  return Object.values(groupedEntries);
};