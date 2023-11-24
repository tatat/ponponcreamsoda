/** @jsxImportSource @emotion/react */
'use client'

import { css, useTheme } from '@emotion/react'
import { useCallback, useMemo, useState } from 'react'
import LogoTSSH from '@/components/LogoTSSH'
import BackgroundVideo, { Props as BackgroundVideoProps } from '@/components/BackgroundVideo'
import Info from '@/components/Info'
import Members from '@/components/Members'
import Loading from '@/components/Loading'
import * as layout from '@/components/layout-2'
import { books } from '@/constants'
import Menu from '@/components/Menu'

const themeColor = '#e61773'
const themeSecondaryColor = '#f1efe1'
const themeTertiaryColor = '#261616'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(() => {
    return {
      containerInner: css`
        padding: 2px 0;
      `,
      background: css`
        position: relative;
        aspect-ratio: 4 / 3;
      `,
      background2: css`
        background-color: ${themeSecondaryColor};
        height: 100vh;
        height: 100lvh;
      `,
      backgroundInner2: css`
        position: fixed;
        bottom: auto;
        height: 100vh;
        height: 100lvh;
      `,
      backgroundOverlay2: css`
        position: fixed;
        mix-blend-mode: color-burn;
        background-color: rgba(93, 83, 80, 0.85);
        transform: translate3d(0, 0, 0);
      `,
      loading: css`
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
      `,
      inner1: css`
        min-width: 280px;
      `,
      inner2: css`
        padding: 0;
        background-color: ${themeTertiaryColor};
      `,
      titleImage: css`
        box-sizing: border-box;
        width: 100%;
        height: auto;
        mix-blend-mode: multiply;
      `,
      contentTitle: css`
        color: ${themeSecondaryColor};

        span {
          display: inline-block;
        }
      `,
      content: css`
        color: ${themeSecondaryColor};
      `,
      info: css`
        margin-bottom: 0.6rem;

        @media ${theme.breakpoints.portrait} {
          margin-bottom: 0.5rem;
        }
      `,
    }
  }, [theme])
}

type MainVideoProps = Omit<BackgroundVideoProps, 'size' | 'src' | 'poster'> & {
  width: number;
  height: number;
}

const MainVideo = ({ width, height, ...props }: MainVideoProps) => {
  return (
    <BackgroundVideo
      {...props}
      size={{
        default: {
          width,
          height,
        },
      }}
      src={{
        default: {
          url: '/videos/book03-1920x1080.mp4',
          type: 'video/mp4',
        },
      }}
      poster={{
        default: '/videos/book03-1920x1080.jpg',
      }}
    />
  )
}

export default function Book03Content() {
  const styles = useStyles()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
  }, [])

  const videoWidth = 1920
  const videoHeight = 1080

  return (
    <layout.Container>
      <Loading css={styles.loading} visible={isLoading} />
      <Menu color={themeTertiaryColor} secondaryColor={themeColor} />
      <MainVideo
        width={videoWidth}
        height={videoHeight}
        css={styles.background2}
        videoContainerCss={styles.backgroundInner2}
        overlayCss={styles.backgroundOverlay2}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
      />
      <layout.Inner css={styles.containerInner}>
        <layout.Inner1 css={styles.inner1}>
          <layout.Title>
            <LogoTSSH
              colors={{
                primary: themeSecondaryColor,
                secondary: themeColor,
                tertiary: themeColor,
              }}
              css={styles.titleImage}
            />
          </layout.Title>
          <layout.ContentTitle css={styles.contentTitle}>
            {books.vol03.titleMultiline.map((x, i) => <span key={i}>{x}</span>)}
          </layout.ContentTitle>
          <layout.Content css={styles.content}>
            <Info css={styles.info} />
            <Members />
          </layout.Content>
        </layout.Inner1>
        <layout.Inner2 css={styles.inner2}>
          <MainVideo
            width={videoWidth}
            height={videoHeight}
            css={styles.background}
            onCanPlay={handleCanPlay}
            onLoadStart={handleLoadStart}
            fit='contain'
          />
        </layout.Inner2>
      </layout.Inner>
    </layout.Container>
  )
}
