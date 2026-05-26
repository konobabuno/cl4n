"use client"
import { useEffect, useRef, ReactNode, useState } from "react";

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
    const [hasAnimated, setHasAnimated] = useState(false);
    const hasAnimatedRef = useRef(false);
    const timeOut = 80;

    const markAnimated = () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        setHasAnimated(true);
    };

    const handleAnimationEnd = (event: Event) => {
        const target = event.target as HTMLElement;
        target.classList.remove('in-view', 'animate', 'animate-container');
        markAnimated();
    };

    useEffect(() => {
        if (hasAnimatedRef.current) return;

        const element = animateRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const target = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        const animatedElements = target.querySelectorAll<HTMLElement>('.animate');
                        if (animatedElements.length === 0) {
                            // Sin hijos animables → el propio contenedor hace fadeIn.
                            target.classList.add('in-view');
                            target.addEventListener('animationend', handleAnimationEnd);
                        } else {
                            // Hay hijos con .animate: revelamos el contenedor
                            // (quitando animate-container que lo oculta) y
                            // disparamos in-view en cada hijo con stagger.
                            target.classList.remove('animate-container');
                            animatedElements.forEach((el, index) => {
                                setTimeout(() => {
                                    el.classList.add('in-view');
                                    el.addEventListener('animationend', handleAnimationEnd);
                                }, timeOut * index);
                            });
                        }
                        observer.unobserve(target);
                    } else if (isAboveViewport(target)) {
                        // Ya está arriba del viewport (carga tardía, scroll
                        // restaurado, etc.): limpiamos para que no se vea raro.
                        const animatedElements = target.querySelectorAll<HTMLElement>('.animate');
                        target.classList.remove('in-view', 'animate', 'animate-container');
                        animatedElements.forEach((el) => {
                            el.classList.remove('in-view', 'animate');
                        });
                        markAnimated();
                        observer.unobserve(target);
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        const observeTimer = setTimeout(() => {
            observer.observe(element);
        }, 150);

        return () => {
            clearTimeout(observeTimer);
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={animateRef}
            className={`${className ?? ''} ${hasAnimated ? '' : 'animate-container'}`}
        >
            {children}
        </div>
    );
}
