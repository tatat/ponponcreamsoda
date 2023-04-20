/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { Breakpoint, useBreakpoint } from '@/hooks/use-breakpoint'
import { arrayWrap } from '@/helpers'
import { useEffect, useMemo, useRef } from 'react'

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
  fixed?: boolean | {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  className?: string;
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

export default function BackgroundVideo({ size, src, className, fixed }: Props): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const params = useBreakpoint((breakpoint) => {
    if (breakpoint) {
      const getFrom = <T, >(p: ConfigWithDefault<T>): T => (p[breakpoint] ?? p['default']) as T

      return {
        src: arrayWrap(getFrom(src)),
        size: getFrom(size),
        breakpoint,
      }
    }

    return {
      src: [],
      size: {
        width: 0,
        height: 0,
      },
      breakpoint,
    }
  })

  useEffect(() => {
    (async () => {
      const video = videoRef.current

      if (!video) {
        return
      }

      if (params.src.length === 0) {
        return
      }

      video.load()

      await video.play()
    })()
  }, [params])

  const fixedStyle = useMemo(() => {
    if (fixed === true) {
      return {
        position: 'fixed',
      } as const
    }

    if (!fixed) {
      return {}
    }

    return {
      position: 'fixed',
      top: fixed.top ?? 'auto',
      right: fixed.right ?? 'auto',
      bottom: fixed.bottom ?? 'auto',
      left: fixed.left ?? 'auto',
    } as const
  }, [fixed])

  return (
    <div css={styles.container} className={className}>
      <div css={styles.videoContainer} style={fixedStyle}>
        <video
          ref={videoRef}
          css={styles.video}
          width={params.size.width}
          height={params.size.height}
          muted={true}
          loop={true}
        >
          {params.src.map((config) => (
            <source key={config.url} src={config.url} type={config.type} />
          ))}
        </video>
      </div>
    </div>
  )
}
