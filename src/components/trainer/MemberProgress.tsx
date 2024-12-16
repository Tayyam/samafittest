import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Activity, Scale, Dumbbell } from 'lucide-react';
import type { TrainerMember } from '../../types';

interface MemberProgressProps {
  memberId: string | null;
  members: TrainerMember[];
}

export const MemberProgress = ({ memberId, members }: MemberProgressProps) => {
  const member = useMemo(
    () => members.find(m => m.id === memberId),
    [memberId, members]
  );

  if (!member) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        اختر متدرب لعرض تقدمه
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-500">تقرير التقدم</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Scale className="w-5 h-5 text-sama-dark ml-2" />
            <div>
              <div className="text-sm text-gray-500">الوزن الحالي</div>
              <div className="text-lg font-semibold">{member.currentWeight} كجم</div>
            </div>
          </div>
          <div className="text-sm">
            <span className={member.weightChange >= 0 ? 'text-green-600' : 'text-red-600'}>
              {member.weightChange > 0 ? '+' : ''}{member.weightChange} كجم
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 text-sama-dark ml-2" />
            <div>
              <div className="text-sm text-gray-500">التمارين هذا الأسبوع</div>
              <div className="text-lg font-semibold">{member.weeklyWorkouts}</div>
            </div>
          </div>
          <div className="text-sm">
            <span className={member.workoutChange >= 0 ? 'text-green-600' : 'text-red-600'}>
              {member.workoutChange > 0 ? '+' : ''}{member.workoutChange}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-sama-dark ml-2" />
            <div>
              <div className="text-sm text-gray-500">النتيجة</div>
              <div className="text-lg font-semibold">{member.currentScore}</div>
            </div>
          </div>
          <div className="text-sm">
            <span className={member.progress >= 0 ? 'text-green-600' : 'text-red-600'}>
              {member.progress > 0 ? '+' : ''}{member.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={member.progressHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MM/dd', { locale: ar })}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), 'PPP', { locale: ar })}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#1A105F"
              strokeWidth={2}
              dot={{ fill: '#1A105F' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};