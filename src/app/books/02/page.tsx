import Book02Content from './content'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = await parent

  return {
    title: `劈ヶ原衛星第二高校イラスト本 | ${metadata.title?.absolute}`,
    description: `劈ヶ原衛星第二高校イラスト本 | ${metadata.title?.absolute}`,
  }
}

export default function Book02() {
  return (
    <Book02Content />
  )
}
