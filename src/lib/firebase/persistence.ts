import { enableIndexedDbPersistence } from 'firebase/firestore';
import { db } from './config';

export const initializePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.info('Firebase persistence initialized successfully');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence not supported in this browser');
    }
  }
};