'use client'

import dynamic from 'next/dynamic'

const StickerDriftGame = dynamic(() => import('./game'), { ssr: false })

export default function GameWrapper() {
  return <StickerDriftGame />
}
