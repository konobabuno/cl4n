import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'url',
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      hidden: ({ parent }) => parent?.linkType !== 'href' && parent?.linkType !== 'page',

    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'href',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL'
          }

          if (typeof value === 'string' && value.trim().startsWith('#')) {
            const v = value.trim()
            if (v === '#') return true  
            return /^#[A-Za-z][A-Za-z0-9_-]*$/.test(v)
              ? true
              : 'Anchor links must look like #section-id'
          }

          return true
        }).uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
          allowRelative: true,
        })
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'home'}, {type: 'page'}, {type: 'project'}, {type: 'projects'}, {type: 'service'}],
      options: {
        filter: ({ document }) => {
            const { language } = document
            if (language) {
                return {
                    filter: 'language == $language',
                    params: {
                        language: language,
                    },
                }
            }
            return {}
        },
        disableNew: true,
        documentInternationalization: {
          exclude: true,
        },
      },  
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'inNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => parent?.linkType !== 'href',
    }),
  ],
})
