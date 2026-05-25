import { defineField, defineType } from "sanity";

export default defineType({
    name: "ourClients",
    title: "Our Clients",
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
            title: "Clients",
            name: "clients",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "title",
                            type: "string",
                            title: "Title",
                        }),
                        defineField({
                            name: "clientLogo",
                            type: "image",
                            title: "Client Logo",
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
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Our Clients",
            };
        },
    },
});