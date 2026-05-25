import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/isUnique";
import {
    orderRankField,
    orderRankOrdering,
} from "@sanity/orderable-document-list";

const sections: string[] = []; // Add section types here as strings e.g. 'heroSection', 'textSection'

if (sections.length) {
    const mappedSections = sections.map((section) => ({ type: section }));
}

export default defineType({
    name: "project",
    type: "document",
    title: "Project",
    groups: [
        {
            name: "content",
            title: "Content",
        },
        {
            name: "seo",
            title: "SEO",
        },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                isUnique: isUniqueOtherThanLanguage,
                source: "title",
                maxLength: 96,
                documentInternationalization: {
                    exclude: true,
                },
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "services",
            type: "array",
            title: "Services",
            of: [{ type: "reference", to: [{ type: "service" }] }],
            validation: (Rule) =>
                Rule.unique().error(
                    "You cannot select the same service more than once.",
                ),
        }),
        defineField({
            name: "thumbnail",
            type: "image",
            title: "Thumbnail",
            options: {
                hotspot: true,
            },
            group: "content",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "videoPreview",
            type: "url",
            title: "Video Preview URL",
            group: "content",
        }),
        defineField({
            name: "videoUrl",
            type: "url",
            title: "Video URL",
            group: "content",
        }),
        
        defineField({
            name: "team",
            title: "Info",
            type: "text",
        }),
        defineField({
            name: "timeOfProject",
            type: "string",
            title: "Time of Project",
        }),
        defineField({
            name: "gallery",
            type: "array",
            title: "Gallery",
            of: [{ type: "galleryItem" }],
            options: {
                layout: "grid",
            },
        }),
        defineField({
            name: "metaTitle",
            title: "Meta Title",
            type: "string",
            group: "seo",
        }),
        defineField({
            name: "metaDescription",
            title: "Meta Description",
            type: "text",
            group: "seo",
        }),
        defineField({
            name: "noIndex",
            title: "No Index",
            type: "boolean",
            initialValue: false,
            group: "seo",
        }),
        defineField({
            name: "ogImage",
            title: "Open Graph Image - [1200x630]",
            type: "image",
            group: "seo",
        }),
        defineField({
            name: "language",
            type: "string",
            readOnly: true,
            hidden: true,
        }),
        orderRankField({ type: "project" })
    ],
    preview: {
        select: {
            language: "language",
            media: "ogImage",
            title: "title",
        },
        prepare({ language, media, title }) {
            return {
                title: `${title} (${language?.toUpperCase()})`,
                media: media,
            };
        },
    },
});
