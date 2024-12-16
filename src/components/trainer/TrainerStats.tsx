import { useMemo } from 'react';
import { Users, TrendingUp, Activity } from 'lucide-react';
import type { User } from '../../types';

interface TrainerStatsProps {
  trainers: User[];
}

export const TrainerStats = ({ trainers }: TrainerStatsProps) => {
  const stats = useMemo(() => {
    const totalMembers = trainers.reduce((acc, trainer) => acc + (trainer.membersCount || 0), 0);
    const averageMembers = totalMembers / (trainers.length || 1);
    
    return {
      totalTrainers: trainers.length,
      totalMembers,
      averageMembers: Math.round(averageMembers * 10) / 10,
      activeTrainers: trainers.filter(t => t.membersCount && t.membersCount > 0).length
    };
  }, [trainers]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">إحصائيات المدربين</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 ml-2" />
            إجمالي المدربين
          </div>
          <div className="text-2xl font-bold text-sama-dark">
            {stats.totalTrainers}
          </div>
        </div>

        <div>
          <div className="flex items-center text-sm text-gray-500">
            <Activity className="w-4 h-4 ml-2" />
            المدربين النشطين
          </div>
          <div className="text-2xl font-bold text-sama-dark">
            {stats.activeTrainers}
          </div>
        </div>

        <div>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 ml-2" />
            متوسط المتدربين لكل مدرب
          </div>
          <div className="text-2xl font-bold text-sama-dark">
            {stats.averageMembers}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-2">توزيع المتدربين</div>
          <div className="space-y-2">
            {trainers
              .filter(t => t.membersCount && t.membersCount > 0)
              .sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0))
              .slice(0, 5)
              .map(trainer => (
                <div key={trainer.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{trainer.name}</span>
                  <span className="text-sm font-medium text-sama-dark">
                    {trainer.membersCount} متدرب
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};