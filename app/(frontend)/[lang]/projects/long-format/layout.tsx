import InnerProjectsPageNew from "@/components/InnerProjectsPageNew";
import { fetchSanityTags } from "@/sanity/services/fetchProjects";
import { generatePageMetadata } from "@/lib/generateMetadata";
import type { Metadata } from "next";
import { PageProjectsLoader } from "@/components/PageProjectsLoader";
export async function generateMetadata({params} : {params: Promise<{ lang: LocalePage }>}): Promise<Metadata> {
    const {lang} = await params;
    return generatePageMetadata({
      metadata: {
        metaTitle: "CL4N Projects - Long Format",
        metaDescription: "Projects from our Long Format service",
        language: lang,
        noIndex: true,
      },
      slug: "projects",
      title: "CL4N Projects - Long Format",
    });
  }

export default async function LongFormatLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const tags = await fetchSanityTags(lang as LocalePage, "long-format");
    return (
        <InnerProjectsPageNew tags={tags} serviceSlug="long-format">
            <PageProjectsLoader/>
            {children}
        </InnerProjectsPageNew>
    )
}