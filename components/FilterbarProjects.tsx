'use client'

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { CustomEase } from "gsap/CustomEase";
import Link from "next/link";
import { useI18n } from "@/config/i18n/i18nProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import AnimateOnView from "./AnimateOnView";

export function setProjectsLoading() {
    document.body.style.cursor = "wait";
    document.querySelectorAll<HTMLElement>(".grid-of-projects").forEach((el) => (el.style.display = "none"));
    document.querySelectorAll<HTMLElement>(".no-touch-in-loading").forEach((el) => (el.style.pointerEvents = "none"));
}

export function clearProjectsLoading() {
    document.body.style.cursor = "";
    document.querySelectorAll<HTMLElement>(".grid-of-projects").forEach((el) => (el.style.display = ""));
    document.querySelectorAll<HTMLElement>(".no-touch-in-loading").forEach((el) => (el.style.pointerEvents = ""));
}

export default function FilterbarProjects(
    {services, setGridOrListAction, setOrderAction, order, gridOrList}: 
    {services?: string[], setGridOrListAction: (value: "grid" | "list") => void, setOrderAction: (value: "asc" | "desc") => void, order: "asc" | "desc", gridOrList: "grid" | "list"}) {
    gsap.registerPlugin(Draggable, CustomEase);
    
    const router = useRouter();
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);
    const [openServices, setOpenServices] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [serviceInPath, setServiceInPath] = useState<string | null>(pathSegments[2] || null);

    const servicesRef = useRef<HTMLDivElement>(null);
    const orderRef = useRef<HTMLDivElement>(null);
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const draggableProxy = useRef<HTMLDivElement>(null);
    
    const {dict, lang} = useI18n();

    const [draftFilters, setDraftFilters] = useState<{
        service?: string;
        order: "asc" | "desc";
    }>({
        service: (pathSegments[2] || undefined),
        order: order,
    });

    useEffect(() => {
        if (!openServices) return;

        const handleClickOutsideServices = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setOpenServices(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideServices);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideServices);
        };
    }, [openServices]);

    useEffect(() => {
        if (!openOrder) return;

        const handleClickOutsideOrder = (event: MouseEvent) => {
            if (orderRef.current && !orderRef.current.contains(event.target as Node)) {
                setOpenOrder(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideOrder);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideOrder);
        };
    }, [openOrder]);
    
    useEffect(() => {
        const filterbox = filterContainerRef.current;
        CustomEase.create("customEase", "0.19, 1, 0.22, 1");
        if (!filterbox) return;

        if (openFilters) {
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
                    setOpenFilters(false);
                } else {
                    gsap.to(filterbox, {
                        duration: 0.4,
                        translateY: 0,
                        ease: "customEase",
                    });
                    setOpenFilters(true);
                }
            },
        });
    }, [openFilters]);

    const handleSubmitFilter = () => {
        if (draftFilters.order) {
            setOrderAction(draftFilters.order);
        }
        if (draftFilters.service) {
            const service = draftFilters.service;
            router.push(`/${lang}/projects/${service}`);
        } else if (draftFilters.service == null){
            router.push(`/${lang}/projects`);
        }
        setOpenFilters(false);
    }
    
    return(
    <>
        <div className="row justify-center">
            <div className="w-full lg:w-9/12">
                <nav className="pt-green ">
                    <AnimateOnView className="flex justify-between relative">
                        <div className="relative hidden lg:block animate" ref={servicesRef}>
                            <div className="flex gap-2 items-center cursor-pointer select-none" onClick={()=> {setOpenServices(!openServices)}}>
                                <p className="uppercase">{dict.general.projects.services}</p>
                                <svg className={`${openServices ? 'rotate-180' : ''}`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3"/>
                                    <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3"/>
                                </svg>
                            </div>
                            <div className={`absolute flex-col gap-2 flex top-[calc(100%+20px)] bg-gray backdrop-blur-[20px] px-8 py-6 rounded-[10px] w-80 z-30 transition-opacity uppercase ${openServices ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                <Link href={`/${lang}/projects`}  className="flex gap-4 items-center animate" onClick={
                                    (event) => {
                                        event.preventDefault(); 
                                        setServiceInPath(null);
                                        setProjectsLoading();
                                        router.push(`/${lang}/projects`); 
                                    }
                                }>
                                    <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${serviceInPath == undefined ? 'block' : 'hidden'}`}></div>
                                    Todos
                                </Link>
                                {services && services.map((service) => (
                                    <Link key={service + 'desktopService'} href={`/projects/${service}`} className="flex gap-4 items-center animate" onClick={
                                        (event) => {
                                            event.preventDefault(); 
                                            setServiceInPath(service);
                                            setProjectsLoading();
                                            router.push(`/${lang}/projects/${service}`); 
                                        }
                                    }>
                                        <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${serviceInPath == service ? 'block' : 'hidden'}`}></div>
                                        {service}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 items-center cursor-pointer select-none lg:hidden animate " onClick={() => {setOpenFilters(true)}}>
                            <p className="uppercase">{dict.general.projects.filters}</p>
                            <svg className={`${openFilters ? 'rotate-180' : ''} h-auto w-[12px] md:w-[18px]`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3"/>
                                <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3"/>
                            </svg>
                        </div>
                        
                        <div className="lg:absolute top-0 left-1/2 lg:-translate-x-1/2 animate ">
                            <div className="flex gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${gridOrList == 'list' ? 'block' : 'hidden'}`}></div>
                                    <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setGridOrListAction('list') }}>{dict.general.projects.list}</p>
                                </div>
                                
                                <p> / </p>
                                <div className="flex gap-4 items-center">
                                    <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${gridOrList == 'grid' ? 'block' : 'hidden'}`}></div>
                                    <p className="uppercase cursor-pointer no-touch-in-loading" onClick={() => { setGridOrListAction('grid') }}>{dict.general.projects.grid}</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative  hidden lg:block animate" ref={orderRef}>
                            <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => {setOpenOrder(!openOrder)}}>
                                <p className="uppercase">{dict.general.projects.order}</p>
                                <svg className={`${openOrder ? 'rotate-180' : ''}`} width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.0005 4.00007L4.0005 5.99987H6.0003V4.00007H4.0005ZM2.00025 1.99982L2.00025 3.99962L4.0005 4.00007V1.99937L2.00025 1.99982ZM8.74338e-08 -0.000427246L0 1.99982L2.00025 1.99982L1.9998 -0.000427159L8.74338e-08 -0.000427246ZM13.9995 4.00007L11.9997 4.00007V5.99987L13.9999 5.99987L13.9995 4.00007ZM16.0002 1.99982H13.9995V4.00007L16.0002 3.99962V1.99982ZM18 -0.000426459L16.0002 -0.000426547V1.99982L18 1.99982V-0.000426459Z" fill="#FDF9F3"/>
                                    <path d="M6.0003 5.99987L8.00098 5.99939L8.00053 7.99964L10.0008 8.00009V5.99939H12.0006V8.00009H10.0008V9.99989H8.00053V7.99964H6.00073L6.0003 5.99987Z" fill="#FDF9F3"/>
                                </svg>
                            </div>
                            <div className={`absolute flex-col gap-2 flex top-[calc(100%+20px)] right-0 bg-gray backdrop-blur-[20px] px-8 py-6 rounded-[10px] w-80 z-30 transition-opacity ${openOrder ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                <div className="flex gap-4 items-center">
                                    <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${order == 'asc' ? 'block' : 'hidden'}`}></div>
                                    <div className="uppercase cursor-pointer no-touch-in-loading" onClick={() => {setOrderAction('asc')}}>
                                        {dict.general.projects.recent}
                                    </div>
                                </div>
                               <div className="flex gap-4 items-center">
                                    <div className={`bg-offwhite w-[8px] h-[8px] rounded-full ${order == 'desc' ? 'block' : 'hidden'}`}></div>
                                    <div className="uppercase cursor-pointer no-touch-in-loading" onClick={() => {setOrderAction('desc')}} >
                                        {dict.general.projects.oldest}
                                    </div>
                               </div>
                              
                            </div>
                        </div>
                    </AnimateOnView>
                </nav>
            </div>
        </div>
        <div 
        className={`fixed left-0 right-0 top-0 bottom-0 bg-black z-100 transition-opacity ${openFilters ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() =>{setOpenFilters(false);}} >
        </div>
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
                <p className="uppercase">{dict.general.projects.services}:</p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <div className={`uppercase border border-offwhite px-4 py-2 rounded-[5px] ${draftFilters.service == null ? 'bg-offwhite text-black' : 'text-offwhite'} cursor-pointer`} onClick={() => {
                        setDraftFilters((prev) => ({ ...prev, service: undefined })); 
                    }}>
                        {dict.general.projects.all}
                    </div>
                    {services && services.map((service) => (
                        <div key={service + 'mobileService'} className={`uppercase border border-offwhite px-4 py-2 rounded-[5px] ${draftFilters.service == service ? 'bg-offwhite text-black' : 'text-offwhite'} cursor-pointer`}
                        onClick={() => {
                            setDraftFilters((prev) => ({ ...prev, service })); 
                        }}>
                            {service}
                        </div>
                    ))}
                </div>
                <div className="pt-red">
                    <p className="uppercase">{dict.general.projects.order}</p>
                    <div className="flex flex-wrap gap-8 lg:gap-12 pt-4">
                        <div className="flex gap-4 items-center cursor-pointer" onClick={() => { 
                            setDraftFilters((prev) => ({ ...prev, order: 'asc' })); 
                        }}> 
                            <div className="border border-offwhite w-6 h-6 rounded-full flex items-center justify-center">
                                <div className={`bg-offwhite w-[9px] h-[9px] rounded-full ${draftFilters.order == 'asc' ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>
                            <p className="uppercase">
                                {dict.general.projects.recent}
                            </p>
                        </div>
                        <div className="flex gap-4 items-center cursor-pointer" onClick={() => { 
                            setDraftFilters((prev) => ({ ...prev, order: 'desc' })); 
                        }}>  
                            <div className="border border-offwhite w-6 h-6 rounded-full flex items-center justify-center">
                                <div className={`bg-offwhite w-[9px] h-[9px] rounded-full  ${draftFilters.order == 'desc' ? 'opacity-100' : 'opacity-0'} `}></div>
                            </div>
                            <p className="uppercase">
                                {dict.general.projects.oldest}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="pt-pink flex justify-center pb-3">
                    <div className="btn" onClick={() => {
                        handleSubmitFilter();
                        setProjectsLoading();
                    }}>
                        <p className="uppercase">
                            {dict.general.projects.apply}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>
    
    
   )
}