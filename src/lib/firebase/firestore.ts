import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  type Query,
  type DocumentData
} from 'firebase/firestore';
import { db } from './config';
import type {
  User,
  NutritionEntry,
  WorkoutEntry,
  InBodyData,
  RankingData,
  AdminStats,
  TrainerMember,
  TrainerStats
} from '../../types';

// User Functions
export const createUser = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, {
    ...user,
    createdAt: serverTimestamp()
  });
};

export const getUserData = async (userId: string): Promise<User> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
    createdAt: (userDoc.data().createdAt as Timestamp).toDate()
  } as User;
};

// Nutrition Functions
export const getNutritionEntries = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<NutritionEntry[]> => {
  let q: Query<DocumentData> = query(
    collection(db, 'nutrition'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  if (startDate && endDate) {
    q = query(q, 
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: (doc.data().date as Timestamp).toDate()
  })) as NutritionEntry[];
};

export const addNutritionEntry = async (entry: Omit<NutritionEntry, 'id'>): Promise<NutritionEntry> => {
  const docRef = await addDoc(collection(db, 'nutrition'), {
    ...entry,
    date: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...entry,
    date: new Date()
  };
};

export const updateNutritionEntry = async (id: string, data: Partial<NutritionEntry>): Promise<void> => {
  const entryRef = doc(db, 'nutrition', id);
  await updateDoc(entryRef, data);
};

export const deleteNutritionEntry = async (id: string): Promise<void> => {
  try {
    const entryRef = doc(db, 'nutrition', id);
    await deleteDoc(entryRef);
  } catch (error) {
    console.error('Error deleting nutrition entry:', error);
    throw error;
  }
};

export const deleteAllNutritionEntries = async (userId: string, date: Date): Promise<void> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'nutrition'),
      where('userId', '==', userId),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay)
    );

    const snapshot = await getDocs(q);
    
    // حذف كل الوثائق التي تم العثور عليها
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting all nutrition entries:', error);
    throw error;
  }
};

// Workout Functions
export const getWorkoutEntries = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<WorkoutEntry[]> => {
  let q: Query<DocumentData> = query(
    collection(db, 'workouts'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  if (startDate && endDate) {
    q = query(q, 
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: (doc.data().date as Timestamp).toDate()
  })) as WorkoutEntry[];
};

export const addWorkoutEntry = async (entry: Omit<WorkoutEntry, 'id'>): Promise<WorkoutEntry> => {
  const docRef = await addDoc(collection(db, 'workouts'), {
    ...entry,
    date: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...entry,
    date: new Date()
  };
};

export const updateWorkoutEntry = async (id: string, data: Partial<WorkoutEntry>): Promise<void> => {
  const entryRef = doc(db, 'workouts', id);
  await updateDoc(entryRef, data);
};

export const deleteWorkoutEntry = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'workouts', id));
};

// InBody Functions
export const getInBodyData = async (userId: string): Promise<InBodyData[]> => {
  const q = query(
    collection(db, 'inbody'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: (doc.data().date as Timestamp).toDate()
  })) as InBodyData[];
};

export const addInBodyData = async (data: Omit<InBodyData, 'id'>): Promise<InBodyData> => {
  const docRef = await addDoc(collection(db, 'inbody'), {
    ...data,
    date: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...data,
    date: new Date()
  };
};

// Ranking Functions
export const getRankings = async (): Promise<RankingData[]> => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'member'),
    orderBy('score', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    userId: doc.id,
    name: doc.data().name,
    score: doc.data().score || 0,
    progress: doc.data().progress || 0
  }));
};

// Admin Functions
export const getAdminStats = async (): Promise<AdminStats> => {
  // This would typically involve multiple queries and calculations
  // Simplified version for demonstration
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const workoutsSnapshot = await getDocs(collection(db, 'workouts'));
  const inbodySnapshot = await getDocs(collection(db, 'inbody'));
  const nutritionSnapshot = await getDocs(collection(db, 'nutrition'));

  return {
    totalUsers: usersSnapshot.size,
    activeUsers: usersSnapshot.docs.filter(doc => doc.data().lastActivity).length,
    averageScore: 0, // Calculate from inbody scores
    totalWorkouts: workoutsSnapshot.size,
    userGrowth: 0,
    activeUsersGrowth: 0,
    scoreGrowth: 0,
    workoutGrowth: 0,
    dailyActiveUsers: 0,
    averageSessionTime: 0,
    totalMeasurements: inbodySnapshot.size,
    totalMeals: nutritionSnapshot.size
  };
};

