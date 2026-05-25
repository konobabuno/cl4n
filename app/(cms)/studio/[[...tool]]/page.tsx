/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

// Custom metadata for Sanity Studio
export const metadata: Metadata = {
  title: 'CL4N CMS Studio',
  description: 'The content management system for CL4N',
}

export { viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
