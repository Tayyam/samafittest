import { getAnalytics, isSupported } from 'firebase/analytics';
import { app } from './config';

export const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      const analytics = getAnalytics(app);
      console.info('Firebase Analytics initialized successfully');
      return analytics;
    }
  } catch (error) {
    console.warn('Analytics not supported:', error);
  }
  return null;
};