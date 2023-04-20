import Book02Content from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `劈ヶ原衛星第二高校イラスト本 | ${siteName}`
  const description = '同人サークル Pon Pon Creamsoda 劈ヶ原衛星第二高校イラスト本販促サイト'
  const url = `${process.env.SITE_ORIGIN}/books/02/`

  const images = {
    url: `${process.env.SITE_ORIGIN}/images/og-image-book02.png`,
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

export default function Book02() {
  return (
    <Book02Content />
  )
}
