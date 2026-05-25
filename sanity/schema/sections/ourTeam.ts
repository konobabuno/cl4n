import { defineField, defineType } from "sanity";

export default defineType({
    name: "ourTeam",
    title: "Our Team",
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
            name: "bigText",
            type: "blockContent",
            title: "Big Text",
        }),
        defineField({
            title: "Team Members",
            name: "members",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "name",
                            type: "string",
                            title: "Name",
                        }),
                        defineField({
                            name: "externalLink",
                            type: "url",
                            title: "External Link",
                        }),
                        defineField({
                            name: "photo",
                            type: "image",
                            title: "Photo",
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
                },
            ],
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
                title: "Our Team",
            };
        },
    },
});