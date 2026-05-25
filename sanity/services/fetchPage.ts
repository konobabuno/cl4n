import { sanityFetch } from "@/sanity/lib/live";
import { HOME, PAGE, PROJECT, PAGE_SLUG, PROJECT_SLUG, PROJECTS_PAGE_METADATA } from "../queries/page";
import { locales } from "@/config/i18n/i18nConfig"; 

export const fetchHome = async (lang: LocalePage ): Promise<Home> => {
  const { data } = await sanityFetch({
    query: HOME,
    params: { lang },
  });
  return data;
}

export const fetchPage = async (slug: string, lang: LocalePage): Promise<Page> => {
  const { data }  = await sanityFetch({
    query: PAGE,
    params: { slug, lang },
  });
  return data;
}

export const fetchProject = async (slug: string,  lang: LocalePage): Promise<Project> => {
  const { data }  = await sanityFetch({
    query: PROJECT,
    params: { slug, lang },
  });
  return data;
}

type ProjectsPageMetadata = {
    metadata: SeoMetadata;
}
export const fetchProjectsPageMetadata = async (lang: LocalePage): Promise<ProjectsPageMetadata> => {
  const { data }  = await sanityFetch({
    query: PROJECTS_PAGE_METADATA,
    params: { lang },
  });
  return data;
}

export const fetchPageSlugs = async (): Promise<{ lang: LocalePage; slug: string }[]> => {
  const slugsArrays = await Promise.all(
    locales.map(async (locale) => {
      const { data } = await sanityFetch({
        query: PAGE_SLUG,
        params: { lang: locale },
        perspective: "published",
        stega: false,
      });

      return data
        .filter((item: { slug: { current: string } }) => item.slug.current !== "carpeta") 
        .map((item: { slug: { current: string } }) => ({
          lang: locale,
          slug: item.slug.current,
        }));
    })
  );
  return slugsArrays.flat();
};

export const fetchProjectSlugs = async (): Promise<{ lang: LocalePage; slug: string }[]> => {
  const slugsArrays = await Promise.all(
    locales.map(async (locale) => {
      const { data } = await sanityFetch({
        query: PROJECT_SLUG,
        params: { lang: locale },
        perspective: "published",
        stega: false,
      });

      return data
        .map((item: { slug: { current: string } }) => ({
          lang: locale,
          slug: item.slug.current,
        }));
    })
  );
  return slugsArrays.flat();
}


