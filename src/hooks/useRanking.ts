import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getRankings } from '../lib/firebase/firestore';
import type { RankingData } from '../types';

export const useRanking = () => {
  const { user } = useAuthContext();
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getRankings();
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [user]);

  const currentUserRank = rankings.find(rank => rank.userId === user?.id);

  return {
    rankings,
    loading,
    currentUserRank
  };
};