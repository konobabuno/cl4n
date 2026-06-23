import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/isUnique";
import {
    orderRankField,
} from "@sanity/orderable-document-list";

const sections: string[] = [
    "featuredProjects",
];
const mappedSections = sections?.map((section) => ({ type: section }));

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
            name: "service",
            type: "reference",
            title: "Service",
            to: [{ type: "service" }],
            options: {
                disableNew: true,
                filter: "slug.current != 'photo'",
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "tags",
            type: "array",
            title: "Tags",
            of: [{
                type: "reference",
                to: [{ type: "tag" }],
                options: {
                    disableNew: true,
                },
            }],
            validation: (Rule) =>
                Rule.unique().error(
                    "You cannot select the same tag more than once.",
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
            name: "info",
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
            name: "sections",
            type: "array",
            group: "content",
            of: mappedSections,
            options: {
              insertMenu: {
                views: [
                  {
                    name: 'grid',
                    previewImageUrl: (section) => 
                      `/cms/${section}.jpg`,
                  },
                  { name: 'list' },
                ]
              }
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
