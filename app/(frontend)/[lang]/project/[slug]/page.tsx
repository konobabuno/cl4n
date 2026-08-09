import { fetchProject } from "@/sanity/services/fetchPage";
import { fetchProjectSlugs } from "@/sanity/services/fetchPage";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { getDictionary } from "@/config/i18n/dictionaries";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import VideoHLS from "@/components/VideoHLS";
import ImageComponent from "@/components/ImageComponent";
import AnimateOnView from "@/components/AnimateOnView";
import Sections from "@/components/Sections";
import GalleryItem from "@/components/GalleryItem";


export async function generateStaticParams() {
    const slugs = await fetchProjectSlugs();
    return slugs;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: LocalePage; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const projectData = await fetchProject(slug, lang);
    if (projectData.metadata) {
        return generatePageMetadata({
            metadata: projectData.metadata,
            slug: slug,
            title: projectData.title,
        });
    }
    return {
        title: "Title Undefined",
    };
}

export default async function Project({
    params,
}: {
    params: Promise<{ lang: LocalePage; slug: string }>;
}) {
    const { lang, slug } = await params;
    const projectData = await fetchProject(slug, lang);
    if (!projectData) {
        notFound();
    }
    const dict = await getDictionary(lang);
    console.log(projectData);
    return (
        <main>
            <PageTransitionLoader />
            {projectData?.videoUrl && (
                <>
                    <section className={`pb-pink min-h-[50vh] relative flex flex-col pb-0!`}>
                        <AnimateOnView className={`container p-lat delay-anim ${(projectData?.gallery?.length ?? 0) > 0 ? 'order-0 ' : 'order-1 pt-green'}`}>
                            <VideoHLS videoUrl={projectData.videoUrl} />
                        </AnimateOnView>
                        <div className={`container p-lat  ${(projectData?.gallery?.length ?? 0) > 0 ? 'order-1 pt-green' : 'order-0 pt-red'}`}>
                            <div className="row justify-center lg:justify-start gap-y-16 md:gap-y-20 lg:gap-y-24">
                                {projectData?.title && (
                                    <AnimateOnView className="w-full md:w-10/12 lg:w-6/12 flex flex-col gap-4">
                                        <p className="detalle uppercase text-center lg:text-start">
                                            {dict.general.project.project}
                                        </p>
                                        <h1 className="h1 text-center lg:text-start">
                                            {projectData.title}
                                        </h1>
                                        {
                                            (projectData?.timeOfProject || (projectData?.tags?.length ?? 0)) && (
                                                <div className="flex justify-center lg:justify-start gap-4  flex-wrap pt-16 md:pt-20 lg:pt-24">
                                                    {(projectData?.tags?.length ?? 0 ) > 0 && (
                                                        projectData?.tags?.map((tag) => (
                                                            <div key={tag._id} className="backdrop-blur-[20px] bg-gray py-2 px-6 uppercase rounded-[5px] flex gap-4 items-center">
                                                                <p className="uppercase lg:text-start">{tag.title}</p>
                                                            </div>
                                                        ))
                                                    
                                                    )}
                                                    {projectData?.timeOfProject && (
                                                        <div className="backdrop-blur-[20px] bg-gray py-2 px-6 uppercase rounded-[5px] flex gap-4 items-center">
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0 3.5625H1.8V5.3625H0V3.5625Z" fill="#FDF9F3"/>
                                                                <path d="M10.7999 1.78125H12.5999V3.58125H10.7999V1.78125Z" fill="#FDF9F3"/>
                                                                <path d="M12.6002 3.5625H14.4002V5.3625H12.6002V3.5625Z" fill="#FDF9F3"/>
                                                                <path d="M9 0H10.8V1.8H9V0Z" fill="#FDF9F3"/>
                                                                <path d="M7.20007 0H9V1.8H7.20007V0Z" fill="#FDF9F3"/>
                                                                <path d="M3.60022 0H5.40022V1.8H3.60022V0Z" fill="#FDF9F3"/>
                                                                <path d="M5.40022 0H7.20007V1.8H5.40022V0Z" fill="#FDF9F3"/>
                                                                <path d="M1.79993 1.78125H3.59993V3.58125H1.79993V1.78125Z" fill="#FDF9F3"/>
                                                                <path d="M12.6002 5.34375H14.4002V7.14375H12.6002V5.34375Z" fill="#FDF9F3"/>
                                                                <path d="M12.6002 7.125H14.4002V8.925H12.6002V7.125Z" fill="#FDF9F3"/>
                                                                <path d="M12.6002 8.90625H14.4002V10.7063H12.6002V8.90625Z" fill="#FDF9F3"/>
                                                                <path d="M0 5.34375H1.8V7.14375H0V5.34375Z" fill="#FDF9F3"/>
                                                                <path d="M0 7.125H1.8V8.925H0V7.125Z" fill="#FDF9F3"/>
                                                                <path d="M0 8.90625H1.8V10.7063H0V8.90625Z" fill="#FDF9F3"/>
                                                                <path d="M1.79993 10.6875H3.59993V12.4875H1.79993V10.6875Z" fill="#FDF9F3"/>
                                                                <path d="M3.60022 12.4688H5.40022V14.25H3.60022V12.4688Z" fill="#FDF9F3"/>
                                                                <path d="M5.40022 12.4688H7.20015V14.25H5.40022V12.4688Z" fill="#FDF9F3"/>
                                                                <path d="M7.20015 12.4688H9.00007V14.25H7.20015V12.4688Z" fill="#FDF9F3"/>
                                                                <path d="M9.00007 12.4688H10.8V14.25H9.00007V12.4688Z" fill="#FDF9F3"/>
                                                                <path d="M10.7999 10.6875H12.5999V12.4875H10.7999V10.6875Z" fill="#FDF9F3"/>
                                                                <path d="M7.20007 5.34375H9.00007V7.14375H7.20007V5.34375Z" fill="#FDF9F3"/>
                                                                <path d="M3.60022 7.125H5.40022V8.925H3.60022V7.125Z" fill="#FDF9F3"/>
                                                                <path d="M5.40022 7.125H7.20015V8.925H5.40022V7.125Z" fill="#FDF9F3"/>
                                                                <path d="M7.20007 3.5625H9.00007V5.3625H7.20007V3.5625Z" fill="#FDF9F3"/>
                                                            </svg>
                                                            <p className="uppercase lg:text-start">{projectData.timeOfProject}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </AnimateOnView>
                                )}
                                {(projectData?.info || projectData?.timeOfProject || (projectData?.tags?.length ?? 0) > 0) && (
                                    <>
                                        <div className="w-1/12 hidden lg:block"></div>
                                        <AnimateOnView className="w-full md:w-10/12 lg:w-4/12 flex flex-col gap-y-16 md:gap-y-20 lg:gap-y-24">
                                            {projectData?.info && (
                                                <>
                                                    <h3 className="uppercase h3 lg:text-start">{dict.general.project.info}</h3>
                                                    <p className="uppercase lg:text-start pt-4 ">{projectData.info}</p>
                                                </>
                                            )}
                                           
                                        </AnimateOnView>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                    {
                        projectData?.gallery?.length && projectData.gallery.length > 0 && (
                            <section className="pt-green mt-0! ">
                                <div className="container p-lat">
                                    {
                                        projectData?.gallery?.length && projectData.gallery.length > 0 && (
                                            <GalleryItem images={projectData.gallery} />
                                        )
                                    }
                                </div>
                            
                            </section>
                        )
                    }
                  
                    { projectData?.sections &&
                        <Sections sections={projectData.sections} />
                    }

                    <div className="pb-pink"></div>
                </>
            )}
        </main>
    );
}
