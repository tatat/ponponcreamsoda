/** @jsxImportSource @emotion/react */
'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'

export type Props = {
  className?: string;
}

export default function Schedule({ className }: Props): React.ReactElement {
  const theme = useTheme()

  const styles = useMemo(() => ({
    container: css`
      ${theme.styles.text};
      font-size: 1.2rem;
      font-weight: bold;

      p {
        margin: 0 0 0.6rem 0;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      @media ${theme.breakpoints.portrait} {
        font-size: 1rem;

        p {
          margin-bottom: 0.5rem;
        }
      }
    `,
  }), [theme])

  return (
    <div css={styles.container} className={className}>
      <p>COMITIA 144 N55a</p>
    </div>
  )
}
