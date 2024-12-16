import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';
import { createUser, getUserData } from './firestore';
import type { User } from '../../types';

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserData(userCredential.user.uid);
    return userData;
  } catch (error) {
    throw new Error('فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  name: string,
  role: User['role'] = 'member'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = {
      id: userCredential.user.uid,
      email,
      name,
      role,
      createdAt: new Date(),
    };
    await createUser(user);
    return user;
  } catch (error) {
    throw new Error('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.');
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};