import { defineField, defineType } from "sanity";

export default defineType({
    name: "photoPage",
    type: "document",
    title: "Photo Page",
    fields: [
        defineField({
            name: "photos",
            type: "array",
            of: [
                {
                    type: "image",
                    fields: [
                        defineField({
                            name: "alt",
                            type: "string",
                            title: "Alternative Text",
                            description: "Important for SEO and accessibility.",
                        }),
                    ],
                    preview: {
                        select: {
                            title: "alt",
                            media: "asset",
                        },
                        prepare({ title, media }) {
                            return {
                                title: title || "Image",
                                media,
                            };
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: "Photo Page",
            };
        },
    },
});
