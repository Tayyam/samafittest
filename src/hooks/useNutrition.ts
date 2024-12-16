import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { addNutritionEntry, getNutritionEntries, deleteNutritionEntry, deleteAllNutritionEntries } from '../lib/firebase/firestore';
import type { NutritionEntry } from '../types';

export const useNutrition = (date: Date) => {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEntries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const data = await getNutritionEntries(user.id, startOfDay, endOfDay);
        if (isMounted) {
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching nutrition entries:', error);
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

  const deleteEntry = async (id: string) => {
    if (!user) return;

    try {
      await deleteNutritionEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
      throw error;
    }
  };

  const deleteAllEntries = async () => {
    if (!user) return;

    try {
      await deleteAllNutritionEntries(user.id, date);
      setEntries([]);
    } catch (error) {
      console.error('Error deleting all nutrition entries:', error);
      throw error;
    }
  };

  return {
    entries,
    loading,
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
    },
    deleteEntry,
    deleteAllEntries
  };
};