import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { AdminStats } from '../../components/admin/AdminStats';
import { UserManagement } from '../../components/admin/UserManagement';
import { SystemOverview } from '../../components/admin/SystemOverview';
import { useAdmin } from '../../hooks/useAdmin';

export const AdminDashboard = () => {
  const { stats, users, loading } = useAdmin();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدير</h1>

        <AdminStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserManagement users={users} loading={loading} />
          </div>
          <div>
            <SystemOverview stats={stats} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};