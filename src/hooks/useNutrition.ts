import { useState, useEffect } from 'react';
import { 
  getNutritionEntriesByDate, 
  deleteNutritionEntry,
  deleteAllNutritionEntries 
} from '../lib/firebase/nutrition';
import type { NutritionEntry } from '../types';

export const useNutrition = (selectedDate: Date) => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getNutritionEntriesByDate(selectedDate.toISOString());
      console.log('Loaded entries:', data);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: NutritionEntry) => {
    try {
      setAnalysisLoading(true);
      // إضافة الإدخال الجديد إلى القائمة
      setEntries(prev => [...prev, entry]);
      await loadEntries(); // إعادة تحميل القائمة للتأكد من التحديث
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    } finally {
      setAnalysisLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await deleteNutritionEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  const deleteAllEntries = async () => {
    try {
      await deleteAllNutritionEntries(selectedDate);
      setEntries([]);
    } catch (error) {
      console.error('Error deleting all entries:', error);
      throw error;
    }
  };

  return {
    entries,
    loading,
    analysisLoading,
    addEntry,
    deleteEntry,
    deleteAllEntries
  };
};