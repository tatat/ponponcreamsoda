import { siteOrigin } from '@/config'
import MixerWrapper from './mixer-wrapper'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent
  const siteName = metadata.title?.absolute ?? 'Pon Pon Creamsoda'
  const title = `QR Loop Mixer | ${siteName}`
  const description = 'QRコードを読み取ってループの組み合わせを切り替えるデモ'
  const url = `${siteOrigin}/demos/qr-loop-mixer/`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName,
      url,
      title,
      description,
    },
  }
}

export default function QrLoopMixerPage() {
  return <MixerWrapper />
}
