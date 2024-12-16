import { ReactNode } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 mr-64">
          {children}
        </main>
      </div>
    </div>
  );
}; 