import { defineField, defineType } from "sanity";

export default defineType({
    name: "textAndImage",
    title: "Text and Image",
    type: "object",
    fields: [
        defineField({
            name: 'imagePosition',
            title: 'Image Position',
            type: 'string',
            initialValue: 'left',
            options: {
                list: [
                    { title: 'Left image and Right Text', value: 'left' },
                    { title: 'Right image and Left Text', value: 'right' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Image",
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
                Rule.required().error("Image is required"),
        }),
        defineField({
            name: 'headline',
            type: 'string',
            title: 'Headline',
        }),
        defineField({
            name: "title",
            type: "blockContent",
            title: "Title",
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Description",
        }),
        defineField({
            title: "CTA Button",
            name: "ctaButton",
            type: "link",
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Text and Image",
            };
        },
    },
});