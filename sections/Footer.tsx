import React from 'react';
    import LinkComponent from '@/components/LinkComponent';
import RandomLogo from '@/components/RandomLogo';

type Settings = {
  mail?: string;
  headerNavigation?: Link[]; 
  footerSitemap?: Link[];
  footerLogos?: Image[];
  footerSocial?: Link[];
  footerTerms?: Link[];
}

export default function Footer({settings}: {settings: Settings}) {
    const logos = settings.footerLogos || [];
    const sitemap = settings.footerSitemap || [];
    const social = settings.footerSocial || [];
    const terms = settings.footerTerms || [];
    const rights = `© ${new Date().getFullYear()} CL4N. All rights reserved.`;


    return (
        <footer className="text-black z-10 relative">
            <div className="grid grid-cols-10 md:grid-cols-18 lg:grid-cols-24 -mb-px">
                <span className="square col-start-4"></span>
                <span className="square col-start-8"></span>
                <span className="square col-start-10"></span>
                <span className="square col-start-14 hidden md:block"></span>
                <span className="square col-start-16 hidden md:block"></span>
                <span className="square col-start-18 hidden md:block"></span>
                <span className="square col-start-20 hidden lg:block"></span>
                <span className="square col-start-24 hidden lg:block"></span>
            </div>
            <div className="grid grid-cols-10 md:grid-cols-18 lg:grid-cols-24 -mb-px">
                <span className="square col-start-1"></span>
                <span className="square col-start-3"></span>
                <span className="square col-start-4"></span>
                <span className="square col-start-6"></span>
                <span className="square col-start-9"></span>
                <span className="square col-start-11 hidden md:block"></span>
                <span className="square col-start-12 hidden md:block"></span>
                <span className="square col-start-13 hidden md:block"></span>
                <span className="square col-start-14 hidden md:block"></span>
                <span className="square col-start-16 hidden md:block"></span>
                <span className="square col-start-17 hidden md:block"></span>
                <span className="square col-start-21 hidden lg:block"></span>
                <span className="square col-start-23 hidden lg:block"></span>
                <span className="square col-start-24 hidden lg:block"></span>
            </div>

            <div className="container bg-offwhite p-lat uppercase">
                <div className="row pt-green pb-red justify-center md:justify-start">
                    <div className="w-10/12 md:w-5/12 flex flex-col">
                        {logos.length > 0 && (
                            <RandomLogo logos={logos} />
                        )}
                        <div className="pt-red hidden md:block mt-auto">
                            {rights}
                        </div>
                    </div>
                    <div className="w-full md:w-6/12 lg:w-5/12 grid grid-cols-6 lg:grid-cols-5 ml-auto pt-green md:pt-8! lg:pt-12!">
                        <div className="col-span-3 lg:col-span-2 text-center md:text-start">
                            <h3 className="h3">
                                sitemap
                            </h3>
                            <div className="flex flex-col items-center md:items-start  pt-4 md:pt-6">
                                {
                                    sitemap.map((link) => (
                                        <LinkComponent className='link-hover' {...link} key={link._key} >
                                            {link.label}
                                        </LinkComponent>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-span-3 lg:col-span-2 text-center md:text-start">
                            <h3 className="h3">
                                social
                            </h3>
                            <div className="flex flex-col items-center md:items-start pt-4 md:pt-6">
                                {
                                    social.map((link) => (
                                        <LinkComponent className='link-hover' {...link} key={link._key} >
                                            {link.label}
                                        </LinkComponent>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-span-full text-center pt-blue flex flex-col">
                            <p className="md:hidden">
                                {rights}
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start mt-auto">
                                {
                                    terms.map((link, index) => (
                                        <React.Fragment key={link._key}>
                                            {index === 1 ? (
                                                <>
                                                    <p>|</p>
                                                    <LinkComponent className='link-hover' {...link}>
                                                        {link.label}
                                                    </LinkComponent>
                                                    
                                                </>
                                            ) : (
                                                <LinkComponent className='link-hover' {...link}>
                                                    {link.label}
                                                </LinkComponent>
                                            )}
                                        </React.Fragment>
                                    ))
                                }
                               
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
    
    
}