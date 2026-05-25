'use client'

import TitleText from "@/components/TitleText"
import ImageComponent from "@/components/ImageComponent";
import { useState, useRef } from "react";
import AnimateOnView from "@/components/AnimateOnView";
import { gsap } from "gsap";
import LinkComponent from "@/components/LinkComponent";
import { PortableTextBlock } from "@portabletext/types";

type ourTeam = {
    headline?: string;
    bigText?: PortableTextBlock;
    backgroundColor?: {
        value: string;
    };
    members?: {
        _key: string;
        name: string;
        photo: Image;
        externalLink?: string;
    }[];
    ctaButton?: Link;
}

export default function OurTeam(section: ourTeam) {
    const [hoveredMember, setHoveredMember] = useState<number>(-1);
    const abecedary = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const color = section.backgroundColor?.value || '#B70100';  
    let newColor = [];
    if (color){
        for (let i = 0; i < 7; i++) {
            newColor.push(color[i]);
        }
    }
    let newColorString: string = newColor.join('');

    const containerImgs = useRef<HTMLDivElement | null>(null);
    const containerTeam = useRef<HTMLDivElement | null>(null);
    const innerImages = useRef<HTMLDivElement | null>(null);

    const [flag, setFlag] = useState(false);


    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
        if (flag) return; 
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const y = e.clientY - rect.top;
        gsap.set(containerImgs.current, {
            y: y
        });

        if (section.members){
            if (hoveredMember !== null && section.members.length > 0) {
                const translateY = (100 / section.members.length) * (hoveredMember) * -1;
                gsap.set(innerImages.current, {
                    y: `${translateY}%`,
                });
            }
        }

        gsap.to(containerImgs.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
        });
        setFlag(true);
    }

    function handleMouseLeave() {
        gsap.set(containerImgs.current, {
            y: 0
        });

        gsap.to(containerImgs.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
        });

        setFlag(false);
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (flag && section.members) {
            const container = event.currentTarget.getBoundingClientRect();
            const cursorY = event.clientY - container.top; // Get Y position relative to container

            // Animate containerImgs to follow the cursor
            gsap.to(containerImgs.current, {
                y: cursorY,
                duration: 0.5,
                ease: "power3.out",
            });

            // Calculate translateY for innerImages based on hoveredMember
            if (hoveredMember !== null && section.members.length > 0) {

                const translateY = (100 / section.members.length) * (hoveredMember) * -1;

                // Animate innerImages with gsap
                gsap.to(innerImages.current, {
                    y: `${translateY}%`,
                    duration: 0.6,
                    ease: "power2.out",
                });
            }
        }
    };

    return (
        <section
            className="relative"
            style={{ backgroundColor: newColorString }}
        >
            <div className="container p-lat pt-green">
                <div className="row justify-center">
                    <AnimateOnView
                        className="w-full md:w-10/12 lg:w-7/12 flex flex-col items-center"
                    >
                        {section.headline && (
                            <div className="detalle circular-tag uppercase animate">
                                {section.headline}
                            </div>
                        )}
                        {section.bigText && (
                            <div className="pt-6">
                                <div className="h1 text-center relative animate delay-sm">
                                    <TitleText text={section.bigText} />
                                </div>
                            </div>
                        )}
                    </AnimateOnView>
                </div>
            </div>
            {section.members && section.members.length > 0 && (
                <div
                    className="mt-blue relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    ref={containerTeam}
                >
                    <AnimateOnView
                        
                        className=" border-t border-off-opaque animate"
                    >
                        {section.members.map((member, index) => {
                            const WrapperTag = member.externalLink
                                ? "a"
                                : "div";

                            return (
                                <WrapperTag
                                    {...(member.externalLink
                                        ? {
                                              href: member.externalLink,
                                              target: "_blank",
                                              rel: "noopener noreferrer",
                                          }
                                        : {})}
                                    className={`container p-lat member border-b border-off-opaque block ${hoveredMember === index ? "active" : ""}`}
                                    style={{
                                        color:
                                            hoveredMember === index
                                                ? newColorString
                                                : undefined,
                                    }}
                                    key={member._key}
                                    onMouseEnter={() =>
                                        setHoveredMember(index)
                                    }

                                    onMouseLeave={() => setHoveredMember(-1)}
                                >
                                    <div className="row py-8">
                                        <div className="hidden md:block w-1/12"></div>
                                        <div className="w-2/12 lg:w-1/12">
                                            <p className="h2-bold">
                                                {abecedary[index]}
                                            </p>
                                        </div>
                                        <div className="hidden md:block w-2/12 md:w-1/12 lg:w-4/12"></div>
                                        <div className="w-10/12 md:w-8/12 lg:w-6/12">
                                            <p className="h2-bold">
                                                {member.name}
                                            </p>
                                        </div>
                                    </div>
                                </WrapperTag>
                            );
                        })}
                    </AnimateOnView>
                    <div className="absolute pointer-events-none left-0 top-0 w-full">
                        <div className="container p-lat">
                            <div className="row">
                                <div className="w-2/12"></div>
                                <div className="w-4/12  hidden lg:block">
                                    <div className="row justify-center">
                                        <div className="w-9/12 ">
                                            <div className=" w-full rounded-[15px] aspect-[1.6] relative opacity-0 overflow-hidden" ref={containerImgs}>
                                                <div className="absolute left-0 top-0">
                                                    <div className="flex flex-col " ref={innerImages}>
                                                        {section.members &&
                                                            section.members
                                                                .length > 0 &&
                                                            section.members.map(
                                                                (member) => {
                                                                    return (
                                                                        member.photo && (
                                                                            <div
                                                                                key={
                                                                                    member._key +
                                                                                    "picture"
                                                                                }
                                                                                className={`rounded-[15px] flex flex-col`}

                                                                            >
                                                                                <ImageComponent
                                                                                    image={
                                                                                        member.photo
                                                                                    }
                                                                                    sizes="(max-width: 768px) 100vw, (max-width: 993px) 75vw, 50vw"
                                                                                    optionalAlt="Img Project"
                                                                                    classContainer="rounded-[15px] overflow-hidden w-full !aspect-[1.6] object-cover object-center "
                                                                                    classImg="w-full h-full object-cover object-center"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AnimateOnView
                className="container p-lat pb-green"
            >
                {section.ctaButton && (
                    <div className="row pt-red">
                        <div className="w-2/12 md:w-4/12 lg:w-6/12 hidden lg:block"></div>
                        <div className="w-full lg:w-6/12 flex justify-center lg:justify-start">
                            <LinkComponent
                                {...section.ctaButton}
                                className="bg-offwhite flex gap-4 uppercase items-center py-[8px] px-6 lg:px-8 lg:py-4 rounded-[5px] lg:rounded-[10px] btn-hover "

                            >
                                <span
                                    className="dot w-[8px] h-[8px]"
                                    style={{ backgroundColor: newColorString }}
                                ></span>
                                <p style={{ color: newColorString }}>
                                    {section.ctaButton.label}
                                </p>
                            </LinkComponent>
                           
                        </div>
                    </div>
                )}
            </AnimateOnView>
        </section>
    );
}