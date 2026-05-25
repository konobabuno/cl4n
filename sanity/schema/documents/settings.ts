import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
    name: "settings",
    type: "document",
    title: "Settings",
    fieldsets: [
        {
            name: 'header',
            title: 'Header Settings',
            options: {
                collapsible: false,
                collapsed: false,
            },
        },
        {
            name: 'footer',
            title: 'Footer Settings',
            options: {
                collapsible: false,
                collapsed: false,
            },
        },
    ],
    fields: [
        defineField({
            name: "mail",
            title: "Contact Email",
            type: "string",
             validation: (Rule) => Rule.email().error('Please enter a valid email address.'),
        }),
        defineField({
            name: 'headerNavigation',
            title: 'Header Navigation',
            type: 'array',
            of: [
                {
					type: 'link',
				},
            ],
            options: {
                insertMenu: {
                  views: [
                    { name: 'list' },
                  ]
                }
            },
            fieldset: 'header',
        }),
        defineField({
            name: "footerLogos",
            title: "Footer Logos",
            type: "array",
            of: [
                defineArrayMember({
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                            description: 'Important for SEO and accessibility.',
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'footerSitemap',
            title: 'Footer Sitemap',
            type: 'array',
            of: [
                {
					type: 'link',
				},
            ],
            options: {
                insertMenu: {
                  views: [
                    { name: 'list' },
                  ]
                }
            },
            fieldset: 'footer',
        }),
        defineField({
            name: 'footerSocial',
            title: 'Footer Social Links',
            type: 'array',
            of: [
                {
					type: 'link',
				},
            ],
            options: {
                insertMenu: {
                  views: [
                    { name: 'list' },
                  ]
                }
            },
            fieldset: 'footer',
        }),
        defineField({
            name: 'footerTerms',
            title: 'Footer Terms and Conditions',
            type: 'array',
            of: [
                {
					type: 'link',
				},
            ],
            options: {
                insertMenu: {
                  views: [
                    { name: 'list' },
                  ]
                }
            },
            validation: (Rule) => Rule.max(2).error('You can only add up to 2 social links.'),
            fieldset: 'footer',
        }),
        defineField({
            name: 'language',
            type: 'string',
            readOnly: true,
            hidden: true,
        }),
    ],
    preview: {
        select: {
            title: "title",
            language: "language",
        },
        prepare(selection) {
            const { language } = selection;
            return {
                title: `Settings (${language.toUpperCase()})`,
            };
        },
    },

});