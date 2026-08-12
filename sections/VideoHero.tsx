'use client'

import ImageComponent from '@/components/ImageComponent';
import { PortableTextBlock } from '@portabletext/types';
import TitleText from "@/components/TitleText";
import Hls from "hls.js";
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import AnimateOnView from '@/components/AnimateOnView';

type VideoHero = {
    video: string;
    coverImage: Image;
    description: PortableTextBlock;
    ctaButton: Link;
}

export default function VideoHero(section: VideoHero) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl = section.video;

    gsap.registerPlugin(ScrollTrigger);


    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;
            
        let hls: Hls | null = null;

        const tryPlay = async () => {
            try {
                await video.play();
                if (video.paused) {
                    console.log('video paused');
                }
            } catch {
                console.log('video error');
            }
        };

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    console.log('hls error');
                }
            });
        } else {
            video.src = videoUrl;
            video.addEventListener("loadedmetadata", tryPlay, { once: true });
            video.addEventListener("error", () => {
                console.log('video error');
            }, { once: true });
        }

        return () => {
            hls?.destroy();
        };
    }, [videoUrl]);


    return (
        <section className="home-hero" ref={rootRef}>
            <div className="container p-lat pt-[78px] md:pt-[97px] lg:pt-44">
                <div className="relative w-full">
                    <AnimateOnView className="w-full flex aspect-[1.77]">
                        {videoUrl && (
                            <video
                                ref={videoRef}
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                autoPlay={true}
                                className="w-full overflow-hidden rounded-[15px]"
                            />
                        )}
                    </AnimateOnView>
                    
                    { section.description && (
                        <AnimateOnView className="md:absolute left-0 top-1/2 md:-translate-y-1/2 delay-sm">
                            <div className="row justify-center">
                                <div className="w-full lg:w-7/12">
                                    <h2 className="h2 position-relative text-center pt-8 md:pt-0 md:px-12 lg:px-0">
                                        <TitleText text={section.description} />
                                    </h2>
                                </div>
                            </div>
                        </AnimateOnView>
                        
                    )}
                </div>
        
             
            </div>
        </section>
    );
}