export type NotificationType = 
  | 'nutrition'    // تذكير بتسجيل الوجبات
  | 'workout'      // تذكير بتسجيل التمارين
  | 'inbody'       // موعد قياس جديد
  | 'achievement'  // إنجاز جديد
  | 'assignment'   // تعيين مدرب جديد
  | 'system';      // إشعارات النظام

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  data?: Record<string, any>;
}