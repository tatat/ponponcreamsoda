'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'

export type Props = {
  className?: string;
}

export default function Members({ className }: Props): React.ReactElement {
  const theme = useTheme()

  const styles = useMemo(() => ({
    container: css`
      ${theme.styles.text};
      position: relative;

      a {
        color: inherit;
        text-decoration-line: none;
        white-space: nowrap;

        &:hover {
          text-decoration-line: underline;
          text-decoration-thickness: 1px;
        }
      }
    `,
    groupName: css`
      font-size: 1.6rem;
      font-weight: bold;

      @media ${theme.breakpoints.portrait} {
        font-size: 1.3rem;
      }
    `,
    members: css`
      margin: 0;
      padding: 0;
      font-size: 0.9rem;
      display: flex;

      > * {
        display: block;

        &:first-child {
          &::before {
            content: none;
          }
        }

        &::before {
          content: "|";
          margin: 0 0.5em;
        }
      }

      @media ${theme.breakpoints.portrait} {
        font-size: 0.8rem;
      }
    `,
  }), [theme])

  return (
    <div css={styles.container} className={className}>
      <div css={styles.groupName}>Pon Pon Creamsoda</div>
      <ul css={styles.members}>
        <li>
          <a href="https://twitter.com/ryuga11112" target="_blank" rel="noopener noreferrer">
            ryuga.
          </a>
        </li>
        <li>
          <a href="https://twitter.com/__________t_t_" target="_blank" rel="noopener noreferrer">
            tatあt
          </a>
        </li>
        <li>
          <a href="https://twitter.com/dobby_smilaugh" target="_blank" rel="noopener noreferrer">
            Dobby.
          </a>
        </li>
        <li>
          <a href="https://twitter.com/mumemo0827" target="_blank" rel="noopener noreferrer">
            むめも
          </a>
        </li>
      </ul>
    </div>
  )
}