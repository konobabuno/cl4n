import { groq } from "next-sanity";
import { METADATA, IMG } from "./lib";
import { TEXT_AND_IMAGE, OUR_CLIENTS, SERVICES_CTA, CONTACT_CTA, GENERAL_HERO, ABOUT_US, OUR_TEAM, CONTACT_US, TERMS_AND_CONDITIONS, FEATURED_PROJECTS_QUERY, SERVICES_DESCRIPTION_QUERY, GENERAL_HERO_QUERY, HOME_HERO_QUERY} from "./section";

export const HOME = groq`
*[_type == "home" && language == $lang][0] {
    ${METADATA},
    sections[] {
      ${HOME_HERO_QUERY},
      ${GENERAL_HERO_QUERY},
      ${TEXT_AND_IMAGE},
      ${OUR_CLIENTS},
      ${SERVICES_CTA},
      ${CONTACT_CTA},
      ${GENERAL_HERO},
      ${ABOUT_US},
      ${OUR_TEAM},
      ${CONTACT_US},
      ${TERMS_AND_CONDITIONS},
      ${FEATURED_PROJECTS_QUERY},
      ${SERVICES_DESCRIPTION_QUERY}
    }
}`;

export const PAGE = groq`
*[_type == "page" && slug.current == $slug && language == $lang][0] {
    title,
    ${METADATA},
    sections[] {
      ${TEXT_AND_IMAGE},
      ${OUR_CLIENTS},
      ${SERVICES_CTA},
      ${CONTACT_CTA},
      ${GENERAL_HERO},  
      ${ABOUT_US},
      ${OUR_TEAM},
      ${CONTACT_US},
      ${TERMS_AND_CONDITIONS},
      ${FEATURED_PROJECTS_QUERY},
      ${SERVICES_DESCRIPTION_QUERY}
    }
}`;

export const PROJECTS_PAGE_METADATA = groq`
*[_type == "projects" && language == $lang][0] {
    ${METADATA}
}`;

export const PROJECT = groq`
*[_type == "project" && slug.current == $slug && language == $lang][0] {
    ${METADATA},
    title,
    team, 
    videoUrl,
    timeOfProject,
    services[]->{
      _id,
      "title": coalesce(
        title[language == $lang][0].value,
        title[language == "es"][0].value
      )
    },
    gallery[]{
      _key,
      image{
        ${IMG}
      },
      videoUrl,
      verticalOrHorizontal,
    }
}`;

export const PAGE_SLUG = groq`
*[_type == "page" && defined(slug) && language==$lang ] {
    slug
  }
`;

export const PROJECT_SLUG = groq`
*[_type == "project" && defined(slug) && language==$lang ] {
    slug
  }
`;

