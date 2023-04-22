/** @jsxImportSource @emotion/react */
'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import Logo from '@/components/Logo'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => ({
    container: css`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    `,
    logo: css`
      width: 40vw;

      @media ${theme.breakpoints.portrait} {
        width: 60vw;
      }
    `,
    logoImage: css`
      width: 100%;
      height: auto;
    `,
  }), [theme])
}

export default function HomeContent() {
  const styles = useStyles()

  return (
    <main css={styles.container}>
      <h1 css={styles.logo}>
        <Logo colors={{ primary: '#000000' }} css={styles.logoImage} />
      </h1>
    </main>
  )
}
