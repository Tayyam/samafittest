import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { InBodyForm } from '../../components/inbody/InBodyForm';
import { InBodyHistory } from '../../components/inbody/InBodyHistory';
import { InBodyProgress } from '../../components/inbody/InBodyProgress';
import { useInBody } from '../../hooks/useInBody';

export const InBodyPage = () => {
  const { data, addEntry, loading } = useInBody();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">تقرير InBody</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InBodyForm onSubmit={addEntry} />
            <InBodyHistory entries={data} loading={loading} />
          </div>
          
          <div>
            <InBodyProgress data={data} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};