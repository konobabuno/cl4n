'use client';

import ImageComponent from "./ImageComponent";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { PageProjectsLoader } from "./PageProjectsLoader";
gsap.registerPlugin(CustomEase, Flip);


export default function RenderPhotos({ photos }: { photos: Image[] }) {

    const [allPhotos, setAllPhotos] = useState<Image[]>(photos);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isTablet, setIsTablet] = useState(true);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const limit = 9;
    const [start, setStart] = useState<number>(photos.length);
    const isFetchingRef = useRef(false);
    const reachedEndRef = useRef<boolean>(false);
    const isFirstRenderRef = useRef(true);
    const gsapCtxRef = useRef<gsap.Context | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    CustomEase.create("customEase", "0.19, 1, 0.22, 1");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mqDesktop = window.matchMedia("(min-width: 993px)");
        const mqTablet = window.matchMedia("(max-width: 992px)");
        const updateDesktop = () => setIsDesktop(mqDesktop.matches);
        const updateTablet = () => setIsTablet(mqTablet.matches);

        updateDesktop();
        updateTablet();
        mqDesktop.addEventListener("change", updateDesktop);
        mqTablet.addEventListener("change", updateTablet);

        return () => {
            mqDesktop.removeEventListener("change", updateDesktop);
            mqTablet.removeEventListener("change", updateTablet);
        }
    }, []);

    const focusContainerRef = useRef<HTMLDivElement>(null);
    const copyOriginRef = useRef<{ copyEl: HTMLElement; originParent: HTMLElement } | null>(null);
    const flipTweenRef = useRef<gsap.core.Timeline | null>(null);
    const fadeTweenRef = useRef<gsap.core.Tween | null>(null);
    const resizeCleanupRef = useRef<(() => void) | null>(null);
    const animateOpenFlipRef = useRef(false);

    const clearCopyZIndexes = () => {
        containerRef.current?.querySelectorAll<HTMLElement>(".copy").forEach((copyEl) => {
            copyEl.style.zIndex = "";
        });
        focusContainerRef.current?.querySelectorAll<HTMLElement>(".copy").forEach((copyEl) => {
            copyEl.style.zIndex = "";
        });
    };

    useEffect(() => () => {
        clearCopyZIndexes();
        flipTweenRef.current?.kill();
        fadeTweenRef.current?.kill();
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        gsapCtxRef.current = gsap.context(() => { }, containerRef);
        return () => {
            gsapCtxRef.current?.revert();
            gsapCtxRef.current = null;
        };
    }, []);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        if (reachedEndRef.current) return;

        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            if (isFetchingRef.current || reachedEndRef.current) return;

            isFetchingRef.current = true;
            const params = new URLSearchParams({
                start: String(start),
                limit: String(limit),
            });

            try {
                const res = await fetch(`/api/photos?${params.toString()}`);
                const photos: Image[] = res.ok ? await res.json() : [];
                if (!photos || photos.length === 0) {
                    reachedEndRef.current = true;
                    return;
                }
                setAllPhotos(prev => [...prev, ...photos]);
                setStart((prev) => prev + photos.length);

                if (photos.length < limit) {
                    reachedEndRef.current = true;
                }
            } finally {
                isFetchingRef.current = false;
            }

        }, {
            root: null,
            rootMargin: "600px 0px",
            threshold: 0,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [start, isDesktop, isTablet]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (!isDesktop && !isTablet) return;

        const ctx = gsapCtxRef.current ?? gsap.context(() => { }, container);

        ctx.add(() => {
            const allItems = gsap.utils.toArray<HTMLElement>("[data-photo-item]");
            if (allItems.length === 0) return;

            const items = allItems.filter((el) => el.dataset.animated !== "true");
            if (!items.length) return;

            const baseDelay = isFirstRenderRef.current ? 0.1 : 0;
            isFirstRenderRef.current = false;

            const minRealIndex = Math.min(
                ...items.map((el) => Number(el.dataset.realIndex ?? 0))
            );

            items.forEach((el) => {
                el.dataset.animated = "true";
                const realIndex = Number(el.dataset.realIndex ?? 0);
                gsap.to(el, {
                    opacity: 1,
                    duration: 0.8,
                    delay: baseDelay + (realIndex - minRealIndex) * 0.1,
                    ease: "customEase",
                });
            });
        });
        }, [allPhotos, isDesktop, isTablet]);

    useLayoutEffect(() => {
        const container = focusContainerRef.current;
        if (!container) return;

        resizeCleanupRef.current?.();
        resizeCleanupRef.current = null;
        clearCopyZIndexes();
        flipTweenRef.current?.kill();
        flipTweenRef.current = null;
        fadeTweenRef.current?.kill();
        fadeTweenRef.current = null;

        const returnCopyToGrid = (copyEl: HTMLElement, originParent: HTMLElement) => {
            copyEl.style.width = "";
            copyEl.style.height = "";
            copyEl.style.opacity = "";
            copyEl.style.zIndex = "";
            originParent.appendChild(copyEl);
        };

        if (!isOpen) {
            if (copyOriginRef.current) {
                const { copyEl, originParent } = copyOriginRef.current;
                copyOriginRef.current = null;

                const rect = originParent.getBoundingClientRect();
                const isVisible =
                    rect.bottom > 0 &&
                    rect.top < window.innerHeight &&
                    rect.right > 0 &&
                    rect.left < window.innerWidth;

                if (isVisible) {
                    const state = Flip.getState(copyEl);
                    returnCopyToGrid(copyEl, originParent);
                    copyEl.style.zIndex = "1001";
                    flipTweenRef.current = Flip.from(state, {
                        duration: 0.6,
                        ease: "customEase",
                        absolute: true,
                        onComplete: () => {
                            copyEl.style.zIndex = "";
                        },
                        onInterrupt: () => {
                            copyEl.style.zIndex = "";
                        },
                    });
                } else {
                    returnCopyToGrid(copyEl, originParent);
                }
            }
            return;
        }

        if (selectedPhotoIndex === null) return;

        const selectedPhotoEl = containerRef.current?.querySelector<HTMLDivElement>(
            `[data-photo-item][data-real-index="${selectedPhotoIndex}"]`
        );
        if (!selectedPhotoEl) return;

        const copyEl = selectedPhotoEl.querySelector(".copy") as HTMLElement | null;
        if (!copyEl) return;

        if (copyOriginRef.current && copyOriginRef.current.copyEl !== copyEl) {
            const prev = copyOriginRef.current;
            returnCopyToGrid(prev.copyEl, prev.originParent);
        }

        const shouldFlip = animateOpenFlipRef.current;
        animateOpenFlipRef.current = false;

        copyOriginRef.current = { copyEl, originParent: selectedPhotoEl };

        const fitToContainer = () => {
            const img = copyEl.querySelector("img");
            const iw = img?.naturalWidth || Number(img?.getAttribute("width")) || 1;
            const ih = img?.naturalHeight || Number(img?.getAttribute("height")) || 1;
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            if (!cw || !ch) return;
            const scale = Math.min(cw / iw, ch / ih);
            copyEl.style.width = `${iw * scale}px`;
            copyEl.style.height = `${ih * scale}px`;
        };

        const state = shouldFlip ? Flip.getState(copyEl) : null;
        container.appendChild(copyEl);
        fitToContainer();

        if (state) {
            flipTweenRef.current = Flip.from(state, {
                duration: 0.6,
                ease: "customEase",
                absolute: true,
            });
        } else {
            fadeTweenRef.current = gsap.fromTo(
                copyEl,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "customEase" }
            );
        }

        let resizeTimeout: number | undefined;
        const handleResize = () => {
            if (resizeTimeout) window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(fitToContainer, 120);
        };

        window.addEventListener("resize", handleResize);
        resizeCleanupRef.current = () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeout) window.clearTimeout(resizeTimeout);
        };
    }, [isOpen, selectedPhotoIndex]);

    const handlePhotoClick = (index: number) => {
        animateOpenFlipRef.current = true;
        setIsOpen(true);
        setSelectedPhotoIndex(index);
    }

    const goToPhoto = (direction: -1 | 1) => {
        animateOpenFlipRef.current = false;
        setSelectedPhotoIndex((currentIndex) => {
            if (!allPhotos.length) return null;
            const current = currentIndex ?? 0;
            const nextIndex = current + direction;
            return Math.max(0, Math.min(nextIndex, allPhotos.length - 1));
        });
    }

    const hasPreviousPhoto = selectedPhotoIndex !== null && selectedPhotoIndex > 0;
    const hasNextPhoto = selectedPhotoIndex !== null && selectedPhotoIndex < allPhotos.length - 1;

    return (
        <>
            <div className="container p-lat pt-blue relative min-h-[75vh] pb-pink" ref={containerRef}>
                <PageProjectsLoader/>
                <div className="row">
                    <div className="w-6/12 lg:w-4/12 flex flex-col gap-4">
                        {
                            allPhotos.map((photo, index) => {
                                if (isDesktop) {
                                    if (index % 3 === 0) {
                                        return (
                                            <div key={photo._key} data-photo-item className="opacity-0 relative" data-real-index={index} onClick={
                                                () => handlePhotoClick(index)}
                                            >
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer="rounded-[10px] lg:rounded-[15px] overflow-hidden"
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden absolute! top-1/2 left-1/2 transform-3d-neg copy`}
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        );
                                    }
                                } else if (isTablet) {
                                    if (index % 2 === 0) {
                                        return (
                                            <div key={photo._key} data-photo-item className="opacity-0 relative" data-real-index={index} onClick={() => handlePhotoClick(index)}>
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer="rounded-[10px] lg:rounded-[15px] overflow-hidden"
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden absolute! top-1/2 left-1/2 transform-3d-neg copy`}
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        );
                                    }
                                }

                                return null;
                            })
                        }
                    </div>
                    <div className="w-6/12 lg:w-4/12 flex flex-col gap-4" >
                        {
                            allPhotos.map((photo, index) => {
                                if (isDesktop) {
                                    if (index % 3 === 1) {
                                        return (
                                            <div key={photo._key} data-photo-item className="opacity-0 relative" data-real-index={index} onClick={() => handlePhotoClick(index)}>
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={"rounded-[10px] lg:rounded-[15px] overflow-hidden"}
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden absolute! top-1/2 left-1/2 transform-3d-neg copy`}
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        );
                                    }
                                } else if (isTablet) {
                                    if (index % 2 === 1) {
                                        return (
                                            <div key={photo._key} data-photo-item className="opacity-0 relative" data-real-index={index} onClick={() => handlePhotoClick(index)}>
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer="rounded-[10px] lg:rounded-[15px] overflow-hidden"
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden absolute! top-1/2 left-1/2 transform-3d-neg copy`}
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })
                        }
                    </div>
                    <div className="lg:w-4/12 hidden lg:flex flex-col gap-4">
                        {
                            allPhotos.map((photo, index) => {
                                if (isDesktop) {
                                    if (index % 3 === 2) {
                                        return (
                                            <div key={photo._key} data-photo-item className="opacity-0 relative" data-real-index={index} onClick={() => handlePhotoClick(index)}>
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer="rounded-[10px] lg:rounded-[15px] overflow-hidden"
                                                />
                                                <ImageComponent
                                                    image={photo}
                                                    optionalAlt="Photo"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden absolute! top-1/2 left-1/2 transform-3d-neg copy`}
                                                />
                                            </div>
                                        );
                                    }
                                }

                                return null;
                            })
                        }
                    </div>
                </div>
                <div ref={sentinelRef} aria-hidden className="h-16 w-full" />
            </div>

            <div className={`fixed top-0 left-0 w-full h-full z-1000 p-8 md:p-20 lg:p-24 pt-red pb-pink flex flex-col items-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} >
                <div className={`absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-[10px] transition-opacity duration-400 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)}></div>
                <div className={`flex gap-4 uppercase  duration-400 z-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`} >
                    <div className="cursor-pointer" onClick={() => setIsOpen(false)}>Grid</div>
                    <span>/</span>
                    <div className={`flex gap-4 items-center transition-opacity cursor-default`}>
                        <span className="dot bg-offwhite flex-none"></span>
                        Full
                    </div>
                </div>
                <div className="pt-blue flex-1 w-full p-lat">
                    <div className="row h-full justify-center">
                        <div className="w-full md:w-10/12 lg:w-8/12">
                            <div className="w-full h-full relative pointer-events-none" ref={focusContainerRef}></div>
                        </div>
                    </div>
                </div>
                <div className={`pt-red flex gap-4 md:gap-6 items-center justify-center transition-opacity duration-400 relative z-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                    <button
                        className={`w-12 h-12 md:w-[42px] md:h-[42px] flex items-center justify-center bg-offwhite rounded-[5px] ${hasPreviousPhoto ? "cursor-pointer" : "opacity-40"}`}
                        disabled={!hasPreviousPhoto}
                        onClick={() => goToPhoto(-1)}
                    >
                        <svg className='w-[13px] h-[13px] md:w-[18px] md:h-[18px]' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.99982 13.9995H4.00002V11.9997H5.99982V13.9995ZM8.00007 15.9998H6.00027L5.99982 13.9995H8.00052L8.00007 15.9998ZM10.0003 18H8.00007V15.9998L10.0003 16.0002V18ZM5.99982 4.0005V6.0003H4.00002V4.00005L5.99982 4.0005ZM8.00007 1.9998V4.0005H5.99982L6.00027 1.9998H8.00007ZM10.0003 0V1.9998H8.00007V0H10.0003Z" fill={"#B70100"}/>
                            <path d="M4.0005 9.99901L4.00002 11.9997L2.00025 11.9993V9.99946H0V7.99921H1.9998V5.99941H4.0005V7.99921H18.0005V9.99946L4.0005 9.99901Z" fill={"#B70100"}/>
                        </svg>
                    </button>
                    <button
                        className={`w-12 h-12 md:w-[42px] md:h-[42px] flex items-center justify-center bg-offwhite rounded-[5px] ${hasNextPhoto ? "cursor-pointer" : "opacity-40"}`}
                        disabled={!hasNextPhoto}
                        onClick={() => goToPhoto(1)}
                    >
                        <svg className='w-[13px] h-[13px] md:w-[18px] md:h-[18px]' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8629 14.0564H14.8627V12.0566H12.8629V14.0564ZM10.8627 16.0566H12.8625L12.8629 14.0564H10.8622L10.8627 16.0566ZM8.86244 18.0569H10.8627V16.0566L8.86244 16.0571V18.0569ZM12.8629 4.05738V6.05718H14.8627V4.05693L12.8629 4.05738ZM10.8627 2.05668V4.05738H12.8629L12.8625 2.05668H10.8627ZM8.86244 0.0568848V2.05668H10.8627V0.0568848H8.86244Z" fill={"#B70100"}/>
                            <path d="M14.8623 10.0559L14.8627 12.0566L16.8625 12.0561V10.0563H18.8628V8.0561H16.863V6.0563H14.8623V8.0561H0.862305V10.0563L14.8623 10.0559Z" fill={"#B70100"}/>
                        </svg>      
                    </button>
                </div>
            </div>
        </>

    );
}