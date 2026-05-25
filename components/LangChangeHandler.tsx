"use client";
import { useEffect, useMemo } from "react";
import { locales } from "@/config/i18n/i18nConfig";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LangChangeHandler({
    lang,
    translations,
}: {
    lang: LocalePage;
    translations: Translation[];
}): React.ReactNode {
    const pathname = usePathname();
    const currentPath = pathname.split("/").slice(2).join("/");
    const otherLang: LocalePage = lang === "en" ? "es" : "en";

    const matchedTranslation = useMemo(() => {
        if (!currentPath) return undefined;
        return translations?.find((t) => {
            const enSlug = (t)?.en?.slug;
            const esSlug = (t)?.es?.slug;
            return enSlug === currentPath || esSlug === currentPath;
        });
    }, [currentPath, translations]);

    const newRoute = useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length <= 1) return `/${otherLang}`;
        if (matchedTranslation) {
            const type = (matchedTranslation)?.type;
            const targetSlug = (matchedTranslation)?.[otherLang]?.slug;
            if (type === "page") {
                if (!targetSlug) return `/${otherLang}`;
                return `/${otherLang}/${targetSlug}`;
            } else if (type === "project"){
                if (!targetSlug) return `/${otherLang}`;
                return `/${otherLang}/${type}/${targetSlug}`;
            }
        } else {
            const type = segments[1];
            if (type === "home"){
                return `/${otherLang}`;
            }
            else if (type === "projects"){
                return `/${otherLang}/${type}`;
            } else {
                return `/${otherLang}`;
            }
        }
    }, [matchedTranslation, otherLang, pathname]);

    useEffect(() => {
        document.documentElement.setAttribute("lang", lang);
    }, [lang]);

    const otherLocale = locales.filter((locale) => locale !== lang)[0];
    return (
        <>
            <div className="flex items-center gap-1">
                {
                    <>
                        <Link
                            className="w-full py-6 px-8 hidden lg:block link-hover"
                            href={`${newRoute}`}
                        >
                            {otherLocale === "es" ? "es" : "en"}
                        </Link>
                        <div className="flex items-center gap-4 lg:hidden">
                            <p className="under-deco">
                                {otherLocale === "es" ? "en" : "es"}
                            </p>
                            <p>/</p>
                            <Link href={`${newRoute}`}>
                                {otherLocale === "es" ? "es" : "en"}
                            </Link>
                        </div>
                    </>
                }
            </div>
        </>
    );
}
