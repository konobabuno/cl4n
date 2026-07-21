'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ServicesLinks({services, lang}: {services: SanityService[], lang: LocalePage}) {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);
    const [clickedServiceSlug, setClickedServiceSlug] = useState<string | null>(null);
    const isTransitioning = Boolean(clickedServiceSlug);
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const router = useRouter();

    useEffect(() => {
        setClickedServiceSlug(null);
    }, [pathname]);

    async function pageTransition(href: string) {
        const pageProjectsLoader = document.getElementById('page-projects-loader');
        const body = document.body;

        body.classList.add('loading');
        pageProjectsLoader?.classList.add('opacity-100!');

        await sleep(300);
        router.push(href as Route);
    }
    
    return (
        <div className="flex flex-wrap gap-4 justify-center relative z-12">
            {services.map((service) => {
                const serviceSlug = service.slug.current;
                const href = `/${lang}/projects/${serviceSlug}`;
                const isActive = clickedServiceSlug
                    ? clickedServiceSlug === serviceSlug
                    : pathSegments[2] === serviceSlug;

                return (
                <Link
                    key={service._id}
                    href={href}
                    className={`py-2 px-6 uppercase border border-offwhite rounded-[5px] ${isActive ? 'bg-offwhite text-black' : 'text-offwhite'} ${isTransitioning ? 'pointer-events-none' : ''}`}
                    onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
                            return;
                        }

                        e.preventDefault();
                        setClickedServiceSlug(serviceSlug);
                        pageTransition(href);
                    }}
                >
                    <h2>{service.title}</h2>
                </Link>
                );
            })}
        </div>
    );
}