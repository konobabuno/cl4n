'use client'

import ImageComponent from "./ImageComponent";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper/types';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import VideoHLS from "./VideoHLS";

export default function GalleryItem({ galleryItem }: { galleryItem: GalleryItem }) {
    let className = "";
    switch (galleryItem.orientation) {
        case "vertical":
            className = "w-full md:w-6/12 lg:w-4/12";
            break;
        case "horizontal":
            className = "w-full md:w-6/12 lg:w-8/12";
            break;
        case "bigImage":
            className = "w-full";
            break;
    }

    const [isInView, setIsInView] = useState(false);
    const swiperRef = useRef<HTMLDivElement>(null);
    const swiperInstance = useRef<SwiperCore | null>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const prevRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imgIsLoaded, setImgIsLoaded] = useState(false);

    useEffect(() => {
        if (!swiperRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (swiperInstance.current?.autoplay) {
                            swiperInstance.current.autoplay.start();
                        }
                    } else {
                        setIsInView(false);
                        if (swiperInstance.current?.autoplay) {
                            swiperInstance.current.autoplay.stop();
                        }
                    }
                });
            },
            { threshold: 0, rootMargin: '0px 0px 50px 0px ' }
        );

        observer.observe(swiperRef.current);

        return () => {
            if (swiperRef.current) {
                observer.unobserve(swiperRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isInView) {
            setImgIsLoaded(true);
        }
    }, [isInView]);
    const items = galleryItem.items ?? [];

    return (
        <div className={className}>
            {
                items.length === 1 && items[0].image && (
                    <div className="relative rounded-[15px] overflow-hidden">
                        <ImageComponent image={items[0].image} sizes="(max-width: 768px) 100vw, 75vw" optionalAlt="Image Gallery" classContainer="rounded-[15px] overflow-hidden" />
                    </div>
                )
            }
            {
                items.length === 1 && items[0].video && (
                    <div className="relative rounded-[15px] overflow-hidden">
                        <VideoHLS videoUrl={items[0].video.url}  />
                    </div>
                )
            }
            {
                items.length > 1 && (
                    <div className="relative rounded-[15px] overflow-hidden" ref={swiperRef}>
                        <Swiper
                            className="w-full"
                            slidesPerView={1}
                            spaceBetween={10}
                            loop={true}
                            speed={700}
                            autoplay={{
                                delay: 2200,
                                disableOnInteraction: true,
                            }}
                            navigation={{
                                nextEl: nextRef.current!,
                                prevEl: prevRef.current!,
                            }}
                            modules={[Pagination, Autoplay, Navigation]}
                            style={{
                                ['--swiper-wrapper-transition-timing-function' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                            onSwiper={(swiper) => {
                                swiperInstance.current = swiper;
                                swiper.autoplay.stop();
                            }}
                            onSlideChange={(swiper) => {
                                setActiveIndex(swiper.realIndex);
                            }}
                        >
                            {items.map((item, index) => (
                                <SwiperSlide key={item._key} className="h-auto!">
                                    {item.image && index === 0 && (
                                        <ImageComponent image={item.image} sizes="(max-width: 768px) 100vw, 75vw" optionalAlt="Image Gallery" classContainer="rounded-[15px] overflow-hidden h-full" classImg="h-full! object-cover" />
                                    )}
                                    {(item.image && index > 0 && (isInView || imgIsLoaded)) && (
                                        <ImageComponent image={item.image} sizes="(max-width: 768px) 100vw, 75vw" optionalAlt="Image Gallery" classContainer="rounded-[15px] overflow-hidden h-full" classImg="h-full! object-cover" />
                                    )}
                                    {item.video  && (
                                        <VideoHLS videoUrl={item.video.url} classContainer="h-full! w-full!" classVideo="h-full! w-full! object-cover"/>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="absolute left-0 bottom-12 flex gap-8 items-center justify-center w-full z-10 mix-blend-difference pointer-events-none">
                            <div ref={prevRef} className="cursor-pointer pointer-events-auto">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.99982 13.9995H4.00002V11.9997H5.99982V13.9995ZM8.00007 15.9998H6.00027L5.99982 13.9995H8.00052L8.00007 15.9998ZM10.0003 18H8.00007V15.9998L10.0003 16.0002V18ZM5.99982 4.0005V6.0003H4.00002V4.00005L5.99982 4.0005ZM8.00007 1.9998V4.0005H5.99982L6.00027 1.9998H8.00007ZM10.0003 0V1.9998H8.00007V0H10.0003Z" fill="#FDF9F3" />
                                    <path d="M4.0005 9.99901L4.00002 11.9997L2.00025 11.9993V9.99946H0V7.99921H1.9998V5.99941H4.0005V7.99921H18.0005V9.99946L4.0005 9.99901Z" fill="#FDF9F3" />
                                </svg>
                            </div>
                            <div>
                                {activeIndex + 1} / {items.length}
                            </div>
                            <div ref={nextRef} className="cursor-pointer pointer-events-auto">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0006 4.0005H14.0004V6.0003H12.0006V4.0005ZM10.0004 2.00025H12.0002L12.0006 4.0005H9.99993L10.0004 2.00025ZM8.00013 0H10.0004V2.00025L8.00013 1.9998V0ZM12.0006 13.9995V11.9997H14.0004V14L12.0006 13.9995ZM10.0004 16.0002V13.9995H12.0006L12.0002 16.0002H10.0004ZM8.00013 18V16.0002H10.0004V18H8.00013Z" fill="#FDF9F3" />
                                    <path d="M14 8.00099L14.0004 6.0003L16.0002 6.00074V8.00054H18.0005V10.0008H16.0007V12.0006H14V10.0008H0V8.00054L14 8.00099Z" fill="#FDF9F3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )
            }
            


        </div>
    )
}