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
  doc
} from 'firebase/firestore';
import { db } from './config';
import type { SavedFood } from '../../types/nutrition';
import { auth } from './config';
import type { NutritionEntry } from '../../types';
import { findNutritionProperty } from './nutritionProperties';
import { analyzeNutrition } from '../openai/nutrition';

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

export const getNutritionEntriesByDate = async (date: string) => {
  const { currentUser } = auth;
  if (!currentUser) throw new Error('No user logged in');

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const mealsRef = collection(db, 'nutrition');
  const q = query(
    mealsRef,
    where('userId', '==', currentUser.uid),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || new Date()
  })) as NutritionEntry[];
};

export const addNutritionEntry = async (data: NutritionAnalysis) => {
  try {
    if (!auth.currentUser) throw new Error('No user logged in');
    if (!data.food) throw new Error('Food name is required');

    const normalizedFoodName = data.food.trim().toLowerCase();

    const existingProperty = await findNutritionProperty(normalizedFoodName);
    
    let nutritionData;
    
    if (existingProperty) {
      const ratio = data.amount / existingProperty.standardServing;
      nutritionData = {
        food: data.food,
        amount: data.amount,
        unit: data.unit || 'جرام',
        calories: Math.round(existingProperty.calories * ratio),
        protein: +(existingProperty.protein * ratio).toFixed(1),
        carbs: +(existingProperty.carbs * ratio).toFixed(1),
        fats: +(existingProperty.fats * ratio).toFixed(1)
      };
    } else {
      const standardRatio = 100 / data.amount;
      
      await addNutritionProperty({
        name: normalizedFoodName,
        standardServing: 100,
        unit: 'جرام',
        calories: Math.round(data.calories * standardRatio),
        protein: +(data.protein * standardRatio).toFixed(1),
        carbs: +(data.carbs * standardRatio).toFixed(1),
        fats: +(data.fats * standardRatio).toFixed(1)
      });

      nutritionData = {
        food: data.food,
        amount: data.amount,
        unit: data.unit || 'جرام',
        calories: Math.round(data.calories),
        protein: +data.protein.toFixed(1),
        carbs: +data.carbs.toFixed(1),
        fats: +data.fats.toFixed(1)
      };
    }

    const entryRef = collection(db, 'nutrition');
    const docRef = await addDoc(entryRef, {
      ...nutritionData,
      userId: auth.currentUser.uid,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      ...nutritionData,
      userId: auth.currentUser.uid,
      date: new Date()
    };

  } catch (error) {
    console.error('Error adding nutrition entry:', error);
    throw error;
  }
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
  try {
    if (!auth.currentUser) throw new Error('No user logged in');

    const entryRef = doc(db, 'nutrition', id);
    
    await deleteDoc(entryRef);
    
    console.log('Successfully deleted entry:', id);
  } catch (error) {
    console.error('Error deleting nutrition entry:', error);
    throw new Error('فشل في حذف الوجبة');
  }
};

export const deleteAllNutritionEntries = async (date: Date) => {
  try {
    if (!auth.currentUser) throw new Error('No user logged in');

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const entriesRef = collection(db, 'nutrition');
    const q = query(
      entriesRef,
      where('userId', '==', auth.currentUser.uid),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('Successfully deleted all entries for date:', date);
  } catch (error) {
    console.error('Error deleting all nutrition entries:', error);
    throw new Error('فشل في حذف جميع الوجبات');
  }
};