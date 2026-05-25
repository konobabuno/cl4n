'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { clearProjectsLoading } from './FilterbarProjects';

export function ProjectsTransitionHandler() {
    const pathname = usePathname();

    useEffect(() => {
        clearProjectsLoading();
    }, [pathname]);

    return null;
}
