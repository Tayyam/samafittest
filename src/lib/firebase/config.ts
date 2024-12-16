import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAnalytics } from './analytics';
import { initializePersistence } from './persistence';

const firebaseConfig = {
  apiKey: "AIzaSyDsmlAplAg1yjHiTzpqOWTLPDXueEmsJIw",
  authDomain: "samafit-264c2.firebaseapp.com",
  projectId: "samafit-264c2",
  storageBucket: "samafit-264c2.firebasestorage.app",
  messagingSenderId: "20786630905",
  appId: "1:20786630905:web:036aeeadd7b8bdfe65d228",
  measurementId: "G-G1PNHPBPCH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize features
initializeAnalytics();
initializePersistence();