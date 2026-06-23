import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_THUMBNAIL_QUERY, SERVICES_LINKED_TO_PROJECTS_QUERY, TAGS_LINKED_TO_PROJECTS_QUERY, NUMBER_OF_PROJECTS_WITH_SERVICE_FILTER_QUERY, NUMBER_OF_PROJECTS_QUERY, TAGS_SLUG_QUERY} from "../queries/projects";
import { locales } from "@/config/i18n/i18nConfig";


export const fetchProjectsThumbnails = async (
    lang: LocalePage,
    start: number,
    end: number,
    order: string,
    service?: string,
    tag?: string
): Promise<ProjectPost[]> => {
    const { data } = await sanityFetch<string>({
        query: PROJECT_THUMBNAIL_QUERY(order),
        params: { lang, start, end, service: service ?? "", tagSlug: tag ?? "" },
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

export const fetchSanityServices = async (lang: LocalePage): Promise<SanityService[]> => {
    const { data } = await sanityFetch({
        query: SERVICES_LINKED_TO_PROJECTS_QUERY, 
        params: { lang },
    });
    return data as SanityService[];
};

export const fetchSanityTags = async (lang: LocalePage, service?: string): Promise<SanityTag[]> => {
    const { data } = await sanityFetch({
        query: TAGS_LINKED_TO_PROJECTS_QUERY,
        params: { lang, service: service ?? "" },
    });
    return data as SanityTag[];
};

export const fetchSanityProjectsWithFilter = async (
    lang: LocalePage,
    start: number,
    end: number,
    order: string,
    service: string,
    tag?: string
): Promise<ProjectPost[]> => {
    return fetchProjectsThumbnails(lang, start, end, order, service, tag);
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
                .map((item: SanityService) => ({
                    lang: locale,
                    category: item.title,
                }));
        })
    );

    return categoriesArrays.flat();
};

export const fetchSanityTagsSlugs = async (service: string): Promise<{ lang: LocalePage; tags: string }[]> => {
    const slugsArrays = await Promise.all(
        locales.map(async (locale) => {
            const { data } = await sanityFetch({
                query: TAGS_SLUG_QUERY,
                params: { lang: locale, service },
                perspective: "published",
                stega: false,
            });

            return ((data as string[]) ?? [])
                .filter(Boolean)
                .map((slug) => ({
                    lang: locale,
                    tags: slug,
                }));
        })
    );

    return slugsArrays.flat();
};