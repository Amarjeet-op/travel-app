'use client';

import { useEffect } from 'react';

export default function ForceLightMode({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    return () => {
      const saved = localStorage.getItem('abhayam-theme');
      root.classList.remove('light', 'dark');
      if (saved === 'dark') {
        root.classList.add('dark');
      } else if (saved === 'light') {
        root.classList.add('light');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    };
  }, []);

  return <>{children}</>;
}
