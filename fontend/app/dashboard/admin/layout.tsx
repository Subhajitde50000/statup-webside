'use client';

import { ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-72 transition-all duration-300">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
