'use client'

import AnimateOnView from "./AnimateOnView";
import Link from "next/link";
import { useI18n } from "@/config/i18n/i18nProvider";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { CustomEase } from "gsap/CustomEase";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function FilterbarNew({ tags, serviceSlug, setOrderAction, order, gridOrList, setGridOrListAction }:
    { tags: SanityTag[], serviceSlug: { current: string }, setOrderAction: (value: "asc" | "desc" | "alphabetical") => void, order: "asc" | "desc" | "alphabetical", gridOrList: "grid" | "list", setGridOrListAction: (value: "grid" | "list") => void }) {
    
    gsap.registerPlugin(Draggable, CustomEase);
    const { dict, lang } = useI18n();
    const router = useRouter();

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const [isTransitioning, setIsTransitioning] = useState(false);

    async function tagTransition(href: string) {
        setIsTransitioning(true);
        const body = document.body;
        body.classList.add("loading");

        const projectItems = document.querySelectorAll<HTMLElement>("[data-project-item]");
        if (projectItems.length > 0) {
            gsap.killTweensOf(projectItems);
            gsap.to(projectItems, { opacity: 0, duration: 0.3, ease: "power2.out" });
        }

        await sleep(300);
        router.push(href as Route);
    }

    // TAGS AND ORDER OPEN
    const tagsMenuRef = useRef<HTMLDivElement>(null);
    const [openTagsMenu, setOpenTagsMenu] = useState(false);
    useEffect(() => {
        if (!openTagsMenu) return;
        const handleClickOutsideTagsMenu = (event: MouseEvent) => {
            if (tagsMenuRef.current && !tagsMenuRef.current.contains(event.target as Node)) {
                setOpenTagsMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideTagsMenu);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideTagsMenu);
        };
    }, [openTagsMenu]);

    const orderMenuRef = useRef<HTMLDivElement>(null);
    const [openOrderMenu, setOpenOrderMenu] = useState(false);
    useEffect(() => {
        if (!openOrderMenu) return;
        const handleClickOutsideOrderMenu = (event: MouseEvent) => {
            if (orderMenuRef.current && !orderMenuRef.current.contains(event.target as Node)) {
                setOpenOrderMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideOrderMenu);
    }, [openOrderMenu]);

    // BOTTOM FILTERS
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const draggableProxy = useRef<HTMLDivElement>(null);
    const [openBottomsheet, setOpenBottomsheet] = useState(false);
    useEffect(() => {
        const filterbox = filterContainerRef.current;
        CustomEase.create("customEase", "0.19, 1, 0.22, 1");
        if (!filterbox) return;

        if (openBottomsheet) {
            gsap.to(filterbox, {
                duration: 0.6,
                translateY: 0,
                ease: "customEase",
            });
        } else {
            gsap.to(filterbox, {
                duration: 0.6,
                translateY: "100%",
                ease: "customEase",
            });
        }
        Draggable.create(filterbox, {
            type: "y",
            bounds: { minY: 1 * filterbox.offsetHeight, maxY: -15 },
            onDragEnd: function () {
                if (this.y > filterbox.offsetHeight * 0.1) {
                    setOpenBottomsheet(false);
                } else {
                    gsap.to(filterbox, {
                        duration: 0.4,
                        translateY: 0,
                        ease: "customEase",
                    });
                    setOpenBottomsheet(true);
                }
            },
        });
    }, [openBottomsheet]);
    

    // BOTTOM FILTERS DRAFT
    const currentPath = usePathname();
    const pathSegments = currentPath.split("/");

    const [serviceClicked, setServiceClicked] = useState<string | null>(null);

    useEffect(() => {
        if (pathSegments[4] ) {
            setServiceClicked(pathSegments[4]);
        } else {
            setServiceClicked(null);
        }
        setIsTransitioning(false);
    }, [currentPath]);

    const [bottomsheetDraft, setBottomsheetDraft] = useState<{
        tag: string | null;
        order: "asc" | "desc" | "alphabetical";
    }>({
        tag: pathSegments[4] || null,
        order: order,
    });

    const submitBottomsheetDraft = () => {
        setTimeout(() => {
            setOpenBottomsheet(false);
        }, 100);
        setOrderAction(bottomsheetDraft.order);
        if (bottomsheetDraft.tag != null) {
          tagTransition(`/${lang}/projects/${serviceSlug.current}/${bottomsheetDraft.tag}`);
        } else {
          tagTransition(`/${lang}/projects/${serviceSlug.current}`);
        }
      };

    return (
        <>
            {/* DESKTOP FILTER */}
            <div className="row justify-center">
                <div className="w-full lg:w-9/12">
                    <nav className="pt-green">
                        <div className="flex justify-between relative">
                            {/* TAGS FILTER */}
                            <div className="relative hidden lg:block" ref={tagsMenuRef}>
                                <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => { setOpenTagsMenu(!openTagsMenu) }}>
                                    <p className="uppercase">{dict.general.projects.services}</p>
                                    <svg className={`${openTagsMenu ? 'rotate-180' : ''}`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3" />
                                        <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3" />
                                    </svg>
                                </div>
                                <div className={`absolute flex-col gap-2 flex top-[calc(100%+20px)] bg-gray backdrop-blur-[20px] px-8 py-6 rounded-[10px] w-80 z-400 transition-opacity uppercase ${openTagsMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                    <Link href={`/${lang}/projects/${serviceSlug.current}`} className={`flex gap-4 items-center ${isTransitioning ? 'pointer-events-none' : ''}`} onClick={(e) => {
                                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                                        e.preventDefault();
                                        setServiceClicked(null);
                                        tagTransition(`/${lang}/projects/${serviceSlug.current}`);
                                    }}>
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${serviceClicked == null ? 'block' : 'hidden'}`}></div>
                                        {dict.general.projects.all}
                                    </Link>
                                    {tags && tags.map((tag) => (
                                        <Link key={tag.title + 'desktopTag'} href={`/${lang}/projects/${serviceSlug.current}/${tag.slug.current}`} className={`flex gap-4 items-center ${isTransitioning ? 'pointer-events-none' : ''}`} onClick={(e) => {
                                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                                            e.preventDefault();
                                            setServiceClicked(tag.slug.current);
                                            tagTransition(`/${lang}/projects/${serviceSlug.current}/${tag.slug.current}`);
                                        }}>
                                            <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${serviceClicked == tag.slug.current ? 'block' : 'hidden'}`}></div>
                                            {tag.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {/* OPEN BOTTOMSHEET FILTER */}
                            <div className="flex gap-2 items-center cursor-pointer select-none lg:hidden " onClick={() => {setOpenBottomsheet(true)}}>
                                <p className="uppercase">{dict.general.projects.filters}</p>
                                <svg className={`${openBottomsheet ? 'rotate-180' : ''} h-auto w-[12px] md:w-[18px]`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3"/>
                                    <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3"/>
                                </svg>
                            </div>
                            {/* GRID OR LIST FILTER */}
                            <div className="lg:absolute top-0 left-1/2 lg:-translate-x-1/2 ">
                                <div className="flex gap-4">
                                    <div className="flex gap-4 items-center">
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${gridOrList == 'grid' ? 'block' : 'hidden'}`}></div>
                                        <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setGridOrListAction('grid') }}>{dict.general.projects.grid}</p>
                                    </div>
                                    <p> / </p>
                                    <div className="flex gap-4 items-center">
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${gridOrList == 'list' ? 'block' : 'hidden'}`}></div>
                                        <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setGridOrListAction('list') }}>{dict.general.projects.list}</p>
                                    </div>
                                </div>
                            </div>
                            {/* ORDER FILTER */}
                            <div className="relative hidden lg:block" ref={orderMenuRef}>
                                <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => { setOpenOrderMenu(!openOrderMenu) }}>
                                    <p className="uppercase">{dict.general.projects.order}</p>
                                    <svg className={`${openOrderMenu ? 'rotate-180' : ''}`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3" />
                                        <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3" />
                                    </svg>
                                </div>
                                <div className={`absolute flex-col gap-2 flex top-[calc(100%+20px)] bg-gray backdrop-blur-[20px] px-8 py-6 rounded-[10px] w-80 z-400 transition-opacity uppercase ${openOrderMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                    <div className="flex gap-4 items-center">
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${order == 'asc' ? 'block' : 'hidden'}`}></div>
                                        <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setOrderAction('asc') }}>{dict.general.projects.recent}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${order == 'desc' ? 'block' : 'hidden'}`} ></div>
                                        <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setOrderAction('desc') }}>{dict.general.projects.oldest}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${order == 'alphabetical' ? 'block' : 'hidden'}`}></div>
                                        <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setOrderAction('alphabetical') }}>{dict.general.projects.alphabetical}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            {/* BOTTOMSHEET FILTER */}
            <div className="fixed lg:hidden -bottom-6 left-0 right-0 bg-gray backdrop-blur-[20px] z-110 px-8 md:px-12 pb-12 rounded-tl-[10px] rounded-tr-[10px] translate-y-full" ref={filterContainerRef}>
                <div className="relative">
                    <div className="absolute left-0 top-0 bg-green opacity-20" ref={draggableProxy} >
                    </div>
                </div>
                <div className="py-6 flex justify-center">
                    <div className="bg-offwhite rounded-[30px] h-2 w-56"></div>
                </div>
                <div className="pt-3">
                    <p className="h3 text-center">
                        {dict.general.projects.filters}
                    </p>
                </div>
                <div className=" pt-blue">
                    <p className="uppercase">{dict.general.projects.tags}:</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className={`uppercase border border-offwhite px-4 py-2 rounded-[5px]  cursor-pointer ${bottomsheetDraft.tag == null ? 'bg-offwhite text-black' : 'text-offwhite'}`} onClick={() => { setBottomsheetDraft({...bottomsheetDraft, tag: null}) }}>
                            {dict.general.projects.all}
                        </div>
                        {tags && tags.map((tag) => (
                            <div key={tag.title + 'mobileTag'} data-slug={tag.slug.current} className={`uppercase border border-offwhite px-4 py-2 rounded-[5px] cursor-pointer ${bottomsheetDraft.tag == tag.slug.current ? 'bg-offwhite text-black' : 'text-offwhite'}`} onClick={() => { setBottomsheetDraft({...bottomsheetDraft, tag: tag.slug.current}) }}>
                                {tag.title}
                            </div>
                        ))}
                    </div>
                    <div className="pt-red">
                        <p className="uppercase">{dict.general.projects.order}</p>
                        <div className="flex flex-wrap gap-8 gap-y-4 lg:gap-x-8 pt-4">
                            <div className="flex gap-4 items-center cursor-pointer" onClick={() => { setBottomsheetDraft({...bottomsheetDraft, order: 'asc'}) }}>
                                <div className="border border-offwhite w-6 h-6 rounded-full flex items-center justify-center">
                                    <div className={`bg-offwhite w-[9px] h-[9px] rounded-full ${bottomsheetDraft.order == 'asc' ? 'block' : 'hidden'}`}></div>
                                </div>
                                <p className="uppercase">
                                    {dict.general.projects.recent}
                                </p>
                            </div>
                            <div className="flex gap-4 items-center cursor-pointer" onClick={() => { setBottomsheetDraft({...bottomsheetDraft, order: 'desc'}) }}>
                                <div className="border border-offwhite w-6 h-6 rounded-full flex items-center justify-center">
                                    <div className={`bg-offwhite w-[9px] h-[9px] rounded-full ${bottomsheetDraft.order == 'desc' ? 'block' : 'hidden'}`}></div>
                                </div>
                                <p className="uppercase">
                                    {dict.general.projects.oldest}
                                </p>
                            </div>
                            <div className="flex gap-4 items-center cursor-pointer" onClick={() => { setBottomsheetDraft({...bottomsheetDraft, order: 'alphabetical'}) }}>
                                <div className="border border-offwhite w-6 h-6 rounded-full flex items-center justify-center">
                                    <div className={`bg-offwhite w-[9px] h-[9px] rounded-full ${bottomsheetDraft.order == 'alphabetical' ? 'block' : 'hidden'}`}></div>
                                </div>
                                <p className="uppercase">
                                    {dict.general.projects.alphabetical}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-pink flex justify-center pb-3">
                        <div className={`btn ${isTransitioning ? 'pointer-events-none' : ''}`} onClick={submitBottomsheetDraft}>
                            <p className="uppercase">
                                {dict.general.projects.apply}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOMSHEET OVERLAY */}
            <div 
                className={`fixed left-0 right-0 top-0 bottom-0 bg-black z-100 transition-opacity ${openBottomsheet ? 'opacity-70 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={() =>{setOpenBottomsheet(false);}} >
            </div>
        </>

    )
}