import {fetchSanityProjectsWithFilter, fetchSanityNumberOfProjectsWithFilter}from "@/sanity/services/fetchProjects";
import RenderProjects from "@/components/RenderProjects";
import { fetchSanityLangAndCategories } from "@/sanity/services/fetchProjects";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const langAndCategories = await fetchSanityLangAndCategories();
    return langAndCategories;
}

export default async function ProjectCategory({params} : {params: Promise<{ lang: LocalePage, category: string }>}) {
    const { lang, category } = await params;
    const projects = await fetchSanityProjectsWithFilter(lang, 0, 8, 'asc', category);
    const quantity = await fetchSanityNumberOfProjectsWithFilter(lang, category);
    if( !projects || projects.length === 0) {
        notFound();
    }
    return (
        <>
            <div className="row justify-center">
                <div className="w-full lg:w-9/12 ">
                    <RenderProjects initialProjects={projects} lang={lang} service={category} totalProjects={quantity} principalRoute="projectsfilter"/>
                </div>
            </div>

        </>
    )    
}