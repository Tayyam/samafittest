import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../lib/firebase/notifications';
import type { Notification } from '../types/notification';

export class NotificationService {
  static async getAll(userId: string, limit?: number): Promise<Notification[]> {
    return getNotifications(userId, limit);
  }

  static async create(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    return createNotification(notification);
  }

  static async markAsRead(notificationId: string): Promise<void> {
    return markNotificationAsRead(notificationId);
  }

  static async markAllAsRead(userId: string): Promise<void> {
    return markAllNotificationsAsRead(userId);
  }
}