import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { NutritionProperty } from '../../types';

const COLLECTION_NAME = 'nutritionProperties';

export const getNutritionProperties = async () => {
  const propertiesRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(propertiesRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as NutritionProperty[];
};

export const addNutritionProperty = async (data: Omit<NutritionProperty, 'id' | 'createdAt' | 'updatedAt'>) => {
  const propertiesRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(propertiesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateNutritionProperty = async (id: string, data: Partial<NutritionProperty>) => {
  const propertyRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(propertyRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteNutritionProperty = async (id: string) => {
  const propertyRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(propertyRef);
};

export const findNutritionProperty = async (name: string) => {
  const propertiesRef = collection(db, COLLECTION_NAME);
  const q = query(propertiesRef, where('name', '==', name));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as NutritionProperty;
}; 