import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Header />
      <main className="flex-1 pb-16 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
