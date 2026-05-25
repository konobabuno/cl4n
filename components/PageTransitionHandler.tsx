'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransitionHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const overlay = document.getElementById('page-loader');
    const body = document.body;
    const header = document.querySelector('header');
    if (!overlay) return;

    overlay.classList.remove('visible');
    body.classList.remove('loading');
    header?.classList.remove('no-touch');

  }, [pathname]); 

  return null;
}
