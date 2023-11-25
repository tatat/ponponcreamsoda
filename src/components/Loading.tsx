'use client'

import { css, keyframes } from '@emotion/react'

export type Props = {
  visible: boolean;
  className?: string;
}

const animation = keyframes`
  0% {
    left: -50%;
  }
  100% {
    left: 100%;
  }
`

const styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 3px;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
  `,
  inner: css`
    position: absolute;
    height: 100%;
    width: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    animation: ${animation} 3s linear infinite;
  `,
}

export default function Loading({ className, visible }: Props): React.ReactElement {
  return (
    <div
      css={styles.container}
      className={className}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div css={styles.inner} />
    </div>
  )
}