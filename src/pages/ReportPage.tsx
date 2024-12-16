import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const ReportPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportRef = doc(db, 'nutritionReports', reportId!);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          setReport(reportSnap.data());
        } else {
          console.error('No such report!');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!report) {
    return <div className="text-center py-8">Report not found</div>;
  }

  const totalStats = report.entries.reduce((acc: any, entry: any) => {
    acc.calories += entry.calories;
    acc.protein += entry.protein;
    acc.carbs += entry.carbs;
    acc.fats += entry.fats;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const pieData = [
    { name: 'Protein', value: totalStats.protein, color: '#FF6B6B' },
    { name: 'Carbs', value: totalStats.carbs, color: '#4ECDC4' },
    { name: 'Fats', value: totalStats.fats, color: '#45B7D1' }
  ];

  // أهداف يومية افتراضية
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Nutrition Report</h1>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Total Calories</span>
            <span className="text-2xl font-bold">{totalStats.calories.toFixed(0)} kcal</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${(totalStats.calories / dailyGoals.calories) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Total Protein</span>
            <span className="text-2xl font-bold">{totalStats.protein.toFixed(1)} g</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full bg-red-600"
                style={{ width: `${(totalStats.protein / dailyGoals.protein) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Total Carbs</span>
            <span className="text-2xl font-bold">{totalStats.carbs.toFixed(1)} g</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full bg-green-600"
                style={{ width: `${(totalStats.carbs / dailyGoals.carbs) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Total Fats</span>
            <span className="text-2xl font-bold">{totalStats.fats.toFixed(1)} g</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full bg-yellow-600"
                style={{ width: `${(totalStats.fats / dailyGoals.fats) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Detailed Entries</h2>
        {report.entries && report.entries.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protein
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fats
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.entries.map((entry: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.food}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.amount} {entry.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.calories}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.protein}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.carbs}g</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.fats}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No entries found in this report.</p>
        )}
      </div>
    </div>
  );
}; 