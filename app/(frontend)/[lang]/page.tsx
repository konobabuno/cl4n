import {fetchHome} from "@/sanity/services/fetchPage";
import { locales } from "@/config/i18n/i18nConfig";
import { generatePageMetadata } from "@/lib/generateMetadata";
import type { Metadata } from "next";
import Sections from "@/components/Sections";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";

export async function generateStaticParams() {
    return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({params} : {params: Promise<{ lang: LocalePage }>}): Promise<Metadata> {
    const {lang} = await params;
    const homeData = await fetchHome(lang);
    if (homeData?.metadata){
        return generatePageMetadata({
            metadata: homeData.metadata,
            slug: "home",
            title: "Home",
        });
    }
    return {
        title: 'Title Undefined',
    };
}

export default async function Home({
    params,
}: {
    params: Promise<{ lang: LocalePage }>;
}) {
    const { lang } = await params;
    const homeData = await fetchHome(lang);
    return(
        <main>
            <PageTransitionLoader />
            { homeData?.sections &&
                <Sections sections={homeData.sections} />
            }
        </main>
    );
}
