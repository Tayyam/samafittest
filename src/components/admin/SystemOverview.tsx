import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AdminStats } from '../../types';

interface SystemOverviewProps {
  stats: AdminStats;
}

export const SystemOverview = ({ stats }: SystemOverviewProps) => {
  const activityData = [
    { name: 'تمارين', value: stats.totalWorkouts },
    { name: 'قياسات', value: stats.totalMeasurements },
    { name: 'وجبات', value: stats.totalMeals },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">نظرة عامة على النظام</h3>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">معدل النشاط اليومي</div>
          <div className="text-2xl font-bold text-sama-dark">
            {stats.dailyActiveUsers} مستخدم
          </div>
          <div className="text-sm text-gray-500">
            نشط في آخر 24 ساعة
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">متوسط وقت الجلسة</div>
          <div className="text-2xl font-bold text-sama-dark">
            {stats.averageSessionTime} دقيقة
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7CDEE6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};