// Trainer Functions
export const getTrainerMembers = async (trainerId: string): Promise<TrainerMember[]> => {
  const q = query(
    collection(db, 'users'),
    where('trainerId', '==', trainerId)
  );

  const snapshot = await getDocs(q);
  return Promise.all(snapshot.docs.map(async doc => {
    const userData = doc.data();
    const inbodyData = await getInBodyData(doc.id);
    const workouts = await getWorkoutEntries(doc.id);

    return {
      id: doc.id,
      name: userData.name,
      email: userData.email,
      lastActivity: (userData.lastActivity as Timestamp)?.toDate() || new Date(),
      currentScore: inbodyData[0]?.score || 0,
      progress: calculateProgress(inbodyData),
      currentWeight: inbodyData[0]?.weight || 0,
      weightChange: calculateWeightChange(inbodyData),
      weeklyWorkouts: calculateWeeklyWorkouts(workouts),
      workoutChange: calculateWorkoutChange(workouts),
      progressHistory: generateProgressHistory(inbodyData)
    };
  }));
};

export const getTrainerStats = async (trainerId: string): Promise<TrainerStats> => {
  const members = await getTrainerMembers(trainerId);
  
  return {
    totalMembers: members.length,
    activeMembers: members.filter(m => isActive(m.lastActivity)).length,
    averageScore: calculateAverageScore(members),
    memberGrowth: 0, // Calculate from historical data
    scoreGrowth: 0, // Calculate from historical data
    activityGrowth: 0 // Calculate from historical data
  };
};

// Helper Functions
const calculateProgress = (inbodyData: InBodyData[]): number => {
  if (inbodyData.length < 2) return 0;
  const latest = inbodyData[0].score;
  const previous = inbodyData[1].score;
  return Math.round(((latest - previous) / previous) * 100);
};

const calculateWeightChange = (inbodyData: InBodyData[]): number => {
  if (inbodyData.length < 2) return 0;
  return +(inbodyData[0].weight - inbodyData[1].weight).toFixed(1);
};

const calculateWeeklyWorkouts = (workouts: WorkoutEntry[]): number => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return workouts.filter(w => w.date >= weekAgo).length;
};

const calculateWorkoutChange = (workouts: WorkoutEntry[]): number => {
  // Compare current week with previous week
  const now = new Date();
  const weekAgo = new Date(now.setDate(now.getDate() - 7));
  const twoWeeksAgo = new Date(now.setDate(now.getDate() - 7));

  const currentWeek = workouts.filter(w => w.date >= weekAgo).length;
  const previousWeek = workouts.filter(w => w.date >= twoWeeksAgo && w.date < weekAgo).length;

  if (previousWeek === 0) return currentWeek > 0 ? 100 : 0;
  return Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
};

const generateProgressHistory = (inbodyData: InBodyData[]): { date: string; score: number }[] => {
  return inbodyData.map(data => ({
    date: data.date.toISOString(),
    score: data.score
  })).reverse();
};

const calculateAverageScore = (members: TrainerMember[]): number => {
  if (members.length === 0) return 0;
  const total = members.reduce((sum, member) => sum + member.currentScore, 0);
  return Math.round(total / members.length);
};

const isActive = (lastActivity: Date): boolean => {
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - 1);
  return lastActivity >= dayAgo;
};

export const useNutrition = (date: Date) => {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEntries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // تعيين بداية ونهاية اليوم
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Fetching entries for:', {
          userId: user.id,
          startOfDay,
          endOfDay
        });

        const data = await getNutritionEntries(user.id, startOfDay, endOfDay);
        
        if (isMounted) {
          console.log('Fetched entries:', data);
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching nutrition entries:', error);
        if (isMounted) {
          setError('حدث خطأ أثناء تحميل البيانات');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEntries();

    return () => {
      isMounted = false;
    };
  }, [user, date]);

  return {
    entries,
    loading,
    error,
    addEntry: async (entry: Omit<NutritionEntry, 'id'>) => {
      if (!user) return;

      try {
        const newEntry = await addNutritionEntry({
          ...entry,
          userId: user.id,
        });
        setEntries(prev => [newEntry, ...prev]);
      } catch (error) {
        console.error('Error adding nutrition entry:', error);
        throw error;
      }
    }
  };
};