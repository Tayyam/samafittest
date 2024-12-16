import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Check, Bell, Dumbbell, Apple, Activity, Award, UserPlus } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../ui/Button';
import type { NotificationType } from '../../types/notification';

interface NotificationListProps {
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'nutrition':
      return <Apple className="w-5 h-5 text-green-500" />;
    case 'workout':
      return <Dumbbell className="w-5 h-5 text-blue-500" />;
    case 'inbody':
      return <Activity className="w-5 h-5 text-purple-500" />;
    case 'achievement':
      return <Award className="w-5 h-5 text-yellow-500" />;
    case 'assignment':
      return <UserPlus className="w-5 h-5 text-sama-dark" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

export const NotificationList = ({ onClose }: NotificationListProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = async (notificationId: string, link?: string) => {
    await markAsRead(notificationId);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        لا توجد إشعارات
      </div>
    );
  }

  return (
    <div className="max-h-[28rem] overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAllAsRead()}
            >
              <Check className="w-4 h-4 ml-2" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id, notification.link)}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              !notification.read ? 'bg-sama-light bg-opacity-5' : ''
            }`}
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="flex-shrink-0">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {format(notification.createdAt, 'PPp', { locale: ar })}
                </p>
              </div>
              {!notification.read && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-sama-dark rounded-full" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};