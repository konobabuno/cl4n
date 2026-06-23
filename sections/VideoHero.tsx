'use client'

import ImageComponent from '@/components/ImageComponent';
import { PortableTextBlock } from '@portabletext/types';
import TitleText from "@/components/TitleText";
import Hls from "hls.js";
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useLayoutEffect } from 'react';
import AnimateOnView from '@/components/AnimateOnView';
import LinkComponent from '@/components/LinkComponent';

type VideoHero = {
    video: string;
    imageDesktop: Image;
    imageMobile: Image;
    headline: string;
    title: PortableTextBlock;
    description: PortableTextBlock[];
    ctaButton: Link;
}

export default function VideoHero(section: VideoHero) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl = section.video;
    const [useImageFallback, setUseImageFallback] = useState(!videoUrl);

    gsap.registerPlugin(ScrollTrigger);


    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        let cancelled = false;
        let hls: Hls | null = null;

        const fallback = () => {
            if (!cancelled) setUseImageFallback(true);
        };

        const tryPlay = async () => {
            try {
                await video.play();
                if (!cancelled && video.paused) fallback();
            } catch {
                fallback();
            }
        };

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) fallback();
            });
        } else {
            video.src = videoUrl;
            video.addEventListener("loadedmetadata", tryPlay, { once: true });
            video.addEventListener("error", fallback, { once: true });
        }

        return () => {
            cancelled = true;
            hls?.destroy();
        };
    }, [videoUrl]);

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);

        return () => mq.removeEventListener("change", update);
    }, []);

    const fallbackImage = isDesktop ? section.imageDesktop : section.imageMobile;


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


    return (
        <section className="home-hero" ref={rootRef}>
            <div className="h-[200vh] ">
                <AnimateOnView className="container p-lat  sticky top-32 md:top-40 lg:top-60">
                    <div className="relative block overflow-hidden rounded-[15px] w-full h-[calc(100vh-100px)] md:h-[calc(100vh-130px)] lg:h-[calc(100vh-180px)] p-lat">
                        {videoUrl && !useImageFallback && (
                            <video
                                ref={videoRef}
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                autoPlay={true}
                                className="w-full h-full object-cover absolute top-0 left-0"
                            />
                        )}
                        {useImageFallback && fallbackImage?.asset && (
                            <ImageComponent
                                image={fallbackImage}
                                optionalAlt={section.headline || "Video Hero"}
                                sizes="100vw"
                                loading="eager"
                                classContainer="w-full h-full"
                                classImg="w-full h-full object-cover absolute top-0 left-0"
                            />
                        )}

                        <div className="row justify-center h-full items-center pointer-events-none">
                            <div className="w-full md:w-10/12 lg:w-8/12 ">
                                <div className="relative animate z-10">
                                    <div className=" flex flex-col items-center display-container">
                                        {section.headline && (
                                            <div className="detalle circular-tag">
                                                {section.headline}
                                            </div>
                                        )}
                                        {section.title && (
                                            <>
                                                <div className="display text-center mt-6 relative">

                                                    <div className="flex flex-col">
                                                        <TitleText
                                                            text={section.title}
                                                        />

                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="absolute left-0 top-0 w-full z-10">
                                        {section.description && (
                                            <div className="h2 text-center relative home-hero">
                                                {section.description && (
                                                    <div className="h2 text-center inline-flex justify-center flex-wrap relative home-hero">
                                                        {section.description.map((block) => (
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
                                        {section.ctaButton && (
                                            <div className="flex pt-red justify-center cta-link">
                                                <LinkComponent
                                                    {...section.ctaButton}
                                                >
                                                    <div className="bg-offwhite py-[8px] px-6 lg:px-8 lg:py-4 flex gap-4 items-center rounded-[5px] lg:rounded-[10px] btn-hover">
                                                        <span className="dot bg-black"></span>
                                                        <p className="uppercase text-black">{section.ctaButton.label}</p>
                                                    </div>
                                                </LinkComponent>

                                            </div>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="bg-[radial-gradient(circle,rgba(0,0,0,0.4)_0%,rgba(3,138,255,0)_100%)] w-full h-full absolute top-0 left-0 ">
                        </div>
                    </div>
                </AnimateOnView>
            </div>
        </section>
    );
}