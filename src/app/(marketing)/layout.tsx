'use client';

import ForceLightMode from '@/components/shared/ForceLightMode';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <ForceLightMode>{children}</ForceLightMode>;
}
