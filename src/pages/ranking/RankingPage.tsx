import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { RankingTable } from '../../components/ranking/RankingTable';
import { RankingStats } from '../../components/ranking/RankingStats';
import { useRanking } from '../../hooks/useRanking';

export const RankingPage = () => {
  const { rankings, loading, currentUserRank } = useRanking();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">التصنيف العام</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RankingTable rankings={rankings} loading={loading} currentUserRank={currentUserRank} />
          </div>
          <div>
            <RankingStats rankings={rankings} currentUserRank={currentUserRank} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};