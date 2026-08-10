import type { MetadataRoute } from 'next'

const baseUrl = 'https://www.cl4n.mx'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/es`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/es/servicios`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/servicios`,
          en: `${baseUrl}/en/services`,
        },
      },
    },
    {
      url: `${baseUrl}/en/services`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/servicios`,
          en: `${baseUrl}/en/services`,
        },
      },
    },
    {
      url: `${baseUrl}/es/projects`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/projects`,
          en: `${baseUrl}/en/projects`,
        },
      },
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/projects`,
          en: `${baseUrl}/en/projects`,
        },
      },
    },
    {
      url: `${baseUrl}/es/acerca-de`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/acerca-de`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/acerca-de`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
    {
      url: `${baseUrl}/es/contacto`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/contacto`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified,
      alternates: {
        languages: {
          es: `${baseUrl}/es/contacto`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
  ]
}