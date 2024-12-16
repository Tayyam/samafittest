import { NavLink } from 'react-router-dom';
import { Home, Utensils, Database, Dumbbell, Activity, Trophy, Users } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export const Sidebar = () => {
  const { user } = useAuthContext();

  const links = [
    { to: '/dashboard', icon: Home, label: 'الرئيسية' },
    { to: '/nutrition', icon: Utensils, label: 'التغذية' },
    { to: '/workouts', icon: Dumbbell, label: 'التمارين' },
    { to: '/inbody', icon: Activity, label: 'InBody' },
    { to: '/ranking', icon: Trophy, label: 'التصنيف' },
  ];

  if (user?.role === 'admin') {
    links.push(
      { to: '/users', icon: Users, label: 'المستخدمين' },
      { to: '/nutrition-properties', icon: Database, label: 'خصائص التغذية' }
    );
  }

  return (
    <aside className="w-64 bg-white shadow-sm h-screen">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-sama-dark to-sama-light text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};