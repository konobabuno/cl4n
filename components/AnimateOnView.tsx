"use client"
import { useEffect, useRef, ReactNode, useState } from "react";
import { Fragment } from "react";

type AnimatedOnViewProps = {
  children: ReactNode;
  className?: string;
  
};

function isAboveViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom < 0;
}

export default function AnimateOnView({ children, className }: AnimatedOnViewProps) {
    const animateRef = useRef<HTMLDivElement>(null);
    const timeOut = 80;

     const handleAnimationEnd = (event: Event) => {
        const target = event.target as HTMLElement;
        target.classList.remove('in-view', 'animate', 'animate-container');
        return;
    }

    useEffect(() => {
        const element = animateRef.current;
        if (!element) return;
        const numberOfElements = element.querySelectorAll('.animate').length;

        if (numberOfElements > 0) {
            element.classList.remove('animate-container');
        }
       
         
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const animatedElements = (entry.target as HTMLElement).querySelectorAll('.animate');
                        if (animatedElements.length == 0) {
                            animateRef.current?.classList.add('in-view');
                            animateRef.current?.addEventListener('animationend', handleAnimationEnd);
                        } else if (animatedElements.length == 1) {
                            animatedElements[0].classList.add('in-view');
                            animatedElements[0].addEventListener('animationend', handleAnimationEnd);
                        } else {
                            animatedElements.forEach(
                                (el, index) => {
                                    setTimeout(() => {
                                        el.classList.add('in-view');
                                        el.addEventListener('animationend', handleAnimationEnd);
                                    }, timeOut * index);
                                }
                            );
                        }
                        observer.unobserve(entry.target);
                    } else {
                        if (isAboveViewport(entry.target as HTMLElement)) {
                            const animatedElements = (entry.target as HTMLElement).querySelectorAll('.animate');
                            animateRef.current?.classList.remove('in-view', 'animate', 'animate-container');
                            animatedElements.forEach((el) => {
                                el.classList.remove('in-view', 'animate');
                            });
                        }
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        setTimeout(() => {
            observer.observe(element);
        }, 150);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);



    return (
        <div ref={animateRef} className={`${className} animate-container`}>
            {children}
        </div>
    );
}