import { defineField, defineType } from "sanity";

export default defineType({
    name: "contactCTA",
    title: "Contact CTA",
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
                title: "Contact CTA",
            };
        },
    },
});