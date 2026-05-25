import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export default defineType({
    name: "servicesDescription",
    title: "Services Description",
    type: "object",
    fields: [
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
            title: "Services",
            name: "services",
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
                            name: "description",
                            type: "text",
                            title: "Description",
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
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Services Description",
            };
        },
    },
});