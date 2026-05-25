'use client'

import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

interface VideoHLSProps {
    videoUrl: string;
    externalTrigger?: boolean;
}


export default function PreviewProject({ videoUrl, externalTrigger }: VideoHLSProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activePreview, setActivePreview] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mq = window.matchMedia('(min-width: 993px)');
        const update = () => setIsDesktop(mq.matches);
        update();

        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (videoRef.current && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(videoRef.current);

            return () => {
                hls.destroy();
            };
        } else if (videoRef.current) {
            videoRef.current.src = videoUrl;
        }
    }, [videoUrl]);

    const handleMouseOver = () => {
        if (!isDesktop) return;
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            void video.play().catch(() => {
            });
        }
        setActivePreview(true);
    };

    const handleMouseOut = () => {
        if (!isDesktop) return;
        const video = videoRef.current;
        if (video) video.pause();
        setActivePreview(false);
    };

    useEffect(() => {
        if (!isDesktop) return;
        if (externalTrigger) {
            handleMouseOver();
        } else {
            handleMouseOut();
        }
    }, [externalTrigger, isDesktop]);

    return (
        videoUrl ? (
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="metadata"
                className={`w-full h-full rounded-[15px] object-cover absolute left-0 top-0 ${activePreview ? 'opacity-100' : 'opacity-0'}`}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            />
        ) : null
    );
}