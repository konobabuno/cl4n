import {fetchPage, fetchPageSlugs} from "@/sanity/services/fetchPage";
import { generatePageMetadata } from "@/lib/generateMetadata";
import type { Metadata } from "next";
import Sections from "@/components/Sections";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const slugs = await fetchPageSlugs();
    return slugs;
}

export async function generateMetadata({params} : {params: Promise<{ lang: LocalePage, slug: string }> }): Promise<Metadata> {
    const {lang, slug} = await params;
    const pageData = await fetchPage(slug, lang);
    if (pageData.metadata){
        return generatePageMetadata({
            metadata: pageData.metadata,
            slug: slug,
            title: pageData.title
        });
    }
    return {
        title: pageData.title || 'Title Undefined',
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string, lang: LocalePage }>;
}) {
    const { slug, lang } = await params;
    const pageData = await fetchPage(slug, lang);
    if (!pageData) {
        notFound();
    }
    return(
        <main>
            <PageTransitionLoader />
            { pageData.sections &&
                <Sections sections={pageData.sections} />
            }

        </main>
    );
}
