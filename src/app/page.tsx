import HomeContent from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent

  return {
    title: `Home | ${metadata.title?.absolute}`,
    description: `Home | ${metadata.title?.absolute}`,
  }
}

export default function Home() {
  return (
    <HomeContent />
  )
}
