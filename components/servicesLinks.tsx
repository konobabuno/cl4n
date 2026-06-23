'use client';

import LinkComponent from '@/components/LinkComponent';
import Link from 'next/link';
import { serviceTitleToSlug } from '@/lib/serviceSlug';
import { usePathname } from 'next/navigation'
import { useI18n } from '@/config/i18n/i18nProvider';

export default function ServicesLinks({services, lang}: {services: SanityService[], lang: LocalePage}) {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(segment => segment);

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {services.map((service) => {
                const serviceSlug = service.slug.current;
                let isActive = false;
                if (pathSegments[2] === serviceSlug) {
                    isActive = true;
                } 
                return (
                <Link key={service._id} href={`/${lang}/projects/${serviceSlug}`} className={`py-2 px-6 uppercase border border-offwhite rounded-[5px] ${isActive ? 'bg-offwhite text-black' : 'text-offwhite'}`}>
                    <h2>{service.title}</h2>
                </Link>
                );
            })}
        </div>
    );
}