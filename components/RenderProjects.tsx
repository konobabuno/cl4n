"use client";
import { useProjects } from "./InnerProjectsPage";
import LinkComponent from "./LinkComponent";
import ImageComponent from "./ImageComponent";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PreviewProject from "./PreviewProject";

function useMediaQuery(query: string) {
    const getMatches = () =>
        typeof window !== "undefined" && window.matchMedia(query).matches;

    const [matches, setMatches] = useState(getMatches);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        }
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, [query]);

    return matches;
}

export default function RenderProjects({
    initialProjects,
    lang,
    service,
    principalRoute = "projects",
    totalProjects
}: {
    initialProjects: ProjectPost[];
    lang: LocalePage;
    service?: string;
    principalRoute?: string;
    totalProjects: number;
}) {
    const { gridOrList, order } = useProjects() || {};
    const containerRef = useRef<HTMLDivElement | null>(null);
    const prevGridOrList = useRef(gridOrList);
    const prevOrder = useRef(order);
    const [activeId, setActiveId] = useState<string | null>(null);
    const canHover = useMediaQuery("(min-width: 993px) and (hover: hover)");
    const [allProjects, setAllProjects] = useState<ProjectPost[]>(initialProjects);
    const [start, setStart] = useState<number>(initialProjects?.length ?? 0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(
        typeof totalProjects === "number"
            ? (initialProjects?.length ?? 0) < totalProjects
            : true,
    );
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const limit = 8;

    CustomEase.create("customEase", "0.19, 1, 0.22, 1");

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const gridOrListChanged = prevGridOrList.current !== gridOrList;
        const orderChanged = prevOrder.current !== order;
        prevGridOrList.current = gridOrList;
        prevOrder.current = order;

        const ctx = gsap.context(() => {
            const allItems = gsap.utils.toArray<HTMLElement>("[data-project-item]");
            const items = (gridOrListChanged || orderChanged)
                ? allItems
                : allItems.filter((el) => el.dataset.new === "true");
            if (!items.length) return;
            gsap.killTweensOf(items);
            gsap.set(items, { opacity: 0 });
            gsap.to(items, {
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.1,
                ease: "customEase",
                onComplete: () => {
                    items.forEach((el) => el.setAttribute("data-new", "false"));
                },
            });
        }, container);

        return () => ctx.revert();
    }, [allProjects.length, gridOrList, order]);

    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>(".no-touch-in-loading");
        if (isFetching) {
            document.body.style.cursor = "wait";
            els.forEach((el) => (el.style.pointerEvents = "none"));
        } else {
            document.body.style.cursor = "";
            els.forEach((el) => (el.style.pointerEvents = ""));
        }
        return () => {
            document.body.style.cursor = "";
            els.forEach((el) => (el.style.pointerEvents = ""));
        };
    }, [isFetching]);

    const fetchProjects = async (
        startFetch: number,
        limit: number,
        orderFetch?: "asc" | "desc",
    ) => {
        try {
            setIsFetching(true);
            const qs = new URLSearchParams({
                lang,
                start: String(startFetch),
                limit: String(limit),
                order: orderFetch ?? "asc",
                ...(service ? { service } : {}),
            });

            const res = await fetch(`/api/${principalRoute}?${qs.toString()}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error("Bad response");
            const data: ProjectPost[] = await res.json();

            setAllProjects((prev) => {
                const seen = new Set(prev.map((p) => p._id));
                const next = data.filter((p) => !seen.has(p._id));
                return next.length ? [...prev, ...next] : prev;
            });
            

            setStart((prev) => prev + data.length);
            if (typeof totalProjects === "number") {
                setHasMore(startFetch + data.length < totalProjects);
            } else {
                setHasMore(data.length > 0);
            }
        } catch (e) {
            console.error("Error fetching projects:", e);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!hasMore) return;
        if (typeof totalProjects === "number" && start >= totalProjects) {
            setHasMore(false);
            return;
        }
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                if (isFetching) return;
                if (!hasMore) return;
                if (typeof totalProjects === "number" && start >= totalProjects) {
                    setHasMore(false);
                    return;
                }
                fetchProjects(start, limit, order);
            },
            {
                root: null,
                rootMargin: "600px 0px",
                threshold: 1,
            },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, isFetching, limit, order, start, totalProjects]);

    useEffect(() => {
        setAllProjects([]);
        setStart(0);
        setHasMore(typeof totalProjects === "number" ? initialProjects.length < totalProjects : true);
        fetchProjects(0, limit, order);
    }, [order]);

    const renderedProjects = useMemo(() => {
        return allProjects?.map((p, i) => (
            <div key={`${p._id} + 'title' + ${i}`} data-project-item data-new="true">
                <div
                    className={`${
                        gridOrList === "list"
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
                        className="relative"
                    >
                        {
                          p.services.length > 0 && (
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 flex-wrap ">
                              {p.services.map((service, index) => (
                                  <div
                                      key={`service-${index}`}
                                      className="backdrop-blur-[20px] bg-gray py-2 px-6 uppercase rounded-[5px] pointer-events-none"
                                  >
                                      {service.title}
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
                        if (gridOrList === "list" && canHover) setActiveId(p._id);
                    }}
                    onMouseLeave={() => {
                        if (gridOrList === "list" && canHover) setActiveId(null);
                    }}
                    onPointerDown={(e) => {
                        if (gridOrList !== "list") return;
                        if (!canHover) {
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
                            className={`${gridOrList === "list" ? "h1 project-title text-center" : "pt-4"}`}
                        >
                            {p.title}
                        </p>
                    </LinkComponent>
                </div>
            </div>
        ));
    }, [
        activeId,
        canHover,
        gridOrList,
        allProjects,
        lang,
    ]);

    
    return (
        <div
            ref={containerRef}
            className={`grid-of-projects ${gridOrList == "list" ? "flex flex-col items-center gap-8 md:gap-4" : "grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 "} `}
        >
            {renderedProjects}
            {hasMore ? (
                <div
                    ref={sentinelRef}
                    aria-hidden
                    className={gridOrList === "list" ? "h-16" : "col-span-full h-16"}
                />
            ) : null}
        </div>
    );
}
