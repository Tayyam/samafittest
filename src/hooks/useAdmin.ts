import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getAdminStats, getAllUsers } from '../lib/firebase/firestore';
import type { AdminStats, User } from '../types';

export const useAdmin = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    averageScore: 0,
    totalWorkouts: 0,
    userGrowth: 0,
    activeUsersGrowth: 0,
    scoreGrowth: 0,
    workoutGrowth: 0,
    dailyActiveUsers: 0,
    averageSessionTime: 0,
    totalMeasurements: 0,
    totalMeals: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        setLoading(true);
        const [adminStats, allUsers] = await Promise.all([
          getAdminStats(),
          getAllUsers()
        ]);
        
        setStats(adminStats);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    stats,
    users,
    loading,
  };
};