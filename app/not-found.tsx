'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import AnimateOnView from "@/components/AnimateOnView";

const translations = {
    en: {
        title: "THE PAGE YOU ARE LOOKING FOR",
        subtitle: "DOES NOT EXIST",
        backToHome: "Go back to home",
    },
    es: {
        title: "LA PÁGINA que buscas",
        subtitle: "NO EXISTE",
        backToHome: "Regresar al inicio",
    },
};

export default function NotFound() {
    const pathname = usePathname();
    const lang = pathname.startsWith("/en") ? "en" : "es";

    const { title, subtitle, backToHome } = translations[lang];

    return (
        <AnimateOnView  className="containter h-screen">
            <div className="row items-center justify-center h-full ">
                <div className="w-10/12 md:w-8/12 lg:w-5/12 flex flex-col items-center">
                    <div className="detalle circular-tag uppercase animate">404</div>
                    <h2 className="h1 uppercase text-center pt-4 md:pt-6 animate delay-sm">
                        <span>{title} </span>
                        <span className="bold">{subtitle}</span>
                    </h2>
                    <div className="pt-red flex items-center animate delay-sm-2">
                        <Link href={`/${lang}`} className="btn ">
                            {backToHome}
                        </Link>
                    </div>
                </div>
            </div>
        </AnimateOnView>
    );
}