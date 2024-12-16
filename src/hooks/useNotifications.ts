import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getNotifications } from '../lib/firebase/notifications';
import type { Notification } from '../types';

export const useNotifications = () => {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getNotifications(user.id);
        
        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (isMounted) {
          setError('حدث خطأ في تحميل الإشعارات');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    notifications,
    loading,
    error
  };
};