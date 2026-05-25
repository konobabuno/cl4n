import { defineField, defineType } from "sanity";

export default defineType({
    name: "aboutUs",
    title: "About Us",
    type: "object",
    fields: [
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "blockContent",
        }),
        defineField({
            title: "Values",
            name: "values",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "icon",
                            type: "image",
                            title: "Icon",
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
                        defineField({
                            name: "title",
                            type: "string",
                            title: "Title",
                        }),
                        defineField({
                            name: "description",
                            type: "text",
                            title: "Description",
                        }),
                    ],
                    preview: {
                        select: {
                            title: "title",
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "About Us",
            };
        },
    },
});