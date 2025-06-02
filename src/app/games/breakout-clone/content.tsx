'use client'

import { css, useTheme } from '@emotion/react'
import dynamic from 'next/dynamic'

const BreakoutGame = dynamic(() => import('./game').then((mod) => ({ default: mod.BreakoutGame })), {
  ssr: false,
})

export default function BreakoutCloneContent() {
  const theme = useTheme()

  return (
    <div
      css={css`
        ${theme.styles.text};
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fffaec;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `}
    >
      <BreakoutGame />
    </div>
  )
}
