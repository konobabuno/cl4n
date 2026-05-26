
'use client'

import TitleText from "@/components/TitleText";
import LinkComponent from "@/components/LinkComponent";
import ImageComponent from "@/components/ImageComponent";


import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimateOnView from "@/components/AnimateOnView";
import PreviewProject from "@/components/PreviewProject";
import { PortableTextBlock } from "next-sanity";


type HomeHero = {
    headline?: string;
    heroTitle?: PortableTextBlock;
    heroDescription?: PortableTextBlock[];
    projects?: ProjectPost[];
    ctaLink?: Link;
}

gsap.registerPlugin(ScrollTrigger);

export default function HomeHero(section: HomeHero) {

    const rootRef = useRef<HTMLDivElement | null>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    

    // 1) Palabras + CTA
    useLayoutEffect(() => {
        if (!rootRef.current) return;
  
        const ctx = gsap.context(() => {
        const q = gsap.utils.selector(rootRef);
        const words = gsap.utils.toArray<HTMLSpanElement>(q(':scope .word'));
        const displayEls = q(':scope .display-container');
        const ctaEls = q(':scope .cta-link');
        const hero = rootRef.current;
    
        if (!hero) return;
    
        if (words.length) words.forEach((w) => (w.style.display = 'none'));
        if (displayEls.length) gsap.set(displayEls, { opacity: 1 });
        if (ctaEls.length) gsap.set(ctaEls, { display: 'none', pointerEvents: 'none' });
    
        stRef.current = ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
            const progress = self.progress;
            const totalWords = words.length;
    
            if (displayEls.length) {
                if (progress < 0.2) {
                    const fadeProgress = gsap.utils.mapRange(0, 0.2, 1, 0, progress);
                    gsap.set(displayEls, { opacity: fadeProgress });
                } else {
                    gsap.set(displayEls, { opacity: 0 });
                }
            }
    
            if (totalWords) {
                const wordStart = 0.2;
                const wordEnd = 0.8;
                if (progress >= wordStart && progress <= wordEnd) {
                const wordProgress = gsap.utils.mapRange(wordStart, wordEnd, 0, 1, progress);
                const visibleCount = Math.floor(wordProgress * totalWords);
                words.forEach((word, i) => {
                    word.style.display = i < visibleCount ? 'inline-block' : 'none';
                });
                } else if (progress < wordStart) {
                words.forEach((word) => (word.style.display = 'none'));
                } else {
                words.forEach((word) => (word.style.display = 'inline-block'));
                }
            }
    
            if (ctaEls.length) {
                if (progress > 0.9) {
                gsap.set(ctaEls, { display: 'flex', pointerEvents: 'auto' });
                } else {
                gsap.set(ctaEls, { display: 'none', pointerEvents: 'none' });
                }
            }

            },
        });
        }, rootRef);
  
        return () => {
        stRef.current?.kill();
        stRef.current = null;
        ctx.revert();
        };
  }, []);
  
    // 2) Parallax responsive: mouse (≥994px) y scroll (≤993px) usando el MISMO friction
    useLayoutEffect(() => {
        if (!rootRef.current) return;
    
        const ctx = gsap.context(() => {
        const q = gsap.utils.selector(rootRef);
        const mm = gsap.matchMedia();
    
        // 🖥️ Desktop: parallax por mouse
        mm.add('(min-width: 994px)', () => {
            const items = gsap.utils.toArray<HTMLElement>(q(':scope .project-in-hero'));
            if (!items.length) return;
    
            let lastX = 0, lastY = 0;
    
            const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            if (dx === 0 && dy === 0) return;
    
            lastX = e.clientX;
            lastY = e.clientY;
    
            const vw = window.innerWidth;
            const vh = window.innerHeight;
    
            items.forEach((el) => {
                const friction = el.dataset.friction ? parseFloat(el.dataset.friction) : 0.07;
                const deltaX = (vw / 2 - e.clientX) * friction;
                const deltaY = (vh / 2 - e.clientY) * friction;
    
                gsap.to(el, {
                x: deltaX,
                y: deltaY,
                duration: 1.2,
                ease: 'power3.out',
                overwrite: 'auto',
                });
            });
            };
    
            window.addEventListener('mousemove', handleMouseMove);
    
            return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            items.forEach((el) => gsap.killTweensOf(el));
            };
        });
    
        mm.add('(max-width: 993px)', () => {
            const items = gsap.utils.toArray<HTMLElement>(q(':scope .project-in-hero'));
            if (!items.length) return;
    
            const smoothFactor = 2.5; 
    
            items.forEach((el) => {
            const friction = el.dataset.friction ? parseFloat(el.dataset.friction) : 0.02;
    
            gsap.fromTo(
                el,
                { y: 0 },
                {
                y: () => {
                    const hero = rootRef.current!;
                    const heroHeight = hero.offsetHeight;
                    const vh = window.innerHeight;
                    const scrollable = Math.max(0, heroHeight - vh);
                    return -scrollable * friction * smoothFactor; // mismo coeficiente
                },
                ease: 'none',
                overwrite: 'auto',
                scrollTrigger: {
                    trigger: rootRef.current!,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
                }
            );
            });
    
            return () => {
            items.forEach((el) => gsap.killTweensOf(el));
            };
        });
        }, rootRef);
    
        return () => ctx.revert();
    }, []);
  
    return (
        <section className="home-hero" ref={rootRef}>
            <div className="h-[200vh] ">
                <AnimateOnView className="container p-lat height-for-hero sticky top-12" >
                     {/* TOP ROW */}
                    <div className="absolute left-0 right-0 top-0 translate-y-[-77px] md:translate-y-[-96px] lg:-translate-y-12  pointer-events-none ">
                        <div className="px-4 md:px-12 grid grid-cols-12 gap-4 gap-y-8 md:gap-y-32 overflow-hidden pb-[25vh] w-full pt-[77px] md:pt-[96px] lg:pt-12">
                            {section.projects?.[1] && (
                                <div className="col-start-1 col-end-6  md:col-end-5 lg:col-end-4 animate">
                                    <div className="lg:pr-22 -translate-x-24 md:-translate-x-24 lg:translate-x-0 translate-y-1/4  md:translate-y-1/2 lg:translate-y-1/4 relative">
                                        <LinkComponent
                                            linkType="page"
                                            page={{_type: 'project', slug: section.projects[1].slug.current, language: section.projects[1].language}}
                                            className="pointer-events-auto  block  project-in-hero relative" data-friction="0.02"
                                        >
                                            <ImageComponent
                                                image={section.projects[1].thumbnail}
                                                sizes="(max-width: 993px) 50vw, 33vw"
                                                optionalAlt={section.projects[1].title}
                                                classContainer="h-full rounded-[15px] overflow-hidden pointer-events-none"
                                                classImg="h-full"
                                            />

                                            <PreviewProject videoUrl={section.projects[1].videoPreview || ''} />

                                            <div className="absolute left-6 bottom-6  bg-gray backdrop-blur-[20px]  gap-4 items-center py-2 px-6 rounded-[5px] hidden lg:flex tag-hero-project pointer-events-none max-w-[75%]">
                                                <span className="dot bg-offwhite flex-none"></span>
                                                <p className="uppercase">{section.projects[1].title}</p>
                                            </div>
                                        </LinkComponent>
                                    </div>
                                </div>
                            )}
                            <div className="col-start-3 col-end-7 md:col-start-5 md:col-end-8 lg:col-end-7 animate">
                                <div className="lg:pt-8 translate-y-1/2 md:translate-y-1/4 lg:translate-y-0 lg:pl-12">
                                    <img className="w-full h-auto project-in-hero" src="/assets/Bat.svg" alt="Bat" data-friction="0.02"/>
                                </div>
                            </div>
                            {section.projects?.[0] && (
                                <div className="row-start-1 col-start-7 col-end-12 md:col-start-9 md:col-end-13 lg:col-end-12  animate delay-sm">
                                    <div className="lg:pl-22">
                                        <LinkComponent
                                            linkType="page"
                                            page={{_type: 'project', slug: section.projects[0].slug.current, language: section.projects[0].language}}
                                            className="pointer-events-auto  block relative project-in-hero" data-friction="0.01"
                                        >
                                            <ImageComponent
                                                image={section.projects[0].thumbnail}
                                                sizes="(max-width: 993px) 50vw, 33vw"
                                                optionalAlt={section.projects[0].title}
                                                classContainer="h-full rounded-[15px] overflow-hidden"
                                                classImg="h-full"
                                            />

                                             <PreviewProject videoUrl={section.projects[0].videoPreview || ''} />

                                            <div className="absolute left-6 bottom-6  bg-gray backdrop-blur-[20px]  gap-4 items-center py-2 px-6 rounded-[5px] hidden lg:flex tag-hero-project pointer-events-none max-w-[75%]">
                                                <span className="dot bg-offwhite flex-none"></span>
                                                <p className="uppercase">{section.projects[0].title}</p>
                                            </div>
                                        </LinkComponent>
                                    </div>
                                </div>
                            )}
                            <div className="col-start-10 col-end-12 md:col-start-7 md:col-end-9 lg:col-start-12 lg:col-end-13 animate">
                                <div className="pl-8 md:pl-26 flex items-end h-full md:translate-y-full lg:translate-y-0">
                                    <img className="w-full h-auto project-in-hero" src="/assets/firstStar.svg" alt="Star" data-friction="0.02"/>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                    {/* MIDDLE ROW */}
                    <div className="absolute left-0 right-0 top-1/2  lg:top-[calc(50%+30px)] -translate-y-1/2  pointer-events-none animate">
                        <div className="px-4 md:px-12 grid grid-cols-12 gap-4 gap-y-8 md:gap-y-32 overflow-hidden py-[25vh] grid-rows-2 lg:grid-rows-1">
                            <div className="col-start-1 col-end-4  md:col-end-3 lg:col-start-2 lg:col-end-3 row-start-2 lg:row-start-1">
                                <div className="lg:-translate-x-1/2 translate-y-full md:translate-y-1/2 lg:translate-y-full">
                                    <img className="w-full h-auto project-in-hero" src="/assets/Bee.svg" alt="Bee"  data-friction="0.03"/>
                                </div>
                            </div>
                            <div className="col-start-1 col-end-3 md:col-end-2 row-start-1 lg:col-start-2 lg:col-end-3">
                                <div className="pr-6 md:pr-0 lg:pr-26 ">
                                    <div className=" -translate-y-3/4 md:translate-y-0 lg:translate-x-1/4  lg:-translate-y-full">
                                        <img className="w-full h-auto project-in-hero" src="/assets/fifthStar.svg" alt="Fifth Star" data-friction="0.03" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-11 col-end-13 row-start-2 lg:row-start-1 md:col-start-12 md:col-end-13 lg:col-start-11 lg:col-end-12">
                                <div className="lg:pl-26 h-full">
                                    <div className="translate-y-full md:translate-y-0 lg:-translate-x-1/4  lg:translate-y-full h-full">
                                        <img className="w-full h-auto project-in-hero hidden md:block" src="/assets/sixthStar.svg" alt="Sixth Star" data-friction="0.02"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-10 col-end-13 md:col-start-11 md:col-end-13 lg:col-start-11 lg:col-end-12 row-start-1">
                                <div className="pl-10 md:pl-16">
                                <div className="lg:translate-x-1/2 -translate-y-3/4 md:-translate-y-1/2  lg:-translate-y-full">
                                    <img className="w-full h-auto project-in-hero" src="/assets/bird.svg" alt="bird" data-friction="0.03"/>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE TEXT */}
                    <div className="row justify-center h-full items-center project-in-hero pointer-events-none" data-friction="0.02">
                        <div className="w-full md:w-10/12 lg:w-8/12 ">
                            <div className="relative animate delay-lg-2">
                                <div className=" flex flex-col items-center display-container">
                                    {section.headline && (
                                        <div className="detalle circular-tag">
                                            {section.headline}
                                        </div>
                                    )}
                                    {section.heroTitle && (
                                        <>  
                                            <div className="display text-center mt-6 relative">

                                                <div className="flex flex-col">
                                                    <TitleText 
                                                        text={section.heroTitle}
                                                    />
                                                   
                                                </div>
                                            </div> 
                                        </>
                                    )}
                                </div>
                                    
                                <div className="absolute left-0 top-0 w-full ">
                                    {section.heroDescription && (
                                        <div className="h2 text-center relative home-hero">
                                            {section.heroDescription && (
                                                <div className="h2 text-center inline-flex justify-center flex-wrap relative home-hero">
                                                    {section.heroDescription.map((block) => (
                                                            <p key={block._key}>
                                                            {block.children?.map((child) => {
                                                                if (!("text" in child) || typeof child.text !== "string") {
                                                                    return null;
                                                                }
                                                                const words = child.text.split(" ");
                                                                return words.map((word, wi) => (
                                                                    <span
                                                                        key={wi}
                                                                        className={`word ${child.marks?.includes("strong") ? "bold" : ""}`}
                                                                        style={{
                                                                            whiteSpace: "nowrap",
                                                                        }}
                                                                    >
                                                                        {word}
                                                                        {wi < words.length - 1 && "\u00A0"}
                                                                    </span>
                                                                ));
                                                            })}
                                                            </p>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {section.ctaLink && (
                                        <div className="flex pt-red justify-center cta-link">
                                            <LinkComponent
                                            {...section.ctaLink}
                                            >
                                                <div className="bg-offwhite py-[8px] px-6 lg:px-8 lg:py-4 flex gap-4 items-center rounded-[5px] lg:rounded-[10px] btn-hover">
                                                    <span className="dot bg-black"></span>
                                                    <p className="uppercase text-black">{section.ctaLink.label}</p>
                                                </div>
                                            </LinkComponent>
                                                        
                                        </div>
                                    )}
                                </div>
                            </div>
                                
                                
                        </div>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="absolute left-0 right-0 bottom-0 pointer-events-none animate">
                        <div className="overflow-hidden px-4 md:px-12 grid grid-cols-12 gap-4 gap-y-8 md:gap-y-32 pt-[20vh]">
                            <div className="col-start-1 col-end-4 md:col-end-2 flex items-end h-full row-start-2 lg:row-start-1">
                                <div className="pr-16 md:pr-0 lg:pr-26 lg:pb-12">
                                    <img className="w-100 h-auto project-in-hero" src="/assets/thirdStar.svg" alt="Third Star" data-friction="0.024" />
                                </div>
                            </div>
                            {section.projects?.[2] && (
                                <div className="row-start-1 col-start-2 col-end-7 md:col-start-3 md:col-end-7 lg:col-end-6">
                                    <div className="lg:pr-22 md:translate-y-full lg:-translate-y-1/4">
                                        <LinkComponent
                                            linkType="page"
                                            page={{_type: 'project', slug: section.projects[2].slug.current, language: section.projects[2].language}}
                                            className="pointer-events-auto  block relative project-in-hero" data-friction="0.03"
                                        >
                                            <ImageComponent
                                                image={section.projects[2].thumbnail}
                                                sizes="(max-width: 993px) 50vw, 33vw"
                                                optionalAlt={section.projects[1].title}
                                                classContainer="h-full rounded-[15px] overflow-hidden"
                                                classImg="h-full"
                                            />

                                            <PreviewProject videoUrl={section.projects[2].videoPreview || ''} />

                                            <div className="absolute left-6 bottom-6  bg-gray backdrop-blur-[20px]  gap-4 items-center py-2 px-6 rounded-[5px] hidden lg:flex tag-hero-project pointer-events-none  max-w-[75%]">
                                                <span className="dot bg-offwhite"></span>
                                                <p className="uppercase">{section.projects[2].title}</p>
                                            </div>
                                        </LinkComponent>
                                    </div>
                                </div>
                            )}
                            <div className="col-start-7 col-end-9 md:col-end-8 lg:col-start-6 lg:col-end-7 row-start-2 lg:row-start-1">
                                <div className="pr-9 md:pr-0 lg:pl-26 ">
                                    <img className="w-100 h-auto project-in-hero" src="/assets/fourthStar.svg" alt="Star" data-friction="0.01"/>
                                </div>
                            </div>
                            <div className="col-start-9 col-end-13  md:col-start-8 md:col-end-11 lg:col-start-8 lg:col-end-10">
                                <div className="flex lg:items-center lg:h-full md:translate-y-full lg:translate-y-0  lg:pl-12">
                                    <img className="w-100 h-auto project-in-hero" src="/assets/bug.svg" alt="Bug" data-friction="0.05"/>
                                </div>
                            </div>
                            {section.projects?.[3] && (
                                <div className="row-start-2 col-start-8 lg:row-start-1  md:col-start-9 lg:col-start-10 col-end-13">
                                    <div className="lg:pl-22 translate-x-24 md:translate-x-32 lg:translate-y-0">
                                        <LinkComponent
                                            linkType="page"
                                            page={{_type: 'project', slug: section.projects[3].slug.current, language: section.projects[3].language}}
                                            className="pointer-events-auto block relative project-in-hero" data-friction="0.02"
                                        >


                                            <ImageComponent
                                                image={section.projects[3].thumbnail}
                                                sizes="(max-width: 993px) 50vw, 33vw"
                                                optionalAlt={section.projects[1].title}
                                                classContainer="h-full rounded-[15px] overflow-hidden"
                                                classImg="h-full"
                                            />

                                            <PreviewProject videoUrl={section.projects[3].videoPreview || ''} />


                                            <div className="absolute left-6 bottom-6  bg-gray backdrop-blur-[20px]  gap-4 items-center py-2 px-6 rounded-[5px] hidden lg:flex tag-hero-project pointer-events-none  max-w-[75%]">
                                                <span className="dot bg-offwhite"></span>
                                                <p className="uppercase">{section.projects[3].title}</p>
                                            </div>
                                        </LinkComponent>
                                    </div>
                                </div>
                            )}
                        </div>  
                    </div>
                </AnimateOnView>
               
            </div>
            
        </section>
    );

}
