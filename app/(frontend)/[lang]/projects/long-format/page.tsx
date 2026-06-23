import { fetchProjectsThumbnails } from '@/sanity/services/fetchProjects';
import RenderNew from '@/components/RenderNew';



export default async function LongFormatPage({params}: {params: Promise<{ lang: string }>}) {
    const { lang } = await params;
    const projects = await fetchProjectsThumbnails(lang as LocalePage, 0, 12, 'asc', 'long-format');
    return (
        <RenderNew lang={lang as LocalePage} projectThumbnails={projects} service="long-format" />
    );
}
