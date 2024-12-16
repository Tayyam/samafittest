import { db } from './config';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export const updateDailyBurn = async (userId: string, data: { bmr?: number; activityCalories?: number }) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const burnRef = doc(db, 'dailyBurns', `${userId}_${today}`);

    const burnDoc = await getDoc(burnRef);
    
    if (!burnDoc.exists()) {
      await setDoc(burnRef, {
        userId,
        date: today,
        bmr: data.bmr || 0,
        activityCalories: data.activityCalories || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(burnRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating daily burn:', error);
    throw error;
  }
};

export const getDailyBurn = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const burnRef = doc(db, 'dailyBurns', `${userId}_${today}`);
    const burnDoc = await getDoc(burnRef);
    
    if (!burnDoc.exists()) {
      return { bmr: 0, activityCalories: 0 };
    }
    
    return burnDoc.data();
  } catch (error) {
    console.error('Error getting daily burn:', error);
    throw error;
  }
}; 