'use client'

import { css, useTheme } from '@emotion/react'
import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { useMenu } from '@/hooks/use-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { boothUrl } from '@/constants'

const useMenuItemAnimations = (count: number, delay: number) => {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, x) => delay * x).map((x, i, self) => ({
        initial: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
          transition: {
            delay: x,
            duration: 0.1,
            ease: 'easeIn',
          },
        },
        exit: {
          opacity: 0,
          transition: {
            delay: self[self.length - 1 - i],
            duration: 0.1,
            ease: 'easeIn',
          },
        },
      })),
    [count, delay],
  )
}

export type Props = {
  className?: string
  color?: string
  secondaryColor?: string
}

export default function Menu({ className, color = '#333333', secondaryColor = '#bbbbbb' }: Props): React.ReactElement {
  const theme = useTheme()
  const pathname = usePathname()

  const { opened, setOpened, containerRef } = useMenu<HTMLDivElement>()

  const toggleMenu = useCallback(() => {
    setOpened((_opened) => !_opened)
  }, [setOpened])

  const styles = useMemo(
    () => ({
      container: css`
        position: fixed;
        top: 0;
        right: 5px;
        box-sizing: border-box;
        z-index: 99;
      `,
      main: css`
        background-color: #ffffff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        width: 100px;
        height: 39px;
        display: flex;
        align-items: center;
        justify-content: center;
      `,
      mainInner: css`
        position: relative;
        top: 1px;
        display: block;
        width: 79.43px;
        height: 20.96px;
        border-style: none;
        background-color: transparent;
        padding: 0;
        cursor: pointer;
        box-sizing: border-box;
        transition: padding 0.1s linear;

        &:active {
          padding: 1px 2px 0 2px;
        }

        &::before {
          display: block;
          content: '';
          border-top: 2px dashed ${color};
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
      list: css`
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        gap: 2px;
        width: 322px;

        li {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 160px;
          height: 160px;
        }

        li > a,
        li > span {
          ${theme.styles.textMenu};
          font-weight: 500;
          font-style: italic;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          text-decoration-line: none;
          color: ${secondaryColor};
          background-color: #ffffff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          transition:
            color 0.1s linear,
            text-shadow 0.1s linear,
            width 0.1s linear,
            height 0.1s linear;
          box-sizing: border-box;
          padding: 0.4rem 0.8rem;
        }

        li > span {
          background-color: rgba(255, 255, 255, 0.6);
        }

        li > a:hover {
          color: ${color};
          text-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
          width: 96%;
          height: 96%;
        }
      `,
    }),
    [color, secondaryColor, theme],
  )

  // メニューアイテムの定義
  const menuItems = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/gallery/', label: 'Gallery' },
      { href: '/item-list/', label: 'Item List' },
    ],
    [],
  )

  // 現在のページを除外したメニューアイテム
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 正確なパス比較のため、末尾のスラッシュを統一
      const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
      const normalizedHref = item.href === '/' ? '/' : item.href.replace(/\/$/, '')
      return normalizedPathname !== normalizedHref
    })
  }, [menuItems, pathname])

  // 外部リンク
  const externalLinks = useMemo(
    () => [
      { href: boothUrl, label: 'BOOTH' },
      { href: 'https://www.youtube.com/@ponponcreamsoda', label: 'YouTube' },
      { href: 'https://x.com/CreamsodaPon', label: 'X' },
    ],
    [],
  )

  // 総アイテム数を偶数にするための計算
  const contentItems = filteredMenuItems.length + externalLinks.length
  const emptySpaces = contentItems % 2 === 0 ? 2 : 1 // 偶数にするための空スペース数
  const totalItems = contentItems + emptySpaces
  const menuItemAnimations = useMenuItemAnimations(totalItems, 0.05)
  const menuItemAnimationsCopy = [...menuItemAnimations]

  return (
    <div ref={containerRef} css={styles.container} className={className}>
      <div css={styles.main}>
        <button css={styles.mainInner} onClick={toggleMenu}>
          <Logo id="menu-logo" css={styles.logo} colors={{ primary: color }} />
        </button>
      </div>
      <AnimatePresence>
        {opened && (
          <ul css={styles.list}>
            {/* 現在のページを除外した内部リンク */}
            {filteredMenuItems.map((item) => (
              <motion.li key={item.href} {...menuItemAnimationsCopy.shift()}>
                <Link onClick={toggleMenu} href={item.href}>
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            ))}
            {/* 外部リンク */}
            {externalLinks.map((link) => (
              <motion.li key={link.href} {...menuItemAnimationsCopy.shift()}>
                <a onClick={toggleMenu} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span>
                </a>
              </motion.li>
            ))}
            {/* 空のスペース（偶数調整用） */}
            {Array.from({ length: emptySpaces }, (_, index) => (
              <motion.li key={`empty-${index}`} {...menuItemAnimationsCopy.shift()}>
                <span />
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </div>
  )
}
