import { defineField, defineType } from "sanity";

export default defineType({
    name: "featuredProjects",
    title: "Featured Projects",
    type: "object",
    fields: [
        defineField({
            name: 'backgroundColor',
            title: 'Background color',
            type: 'simplerColor',
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
            name: "projects",
            type: "array",
            title: "Projects",
            of: [
                {
                    type: "reference",
                    to: [{ type: "project" }],
                    options: {
                        filter: ({ document }) => {
                            const { language } = document
                            if (language) {
                                return {
                                    filter: 'language == $language',
                                    params: {
                                        language: language,
                                    },
                                }
                            }
                            return {}
                        },
                        disableNew: true,
                        documentInternationalization: {
                          exclude: true,
                        },
                    },    
                    
                },

            ],
            validation: (Rule) => Rule.min(5).error("At least 5 projects are required."),
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Featured Projects",
            };
        },
    },
});