'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { boothUrl } from '@/constants'

export type Props = {
  className?: string
  linkColor?: string
  boothItemId?: string
}

export default function Info({ className, linkColor, boothItemId }: Props): React.ReactElement {
  const theme = useTheme()

  const styles = useMemo(
    () => ({
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

        a {
          color: ${linkColor ?? 'inherit'};
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        @media ${theme.breakpoints.portrait} {
          font-size: 1rem;

          p {
            margin-bottom: 0.5rem;
          }
        }
      `,
    }),
    [theme, linkColor],
  )

  return (
    <div css={styles.container} className={className}>
      <p>COMITIA 152: N-60a</p>
      <p>
        <span>通信販売: </span>
        <a href={`${boothUrl}${boothItemId ? `items/${boothItemId}` : ''}`} target="_blank" rel="noopener noreferrer">
          <span>BOOTH</span>
        </a>
      </p>
    </div>
  )
}
