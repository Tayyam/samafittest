import { createContext, useContext, ReactNode } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();

  if (auth.loading) {
    return <div className="text-center py-8">جاري تحميل البيانات...</div>;
  }

  if (auth.error) {
    return <div className="text-center py-8 text-red-500">خطأ: {auth.error}</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};