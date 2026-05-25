import { defineField, defineType } from "sanity";

export default defineType({
  name: "projects",
  type: "document",
  title: "Projects Page",
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
        title: `Projects Page (${language?.toUpperCase()})`,
        media: media,
      };
    },
  },
});

