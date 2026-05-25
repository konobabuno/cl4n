/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import ImageComponent from './ImageComponent';
import { useRef,  useState, useEffect } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from "swiper";
import LinkComponent from './LinkComponent';

export default function SliderProjects({projects, color}: {projects?: ProjectPost[], color: string}) {
    const paginationRef = useRef<HTMLDivElement | null>(null);
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const swiperRef = useRef<{ swiper: SwiperType } | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0); 

    useEffect(() => {
        if (swiperRef.current) {
            const swiper = swiperRef.current.swiper;

            if (swiper.params.navigation) {
                (swiper.params.navigation as any).prevEl = prevRef.current;
                (swiper.params.navigation as any).nextEl = nextRef.current;
            }
            if (swiper.params.pagination) {
                (swiper.params.pagination as any).el = paginationRef.current;
                (swiper.params.pagination as any).type = 'fraction';
            }
            swiper.navigation.init();
            swiper.navigation.update();
            swiper.pagination.init();
            swiper.pagination.render();
            swiper.pagination.update();

            setTimeout(() => {
                if (swiper.autoplay) {
                    swiper.autoplay.stop(); // Ensure autoplay exists before calling stop()
                }
            }, 10);

            const observer = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (entry.isIntersecting && containerRef.current) {
                        if (swiper.autoplay) {
                            swiper.autoplay.start(); // Ensure autoplay exists before calling start()
                        }
                    }
                },
                { threshold: 0 }
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => {
                if (containerRef.current) {
                    observer.unobserve(containerRef.current);
                }
            };
        }
    }, []);

    return (
        <div className="pt-blue " ref={containerRef}>
            
                <Swiper
                ref={swiperRef}
                slidesPerView={2}
                spaceBetween={10}
                centeredSlides={true}
                loop={true}
                className="overflow-visible!"
                style={{
                    ['--swiper-wrapper-transition-timing-function' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                speed={700}
                pagination={{
                   type: 'fraction',
                    el: paginationRef.current!,
                }}
                navigation={{
                    nextEl: nextRef.current!,
                    prevEl: prevRef.current!,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                modules={[Autoplay, Pagination, Navigation]}
                breakpoints={
                    {
                        0: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 1.33,
                        },
                        993: {
                            slidesPerView: 2,
                        },
                    }
                }
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: true,
                }}
            >
                {projects?.map((p: ProjectPost, index) => (
                    <SwiperSlide key={p._id}>
                        <div className="relative">
                            <ImageComponent 
                                image={p.thumbnail}
                                sizes="(max-width: 768px) 100vw, 75vw"
                                optionalAlt={p.title ? `Thumbnail image for project ${p.title}` : 'Project thumbnail'}
                                classContainer="w-full rounded-[15px] !aspect-[1.6] overflow-hidden"
                                classImg="object-cover object-center w-full !h-full"
                            />
                            {p.title && (
                                <div className={`absolute left-0 right-0 top-8 md:top-12 transition-opacity delay-300   ${activeIndex == index ? 'opacity-100 duration-300' : 'opacity-0'}`}>
                                     <div className="grid grid-cols-12 md:grid-cols-9 lg:grid-cols-6  gap-x-4">
                                        <div className='col-span-8 md:col-span-5 lg:col-span-3 pl-8 md:pl-12'>
                                            {p.services?.[0].title && (
                                                <p className='uppercase'>
                                                    {p.services?.[0].title}
                                                </p>
                                            )}
                                            <h3 className='h3 uppercase'>
                                                {p.title}
                                            </h3>
                                        </div>
                                     </div>
                                    
                                </div>
                            )}

                            <div className={`absolute right-8 bottom-8  md:right-12 md:bottom-12 bg-gray backdrop-blur-[20px] rounded-[10px] transition-opacity  duration-300  ${activeIndex == index ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                                <LinkComponent 
                                className='flex gap-4 items-center rounded-[5px] lg:rounded-[10px] py-[8px] px-6 lg:px-8 lg:py-4 uppercase btn-hover'
                                linkType="page"
                                page={{_type: 'project', slug: p.slug.current, language: p.language}}
                                >
                                    <div className="bg-offwhite h-[8px] w-[8px] rounded-full dot"></div>
                                    Ver Proyecto
                                </LinkComponent>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper>
            <div className="pt-red flex gap-4 md:gap-6 items-center justify-center">
                <button className="w-12 h-12 md:w-[42px] md:h-[42px] flex items-center justify-center bg-offwhite rounded-[5px] cursor-pointer"  ref={prevRef}>
                    <svg className='w-[13px] h-[13px] md:w-[18px] md:h-[18px]' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.99982 13.9995H4.00002V11.9997H5.99982V13.9995ZM8.00007 15.9998H6.00027L5.99982 13.9995H8.00052L8.00007 15.9998ZM10.0003 18H8.00007V15.9998L10.0003 16.0002V18ZM5.99982 4.0005V6.0003H4.00002V4.00005L5.99982 4.0005ZM8.00007 1.9998V4.0005H5.99982L6.00027 1.9998H8.00007ZM10.0003 0V1.9998H8.00007V0H10.0003Z" fill={color}/>
                        <path d="M4.0005 9.99901L4.00002 11.9997L2.00025 11.9993V9.99946H0V7.99921H1.9998V5.99941H4.0005V7.99921H18.0005V9.99946L4.0005 9.99901Z" fill={color}/>
                    </svg>
                </button>
                <div className="w-auto!" ref={paginationRef}></div>
                <button className="w-12 h-12 md:w-[42px] md:h-[42px] flex items-center justify-center bg-offwhite rounded-[5px] cursor-pointer" ref={nextRef}>
                    <svg className='w-[13px] h-[13px] md:w-[18px] md:h-[18px]' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8629 14.0564H14.8627V12.0566H12.8629V14.0564ZM10.8627 16.0566H12.8625L12.8629 14.0564H10.8622L10.8627 16.0566ZM8.86244 18.0569H10.8627V16.0566L8.86244 16.0571V18.0569ZM12.8629 4.05738V6.05718H14.8627V4.05693L12.8629 4.05738ZM10.8627 2.05668V4.05738H12.8629L12.8625 2.05668H10.8627ZM8.86244 0.0568848V2.05668H10.8627V0.0568848H8.86244Z" fill={color}/>
                        <path d="M14.8623 10.0559L14.8627 12.0566L16.8625 12.0561V10.0563H18.8628V8.0561H16.863V6.0563H14.8623V8.0561H0.862305V10.0563L14.8623 10.0559Z" fill={color}/>
                    </svg>      
                </button>
            </div>
        </div>
    );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
