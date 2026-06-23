import { fetchProjectsThumbnails, fetchSanityTagsSlugs } from '@/sanity/services/fetchProjects';
import RenderNew from '@/components/RenderNew';
import { generatePageMetadata } from '@/lib/generateMetadata';
import type { Metadata } from "next";

export async function generateStaticParams() {
  return fetchSanityTagsSlugs('long-format');
}




export default async function LongFormatTagsPage({params}: {params: Promise<{ lang: string; tags: string }>}) {
    const { lang, tags } = await params;
    const projects = await fetchProjectsThumbnails(lang as LocalePage, 0, 14, 'asc', 'long-format', tags);

  return (
    <>
      <RenderNew lang={lang as LocalePage} projectThumbnails={projects} tag={tags} service="long-format" />
    </>
    
  );
}