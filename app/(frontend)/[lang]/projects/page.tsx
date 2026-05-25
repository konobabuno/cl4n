import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { locales } from "@/config/i18n/i18nConfig";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { fetchProjectsPageMetadata } from "@/sanity/services/fetchPage";
import {fetchNumberOfProjects, fetchProjectsThumbnails} from "@/sanity/services/fetchProjects";
import RenderProjects from "@/components/RenderProjects";

export async function generateStaticParams() {
    return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({params} : {params: Promise<{ lang: LocalePage, slug: string }> }): Promise<Metadata> {
   const { lang } = await params;
       const projectsMetadata = await fetchProjectsPageMetadata(lang);
       if (projectsMetadata?.metadata){
           return generatePageMetadata({
               metadata: projectsMetadata.metadata,
               slug: 'projects',
               title: projectsMetadata.metadata.metaTitle || 'Projects',
           });
       }
       return {
           title: 'Title Undefined',
       };
}

export default async function ProjectsPage({params} : {params: Promise<{ lang: LocalePage, slug: string }>}) {
    const { lang } = await params;
    const initialProjects = await fetchProjectsThumbnails(lang, 0, 14, 'asc');
    const quantity = await fetchNumberOfProjects(lang);
    return (
         <div className='relative'>
            <div className="row justify-center">
                <div className="w-full lg:w-9/12 ">
                    <RenderProjects initialProjects={initialProjects} lang={lang} principalRoute="projects" totalProjects={quantity} />
                </div>
            </div>
        </div>
    );
}