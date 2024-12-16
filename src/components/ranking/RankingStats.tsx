import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { RankingData } from '../../types';

interface RankingStatsProps {
  rankings: RankingData[];
  currentUserRank?: RankingData;
}

export const RankingStats = ({ rankings, currentUserRank }: RankingStatsProps) => {
  const stats = useMemo(() => {
    if (!currentUserRank || rankings.length === 0) return null;

    const currentRankIndex = rankings.findIndex(r => r.userId === currentUserRank.userId);
    const totalParticipants = rankings.length;
    const percentile = ((totalParticipants - currentRankIndex) / totalParticipants) * 100;
    
    const nextRank = currentRankIndex > 0 ? rankings[currentRankIndex - 1] : null;
    const pointsToNext = nextRank ? nextRank.score - currentUserRank.score : 0;

    return {
      rank: currentRankIndex + 1,
      totalParticipants,
      percentile: Math.round(percentile),
      pointsToNext,
      nextRankName: nextRank?.name
    };
  }, [rankings, currentUserRank]);

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">إحصائيات التصنيف</h3>

      <div className="text-center">
        <Trophy className="w-12 h-12 mx-auto text-sama-dark" />
        <div className="mt-2 text-3xl font-bold text-sama-dark">
          المركز {stats.rank}
        </div>
        <div className="text-sm text-gray-500">
          من أصل {stats.totalParticipants} مشترك
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">أفضل من</div>
          <div className="text-xl font-semibold">{stats.percentile}% من المشتركين</div>
        </div>

        {stats.nextRankName && (
          <div>
            <div className="text-sm text-gray-500">النقاط المطلوبة للمركز التالي</div>
            <div className="text-xl font-semibold">{stats.pointsToNext} نقطة</div>
            <div className="text-sm text-gray-500">للوصول إلى مستوى {stats.nextRankName}</div>
          </div>
        )}
      </div>
    </div>
  );
};