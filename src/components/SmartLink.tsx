import React from 'react'
import Link from 'next/link'
import { SerializedStyles } from '@emotion/react'

interface SmartLinkProps {
  href: string
  children: React.ReactNode
  css?: SerializedStyles
  className?: string
}

/**
 * 内部リンクと外部リンクを自動判定してLink/aタグを切り替えるコンポーネント
 */
export const SmartLink: React.FC<SmartLinkProps> = ({ href, children, css, className }) => {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" css={css} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} css={css} className={className}>
      {children}
    </Link>
  )
}
