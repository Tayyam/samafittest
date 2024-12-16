import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import type { TrainerMember } from '../../types';

interface MemberListProps {
  members: TrainerMember[];
  loading: boolean;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string) => void;
}

export const MemberList = ({
  members,
  loading,
  selectedMemberId,
  onSelectMember
}: MemberListProps) => {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        لا يوجد متدربين مسجلين حالياً
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">المتدربين</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المتدرب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                آخر نشاط
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النتيجة الحالية
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التقدم
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr
                key={member.id}
                onClick={() => onSelectMember(member.id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMemberId === member.id ? 'bg-sama-light bg-opacity-10' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Activity className="w-4 h-4 ml-1" />
                    {format(member.lastActivity, 'PPp', { locale: ar })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {member.currentScore}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {member.progress > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    ) : member.progress < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                    ) : (
                      <span className="w-4 h-4 bg-gray-200 rounded-full ml-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      member.progress > 0 ? 'text-green-600' :
                      member.progress < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {member.progress > 0 ? '+' : ''}{member.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};