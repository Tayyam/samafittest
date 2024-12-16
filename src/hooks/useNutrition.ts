import { useState, useEffect } from 'react';
import { 
  getNutritionEntriesByDate, 
  addNutritionEntry,
  deleteNutritionEntry,
  deleteAllNutritionEntries,
  copyNutritionEntries 
} from '../lib/firebase/nutrition';
import type { NutritionEntry } from '../types';

export const useNutrition = (selectedDate: Date) => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getNutritionEntriesByDate(selectedDate);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<NutritionEntry, 'id'>) => {
    try {
      const newEntry = await addNutritionEntry({
        ...entry,
        date: selectedDate
      });
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  };

  const addMultipleEntries = async (newEntries: Omit<NutritionEntry, 'id'>[]) => {
    try {
      const addedEntries = await Promise.all(
        newEntries.map(entry => 
          addNutritionEntry({
            ...entry,
            date: selectedDate
          })
        )
      );
      setEntries(prev => [...prev, ...addedEntries]);
      return addedEntries;
    } catch (error) {
      console.error('Error adding multiple entries:', error);
      throw error;
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

  const copyEntriesFromDate = async (sourceDate: Date) => {
    try {
      const copiedEntries = await copyNutritionEntries(sourceDate, selectedDate);
      setEntries(prev => [...prev, ...copiedEntries]);
      return copiedEntries;
    } catch (error) {
      console.error('Error copying entries:', error);
      throw error;
    }
  };

  return {
    entries,
    loading,
    addEntry,
    addMultipleEntries,
    deleteEntry,
    deleteAllEntries,
    copyEntriesFromDate,
    refresh: loadEntries
  };
};