import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { AuthService } from '../../services/auth.service';
import type { User } from '../../types';

interface UserMenuProps {
  user: User;
}

const getRoleLabel = (role: User['role']): string => {
  switch (role) {
    case 'admin':
      return 'مدير';
    case 'trainer':
      return 'مدرب';
    case 'member':
      return 'مشترك';
    default:
      return '';
  }
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 space-x-reverse bg-white rounded-full px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-sama-light bg-opacity-20 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-sama-dark" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{getRoleLabel(user.role)}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-right text-red-600 hover:bg-red-50 flex items-center space-x-2 space-x-reverse"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};