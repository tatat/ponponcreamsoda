/** @jsxImportSource @emotion/react */
'use client'

import { css, keyframes, useTheme } from '@emotion/react'
import { useCallback, useMemo, useState } from 'react'
import BackgroundVideo from '@/components/BackgroundVideo'
import Members from '@/components/Members'
import Loading from '@/components/Loading'

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
        content: "";
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
        content: "";
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
        background-color: rgba(0, 255, 128, 0.2);
        transform: translate3d(0, 0, 0);
      }
    `

    const text = css`
      letter-spacing: 0.05em;
      font-family: 'Kaisei Decol', serif;
      line-height: 1.3;
    `

    return {
      background: css`
        height: 100vh;
        height: 100lvh;
        background-color: #888;
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
      container: css`
        position: relative;
        min-height: 100vh;
        min-height: 100lvh;
      `,
      inner: css`
        position: relative;
        min-height: 100vh;
        min-height: 100lvh;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 2fr;

        @media ${theme.breakpoints.portrait} {
          grid-template-columns: auto;
          display: flex;
          flex-direction: column;
        }
      `,
      innerCol1: css`
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        gap: 2px;
      `,
      innerCol2: css`
        box-sizing: border-box;
        position: relative;
        padding: 6%;
        overflow: hidden;
        min-height: 100vmin;
        min-height: 100dvmin;

        @media ${theme.breakpoints.portrait} {
          flex: 1;
        }
      `,
      title: css`
        ${background1};
        box-sizing: border-box;
        width: 100%;
        margin: 0;
        padding: 6%;
      `,
      titleImage: css`
        box-sizing: border-box;
        width: 100%;
        mix-blend-mode: multiply;
      `,
      content1: css`
        ${background1};
        box-sizing: border-box;
        padding: 4%;
      `,
      content2: css`
        ${background2};
        box-sizing: border-box;
        flex: 1;
        padding: 4%;
        color: #fff;
      `,
      location: css`
        ${text};
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 0 0.6rem 0;

        @media ${theme.breakpoints.portrait} {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
      `,
      contentTitle: css`
        ${text};
        margin: 0;
        font-size: 2rem;

        span {
          display: inline-block;
        }

        @media ${theme.breakpoints.portrait} {
          font-size: 1.4rem;
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
    <main css={styles.container}>
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
      <div css={styles.inner}>
        <div css={styles.innerCol1}>
          <h1 css={styles.title}>
            <img css={styles.titleImage} src="/images/title.svg" alt="劈ヶ原衛星第二高校" />
          </h1>
          <div css={styles.content1}>
            <h2 css={styles.contentTitle}>
              <span>劈ヶ原衛星第二高校</span>
              <span>イラスト本</span>
            </h2>
          </div>
          <div css={styles.content2}>
            <p css={styles.location}>COMITIA 144 N55a</p>
            <Members />
          </div>
        </div>
        <div css={styles.innerCol2}>
          <div css={styles.mainImageContainer}>
            <img css={styles.mainImage} src="/images/observer.jpg" alt="Observer" />
          </div>
        </div>
      </div>
    </main>
  )
}
