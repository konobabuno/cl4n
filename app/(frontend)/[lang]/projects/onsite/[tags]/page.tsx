import { fetchProjectsThumbnails, fetchSanityTagsSlugs } from '@/sanity/services/fetchProjects';
import RenderNew from '@/components/RenderNew';



export async function generateStaticParams() {
    return fetchSanityTagsSlugs('onsite');
}

export default async function OnSiteTagsPage({params}: {params: Promise<{ lang: string; tags: string }>}) {
    const { lang, tags } = await params;
    const projects = await fetchProjectsThumbnails(lang as LocalePage, 0, 14, 'asc', 'onsite', tags);

  return (
    <RenderNew lang={lang as LocalePage} projectThumbnails={projects} tag={tags} service="onsite" />
  );
}