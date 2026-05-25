import { groq } from "next-sanity";
import { IMG, LINK } from "../queries/lib";

export const HOME_HERO_QUERY = groq`
    _type == "homeHero" => {
        _type,
        _key,
        headline,
        heroTitle,
        heroDescription,
        projects[]->{
          _type,
          title,
          slug,
          language,
          videoPreview,
          thumbnail {
            _id,
            asset->{
              _id,
              metadata {
                dimensions {
                  width,
                  height,
                },
                dominantColor,
                lqip,
                blurHash
              }
            }
          }
        },
        cta_link {
          ...,
          linkType == 'page' => {
            "page": page->{
                _type,
                "slug": slug.current,
                language
            }
          }
        }
    }
`

export const GENERAL_HERO_QUERY = groq`
    _type == "generalHero" => {
        _key,
        _type,
        hero_title,
        image_desktop{
          ...,
          asset->{
            _id,
            metadata {
                dimensions,
                dominantColor,
                lqip,
                blurHash
            }
          }
        },
        image_mobile{
          ...,
          asset->{
            _id,
            metadata {
                dimensions,
                dominantColor,
                lqip,
                blurHash
            }
          }
        }
    }
` 

export const TEXT_AND_IMAGE = groq`
  _type == "textAndImage" => {
    _key,
    _type,
    imagePosition,
    headline,
    title,
    description,
    image {
      ${IMG}
    },
    ctaButton {
      ${LINK}
    }
  }
`;

export const OUR_CLIENTS = groq`
  _type == "ourClients" => {
    _key,
    _type,
    backgroundColor,
    headline,
    bigText,
    clients[] {
      title,
      clientLogo {
        ${IMG}
      }
    }
  }
`;

export const SERVICES_CTA = groq`
  _type == "servicesCTA" => {
    _key,
    _type,
    services[] {
      _key,
      headline,
      title,
      description,
      image {
        ${IMG}
      },
      links[] {
        ...,
        _type == "link" => {
          ${LINK}
        },
        defined(service) => {
          _type,
          label,
          service -> {
            "language": $lang,
            "title": coalesce(
              title[language==$lang][0].value,
              title[language=="es"][0].value,
            )
          }
        }
      }
    }
  }
`;

export const CONTACT_CTA = groq`
  _type == "contactCTA" => {
    _key,
    _type,
    backgroundColor,
    headline,
    bigText,
    ctaButton {
      ${LINK}
    }
  }
`;

export const GENERAL_HERO = groq`
  _type == "generalHero" => {
    _key,
    _type,
    imageDesktop {
      ${IMG}
    },
    imageMobile {
      ${IMG}
    },
    heroTitle,
    heroDescription
  }
`;

export const ABOUT_US = groq`
  _type == "aboutUs" => {
    _key,
    _type,
    headline,
    title,
    values[] {
      _key,
      icon {
        ${IMG}
      },
      title,
      description
    }
  }
`;

export const OUR_TEAM = groq`
  _type == "ourTeam" => {
    _key,
    _type,
    backgroundColor,
    headline,
    bigText,
    members[] {
      _key,
      name,
      externalLink,
      photo {
        ${IMG}
      }
    },
    ctaButton {
      ${LINK}
    } 
  }
`;

export const CONTACT_US = groq`
  _type == "contactUs" => {
    _key,
    _type,
    backgroundColor,
    title,
    description
  }
`;

export const TERMS_AND_CONDITIONS = groq`
  _type == "termsAndConditions" => {
    _key,
    _type,
    backgroundColor,
    headline,
    title,
    content
  }
`;

export const FEATURED_PROJECTS_QUERY = groq`
    _type == "featuredProjects" => {
        _key,
        _type,
        backgroundColor,
        headline,
        title,
        projects[]->{
          _type,
          title,
          slug,
          language,
          services[]->{
            "title": coalesce(
              title[_key==$lang][0].value,
              title[_key=="es"][0].value,
            )
          },
          thumbnail {
            ${IMG}
          }
        }
    }
`

export const SERVICES_DESCRIPTION_QUERY = groq`
    _type == "servicesDescription" => {
        _key,
        _type,
        title,
        description,
        services[] {
          _key,
          name,
          description,
          service -> {
            "language": $lang,
            "title": coalesce(
              title[language==$lang][0].value,
              title[language=="es"][0].value,
            )
          }
        }
    }
`