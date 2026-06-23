import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryItem",
  title: "Gallery Group",
  type: "object",
  fields: [
    defineField({
      name: "orientation",
      title: "Orientation",
      type: "string",
      options: {
        list: [
          { title: "Vertical", value: "vertical" },
          { title: "Horizontal", value: "horizontal" },
          { title: "Big Image", value: "bigImage" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      description: "Add images and/or videos in any order.",
      type: "array",
      of: [
        {
          type: "image",
          title: "Image",
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
        },
        {
          type: "object",
          name: "video",
          title: "Video",
          fields: [
            defineField({
              name: "url",
              title: "Video URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              url: "url",
            },
            prepare({ url }) {
              return {
                title: "Video",
                subtitle: url,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      orientation: "orientation",
      items: "items",
    },
    prepare({ orientation, items }) {
      const count = items?.length ?? 0;
      return {
        title: `${orientation ?? "Group"} (${count} item${count === 1 ? "" : "s"})`,
        subtitle: orientation,
      };
    },
  },
});
