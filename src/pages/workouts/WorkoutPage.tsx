import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { WorkoutForm } from '../../components/workouts/WorkoutForm';
import { WorkoutTable } from '../../components/workouts/WorkoutTable';
import { WorkoutStats } from '../../components/workouts/WorkoutStats';
import { useWorkouts } from '../../hooks/useWorkouts';

export const WorkoutPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { entries, addEntry, loading } = useWorkouts(selectedDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">تتبع التمارين</h1>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorkoutForm onSubmit={addEntry} />
            <div className="mt-6">
              <WorkoutTable entries={entries} loading={loading} />
            </div>
          </div>
          
          <div>
            <WorkoutStats entries={entries} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};