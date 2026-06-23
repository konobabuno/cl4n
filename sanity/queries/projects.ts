import { groq } from 'next-sanity';
import { IMG } from './lib';

export type ProjectOrder = 'asc' | 'desc' | 'alphabetical';

const projectOrderClause = (order: ProjectOrder | string) => {
  if (order === 'alphabetical') return 'title asc';
  if (order === 'desc') return 'orderRank desc';
  return 'orderRank asc';
};

export const PROJECT_THUMBNAIL_QUERY = (order: ProjectOrder | string = 'asc') => groq`
*[_type == "project" && 
language == $lang 
&& (
  $service == "" ||
  service->slug.current == $service
)
&& (
  $tagSlug == "" ||
  $tagSlug in tags[]->slug.current
)
] | order(${projectOrderClause(order)}) [$start...$end] {
  _id,
  title,
  slug{ current },
  "service": service->{
    _id,
    "title": coalesce(
      title[language == $lang][0].value,
      title[language == "es"][0].value
    )
  },
  tags[]->{
    _id,
    slug{current},
    "title": coalesce(
      title[language == $lang][0].value,
      title[language == "es"][0].value
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
  *[ _type == "service" ] | order(orderRank asc){
  _id,
  slug{current},
  "title": coalesce(
    title[language == $lang][0].value,
    title[language == 'es'][0].value
  )
}
`;

export const TAGS_LINKED_TO_PROJECTS_QUERY = groq`
  *[
    _type == "tag" &&
    count(*[
      _type == "project" &&
      language == $lang &&
      ($service == "" || service->slug.current == $service) &&
      references(^._id)
    ]) > 0
  ] | order(_createdAt asc) {
    _id,
    slug{current},
    "title": coalesce(
      title[language == $lang][0].value,
      title[language == 'es'][0].value
    )
  }
`;

export const NUMBER_OF_PROJECTS_WITH_SERVICE_FILTER_QUERY = groq`
  count(*[
    _type == "project" && language == $lang &&
    service->slug.current == $serviceFilter
  ])
`;


export const TAGS_SLUG_QUERY = groq`
  array::unique(*[
    _type == "project" &&
    language == $lang &&
    ($service == "" || service->slug.current == $service)
  ].tags[]->slug.current)
`;