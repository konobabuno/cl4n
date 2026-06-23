"use client";

import { useEffect, useLayoutEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import LinkComponent from "./LinkComponent";
import PreviewProject from "./PreviewProject";
import ImageComponent from "./ImageComponent";
import { useProjects } from "./InnerProjectsPageNew";


export default function RenderNew({ lang, projectThumbnails, tag, service }: { lang: LocalePage; projectThumbnails: ProjectPost[], tag?: string, service: string }) {
    const { gridOrList, order } = useProjects() ?? { gridOrList: "grid", order: "asc" };
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const limit = 12;
    const [start, setStart] = useState<number>(projectThumbnails?.length ?? 0);
    const [isFetching, setIsFetching] = useState(false);
    const reachedEndRef = useRef<boolean>((projectThumbnails?.length ?? 0) < limit);
    const isFirstRenderRef = useRef(true);
    const gsapCtxRef = useRef<gsap.Context | null>(null);
    const prevGridOrListRef = useRef<"grid" | "list">(gridOrList);
    const prevOrderRef = useRef<"asc" | "desc" | "alphabetical">(order);

    CustomEase.create("customEase", "0.19, 1, 0.22, 1");

    // Desktop or mobile
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if the window is defined
        if (typeof window === "undefined") return;

        // Check if the window is a desktop
        const mq = window.matchMedia("(min-width: 993px)");
        const update = () => setIsDesktop(mq.matches);
        update();
        mq.addEventListener("change", update);
        isFirstRenderRef.current = false;

        return () => mq.removeEventListener("change", update);
    }, []);

    const [allProjects, setAllProjects] = useState<ProjectPost[]>(order === "asc" ? projectThumbnails : []);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (order === "asc" && isFirstRenderRef.current) return;

        let cancelled = false;
        setIsFetching(true);

        const params = new URLSearchParams({
            lang,
            start: "0",
            limit: String(limit),
            order,
            service: service,
        });
        if (tag) params.set("tag", tag);

        (async () => {
            const res = await fetch(`/api/projects?${params.toString()}`);
            const projects: ProjectPost[] = res.ok ? await res.json() : [];
            if (cancelled) return;

            reachedEndRef.current = projects.length < limit;
            setAllProjects(projects);
            setStart(projects.length);
            setIsFetching(false);
        })();

        return () => {
            cancelled = true;
            setIsFetching(false);
        };
    }, [order]);

    // New projects fetch
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        if (reachedEndRef.current) return;

        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            if (isFetching || reachedEndRef.current) return;

            setIsFetching(true);

            const params = new URLSearchParams({
                lang,
                start: String(start),
                limit: String(limit),
                order,
                service: service,
            });
            if (tag) params.set("tag", tag);

            try {
                const res = await fetch(`/api/projects?${params.toString()}`);
                const projects: ProjectPost[] = res.ok ? await res.json() : [];

                if (!projects || projects.length === 0) {
                    reachedEndRef.current = true;
                    return;
                }

                setAllProjects((prev) => [...prev, ...projects]);
                setStart((prev) => prev + projects.length);

                if (projects.length < limit) {
                    reachedEndRef.current = true;
                }
            } finally {
               
                setIsFetching(false);
            }
        }, {
            root: null,
            rootMargin: "600px 0px",
            threshold: 1,
        });

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [start, order, lang, service]);


    useEffect(() => {
        if (!containerRef.current) return;
        gsapCtxRef.current = gsap.context(() => {}, containerRef);
        return () => {
            gsapCtxRef.current?.revert();
            gsapCtxRef.current = null;
        };
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const ctx = gsapCtxRef.current ?? gsap.context(() => {}, container);

        ctx.add(() => {
            const gridOrListChanged = prevGridOrListRef.current !== gridOrList;
            const orderChanged = prevOrderRef.current !== order;
            prevGridOrListRef.current = gridOrList;
            prevOrderRef.current = order;
            const allItems = gsap.utils.toArray<HTMLElement>("[data-project-item]");
            if (allItems.length === 0) return;
            if (gridOrListChanged || orderChanged) {
                gsap.killTweensOf(allItems);
                gsap.set(allItems, { opacity: 0 });
                allItems.forEach((el) => el.setAttribute("data-new", "true"));
            }

            const items = allItems.filter((el) => el.getAttribute("data-new") === "true");
            if (!items.length) return;
          
            items.forEach((el, i) => {
                gsap.to(el, {
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.1 + i * 0.1,
                    ease: "customEase",
                    onComplete: () => el.removeAttribute("data-new"),
                });
            });
        });
    }, [allProjects, gridOrList]);

    // Render the projects
    const renderedProjects = useMemo(() => {
        return allProjects?.map((p, i) => (
            <div key={`${p._id} + 'title' + ${i}`} data-project-item data-new="true" className="opacity-0">
                <div
                    className={`${gridOrList === "list"
                            ? "w-3_12_custom fixed bottom-12 right-12 opacity-0"
                            : "relative"
                        } ${activeId === p._id ? "opacity-100!" : ""}`}
                >
                    <LinkComponent
                        linkType="page"
                        page={{
                            _type: "project",
                            slug: p.slug.current,
                            language: lang,
                        }}
                        className="relative "
                    >
                        {
                            p.tags && p.tags.length > 0 && (
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 flex-wrap ">
                                    {p.tags.map((tag, index) => (
                                        <div
                                            key={`tags-${index}`}
                                            className="backdrop-blur-[20px] bg-gray py-2 px-6 uppercase rounded-[5px] pointer-events-none"
                                        >
                                            {tag.title}
                                        </div>))}
                                </div>
                            )
                        }
                        <ImageComponent
                            image={p.thumbnail}
                            sizes="(max-width: 768px) 100vw, (max-width: 993px) 50vw, 25vw"
                            optionalAlt="Project thumbnail"
                            classContainer="rounded-[10px] lg:rounded-[15px] overflow-hidden aspect-[1.6]"
                            classImg="h-full w-full object-cover object-center"
                            loading={i < 3 ? "eager" : "lazy"}
                        />
                        <PreviewProject
                            videoUrl={p.videoPreview}
                            externalTrigger={
                                activeId === p._id && gridOrList == "list"
                            }
                        />
                    </LinkComponent>
                </div>

                <div
                    data-id={p._id}
                    onMouseEnter={() => {
                        if (gridOrList === "list" && isDesktop) setActiveId(p._id);
                    }}
                    onMouseLeave={() => {
                        if (gridOrList === "list" && isDesktop) setActiveId(null);
                    }}
                    onPointerDown={(e) => {
                        if (gridOrList !== "list") return;
                        if (!isDesktop) {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveId(p._id);
                        }
                    }}
                >
                    <LinkComponent
                        linkType="page"
                        page={{
                            _type: "project",
                            slug: p.slug.current,
                            language: lang,
                        }}
                    >
                        <p
                            className={`uppercase ${gridOrList === "list" ? "h1 project-title text-center" : "pt-4"}`}
                        >
                            {p.title}
                        </p>
                    </LinkComponent>
                </div>
            </div>
        ));
    }, [
        activeId,
        isDesktop,
        gridOrList,
        allProjects
    ]);

   

    return (
        <div
            ref={containerRef}
            className={`grid-of-projects relative ${gridOrList == "list" ? "flex flex-col items-center gap-8 md:gap-4" : "grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 pb-pink"} `}
        >
            <div className={`absolute top-0 left-0 w-full h-full bg-black pointer-events-none z-200 transition-opacity ${isFetching && prevOrderRef.current !== order ? 'opacity-100' : 'opacity-0'}`}></div>
            {renderedProjects}
            <div
                ref={sentinelRef}
                aria-hidden
                className={gridOrList === "list" ? "h-16" : "col-span-full h-16 absolute bottom-0 left-0 w-full"}
            />
        </div>
    );
}