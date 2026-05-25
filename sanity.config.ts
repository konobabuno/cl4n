'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { documentInternationalization, SupportedLanguages } from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {resolve} from './sanity/presentation'
import { simplerColorInput } from 'sanity-plugin-simpler-color-input'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'
import {structure} from './sanity/structure'

import { defaultLocale, LANGUAGES } from './config/i18n/i18nConfig'
import { SINGLETONS } from './config/singletons/singletons'

// Define the singleton types for easy reference
const singletonTypes = new Set(SINGLETONS.map(singleton => singleton._type))
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: '/studio',
  title: 'CL4N CMS',
  projectId,
  dataset,
  schema: {
    types: schema,
    templates: (prev) => [
      ...prev.filter((template) => !['page'].includes(template.id)),
      {
        id: 'page-es',
        title: 'Page (ES)',
        schemaType: 'page',
        value: {language: 'es'}
      },
      {
        id: 'page-en',
        title: 'Page (EN)',
        schemaType: 'page',
        value: {language: 'en'}
      },
      {
        id: 'project-es',
        title: 'Project (ES)',
        schemaType: 'project',
        value: {language: 'es'}
      },
      {
        id: 'project-en',
        title: 'Project (EN)',
        schemaType: 'project',
        value: {language: 'en'}
      },
      {
        id: 'service',
        title: 'Service',
        schemaType: 'service',
        value: {}
      }
    ],
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draftMode/enable',
        },
      },
      resolve,
    }),
    documentInternationalization({
      supportedLanguages: LANGUAGES as SupportedLanguages,
      schemaTypes: ['home', 'page', 'project', 'settings', 'projects'], 
    }),
    simplerColorInput({
      defaultColorFormat: 'rgba',
      defaultColorList: [
        { label: 'Green', value: '#1C4C44' },
        { label: 'Red', value: '#B70100' },
        { label: 'Custom...', value: 'custom' },
      ],
      enableSearch: true,
      showColorValue: true,
    }),
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: [defaultLocale], // Languages to show by default in the array editor
      fieldTypes: ['string'], // Field types to support
    })
  ],
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})