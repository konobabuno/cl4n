'use client'

import TitleText from '@/components/TitleText';
import AnimateOnView from '@/components/AnimateOnView';
import { PortableTextBlock } from "@portabletext/types";
import ImageComponent from '@/components/ImageComponent';
import { useEffect, useState } from 'react';

type GeneralHero = {
    heroTitle?: PortableTextBlock;
    heroDescription?: string;
    imageDesktop: Image;
    imageMobile: Image;  
}

export default function  GeneralHero(section: GeneralHero) {
 
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);

        const mql = window.matchMedia('(max-width: 767px)');
        const update = () => setIsMobile(mql.matches);

        update();
        if ('addEventListener' in mql) {
            mql.addEventListener('change', update);
            return () => mql.removeEventListener('change', update);
        }

        // @ts-expect-error - legacy browsers
        mql.addListener(update);
        // @ts-expect-error - legacy browsers
        return () => mql.removeListener(update);
    }, []);

    const mobileLoading = hasMounted ? (isMobile ? 'eager' : 'lazy') : 'lazy';
    const desktopLoading = hasMounted ? (!isMobile ? 'eager' : 'lazy') : 'lazy';

    return (
        <section>
            <div className="container p-lat">
                <div className="relative block overflow-hidden rounded-[15px] w-full h-200 md:h-240">
                    {
                        section.imageMobile && (
                            <ImageComponent
                                image={section.imageMobile}
                                sizes="100vw"
                                optionalAlt="Img Project"
                                classContainer="rounded-[10px] lg:rounded-[15px]  overflow-hidden h-full block md:hidden"
                                classImg='h-full object-cover object-center'
                                loading={mobileLoading}

                            />
                        )
                    }
                    <ImageComponent
                        image={section.imageDesktop}
                        sizes={`${section.imageMobile ? '(max-width: 768px) 300vw, 100vw' : '100vw'}`}
                        optionalAlt="Img Project"
                        classContainer={`rounded-[10px] lg:rounded-[15px]  overflow-hidden h-full ${section.imageMobile ? 'hidden md:block' : 'block'}`}
                        classImg='h-full object-cover object-center'
                        loading={desktopLoading}
                    />
                    {
                        section.heroTitle && (
                            <div className="absolute top-8 md:top-12 w-full">
                                <div className="row">
                                    <div className="w-full md:w-8/12 lg:w-6/12">
                                        <AnimateOnView  className="pl-8 pr-8 md:pr-0 md:pl-12">
                                            <h2 className="h1  relative animate">
                                                <TitleText text={section.heroTitle} />
                                            </h2>
                                        </AnimateOnView>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        section.heroDescription && (
                            <div className="absolute bottom-8 md:bottom-12 left-0 w-full">
                                <div className="row justify-end">
                                    <AnimateOnView  className="w-10/12 md:w-8/12 lg:w-5/12 ml-auto lg:mr-12">
                                        <p className='uppercase pr-8 md:pr-12 lg:pr-0 animate delay-sm'>
                                            {section.heroDescription}
                                        </p>
                                    </AnimateOnView>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
}
