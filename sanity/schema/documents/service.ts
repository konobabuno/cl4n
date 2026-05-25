import { defineField, defineType } from "sanity";

export default defineType({
    name: "service",
    type: "document",
    title: "Service",
    fields: [
        defineField({
            name: "title",
            type: "internationalizedArrayString",
        }),
    ],
    preview: {
            select: {
                title: "title", 
            },
            prepare({ title }) {
                const spanish = title?.find((item: { _key: string; language: string; value: string }) => item.language === "es");
                const english = title?.find((item: { _key: string; language: string; value: string }) => item.language === "en");
                return {
                    title: spanish?.value ? `${spanish?.value} (ES)` : "Sin título (ES)",
                    subtitle: english?.value ? `${english.value} (EN)` : ' ',
                };
            },
        },
});