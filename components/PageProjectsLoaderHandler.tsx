'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';


export function  PageProjectsLoaderHandler() {
    const pathname = usePathname();
  
    useEffect(() => {
      const overlay = document.getElementById('page-projects-loader');
      const body = document.body;
      if (!overlay) return;
  
      overlay.classList.remove('opacity-100!');
      body.classList.remove('loading');

  
    }, [pathname]); 
  
    return null;
  }
  