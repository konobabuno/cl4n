import { defineField, defineType } from "sanity";

type InternationalizedString = {
    _key: string;
    language: string;
    value: string;
};

const getSpanishTitle = (title?: InternationalizedString[]) => {
    const spanish = title?.find((item) => item.language === "es");
    const english = title?.find((item) => item.language === "en");

    return spanish?.value || english?.value || "";
};

export default defineType({
    name: "tag",
    type: "document",
    title: "Tag",
    fields: [
        defineField({
            name: "title",
            type: "internationalizedArrayString",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: (doc) => getSpanishTitle(doc.title as InternationalizedString[]),
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
            select: {
                title: "title", 
            },
            prepare({ title }) {
                const spanish = title?.find((item: InternationalizedString) => item.language === "es");
                const english = title?.find((item: InternationalizedString) => item.language === "en");
                return {
                    title: spanish?.value ? `${spanish?.value} (ES)` : "Sin título (ES)",
                    subtitle: english?.value ? `${english.value} (EN)` : ' ',
                };
            },
        },
});