import { fetchProject } from "@/sanity/services/fetchPage";
import { fetchProjectSlugs } from "@/sanity/services/fetchPage";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { getDictionary } from "@/config/i18n/dictionaries";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import VideoHLS from "@/components/VideoHLS";
import ImageComponent from "@/components/ImageComponent";
import Image from "next/image";
import AnimateOnView from "@/components/AnimateOnView";

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

    return (
        <main>
            <PageTransitionLoader />
            {projectData?.videoUrl && (
                <section className={`pb-pink min-h-screen relative flex flex-col`}>
                    <AnimateOnView className={`container p-lat delay-anim ${(projectData?.gallery?.length ?? 0) > 0 ? 'order-0 ' : 'order-1 pt-green'}`}>
                        <VideoHLS videoUrl={projectData.videoUrl} />
                    </AnimateOnView>
                    <div className={`container p-lat  ${(projectData?.gallery?.length ?? 0) > 0 ? 'order-1 pt-green' : 'order-0 pt-red'}`}>
                        <div className="row justify-center lg:justify-start">
                            {projectData?.title && (
                                <AnimateOnView className="w-full md:w-10/12 lg:w-6/12 flex flex-col gap-4">
                                    <p className="detalle uppercase text-center lg:text-start">
                                        {dict.general.project.project}
                                    </p>
                                    <h1 className="h1 text-center lg:text-start">
                                        {projectData.title}
                                    </h1>
                                </AnimateOnView>
                            )}

                            {(!!projectData?.team ||
                                (projectData?.services?.length ?? 0) > 0) && (
                                <>
                                    <div className="w-1/12 hidden lg:block"></div>
                                    <AnimateOnView className="w-full md:w-10/12 lg:w-4/12 md:grid grid-cols-2 lg:flex flex-col gap-4 items-start delay-anim-md">
                                        {!!projectData?.team && (
                                            <div className="flex flex-col gap-4 pt-blue lg:pt-0!">
                                                <h3 className="h3 uppercase text-start">
                                                    {dict.general.project.team}
                                                </h3>
                                                <p className="text-start uppercase whitespace-pre-wrap">
                                                    {projectData.team}
                                                </p>
                                            </div>
                                        )}

                                        {(projectData?.services?.length ?? 0) >
                                            0 && (
                                            <div className="pt-blue flex flex-wrap gap-4">
                                                {(
                                                    projectData.services ?? []
                                                ).map((service) => (
                                                    <div
                                                        key={service._id}
                                                        className="uppercase bg-gray backdrop-blur-[20px] py-2 px-4 md:px-6 rounded-[5px]"
                                                    >
                                                        {service.title}
                                                    </div>
                                                ))}
                                                {projectData.timeOfProject && (
                                                    <div className="uppercase bg-gray backdrop-blur-[20px] py-2 px-4 md:px-6 rounded-[5px] whitespace-nowrap flex gap-4">
                                                        <Image
                                                            src="/assets/clock.svg"
                                                            alt="Clock Icon"
                                                            width={16}
                                                            height={16}
                                                            className="inline-block  w-[18px]"
                                                        />
                                                        {
                                                            projectData.timeOfProject
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </AnimateOnView>
                                </>
                            )}
                        </div>
                    </div>
                    {(projectData?.gallery?.length ?? 0) > 0 && (
                        <div className="container pt-green p-lat order-2">
                            <div className="row gap-y-4">
                                {projectData?.gallery?.map((item, index) => {
                                    if (item.videoUrl) {
                                             if (
                                            item.verticalOrHorizontal ===
                                            "vertical"
                                        ) {
                                            return (
                                                <AnimateOnView
                                                    key={item._key}
                                                    className="md:w-6/12 lg:w-4/12"
                                                >
                                                    <VideoHLS
                                                        videoUrl={item.videoUrl}
                                                    />
                                                </AnimateOnView>
                                            );
                                        } else {
                                            if (
                                                projectData?.gallery?.[
                                                    index - 1
                                                ]?.verticalOrHorizontal ===
                                                "vertical"
                                            ) {
                                                return (
                                                    <AnimateOnView
                                                        key={item._key}
                                                        className="md:w-6/12 lg:w-8/12 delay-anim-md" 
                                                    >
                                                        <VideoHLS
                                                            videoUrl={item.videoUrl}
                                                        />
                                                    </AnimateOnView>
                                                );
                                            } else {
                                                return (
                                                    <AnimateOnView
                                                        key={item._key}
                                                        className="w-full"
                                                    >
                                                        <VideoHLS
                                                            videoUrl={item.videoUrl}
                                                        />
                                                    </AnimateOnView>
                                                );
                                            }
                                        }
                                    } else if (item.image) {
                                        if (
                                            item.verticalOrHorizontal ===
                                            "vertical"
                                        ) {
                                            return (
                                                <AnimateOnView
                                                    key={item._key}
                                                    className="md:w-6/12 lg:w-4/12 h-full"
                                                >
                                                    <ImageComponent
                                                        image={item.image}
                                                        sizes="100vw, (min-width: 768px) 50vw, (min-width: 993px) 33vw"
                                                        optionalAlt="Img Project"
                                                        classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden h-full block`}
                                                    />
                                                </AnimateOnView>
                                            );
                                        } else {
                                            if (
                                                projectData?.gallery?.[
                                                    index - 1
                                                ]?.verticalOrHorizontal ===
                                                "vertical"
                                            ) {
                                                return (
                                                    <AnimateOnView
                                                        key={item._key}
                                                        className="md:w-6/12 lg:w-8/12 h-full delay-anim-md"
                                                    >
                                                        <ImageComponent
                                                            image={item.image}
                                                            sizes="100vw, (min-width: 768px) 50vw (min-width: 993px) 66vw"
                                                            optionalAlt="Img Project"
                                                            classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden h-full block`}
                                                        />
                                                    </AnimateOnView>
                                                );
                                            } else {
                                                return (
                                                    <AnimateOnView
                                                        key={item._key}
                                                        className="w-full "
                                                    >
                                                        <ImageComponent
                                                            image={item.image}
                                                            sizes="100vw"
                                                            optionalAlt="Img Project"
                                                            classContainer={`rounded-[10px] lg:rounded-[15px] overflow-hidden h-full block`}
                                                            classImg={` object-cover object-center`}
                                                        />
                                                    </AnimateOnView>
                                                );
                                            }
                                        }
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
