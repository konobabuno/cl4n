import { groq } from 'next-sanity';
import { IMG } from './lib';

export const PROJECTS_THUMBNAILS_QUERY = (order = 'asc') => groq`
*[_type == "project" && language == $lang] | order(orderRank ${order}) [$start...$end] {
  _id,
  title,
  slug{ current },
  services[]->{
    "title": coalesce(
      title[language==$lang][0].value,
      title[language=="es"][0].value,
    )
  },
  thumbnail{
    ${IMG}
  },
  videoPreview,
}
`;



export const NUMBER_OF_PROJECTS_QUERY = groq`
  count(*[_type == "project" && language == $lang])
`;

export const SERVICES_LINKED_TO_PROJECTS_QUERY = groq`
  *[
  _type == "service" &&
  count(*[
    _type == "project" &&
    language == $lang &&            
    references(^._id)
  ]) > 0
]{
  "title": coalesce(
    title[language == $lang][0].value,
    title[language == 'es'][0].value
  )
}["title"]
`;

export const ALL_PROJECTS_WITH_SERVICES_QUERY = (order = 'asc') => groq`
*[
  _type == "project" && language == $lang &&
  count(
    services[
      coalesce(
        @->title[language == $lang][0].value,
        @->title[language == "es"][0].value
      ) == $service
    ]
  ) > 0
] | order(orderRank ${order}) [$start...$end]{
  _id,
  title,
  slug{ current },
  services[]->{
    "title": coalesce(
      title[language == "en"][0].value,
      title[language == "es"][0].value
    )
  },
  thumbnail{
    _id,
    asset->{
      _id,
      metadata{
        dimensions{ width, height },
        blurHash
      }
    }
  },
  videoPreview
}
`;

export const NUMBER_OF_PROJECTS_WITH_SERVICE_FILTER_QUERY = groq`
  count(*[
    _type == "project" && language == $lang &&
    count(
      services[
        coalesce(
          @->title[language== $lang][0].value,
          @->title[language == "es"][0].value
        ) == $serviceFilter
      ]
    ) > 0
  ])
`;


