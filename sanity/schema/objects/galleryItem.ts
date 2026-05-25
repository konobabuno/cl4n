import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video URL", value: "video" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility.",
        }),
      ],
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
        name:'verticalOrHorizontal',
        title: "Orientation",
        type: "string",
        options: {
            list: [
            { title: "Vertical", value: "vertical" },
            { title: "Horizontal", value: "horizontal" },
            ],
        },    
        hidden: ({ parent }) => !parent?.type,
        validation: (Rule) =>
        Rule.custom((value, context) => {
            const parent = context.parent as { type?: string } | undefined;
            if (parent?.type !== "image") return true;
            return value ? true : "Orientation is required";
        }),
    }),
  ],
  preview: {
    select: {
      type: "type",
      media: "image",
      video: "video",
    },
    prepare({ type, media, video }) {
      return {
        title: type === "video" ? "Video" : "Image",
        subtitle: type === "video" ? video : undefined,
        media: type === "image" ? media : undefined,
      };
    },
  },
});
