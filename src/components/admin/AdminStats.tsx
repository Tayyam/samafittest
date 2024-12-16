import { Users, Activity, TrendingUp, Award } from 'lucide-react';
import type { AdminStats as AdminStatsType } from '../../types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {typeof change !== 'undefined' && (
          <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% من الشهر الماضي
          </p>
        )}
      </div>
      <div className="p-3 bg-sama-light bg-opacity-10 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

interface AdminStatsProps {
  stats: AdminStatsType;
  loading: boolean;
}

export const AdminStats = ({ stats, loading }: AdminStatsProps) => {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="إجمالي المستخدمين"
        value={stats.totalUsers}
        icon={<Users className="w-6 h-6 text-sama-dark" />}
        change={stats.userGrowth}
      />
      <StatCard
        title="المستخدمين النشطين"
        value={stats.activeUsers}
        icon={<Activity className="w-6 h-6 text-sama-dark" />}
        change={stats.activeUsersGrowth}
      />
      <StatCard
        title="متوسط النتيجة"
        value={stats.averageScore.toFixed(1)}
        icon={<TrendingUp className="w-6 h-6 text-sama-dark" />}
        change={stats.scoreGrowth}
      />
      <StatCard
        title="إجمالي التمارين"
        value={stats.totalWorkouts}
        icon={<Award className="w-6 h-6 text-sama-dark" />}
        change={stats.workoutGrowth}
      />
    </div>
  );
};