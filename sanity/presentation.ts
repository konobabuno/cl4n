import {
    defineLocations,
    defineDocuments,
    PresentationPluginOptions,
  } from "sanity/presentation";
  
  export const resolve: PresentationPluginOptions["resolve"] = {
    locations: {
      post: defineLocations({
        select: {
          title: "title",
          slug: "slug.current",
        },
        resolve: (doc) => ({
          locations: [
            {
              title: doc?.title || "Untitled",
              href: `/projects/${doc?.slug}`,
            },
          ],
        }),
      }),
    },
    mainDocuments: defineDocuments([
      {
        route: "/en",
        filter: `_type == 'home' && language == 'en'`,
      },
      {
        route: "/es",
        filter: `_type == 'home' && language == 'es'`,
      },
    ]),
  };
  