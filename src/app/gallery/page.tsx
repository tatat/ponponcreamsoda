import { siteOrigin } from '@/config'
import GalleryContent from './content'
import type { Metadata, ResolvingMetadata } from 'next'
import { books } from '@/constants'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `Gallery | ${siteName}`
  const description = `同人サークル Pon Pon Creamsoda 「${books.vol04.title}」販促サイト`
  const url = `${siteOrigin}/gallery/`

  const images = {
    url: `${siteOrigin}/images/og-image-home-v2.png`,
    width: 1200,
    height: 630,
    type: 'image/png',
  }

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName,
      url,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CreamsodaPon',
      title,
      description,
      images,
    },
  }
}

export default function Book04() {
  return (
    <GalleryContent />
  )
}