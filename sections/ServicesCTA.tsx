'use client';

import ImageComponent from "@/components/ImageComponent";
import {useState, useRef, useEffect} from "react"; 
import LinkComponent from "@/components/LinkComponent";
import AnimateOnView from "@/components/AnimateOnView";

type ServicesCTA = {
    _type: "servicesCTA";
    _key: string;
    services?: {
        _key: string;
        title: string;
        headline?: string;
        description?: string;
        image: Image;
        links?: Array<Link | {_type: "reference"; label: string; _key: string;  service: { title: string; language?: string } }>;
    }[] | null;
}

export default function ServicesCTA(section: ServicesCTA) {

    const [serviceVisible, setServiceVisible] = useState(section.services?.[0]._key || 0);
    const [isInView, setIsInView] = useState(false);

    const sectionRef = useRef<HTMLElement>(null);
    const intervalRef = useRef<number | null>(null); 
    const observerRef = useRef<IntersectionObserver | null>(null); // Ref to store the observer instance
    

    useEffect(() => {
        observerRef.current = new window.IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
            } ,{ threshold: 0.2, rootMargin: "0px" }
        );
        if (sectionRef.current) observerRef.current.observe(sectionRef.current);
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (isInView && section.services && section.services.length > 1) {
            if (!intervalRef.current) {
                intervalRef.current = window.setInterval(() => {
                    setServiceVisible((prevKey) => {
                        if (!section.services?.length) return prevKey;
                        const currentIndex = section.services.findIndex((s) => s._key === prevKey);
                        const nextIndex = (currentIndex + 1) % section.services.length;
                        return section.services[nextIndex]._key;
                    });
                }, 2000); 
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null; 
            }
        };
    }, [isInView, section.services]);

    function handleTabClick(key: string) {
        setServiceVisible(key);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (observerRef.current) {
            observerRef.current.disconnect(); 
            observerRef.current = null; 
        }
        
    }

  return (
      <section ref={sectionRef}>
          <AnimateOnView className="container p-lat" >
              {section.services && section.services.length > 0 ? (
                  <div className="relative rounded-[15px] overflow-hidden h-240 md:h-320 lg:h-260 animate">
                        <div className="absolute left-8 top-8 right-8 md:left-12 md:top-12 md:right-12 flex flex-wrap gap-4 z-10 ">
                          {section.services.map((service) => (
                              <div
                                  key={service._key + service.title}
                                  className={`py-[3px] lg:py-2 px-6  backdrop-blur-[20px] rounded-[5px] uppercase cursor-pointer ${serviceVisible === service._key ? "bg-green" : "bg-gray"}`}
                                  onClick={() =>
                                        handleTabClick(service._key)
                                  }
                              >
                                  {service.title}
                              </div>
                          ))}
                        </div>
                        <div
                          className={`relative transition-opacity duration-500 h-full w-full ${serviceVisible === section.services?.[0]._key ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-auto"}`}
                        >
                            <ImageComponent
                              image={section.services[0].image}
                              sizes="(max-width: 768px) 200vw, 100vw"
                              optionalAlt={
                                  section.services[0]?.title || "Services Image"
                              }
                              classContainer="!h-full"
                              classImg="!h-full object-cover"
                            />
                            <div className="absolute left-0 bottom-0 z-10">
                                <div className="row pb-red">
                                    <div className="w-full md:w-9/12 lg:w-5/12">
                                        <div className="px-8 md:pr-0 md:pl-12">
                                            {section.services[0].headline && (
                                                <p className="detalle uppercase">
                                                    {section.services[0].headline}
                                                </p>
                                            )}

                                            {section.services[0].title && (
                                                <h2 className="h1 relative pt-4">
                                                    {section.services[0].title}
                                                </h2>
                                            )}
                                            {section.services[0].description && (
                                            <p className="uppercase pt-8">
                                                {section.services[0].description}
                                            </p>
                                            )}

                                            {section.services[0]?.links && section.services[0].links.length > 0 && (
                                                <div className="flex gap-4">
                                                    {section.services[0].links.map((link, i) => (
                                                        <div key={link._key || i}>
                                                            {link._type === "link" ? (
                                                                <div className="pt-red flex" key={link._key}>
                                                                    <LinkComponent {...link}>
                                                                        <div className={`btn ${i === 1 ? 'transparent' : '' } ` } >
                                                                            {link.label}
                                                                        </div>
                                                                    </LinkComponent>
                                                                </div>
                                                                
                                                            ): (
                                                                <div className="pt-red flex" key={link._key}>
                                                                    <LinkComponent 
                                                                    linkType="page"
                                                                    page={
                                                                        {_type: 'service', slug: 'service' in link ? link.service.title : '', language: ('service' in link ? link.service?.language : undefined) || ''}
                                                                    }
                                                                    >
                                                                        <div className={`btn ${i === 1 ? 'transparent' : '' } ` } >
                                                                            {link.label}
                                                                        </div>
                                                                    </LinkComponent>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </div>

                        {section.services.length > 1 &&
                          section.services.slice(1).map((service, index) => (
                                <div
                                    className={`absolute transition-opacity duration-500 left-0 top-0 w-full h-full ${serviceVisible === service._key ?  "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-auto"}`}
                                    key={service._key}
                                >
                                    <ImageComponent
                                        image={service.image}
                                        sizes="(max-width: 768px) 200vw, 100vw"
                                        optionalAlt={
                                            service?.title ||
                                            `Service ${index + 2}`
                                        }
                                        classContainer="h-full!"
                                        classImg="h-full! object-cover"
                                    />
                                    <div className="absolute left-0 bottom-0 z-10">
                                        <div className="row pb-red">
                                            <div className="md:w-9/12 lg:w-5/12">
                                                <div className="px-8 md:pr-0 md:pl-12">
                                                    {service.headline && (
                                                        <p className="detalle uppercase">
                                                            {service.headline}
                                                        </p>
                                                    )}

                                                    {service.title && (
                                                        <h2 className="h1 relative pt-4">
                                                            {service.title}
                                                        </h2>
                                                    )}
                                                    {service.description && (
                                                    <p className="uppercase pt-8">
                                                        {service.description}
                                                    </p>
                                                    )}

                                                    {service?.links && service.links.length > 0 && (
                                                        <div className="flex gap-4">
                                                            {service.links?.map((link, i) => (
                                                                <div key={link._key || i}>
                                                                    {link._type === "link" ? (
                                                                        <div className="pt-red flex" key={link._key}>
                                                                            <LinkComponent {...link}>
                                                                                <div className={`btn ${i === 1 ? 'transparent' : '' } ` } >
                                                                                    {link.label}
                                                                                </div>
                                                                            </LinkComponent>
                                                                        </div>
                                                                        
                                                                    ): (
                                                                        <div className="pt-red flex" key={link._key}>
                                                                            <LinkComponent 
                                                                            linkType="page"
                                                                            page={
                                                                                {_type: 'service', slug: 'service' in link ? link.service.title : '', language: ('service' in link ? link.service?.language : undefined) || ''}
                                                                            }
                                                                            >
                                                                                <div className={`btn ${i === 1 ? 'transparent' : '' } ` } >
                                                                                    {link.label}
                                                                                </div>
                                                                            </LinkComponent>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                              </div>
                        ))}
                  </div>
              ) : (
                  <p>No services available.</p>
              )}
          </AnimateOnView>
      </section>
  );
}