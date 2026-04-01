import ForceLightMode from '@/components/shared/ForceLightMode';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ForceLightMode>
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 w-full flex items-center justify-center [perspective:1000px]">
          {children}
        </div>
      </div>
    </ForceLightMode>
  );
}
