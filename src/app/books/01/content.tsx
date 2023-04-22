/** @jsxImportSource @emotion/react */
'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import LogoTSSH from '@/components/LogoTSSH'
import BackgroundImage from '@/components/BackgroundImage'
import Schedule from '@/components/Schedule'
import Members from '@/components/Members'
import * as layout from '@/components/layout-1'
import dynamic from 'next/dynamic'
import { books } from '@/constants'
import Menu from '@/components/Menu'

const Game = dynamic(() => import('./game').then((mod) => mod.Game), { ssr: false })

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => {
    const background1 = css`
      position: relative;

      & > * {
        position: relative;
        z-index: 1;
      }

      &::before,
      &::after {
        z-index: 0;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: 100%;
      }

      &::before {
        mix-blend-mode: normal;
        background-color: rgba(255, 255, 255, 0.8);
        transform: translate3d(0, 0, 0);
      }

      &::after {
        mix-blend-mode: overlay;
        background-color: rgba(255, 255, 255, 0.8);
        transform: translate3d(0, 0, 0);
      }
    `

    const background2 = css`
      position: relative;

      & > * {
        position: relative;
        z-index: 1;
      }

      &::before,
      &::after {
        z-index: 0;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: 100%;
      }

      &::before {
        mix-blend-mode: multiply;
        background-color: rgba(0, 0, 0, 0.4);
        transform: translate3d(0, 0, 0);
      }

      &::after {
        mix-blend-mode: overlay;
        background-color: rgba(255, 255, 127, 0.2);
        transform: translate3d(0, 0, 0);
      }
    `

    return {
      background: css`
        height: 100vh;
        height: 100lvh;
        background-color: #e6e6e6;
        position: fixed;
        bottom: auto;
      `,
      title: css`
        ${background1};
      `,
      titleImage: css`
        box-sizing: border-box;
        width: 100%;
        height: auto;
        mix-blend-mode: multiply;
      `,
      contentTitle: css`
        ${background1};

        span {
          display: inline-block;
        }
      `,
      content: css`
        ${background2};
        color: #fff;
      `,
      schedule: css`
        margin-bottom: 0.6rem;

        @media ${theme.breakpoints.portrait} {
          margin-bottom: 0.5rem;
        }
      `,
    }
  }, [theme])
}

export default function Book02Content() {
  const styles = useStyles()

  return (
    <layout.Container>
      <BackgroundImage
        css={styles.background}
        src={{
          landscape: '/images/book01-1920x1080.jpg',
          portrait: '/images/book01-1080x1920.jpg',
        }}
      />
      <Menu />
      <layout.Inner>
        <layout.Inner1>
          <layout.Title css={styles.title}>
            <LogoTSSH
              colors={{
                primary: '#231815',
                secondary: '#007ec6',
                tertiary: '#007ec6',
              }}
              css={styles.titleImage}
            />
          </layout.Title>
          <layout.ContentTitle css={styles.contentTitle}>
            {books.vol01.titleMultiline.map((x, i) => <span key={i}>{x}</span>)}
          </layout.ContentTitle>
          <layout.Content css={styles.content}>
            <Schedule css={styles.schedule} />
            <Members />
          </layout.Content>
        </layout.Inner1>
        <layout.Inner2>
          <Game />
        </layout.Inner2>
      </layout.Inner>
    </layout.Container>
  )
}
