import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserMenu } from './UserMenu';
import { useAuthContext } from '../../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold text-sama-dark">SamaFit</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {user ? (
              <>
                <Link to="/nutrition" className="text-gray-600 hover:text-sama-dark">التغذية</Link>
                <Link to="/workouts" className="text-gray-600 hover:text-sama-dark">التمارين</Link>
                <Link to="/inbody" className="text-gray-600 hover:text-sama-dark">InBody</Link>
                <Link to="/ranking" className="text-gray-600 hover:text-sama-dark">التصنيف</Link>
                <div className="flex items-center space-x-4 space-x-reverse mr-4">
                  <NotificationBell />
                  <UserMenu user={user} />
                </div>
              </>
            ) : (
              <Button variant="primary" as={Link} to="/login">تسجيل الدخول</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-sama-dark" />
            ) : (
              <Menu className="h-6 w-6 text-sama-dark" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {user ? (
              <>
                <UserMenu user={user} />
                <Link to="/nutrition" className="block text-gray-600 hover:text-sama-dark">التغذية</Link>
                <Link to="/workouts" className="block text-gray-600 hover:text-sama-dark">التمارين</Link>
                <Link to="/inbody" className="block text-gray-600 hover:text-sama-dark">InBody</Link>
                <Link to="/ranking" className="block text-gray-600 hover:text-sama-dark">التصنيف</Link>
                <div className="py-2">
                  <NotificationBell />
                </div>
              </>
            ) : (
              <Button variant="primary" className="w-full" as={Link} to="/login">
                تسجيل الدخول
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};