import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/isUnique";


const sections: string[] = [
  "generalHero",
  "textAndImage",
  "ourClients",
  "servicesCTA",
  "contactCTA",
  "aboutUs",
  "ourTeam",
  "contactUs",
  "featuredProjects",
  "termsAndConditions",
  "servicesDescription"
];
const mappedSections = sections?.map((section) => ({ type: section }));


export default defineType({
  name: "page",
  type: "document",
  title: "Page",
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
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
       options: {
      isUnique: isUniqueOtherThanLanguage,
      source: "title",
      maxLength: 96,
      documentInternationalization: {
          exclude: true,
      },
      },
      validation: (Rule) => Rule.required(),
    }),
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
      title: "title",
      media: "ogImage",
    },
    prepare({ language, media, title }) {
      return {
        title: `${title} (${language?.toUpperCase()})`,
        media: media,
      };
    },
  },
});