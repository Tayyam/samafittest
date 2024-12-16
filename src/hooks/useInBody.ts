import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { addInBodyData, getInBodyData } from '../lib/firebase/firestore';
import type { InBodyData } from '../types';

export const useInBody = () => {
  const { user } = useAuthContext();
  const [data, setData] = useState<InBodyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const inBodyData = await getInBodyData(user.id);
        setData(inBodyData);
      } catch (error) {
        console.error('Error fetching InBody data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addEntry = async (entry: Omit<InBodyData, 'id'>) => {
    if (!user) return;

    try {
      const newEntry = await addInBodyData({
        ...entry,
        userId: user.id,
      });
      setData((prev) => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error adding InBody entry:', error);
      throw error;
    }
  };

  return {
    data,
    addEntry,
    loading,
  };
};