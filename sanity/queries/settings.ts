import { groq } from "next-sanity";
import { LINK, IMG } from "./lib";

export const SETTINGS = groq`
*[_type == "settings" && language==$lang][0] {
    mail,
    headerNavigation[]{
        ${LINK}
    },
    footerSitemap[]{
        ${LINK}
    },
    footerLogos[]{
        ${IMG}
    },
    footerSocial[]{
        ${LINK}
    },
    footerTerms[]{
        ${LINK}
    }
}
`

export const TRANSLATION_QUERY = groq`
*[_type == "translation.metadata"]{
  "type": coalesce(
    translations[language == "en"][0].value->_type,
    translations[_key == "en"][0].value->_type,
    schemaTypes[0]
  ),
  "en": {
    "slug": coalesce(
      translations[language == "en"][0].value->slug.current,
      translations[_key == "en"][0].value->slug.current
    )
  },
  "es": {
    "slug": coalesce(
      translations[language == "es"][0].value->slug.current,
      translations[_key == "es"][0].value->slug.current
    )
  }
}
`
