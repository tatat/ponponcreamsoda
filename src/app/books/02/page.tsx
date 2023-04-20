import Book02Content from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const title = `劈ヶ原衛星第二高校イラスト本 | ${metadata.title?.absolute}`
  const description = '同人サークル Pon Pon Creamsoda 劈ヶ原衛星第二高校イラスト本販促サイト'

  const images = {
    url: `${process.env.SITE_ORIGIN}/images/og-book02.png`,
    width: 1200,
    height: 630,
    type: 'image/png',
  }

  return {
    title,
    description,
    openGraph: {
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
