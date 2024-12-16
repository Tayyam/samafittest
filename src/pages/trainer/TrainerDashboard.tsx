import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MemberList } from '../../components/trainer/MemberList';
import { MemberProgress } from '../../components/trainer/MemberProgress';
import { TrainerOverview } from '../../components/trainer/TrainerOverview';
import { useTrainerMembers } from '../../hooks/useTrainerMembers';

export const TrainerDashboard = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { members, loading, stats } = useTrainerMembers();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدرب</h1>

        <TrainerOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MemberList
              members={members}
              loading={loading}
              selectedMemberId={selectedMemberId}
              onSelectMember={setSelectedMemberId}
            />
          </div>
          <div>
            <MemberProgress
              memberId={selectedMemberId}
              members={members}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};