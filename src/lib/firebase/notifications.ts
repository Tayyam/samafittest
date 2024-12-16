import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Notification } from '../../types/notification';

export const getNotifications = async (
  userId: string,
  limitCount: number = 10
): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
  const notificationsRef = collection(db, 'notifications');
  const docRef = await addDoc(notificationsRef, {
    ...notification,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  const batch = [];
  
  snapshot.docs.forEach(doc => {
    batch.push(updateDoc(doc.ref, { read: true }));
  });

  await Promise.all(batch);
};

export const createNutritionReminder = async (userId: string) => {
  return createNotification({
    userId,
    type: 'nutrition',
    title: 'تذكير بتسجيل الوجبات',
    message: 'لم تقم بتسجيل أي وجبات اليوم. هل تريد تسجيل وجباتك الآن؟',
    read: false,
    link: '/nutrition'
  });
};

export const createWorkoutReminder = async (userId: string) => {
  return createNotification({
    userId,
    type: 'workout',
    title: 'تذكير بتسجيل التمارين',
    message: 'حان وقت تسجيل تمارينك اليومية. هل أكملت تمارينك اليوم؟',
    read: false,
    link: '/workouts'
  });
};

export const createInBodyReminder = async (userId: string) => {
  return createNotification({
    userId,
    type: 'inbody',
    title: 'موعد قياس InBody',
    message: 'حان موعد قياس InBody الشهري. قم بزيارة المركز لإجراء القياس.',
    read: false,
    link: '/inbody'
  });
};

export const createAchievementNotification = async (
  userId: string,
  achievement: string,
  value: number
) => {
  return createNotification({
    userId,
    type: 'achievement',
    title: 'إنجاز جديد! 🎉',
    message: `مبروك! لقد حققت ${achievement} بقيمة ${value}`,
    read: false,
    data: { achievement, value }
  });
};

export const createTrainerAssignmentNotification = async (
  userId: string,
  trainerName: string
) => {
  return createNotification({
    userId,
    type: 'assignment',
    title: 'تم تعيين مدرب جديد',
    message: `تم تعيين المدرب ${trainerName} كمدربك الشخصي`,
    read: false,
    data: { trainerName }
  });
};