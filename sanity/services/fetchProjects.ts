import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_THUMBNAILS_QUERY, SERVICES_LINKED_TO_PROJECTS_QUERY, ALL_PROJECTS_WITH_SERVICES_QUERY, NUMBER_OF_PROJECTS_WITH_SERVICE_FILTER_QUERY, NUMBER_OF_PROJECTS_QUERY} from "../queries/projects";
import { locales } from "@/config/i18n/i18nConfig";


export const fetchProjectsThumbnails = async (lang: LocalePage, start: number, end: number, order: string): Promise<ProjectPost[]> => {
    const { data } = await sanityFetch<string>({
        query: PROJECTS_THUMBNAILS_QUERY(order),
        params: { lang, start, end},
    });
    return data;
}


export const fetchNumberOfProjects = async (lang: LocalePage): Promise<number> => {
    const { data } = await sanityFetch<string>({
        query: NUMBER_OF_PROJECTS_QUERY,
        params: { lang },
    });
    return data;
}

export const fetchMoreProjects = async (lang: LocalePage, start: number, end: number, order: string): Promise<ProjectPost[]> => {
    const { data } = await sanityFetch<string>({
        query: PROJECTS_THUMBNAILS_QUERY(order),
        params: { lang, start, end},
    });
    return data;
}

export const fetchSanityServicesLinkedToProjects = async (lang: LocalePage): Promise<string[]> => {
    const { data } = await sanityFetch<string>({
        query: SERVICES_LINKED_TO_PROJECTS_QUERY, 
        params: { lang },
    });
    return data;
};

export const fetchSanityProjectsWithFilter = async (lang: LocalePage, start: number, end: number, order: string, service: string): Promise<ProjectPost[]> => {
    const { data } = await sanityFetch<string>({
        query: ALL_PROJECTS_WITH_SERVICES_QUERY(order), 
        params: { lang, service, start, end, order },
    });
    return data;
}

export const fetchSanityNumberOfProjectsWithFilter = async (lang: LocalePage, serviceFilter: string): Promise<number> => {
    const { data } = await sanityFetch<string>({
        query: NUMBER_OF_PROJECTS_WITH_SERVICE_FILTER_QUERY,
        params: { lang, serviceFilter },
    });
    return data;
}

export const fetchSanityLangAndCategories = async (): Promise<{ lang: LocalePage; category: string }[]> => {
    const categoriesArrays = await Promise.all(
        locales.map(async (locale) => {
            const { data } = await sanityFetch({
                query: SERVICES_LINKED_TO_PROJECTS_QUERY,
                params: { lang: locale },
                perspective: "published",
                stega: false,
            });

            return data
                .map((item: { title: string }) => ({
                    lang: locale,
                    category: item,
                }));
        })
    );

    return categoriesArrays.flat();
};