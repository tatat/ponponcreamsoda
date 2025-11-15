'use client'

import { SerializedStyles, css } from '@emotion/react'
import { Breakpoint, useBreakpoint } from '@/hooks/use-breakpoint'
import { arrayWrap } from '@/helpers'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import CSS from 'csstype'

type SizeConfig = {
  width: number
  height: number
}

type SourceConfig = {
  url: string
  type: string
}

type ConfigWithDefault<T> =
  | ({
      default?: undefined
    } & Partial<{
      [K in Breakpoint]: T
    }>)
  | ({
      default: T
    } & {
      [K in Breakpoint]?: T
    })

export type Props = {
  size: ConfigWithDefault<SizeConfig>
  src: ConfigWithDefault<SourceConfig | SourceConfig[]>
  poster?: ConfigWithDefault<string>
  className?: string
  onCanPlay?: () => void
  onLoadStart?: () => void
  videoContainerCss?: SerializedStyles
  videoCss?: SerializedStyles
  overlayCss?: SerializedStyles
  fit?: CSS.Property.ObjectFit
  children?: React.ReactNode
}

const styles = {
  container: css`
    position: absolute;
    width: 100%;
    height: 100%;
  `,
  videoContainer: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
  `,
  video: css`
    width: 100%;
    height: 100%;
  `,
  overlay: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  `,
}

export default function BackgroundVideo({
  size,
  src,
  poster,
  className,
  onCanPlay,
  onLoadStart,
  videoContainerCss,
  videoCss,
  overlayCss,
  fit = 'cover',
  children,
}: Props): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const params = useBreakpoint((breakpoint) => {
    if (breakpoint) {
      const getFrom = <T,>(p: ConfigWithDefault<T>): T => (p[breakpoint] ?? p['default']) as T

      return {
        src: arrayWrap(getFrom(src)),
        size: getFrom(size),
        poster: poster ? getFrom(poster) : undefined,
        breakpoint,
      }
    }

    return {
      src: [],
      size: {
        width: 0,
        height: 0,
      },
      poster: undefined,
      breakpoint,
    }
  })

  // メモ化されたイベントハンドラー
  const handleLoadStart = useCallback(() => {
    onLoadStart?.()
  }, [onLoadStart])

  const handleCanPlay = useCallback(() => {
    onCanPlay?.()
  }, [onCanPlay])

  // src の変更を検知するためのメモ化
  const srcUrls = useMemo(() => {
    return params.src.map((config) => config.url).join(',')
  }, [params.src])

  const srcLength = useMemo(() => params.src.length, [params.src])

  useEffect(() => {
    const video = videoRef.current

    if (!video || srcLength === 0) {
      return
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)

    // src が変更された時のみ load と play を実行
    video.load()
    video.play().catch((error) => {
      console.error('Video play failed:', error)
    })

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [srcUrls, srcLength, handleLoadStart, handleCanPlay])

  // 動的スタイルのメモ化
  const videoStyles = useMemo(
    () =>
      css(
        styles.video,
        {
          objectFit: fit,
          aspectRatio: `${params.size.width} / ${params.size.height}`,
        },
        videoCss,
      ),
    [fit, params.size.width, params.size.height, videoCss],
  )

  const videoContainerStyles = useMemo(() => css(styles.videoContainer, videoContainerCss), [videoContainerCss])

  const overlayStyles = useMemo(() => css(styles.overlay, overlayCss), [overlayCss])

  return (
    <div css={styles.container} className={className}>
      <div css={videoContainerStyles}>
        <video
          ref={videoRef}
          css={videoStyles}
          width={params.size.width}
          height={params.size.height}
          poster={params.poster}
          muted={true}
          loop={true}
          playsInline={true}
        >
          {params.src.map((config) => (
            <source key={config.url} src={config.url} type={config.type} />
          ))}
        </video>
      </div>
      {(children || overlayCss) && <div css={overlayStyles}>{children}</div>}
    </div>
  )
}
