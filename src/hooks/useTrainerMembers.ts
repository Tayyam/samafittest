import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getTrainerMembers, getTrainerStats } from '../lib/firebase/firestore';
import type { TrainerMember, TrainerStats } from '../../types';

export const useTrainerMembers = () => {
  const { user } = useAuthContext();
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [stats, setStats] = useState<TrainerStats>({
    totalMembers: 0,
    activeMembers: 0,
    averageScore: 0,
    memberGrowth: 0,
    scoreGrowth: 0,
    activityGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'trainer') return;

      try {
        setLoading(true);
        const [fetchedMembers, trainerStats] = await Promise.all([
          getTrainerMembers(user.id),
          getTrainerStats(user.id)
        ]);
        setMembers(fetchedMembers);
        setStats(trainerStats);
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    members,
    stats,
    loading,
  };
};