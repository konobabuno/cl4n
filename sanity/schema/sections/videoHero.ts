import { defineField, defineType } from "sanity";

export default defineType({
    name: "videoHero",
    title: "Video Hero",
    type: "object",
    fields: [
        defineField({
            name: "video",
            type: "url",
            title: "Video URL",
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
        defineField({
            name: "headline",
            type: "string",
            title: "Headline",
        }),
        defineField({
            name: "title",
            type: "blockContent",
            title: "Title",
        }),
        defineField({
            name: "description",
            type: "blockContent",
            title: "Hero Description",
        }),
        defineField({
            name: "ctaLink",
            type: "link",
            title: "CTA Button",
        })
    ],
    preview: {
        prepare() {
            return {
                title: "Video Hero",
            };
        },
    },
});