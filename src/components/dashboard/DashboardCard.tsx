import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Dumbbell, Utensils } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: 'activity' | 'dumbbell' | 'utensils';
  to: string;
  children: ReactNode;
}

const icons = {
  activity: Activity,
  dumbbell: Dumbbell,
  utensils: Utensils,
};

export const DashboardCard = ({ title, icon, to, children }: DashboardCardProps) => {
  const Icon = icons[icon];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Icon className="w-5 h-5 text-sama-dark" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <Link
            to={to}
            className="text-sm text-sama-dark hover:text-sama-light transition-colors"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};