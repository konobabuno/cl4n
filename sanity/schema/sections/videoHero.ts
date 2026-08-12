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
            name: "coverImage",
            type: "image",
            title: "Cover Image",
        }),
        defineField({
            name: "description",
            type: "blockContent",
            title: "Hero Description",
        }),
        
    ],
    preview: {
        prepare() {
            return {
                title: "Video Hero",
            };
        },
    },
});