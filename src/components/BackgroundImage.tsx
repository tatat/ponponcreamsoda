'use client'

import { css } from '@emotion/react'
import { Breakpoint, useBreakpoint } from '@/hooks/use-breakpoint'

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
  src: ConfigWithDefault<string>;
  className?: string;
}

export default function BackgroundImage({ src, className }: Props): React.ReactElement {
  const params = useBreakpoint((breakpoint) => {
    if (breakpoint) {
      const getFrom = <T, >(p: ConfigWithDefault<T>): T => (p[breakpoint] ?? p['default']) as T
      const url = getFrom(src)

      return {
        src: url ? `url(${url})` : 'none',
        breakpoint,
      }
    }

    return {
      src: 'none',
      breakpoint,
    }
  })

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: ${params.src};
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      `}
      className={className}
    />
  )
}
