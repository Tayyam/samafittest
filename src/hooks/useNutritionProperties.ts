import { useState, useEffect } from 'react';
import { 
  getNutritionProperties, 
  addNutritionProperty, 
  updateNutritionProperty, 
  deleteNutritionProperty 
} from '../lib/firebase/nutritionProperties';
import type { NutritionProperty } from '../types';

export const useNutritionProperties = () => {
  const [properties, setProperties] = useState<NutritionProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getNutritionProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading nutrition properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (data: Omit<NutritionProperty, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await addNutritionProperty(data);
      await loadProperties(); // إعادة تحميل القائمة
      return id;
    } catch (error) {
      console.error('Error adding nutrition property:', error);
      throw error;
    }
  };

  const updateProperty = async (id: string, data: Partial<NutritionProperty>) => {
    try {
      await updateNutritionProperty(id, data);
      await loadProperties(); // إعادة تحميل القائمة
    } catch (error) {
      console.error('Error updating nutrition property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await deleteNutritionProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting nutrition property:', error);
      throw error;
    }
  };

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty
  };
}; 