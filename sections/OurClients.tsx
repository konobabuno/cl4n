"use client";

import { useEffect, useState, useRef } from "react";
import { urlFor } from "@/sanity/lib/image";
import TitleText from "@/components/TitleText";
import AnimateOnView from "@/components/AnimateOnView";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { PortableTextBlock } from "next-sanity";

gsap.registerPlugin(CustomEase);
CustomEase.create("customEase", "0.19, 1, 0.22, 1");

type OurClients = {
    backgroundColor?: Color;
    headline?: string;
    bigText?: PortableTextBlock;
    clients?: {
        _key: string;
        title: string;
        clientLogo: Image;
    }[];
};

export default function OurClients(section: OurClients) {
    const color = section.backgroundColor?.value || "#B70100";
    const newColorString = (color || "").slice(0, 7);

    const allClients = section.clients || [];

    const [objectURLs, setObjectURLs] = useState<
        Array<{ name: string; url: string }>
    >([]);
    const [sequence, setSequence] = useState<number[]>([0, 4, 2, 5, 1, 3]);

    const [_, forceRerender] = useState(0);

    const containerObserver = useRef<HTMLDivElement | null>(null);
    const containerLogos = useRef<Array<HTMLDivElement | null>>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const sequenceIndexRef = useRef(0);
    const idxRef = useRef(0);
    const typewriterTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        const updateSequence = () => {
            if (window.innerWidth < 768) {
                sequenceIndexRef.current = 0;
                setSequence([0, 3, 1, 2]);
            } else {
                setSequence([0, 4, 2, 5, 1, 3]);
            }
        };
        updateSequence();
        window.addEventListener("resize", updateSequence);
        return () => window.removeEventListener("resize", updateSequence);
    }, []);

    useEffect(() => {
        const urls = allClients
            .map((c) =>
                c?.clientLogo
                    ? { name: c.title, url: urlFor(c.clientLogo).url() }
                    : null,
            )
            .filter((u): u is { name: string; url: string } => !!u);

        let alive = true;

        (async () => {
            const blobs = await Promise.all(
                urls.map(async ({ name, url }) => {
                    const res = await fetch(url, { cache: "force-cache" });
                    const b = await res.blob();
                    return { name, url: URL.createObjectURL(b) };
                }),
            );
            if (!alive) return;

            setObjectURLs((prev) => {
                prev.forEach(({ url }) => URL.revokeObjectURL(url));
                return blobs;
            });

            idxRef.current = 0;
            sequenceIndexRef.current = 0;
        })();

        return () => {
            alive = false;
        };
    }, [allClients]);

    const startInterval = () => {
        if (intervalRef.current || !objectURLs.length) return;
        intervalRef.current = setInterval(() => {
            const indexInGrid = sequence[sequenceIndexRef.current];
            const currentContainer = containerLogos.current[indexInGrid];
            if (!currentContainer) return;

            // Si ya tiene el mismo índice, avanza rápido para no repetir
            const dataIndex = Number(currentContainer.dataset.index ?? -1);
            if (idxRef.current === dataIndex) {
                idxRef.current = (idxRef.current + 1) % objectURLs.length;
            }

            // OUT anim
            const oldImage = currentContainer.querySelector("img");
            if (oldImage) {
                oldImage.classList.add("old");
                gsap.to(oldImage, {
                    translateY: "-50px",
                    opacity: 0,
                    duration: 0.4,
                    ease: "customEase",
                    onComplete: () => oldImage.remove(),
                });
            }

            const next = objectURLs[idxRef.current];
            currentContainer.dataset.title = next.name || "";
            currentContainer.dataset.index = String(idxRef.current);
            const newImage = document.createElement("img");
            newImage.src = next.url;
            newImage.alt = next.name || "Client logo";
            newImage.className =
                "w-full h-full object-cover rounded-[15px] absolute";
            newImage.style.opacity = "0";
            newImage.style.transform = "translateY(60px)";
            currentContainer.classList.add("is-swapping");

            currentContainer.appendChild(newImage);

            gsap.to(newImage, {
                translateY: "0px",
                opacity: 1,
                duration: 0.4,
                ease: "customEase",
                onComplete: () => {
                    currentContainer.dataset.title =
                        currentContainer.dataset.nextTitle || next.name || "";
                    currentContainer.dataset.index =
                        currentContainer.dataset.nextIndex ||
                        String(idxRef.current);
                    delete currentContainer.dataset.nextTitle;
                    delete currentContainer.dataset.nextIndex;
                    currentContainer.classList.remove("is-swapping");
                },
            });

            idxRef.current = (idxRef.current + 1) % objectURLs.length;
            sequenceIndexRef.current =
                (sequenceIndexRef.current + 1) % sequence.length;
        }, 1000);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // ---- Observer + listeners (montar una sola vez y reusar) ----
    useEffect(() => {
        // IntersectionObserver: pausa/reanuda según visibilidad en viewport
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !document.hidden) {
                    startInterval();
                } else {
                    stopInterval();
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, {
            threshold: 0.1,
        });
        if (containerObserver.current)
            observerRef.current.observe(containerObserver.current);

        // Pausar si la pestaña se oculta; reanudar si vuelve y el section está visible
        const onVisibility = () => {
            if (document.hidden) {
                stopInterval();
            } else {
                // Reanuda sólo si el contenedor es visible en viewport
                // (el observer disparará start cuando entre)
                // Forzamos un tick para asegurar medición actual
                requestAnimationFrame(() => startInterval());
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        // Eventos de hover para escribir el título
        const clients = () => document.querySelectorAll(".client");
        const clearTypewriter = () => {
            typewriterTimeoutsRef.current.forEach(clearTimeout);
            typewriterTimeoutsRef.current = [];
        };
        const typeTitle = (text: string, element: HTMLElement) => {
            clearTypewriter();
            element.textContent = "";
            document.querySelectorAll(".titleTag").forEach((el) => {
                (el as HTMLElement).classList.remove("!opacity-0");
                (el as HTMLElement).classList.add("!opacity-100");
            });
            [...text].forEach((char, i) => {
                const t = setTimeout(() => {
                    element.textContent += char;
                }, i * 70);
                typewriterTimeoutsRef.current.push(t);
            });
        };

        const handleMouseOver = (event: Event) => {
            if (window.innerWidth < 993) return;
            const target = event.currentTarget as HTMLElement;
            const clientTitle =
                target.getAttribute("data-next-title") ||
                target.getAttribute("data-title");
            if (!clientTitle) return;
            const titleElement = document.querySelector(
                ".titleTag p",
            ) as HTMLElement | null;
            if (!titleElement) return;
            typeTitle(clientTitle, titleElement);
            stopInterval();
        };

        const handleMouseOut = () => {
            if (window.innerWidth < 993) return;
            const titleElement = document.querySelector(
                ".titleTag p",
            ) as HTMLElement | null;
            if (titleElement) titleElement.textContent = "";
            document.querySelectorAll(".titleTag").forEach((el) => {
                (el as HTMLElement).classList.remove("!opacity-100");
                (el as HTMLElement).classList.add("!opacity-0");
            });
            clearTypewriter();
            startInterval();
        };

        const attachHover = () => {
            clients().forEach((el) => {
                el.addEventListener("mouseover", handleMouseOver);
                el.addEventListener("mouseout", handleMouseOut);
            });
        };
        const detachHover = () => {
            clients().forEach((el) => {
                el.removeEventListener("mouseover", handleMouseOver);
                el.removeEventListener("mouseout", handleMouseOut);
            });
        };

        attachHover();

        return () => {
            stopInterval();
            if (observerRef.current) observerRef.current.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            detachHover();
            clearTypewriter();
        };
        // IMPORTANTE: este efecto NO depende de idx, sólo de objectURLs/sequence que cambian poco
    }, [objectURLs, sequence]);

    // ---- Render ----
    // Reset de slots por render: asigna por índice, sin push acumulativo
    containerLogos.current = [];

    return (
        <section id="our-clients" ref={containerObserver}>
            <div
                className="container p-lat pt-green pb-green"
                style={{ backgroundColor: newColorString }}
            >
                <AnimateOnView className="row justify-center">
                    <div className="w-full md:w-10/12 lg:w-8/12 flex flex-col items-center animate">
                        {section.headline && (
                            <div className="detalle circular-tag">
                                {section.headline}
                            </div>
                        )}
                        {section.bigText && (
                            <div className="pt-6 pb-blue">
                                <div className="h1 text-center relative">
                                    <TitleText text={section.bigText} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-10/12 md:w-9/12 lg:w-8/12">
                        {allClients.length > 0 && (
                            <div className="relative w-full">
                                <div
                                    className="titleTag absolute left-1/2 top-1/2 -translate-1/2 px-12 py-8 rounded-[50px] hidden lg:flex items-center justify-center border-2 border-offwhite z-10 opacity-0! "
                                    style={{ backgroundColor: newColorString }}
                                >
                                    <p className="h2-bold"></p>
                                </div>

                                <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 gridElement">
                                    {Array.from({ length: 6 }).map(
                                        (_, index) => {
                                            const initialObj =
                                                objectURLs[
                                                    index %
                                                        (objectURLs.length || 1)
                                                ];
                                            const initialUrl = initialObj?.url;
                                            const initialTitle =
                                                allClients[
                                                    index % allClients.length
                                                ]?.title || "";

                                            return (
                                                <div
                                                    key={`client-square-${index}`}
                                                    ref={(el) => {
                                                        containerLogos.current[
                                                            index
                                                        ] = el;
                                                    }}
                                                    data-index={
                                                        initialUrl
                                                            ? String(
                                                                  index %
                                                                      objectURLs.length,
                                                              )
                                                            : "-1"
                                                    }
                                                    data-title={initialTitle}
                                                    className={`bg-gray rounded-[15px] client aspect-square md:block relative ${index > 3 ? "hidden" : ""}`}
                                                >
                                                    {initialUrl && (
                                                        <img
                                                            src={initialUrl}
                                                            alt={`Client logo ${index}`}
                                                            className="w-full h-full object-cover rounded-[15px] absolute"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </AnimateOnView>
            </div>

            <div
                className="extra-layout"
                style={{ backgroundColor: newColorString }}
            />
        </section>
    );
}
