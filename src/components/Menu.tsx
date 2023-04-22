/** @jsxImportSource @emotion/react */
'use client'

import { css } from '@emotion/react'
import { useMemo } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export type Props = {
  className?: string;
}

export default function Menu({ className }: Props): React.ReactElement {
  const styles = useMemo(() => ({
    container: css`
      position: fixed;
      top: 0;
      right: 0;
      box-sizing: border-box;
      z-index: 99;
      padding: 10px 10px 8px 10px;
      background-color: #ffffff;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    `,
    inner: css`
      position: relative;
      display: block;
      width: 79.43px;
      height: 20.96px;

      &::before {
        display: block;
        content: "";
        border-top: 2px dashed #333333;
        position: absolute;
        top: -7px;
        left: 0;
        width: 100%;
      }
    `,
    logo: css`
      width: 100%;
      height: auto;
    `,
  }), [])

  return (
    <div css={styles.container} className={className}>
      <Link css={styles.inner} href="/">
        <Logo css={styles.logo} colors={{ primary: '#333333' }} />
      </Link>
    </div>
  )
}
