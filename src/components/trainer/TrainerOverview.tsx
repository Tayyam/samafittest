import { Users, TrendingUp, Activity } from 'lucide-react';
import type { TrainerStats } from '../../types';

interface TrainerOverviewProps {
  stats: TrainerStats;
}

export const TrainerOverview = ({ stats }: TrainerOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">إجمالي المتدربين</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalMembers}</p>
            <p className={`text-sm ${stats.memberGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.memberGrowth > 0 ? '+' : ''}{stats.memberGrowth}% من الشهر الماضي
            </p>
          </div>
          <div className="p-3 bg-sama-light bg-opacity-10 rounded-full">
            <Users className="w-6 h-6 text-sama-dark" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">متوسط النتيجة</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.averageScore}</p>
            <p className={`text-sm ${stats.scoreGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.scoreGrowth > 0 ? '+' : ''}{stats.scoreGrowth}% من الشهر الماضي
            </p>
          </div>
          <div className="p-3 bg-sama-light bg-opacity-10 rounded-full">
            <TrendingUp className="w-6 h-6 text-sama-dark" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">المتدربين النشطين</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.activeMembers}</p>
            <p className={`text-sm ${stats.activityGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.activityGrowth > 0 ? '+' : ''}{stats.activityGrowth}% من الشهر الماضي
            </p>
          </div>
          <div className="p-3 bg-sama-light bg-opacity-10 rounded-full">
            <Activity className="w-6 h-6 text-sama-dark" />
          </div>
        </div>
      </div>
    </div>
  );
};