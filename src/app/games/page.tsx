import { siteOrigin } from '@/config'
import GamesContent from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `Games | ${siteName}`
  const description = 'Pon Pon Creamsoda ゲーム - ブロック崩しなどのゲームをお楽しみください'
  const url = `${siteOrigin}/games/`

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

export default function GamesPage() {
  return <GamesContent />
}
