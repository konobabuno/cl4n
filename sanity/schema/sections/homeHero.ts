import { defineField, defineType } from "sanity";

export default defineType({
    name: "homeHero",
    title: "Home Hero",
    type: "object",
    fields: [
        defineField({
            name: 'headline',
            type: 'string',
            title: 'Headline',
        }),
        defineField({
            name: "heroTitle",
            type: "blockContent",
            title: "Hero Title",
        }),
        defineField({
            name: "heroDescription",
            type: "blockContent",
            title: "Hero Description",
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
            validation: (Rule) => Rule.min(4).error("At least 4 projects are required."),
        }),
        defineField({
            name: "ctaLink",
            type: "link",
            title: "Call to Action",
        })
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Home Hero",
            };
        },
    },
});