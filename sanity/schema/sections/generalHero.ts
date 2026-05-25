import { defineField, defineType } from "sanity";

export default defineType({
    name: "generalHero",
    title: "General Hero",
    type: "object",
    fields: [
        defineField({
            name: "heroTitle",
            type: "blockContent",
            title: "Title",
        }),
        defineField({
            name: "heroDescription",
            type: "text",
            title: "Description",
        }),
        defineField({
            name: "imageDesktop",
            type: "image",
            title: "Image Desktop",
            options: {
                hotspot: true,
            },
            fields: [
              defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  description: "Important for SEO and accessibility.",
              }),
            ],
            validation: (Rule) =>
                Rule.required().error("Image Desktop is required"),
        }),
        defineField({
            name: "imageMobile",
            type: "image",
            title: "Image Mobile",
            options: {
                hotspot: true,
            },
            fields: [
              defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  description: "Important for SEO and accessibility.",
              }),
            ],
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "General Hero",
            };
        },
    },
});