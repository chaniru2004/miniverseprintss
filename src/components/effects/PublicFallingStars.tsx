'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FallingStars = dynamic(() => import('./FallingStars'), { ssr: false });

export default function PublicFallingStars() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const isAdmin = pathname.startsWith('/admin') || pathname === '/admin-login';

  useEffect(() => {
    if (isAdmin) return;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  if (isAdmin || !ready) {
    return null;
  }

  return <FallingStars />;
}
