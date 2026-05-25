import { defineField, defineType } from "sanity";

const sections: string[] = [
  "homeHero",
  "textAndImage",
  "ourClients",
  "servicesCTA",
  "contactCTA",
  "aboutUs",
  "ourTeam",
  "featuredProjects",
  "termsAndConditions",
  "generalHero",
  "servicesDescription"
];
const mappedSections = sections?.map((section) => ({ type: section }));

export default defineType({
  name: "home",
  type: "document",
  title: "Home Page",
  groups: [
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: mappedSections,
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (section) => 
                `/cms/${section}.jpg`,
            },
            { name: 'list' },
          ]
        }
      },
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      group: "seo",
     
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      group: "seo",
    }),
    defineField({
        name: "noIndex",
        title: "No Index",
        type: "boolean",
        initialValue: false,
        group: "seo",
      }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image - [1200x630]",
      type: "image",
      group: "seo",
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: "language",
      media: "ogImage",
    },
    prepare({ language, media }) {
      return {
        title: `Home Page (${language?.toUpperCase()})`,
        media: media,
      };
    },
  },
});