'use client';

import { useEffect, useState } from 'react';

export default function ForceLightMode({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
