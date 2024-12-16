import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { addWorkoutEntry, getWorkoutEntries } from '../lib/firebase/firestore';
import type { WorkoutEntry } from '../types';

export const useWorkouts = (date: Date) => {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const data = await getWorkoutEntries(user.id, startOfDay, endOfDay);
        setEntries(data);
      } catch (error) {
        console.error('Error fetching workout entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user, date]);

  const addEntry = async (entry: Omit<WorkoutEntry, 'id'>) => {
    if (!user) return;

    try {
      const newEntry = await addWorkoutEntry({
        ...entry,
        userId: user.id,
      });
      setEntries((prev) => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error adding workout entry:', error);
      throw error;
    }
  };

  return {
    entries,
    addEntry,
    loading,
  };
};