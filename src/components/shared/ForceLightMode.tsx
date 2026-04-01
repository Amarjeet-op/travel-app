'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ForceLightMode({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const previousTheme = useRef<string | null>(null);

  useEffect(() => {
    // Save current theme to restore later
    previousTheme.current = localStorage.getItem('abhayam-theme');
    
    // Force light mode via the ThemeProvider itself (not just DOM manipulation)
    setTheme('light');

    return () => {
      // Restore previous theme on unmount
      if (previousTheme.current === 'dark') {
        setTheme('dark');
      }
    };
  }, [setTheme]);

  // Also force light on the wrapper div for extra safety
  return (
    <div className="light" style={{ colorScheme: 'light' }}>
      {children}
    </div>
  );
}
