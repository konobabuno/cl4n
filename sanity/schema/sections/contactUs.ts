import { defineField, defineType } from "sanity";

export default defineType({
    name: "contactUs",
    title: "Contact Us",
    type: "object",
    fields: [
        defineField({
            name: 'backgroundColor',
            title: 'Background color',
            type: 'simplerColor',
        }),
        defineField({
            name: "title",
            type: "blockContent",
            title: "Title",
        }),
        defineField({
            name: "description",
            type: "text",
            title: "Description",
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare(selection) {
            return {
                title: "Contact Us",
            };
        },
    },
});