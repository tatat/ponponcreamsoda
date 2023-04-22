/** @jsxImportSource @emotion/react */
'use client'

import { SerializedStyles, css } from '@emotion/react'
import { Breakpoint, useBreakpoint } from '@/hooks/use-breakpoint'
import { arrayWrap } from '@/helpers'
import { useEffect, useRef } from 'react'

type SizeConfig = {
  width: number;
  height: number;
}

type SourceConfig = {
  url: string;
  type: string;
}

type ConfigWithDefault<T> = ({
  default?: undefined;
} & {
  [K in Breakpoint]: T;
}) | ({
  default: T;
} & {
  [K in Breakpoint]?: T;
})

export type Props = {
  size: ConfigWithDefault<SizeConfig>;
  src: ConfigWithDefault<SourceConfig | SourceConfig[]>;
  poster?: ConfigWithDefault<string>;
  className?: string;
  onCanPlay?: () => void;
  onLoadStart?: () => void;
  videoContainerCss?: SerializedStyles;
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
  `,
  video: css`
    object-fit: cover;
    width: 100%;
    height: 100%;
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
}: Props): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const params = useBreakpoint((breakpoint) => {
    if (breakpoint) {
      const getFrom = <T, >(p: ConfigWithDefault<T>): T => (p[breakpoint] ?? p['default']) as T

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

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (params.src.length === 0) {
      return
    }

    const handleLoadStart = () => onLoadStart?.()
    const handleCanPlay = () => onCanPlay?.()

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.load()

    video.play()
      .catch((error) => {
        console.error(error)
      })

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [
    params,
    onCanPlay,
    onLoadStart,
  ])

  return (
    <div css={styles.container} className={className}>
      <div css={css(styles.videoContainer, videoContainerCss)}>
        <video
          ref={videoRef}
          css={styles.video}
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
    </div>
  )
}
