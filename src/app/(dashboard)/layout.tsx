'use client';

import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-gray-900">
      <Header />
      <main className="flex-1 pb-16 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ThemeProvider>
  );
}
