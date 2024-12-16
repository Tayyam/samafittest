import { Trophy, Medal, Award } from 'lucide-react';
import type { RankingData } from '../../types';

interface RankingTableProps {
  rankings: RankingData[];
  loading: boolean;
  currentUserRank?: RankingData;
}

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />;
  return <span className="text-gray-600 font-medium">{rank}</span>;
};

export const RankingTable = ({ rankings, loading, currentUserRank }: RankingTableProps) => {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (rankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا يوجد بيانات للتصنيف حالياً
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المركز
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المشترك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النتيجة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التقدم
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings.map((rank, index) => (
              <tr 
                key={rank.userId}
                className={currentUserRank?.userId === rank.userId ? 'bg-sama-light bg-opacity-10' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <RankBadge rank={index + 1} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {rank.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{rank.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${rank.progress > 0 ? 'bg-green-100 text-green-800' : 
                      rank.progress < 0 ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {rank.progress > 0 ? '+' : ''}{rank.progress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};