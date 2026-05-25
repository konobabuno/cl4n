import { defineField, defineType, defineArrayMember } from "sanity";

export default defineType({
    name: "termsAndConditions",
    title: "Terms and Conditions",
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
            name: "title",
            type: "text",
            title: "Title",
        }),
        defineField({
            name: "content",
            type: "array",
            title: "Content",
            of: [
                defineArrayMember({
                    title: "Block",
                    type: "block",
                    styles: [
                      { title: "Normal", value: "normal" },
                      { title: "H3", value: "h3" },
                    ],
                    lists: [],
                    marks: {
                      decorators: [],
                      annotations: [],
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Terms and Conditions",
            };
        },
    },
});