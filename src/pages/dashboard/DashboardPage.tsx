import { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { NutritionSummary } from '../../components/nutrition/NutritionSummary';
import { WorkoutSummary } from '../../components/dashboard/WorkoutSummary';
import { InBodySummary } from '../../components/dashboard/InBodySummary';
import { getNutritionEntries, getWorkoutEntries, getInBodyData } from '../../lib/firebase/firestore';
import type { NutritionEntry, WorkoutEntry, InBodyData } from '../../types';

export const DashboardPage = () => {
  const { user } = useAuthContext();
  const [nutritionData, setNutritionData] = useState<NutritionEntry[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutEntry[]>([]);
  const [inBodyData, setInBodyData] = useState<InBodyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [nutrition, workouts, inBody] = await Promise.all([
          getNutritionEntries(user.id),
          getWorkoutEntries(user.id),
          getInBodyData(user.id)
        ]);

        setNutritionData(nutrition);
        setWorkoutData(workouts);
        setInBodyData(inBody);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="ملخص التغذية"
          icon="utensils"
          to="/nutrition"
        >
          <NutritionSummary data={nutritionData} />
        </DashboardCard>

        <DashboardCard
          title="ملخص التمارين"
          icon="dumbbell"
          to="/workouts"
        >
          <WorkoutSummary data={workoutData} />
        </DashboardCard>

        <DashboardCard
          title="تقرير InBody"
          icon="activity"
          to="/inbody"
        >
          <InBodySummary data={inBodyData} />
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};