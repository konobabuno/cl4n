import { defineField, defineType } from "sanity";
import {LinkIcon} from '@sanity/icons'

export default defineType({
    name: "servicesCTA",
    title: "Services CTA",
    type: "object",
    fields: [
        defineField({
            title: "Services CTA",
            name: "services",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "headline",
                            type: "string",
                            title: "Headline",
                        }),
                        defineField({
                            name: "title",
                            type: "string",
                            title: "Title",
                            validation: (Rule) => Rule.required().error("Title is required."),
                        }),
                        defineField({
                            name: "description",
                            type: "text",
                            title: "Description",
                        }),
                        defineField({
                            name: "links",
                            type: "array",
                            title: "Links",
                            of: [
                                {
                                    type: "link",
                                },
                                {
                                    type: "object",
                                    title: "Service",
                                    icon: LinkIcon,
                                    fields: [
                                        defineField({
                                            name: "label",
                                            type: "string",
                                            title: "Link Label",
                                            description: "Custom label for the link.",
                                        }),
                                        defineField({
                                            name: "service",
                                            type: "reference",
                                            to: [{ type: "service" }],
                                            title: "Service Reference",
                                            options: {
                                                disableNew: true,
                                            },
                                        })
                                    ],
                                },
                            ],
                            
                            validation: (Rule) => Rule.max(2).error("You can add up to 2 links."),
                        }),
                        defineField({
                            name: "image",
                            type: "image",
                            title: "Image",
                            validation: (Rule) => Rule.required().error("Image is required."),
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
                title: "Services CTA",
            };
        },
    },
});