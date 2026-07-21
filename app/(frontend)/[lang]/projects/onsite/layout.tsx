import InnerProjectsPageNew from "@/components/InnerProjectsPageNew";
import { fetchSanityTags } from "@/sanity/services/fetchProjects";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { PageProjectsLoader } from "@/components/PageProjectsLoader";

export async function generateMetadata({params} : {params: Promise<{ lang: LocalePage }>}): Promise<Metadata> {
    const {lang} = await params;
    return generatePageMetadata({
      metadata: {
        metaTitle: "CL4N Projects - Onsite",
        metaDescription: "Projects from our Onsite service",
        language: lang,
        noIndex: true,
      },
      slug: "projects",
      title: "CL4N Projects - Onsite",
    });
  }

export default async function OnSiteLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const tags = await fetchSanityTags(lang as LocalePage, "onsite");
    return (
        <InnerProjectsPageNew tags={tags} serviceSlug="onsite" >
            <PageProjectsLoader/>

            {children}
        </InnerProjectsPageNew>
    )
}