/** @jsxImportSource @emotion/react */
'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import Logo from '@/components/Logo'
import { books } from '@/constants'
import Link from 'next/link'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => ({
    container: css`
      position: relative;
      background-color: #333;
      min-height: 100vh;
      min-height: 100lvh;
    `,
    logo: css`
      position: fixed;
      top: 0;
      left: 50vh;
      right: 0;
      height: 100vh;
      height: 100lvh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      grid-column: 2;
      grid-row: 1 / 3;

      @media ${theme.breakpoints.portrait} {
        position: absolute;
        left: 0;
        height: 100vw;
        width: 100vw;
      }
    `,
    logoImage: css`
      width: 40vw;
      height: auto;

      @media ${theme.breakpoints.portrait} {
        width: 60vw;
      }
    `,
    menu: css`
      position: relative;
      display: grid;
      grid-auto-rows: calc(50vh - 1px);
      grid-template-columns: 50vh;
      gap: 2px;

      @media ${theme.breakpoints.portrait} {
        top: 100vw;
        grid-auto-rows: calc(100vw - 1px);
        grid-template-columns: 100vw;
      }
    `,
    menuItem: css`
      position: relative;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    `,
    menuItemInner: css`
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      object-fit: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.4;
      transition: opacity 0.3s linear;
      mix-blend-mode: normal;

      img {
        width: 100%;
      }

      &:hover {
        opacity: 1;
      }
    `,
  }), [theme])
}

export default function HomeContent() {
  const styles = useStyles()

  return (
    <main css={styles.container}>
      <h1 css={styles.logo}>
        <Logo colors={{ primary: '#ffffff' }} css={styles.logoImage} />
      </h1>
      <div css={styles.menu}>
        <div css={styles.menuItem}>
          <div css={styles.menuItemInner}>
            <Link href="/books/01/">
              <img src="/images/menu-book01.jpg" alt={books.vol01.title} />
            </Link>
          </div>
        </div>
        <div css={styles.menuItem}>
          <div css={styles.menuItemInner}>
            <Link href="/books/02/">
              <img src="/images/menu-book02.jpg" alt={books.vol02.title} />
            </Link>
          </div>
        </div>
        <div css={styles.menuItem}>
          <div css={styles.menuItemInner}>

          </div>
        </div>
      </div>
    </main>
  )
}
