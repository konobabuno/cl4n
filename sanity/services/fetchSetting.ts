import { sanityFetch } from "@/sanity/lib/live";
import { SETTINGS, TRANSLATION_QUERY } from "../queries/settings";

type Settings = {
  mail?: string;
  headerNavigation?: Link[]; 
  footerSitemap?: Link[];
  footerLogos?: Image[];
  footerSocial?: Link[];
  footerTerms?: Link[];
}



export const fetchSettings = async (lang: LocalePage ): Promise<Settings> => {
  const { data } = await sanityFetch({
    query: SETTINGS,
    params: { lang },
  });
  return data;
}

export const fetchTranslations = async (): Promise<Translation[]> => {
  const { data } = await sanityFetch({
    query: TRANSLATION_QUERY,
  });
  return data;
};
