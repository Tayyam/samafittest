import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import {
  getTrainers,
  getMembers,
  assignTrainerToMember,
  unassignTrainerFromMember
} from '../lib/firebase/firestore';
import type { User } from '../types';

export const useTrainers = () => {
  const { user } = useAuthContext();
  const [trainers, setTrainers] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        setLoading(true);
        const [fetchedTrainers, fetchedMembers] = await Promise.all([
          getTrainers(),
          getMembers()
        ]);
        setTrainers(fetchedTrainers);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const assignMember = async (memberId: string, trainerId: string) => {
    try {
      await assignTrainerToMember(memberId, trainerId);
      setMembers(prev => prev.map(member =>
        member.id === memberId
          ? { ...member, trainerId }
          : member
      ));
    } catch (error) {
      console.error('Error assigning trainer:', error);
      throw error;
    }
  };

  const unassignMember = async (memberId: string) => {
    try {
      await unassignTrainerFromMember(memberId);
      setMembers(prev => prev.map(member =>
        member.id === memberId
          ? { ...member, trainerId: null }
          : member
      ));
    } catch (error) {
      console.error('Error unassigning trainer:', error);
      throw error;
    }
  };

  return {
    trainers,
    members,
    loading,
    assignMember,
    unassignMember
  };
};