"use client";
import { useEffect, useMemo } from "react";
import { locales } from "@/config/i18n/i18nConfig";
import { usePathname } from "next/navigation";
import Link from "next/link";

function getPathSegments(pathname: string) {
    return pathname.split("/").filter(Boolean);
}

function findTranslation(
    translations: Translation[] | undefined,
    slug: string,
    type?: string,
) {
    if (!slug || !translations?.length) return undefined;

    return translations.find((translation) => {
        if (type && translation.type !== type) return false;
        return translation.en?.slug === slug || translation.es?.slug === slug;
    });
}

function getTranslatedSlug(
    translations: Translation[] | undefined,
    slug: string,
    otherLang: LocalePage,
    type?: string,
) {
    return findTranslation(translations, slug, type)?.[otherLang]?.slug;
}

function getLocalizedHref(
    pathname: string,
    otherLang: LocalePage,
    translations: Translation[],
) {
    const segments = getPathSegments(pathname);
    if (segments.length <= 1) return `/${otherLang}`;

    const routeType = segments[1];

    if (routeType === "project") {
        const projectSlug = segments[2];
        const targetSlug = getTranslatedSlug(
            translations,
            projectSlug,
            otherLang,
            "project",
        );
        if (!targetSlug) return `/${otherLang}`;
        return `/${otherLang}/project/${targetSlug}`;
    }

    if (routeType === "projects") {
        return `/${otherLang}/${segments.slice(1).join("/")}`;
    }

    if (routeType === "home") {
        return `/${otherLang}`;
    }

    const pageSlug = segments.slice(1).join("/");
    const targetSlug = getTranslatedSlug(
        translations,
        pageSlug,
        otherLang,
        "page",
    );
    if (!targetSlug) return `/${otherLang}`;
    return `/${otherLang}/${targetSlug}`;
}

export default function LangChangeHandler({
    lang,
    translations,
}: {
    lang: LocalePage;
    translations: Translation[];
}): React.ReactNode {
    const pathname = usePathname();
    const otherLang: LocalePage = lang === "en" ? "es" : "en";
    const newRoute = useMemo(
        () => getLocalizedHref(pathname, otherLang, translations),
        [pathname, otherLang, translations],
    );

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
