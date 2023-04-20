import HomeContent from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent

  return {
    title: `Home | ${metadata.title}`,
    description: `Home | ${metadata.title}`,
  }
}

export default function Home() {
  return (
    <HomeContent />
  )
}
