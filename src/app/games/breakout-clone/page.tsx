import { siteOrigin } from '@/config'
import BreakoutCloneContent from './content'
import type { Metadata, ResolvingMetadata } from 'next'
import { gameInfo } from './config'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `${gameInfo.title} | ${siteName}`
  const description = `同人サークル Pon Pon Creamsoda 「${gameInfo.description}」`
  const url = `${siteOrigin}/games/breakout-clone/`

  const images = {
    url: `${siteOrigin}/images/og-image-breakout-clone.png`,
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

export default function BreakoutClonePage() {
  return <BreakoutCloneContent />
}
