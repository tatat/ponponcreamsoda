import { siteOrigin } from '@/config'
import Book05Content from './content'
import type { Metadata, ResolvingMetadata } from 'next'
import { bookInfo } from './config'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `${bookInfo.title} | ${siteName}`
  const description = `同人サークル Pon Pon Creamsoda 「${bookInfo.title}」販促サイト`
  const url = `${siteOrigin}/books/05/`

  const images = {
    url: `${siteOrigin}/images/og-image-book05.png`,
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

export default function Book05() {
  return <Book05Content />
}
