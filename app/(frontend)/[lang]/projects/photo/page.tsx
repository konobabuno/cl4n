import { fetchPhotoPage } from "@/sanity/services/fetchPage";
import RenderPhotos from "@/components/RenderPhotos";
import { generatePageMetadata } from "@/lib/generateMetadata";
import { Metadata } from "next";


export async function generateMetadata({params}: {params: Promise<{ lang: LocalePage }>}): Promise<Metadata> {
    const { lang } = await params;
    const metadata = generatePageMetadata({
        metadata: {
            metaTitle: `${lang === "es" ? "Proyectos" : "Projects"} / ${lang === "es" ? "Fotografía" : "Photography"} | CL4N`,
            language: lang,
            noIndex: true,
        },
        slug: "projects",
        title: `${lang === "es" ? "Proyectos" : "Projects"} / ${lang === "es" ? "Fotografía" : "Photography"}`,
    });
    return metadata;
}

export default async function PhotoPage({params}: {params: Promise<{ lang: LocalePage }>}) {
    const { lang } = await params;
    const { photos } = await fetchPhotoPage(0, 9);

    
    return (
        <>
            <RenderPhotos photos={photos} />
        </>
    );
}