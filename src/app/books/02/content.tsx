'use client'

import { css, keyframes, useTheme } from '@emotion/react'
import { useCallback, useMemo, useState } from 'react'
import LogoTSSH from '@/components/LogoTSSH'
import BackgroundVideo from '@/components/BackgroundVideo'
import Info from '@/components/Info'
import Members from '@/components/Members'
import Loading from '@/components/Loading'
import * as layout from '@/components/layout-1'
import { books } from '@/constants'
import Menu from '@/components/Menu'

const themeColor = '#f6ca1b'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => {
    const fadeIn = keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `

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
        content: '';
        width: 100%;
        height: 100%;
      }

      &::before {
        mix-blend-mode: soft-light;
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
        content: '';
        width: 100%;
        height: 100%;
      }

      &::before {
        mix-blend-mode: soft-light;
        background-color: rgba(0, 0, 0, 0.4);
        transform: translate3d(0, 0, 0);
      }

      &::after {
        mix-blend-mode: overlay;
        background-color: rgba(0, 255, 127, 0.2);
        transform: translate3d(0, 0, 0);
      }
    `

    return {
      background: css`
        height: 100vh;
        height: 100lvh;
        background-color: #aa9;
      `,
      backgroundInner: css`
        position: fixed;
        bottom: auto;
        height: 100vh;
        height: 100lvh;
      `,
      loading: css`
        position: absolute;
        top: 0;
        left: 0;
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
      info: css`
        margin-bottom: 0.6rem;

        @media ${theme.breakpoints.portrait} {
          margin-bottom: 0.5rem;
        }
      `,
      mainImageContainer: css`
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
      `,
      mainImage: css`
        animation: ${fadeIn} 10s 12s ease forwards;
        opacity: 0;
        object-fit: contain;
        mix-blend-mode: multiply;
        width: 100%;
        height: 100%;
        transform-origin: top center;
        transform: scale(5) translate3d(5%, -3%, 0);

        @media ${theme.breakpoints.portrait} {
          transform: scale(6) translate3d(6%, -5%, 0);
        }
      `,
    }
  }, [theme])
}

export default function Book02Content() {
  const styles = useStyles()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <layout.Container>
      <BackgroundVideo
        css={styles.background}
        videoContainerCss={styles.backgroundInner}
        size={{
          landscape: {
            width: 1920,
            height: 1080,
          },
          portrait: {
            width: 1080,
            height: 1920,
          },
        }}
        src={{
          landscape: {
            url: '/videos/book02-1920x1080.mp4',
            type: 'video/mp4',
          },
          portrait: {
            url: '/videos/book02-1080x1920.mp4',
            type: 'video/mp4',
          },
        }}
        poster={{
          landscape: '/videos/book02-1920x1080.jpg',
          portrait: '/videos/book02-1080x1920.jpg',
        }}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
      />
      <Loading css={styles.loading} visible={isLoading} />
      <Menu secondaryColor={themeColor} />
      <layout.Inner>
        <layout.Inner1>
          <layout.Title css={styles.title}>
            <LogoTSSH
              colors={{
                primary: '#231815',
                secondary: themeColor,
                tertiary: '#bcb7ad',
              }}
              css={styles.titleImage}
            />
          </layout.Title>
          <layout.ContentTitle css={styles.contentTitle}>
            {books.vol02.titleMultiline.map((x, i) => (
              <span key={i}>{x}</span>
            ))}
          </layout.ContentTitle>
          <layout.Content css={styles.content}>
            <Info css={styles.info} boothItemId="4750855" />
            <Members />
          </layout.Content>
        </layout.Inner1>
        <layout.Inner2>
          <div css={styles.mainImageContainer}>
            <img css={styles.mainImage} src="/images/observer.jpg" alt="Observer" />
          </div>
        </layout.Inner2>
      </layout.Inner>
    </layout.Container>
  )
}
