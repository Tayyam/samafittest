import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { TrainerList } from '../../components/trainer/TrainerList';
import { TrainerAssignment } from '../../components/trainer/TrainerAssignment';
import { TrainerStats } from '../../components/trainer/TrainerStats';
import { useTrainers } from '../../hooks/useTrainers';

export const TrainerManagement = () => {
  const { trainers, members, loading, assignMember, unassignMember } = useTrainers();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المدربين</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TrainerList 
              trainers={trainers} 
              loading={loading} 
            />
            <TrainerAssignment
              trainers={trainers}
              members={members}
              onAssign={assignMember}
              onUnassign={unassignMember}
              loading={loading}
            />
          </div>
          <div>
            <TrainerStats trainers={trainers} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};