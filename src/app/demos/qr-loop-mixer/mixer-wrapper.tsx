'use client'

import dynamic from 'next/dynamic'

const QrLoopMixer = dynamic(() => import('./mixer'), { ssr: false })

export default function MixerWrapper() {
  return <QrLoopMixer />
}
