'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import Menu from '@/components/Menu'
import { itemList } from '@/item-list'
import { isGroupItem } from '@/item-list-type'
import { scanlineAnimation, chromaticAberrationAnimation } from './animations'
import { groupItemsByType } from './utils'
import { BookItem } from './components/BookItem'
import { StickerItem } from './components/StickerItem'
import { OtherItem } from './components/OtherItem'
import { GroupItemComponent } from './components/GroupItem'

const useStyles = (enableAnimation: boolean = false) => {
  const theme = useTheme()

  return useMemo(
    () => ({
      container: css`
        position: relative;
        background: #efe7e1;
        min-height: 100vh;
        min-height: 100lvh;
        padding: 2rem;
        box-sizing: border-box;
        transform: translateZ(0);
        ${enableAnimation &&
        css`
          animation: ${chromaticAberrationAnimation} 16s step-end infinite;
        `}

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 115, 85, 0.08) 2px,
            rgba(139, 115, 85, 0.08) 4px
          );
          pointer-events: none;
          z-index: 1;
          transform: translateZ(0);
          animation: ${scanlineAnimation} 1s linear infinite;
        }

        @media ${theme.breakpoints.compact} {
          padding: 1rem;
        }
      `,
      header: css`
        text-align: center;
        margin-bottom: 3rem;
        padding-top: 2rem;

        @media ${theme.breakpoints.compact} {
          margin-bottom: 2rem;
          padding-top: 1rem;
        }
      `,
      title: css`
        ${theme.styles.text};
        color: #8b7355;
        font-size: 3.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        text-shadow: 1px 1px 2px rgba(139, 115, 85, 0.1);
        letter-spacing: 0.1em;

        .print-mode & {
          @media ${theme.breakpoints.wide} {
            font-size: 5.25rem;
          }
        }

        @media ${theme.breakpoints.compact} {
          font-size: 2.5rem;
        }
      `,
      subtitle: css`
        ${theme.styles.text};
        color: #a68b5b;
        font-size: 1.2rem;
        margin: 0;
        font-weight: 300;
        letter-spacing: 0.05em;

        .print-mode & {
          @media ${theme.breakpoints.wide} {
            font-size: 1.8rem;
          }
        }

        @media ${theme.breakpoints.compact} {
          font-size: 1rem;
        }
      `,
      downloadButton: css`
        ${theme.styles.text};
        background: linear-gradient(135deg, #8b7355, #a68b5b);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        letter-spacing: 0.05em;
        margin: 1.5rem auto 0;
        display: block;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(139, 115, 85, 0.3);
        }

        @media ${theme.breakpoints.compact} {
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem;
        }
      `,
      printModeToggle: css`
        ${theme.styles.text};
        background: linear-gradient(135deg, #8b7355, #a68b5b);
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        letter-spacing: 0.05em;
        margin: 1rem auto 0.5rem;
        display: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(139, 115, 85, 0.3);
        }

        @media ${theme.breakpoints.wide} {
          display: block;
        }
      `,
      section: css`
        margin-bottom: 4rem;

        @media ${theme.breakpoints.compact} {
          margin-bottom: 3rem;
        }
      `,
      sectionTitleWrapper: css`
        text-align: center;
        margin-bottom: 2rem;

        @media ${theme.breakpoints.compact} {
          margin-bottom: 1.5rem;
        }
      `,
      sectionTitle: css`
        ${theme.styles.text};
        color: #8b7355;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 1px 1px 2px rgba(139, 115, 85, 0.1);
        letter-spacing: 0.08em;
        display: inline-block;
        position: relative;
        padding-bottom: 0.5rem;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: calc(50% - 30px);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4a574, transparent);
        }

        .print-mode & {
          @media ${theme.breakpoints.wide} {
            font-size: 3.75rem;
          }
        }

        @media ${theme.breakpoints.compact} {
          font-size: 2rem;
        }
      `,
      itemGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 600px;
        }
      `,
      featuredGridWrapper: css`
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @media ${theme.breakpoints.compact} {
          gap: 1.5rem;
        }
      `,
      featuredGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(586px, 1fr));
        gap: 1rem;
        width: 1200px;
        margin: 0 auto;

        @media ${theme.breakpoints.wide} {
          width: 1790px;
        }

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 600px;
        }
      `,
      featuredGroupWrapper: css`
        grid-column: 1 / -1;
        width: 100%;

        @media ${theme.breakpoints.compact} {
          max-width: 100%;
        }
      `,
      stickerGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;

        @media ${theme.breakpoints.wide} {
          max-width: 1790px;
        }

        @media ${theme.breakpoints.compact} {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 600px;
        }
      `,
      otherItemsList: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
        }
      `,
    }),
    [theme, enableAnimation],
  )
}

export default function ItemListContent() {
  const [enableAnimation, setEnableAnimation] = useState(false)
  const [printMode, setPrintMode] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    // Enable animation for all browsers except Safari
    // Safari: CSS animation with filter: url(#id) is not supported
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    setEnableAnimation(!isSafari)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('item-list-print-mode')
    if (stored !== null) {
      setPrintMode(stored === 'true')
    }
  }, [])

  const handleTogglePrintMode = () => {
    const newValue = !printMode
    setPrintMode(newValue)
    localStorage.setItem('item-list-print-mode', String(newValue))
  }

  const styles = useStyles(enableAnimation)

  const handleDownloadImage = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const element = document.querySelector('main')
    if (!element) return

    // Auto-apply print-mode class for download
    element.classList.add('print-mode')

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: Math.min(window.devicePixelRatio, 2),
        width: 1864,
        windowWidth: 1864,
      })

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) return

      const fileName = `item-list-${new Date().toISOString().split('T')[0]}.png`

      // Use Share API on mobile devices if available (iOS/Android)
      if (isMobile && navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'お品書き',
            })
            return
          } catch (error) {
            if (error instanceof Error) {
              if (error.name === 'AbortError') {
                // User cancelled the share dialog - don't fall through to download
                return
              }
              // Log other errors (e.g., NotAllowedError from user gesture timeout)
              console.warn('Share API failed:', error.name, error.message)
            }
            // Fall through to traditional download
          }
        }
      }

      // Fallback: Traditional download (desktop and older mobile browsers)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = fileName
      link.href = url
      link.click()

      // Clean up the object URL after download starts
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } finally {
      // Always remove print-mode class after download
      element.classList.remove('print-mode')
    }
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="chromatic-normal">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="lines-chromatic">
            <feOffset in="SourceGraphic" dx="2" dy="1" result="red" />
            <feColorMatrix
              in="red"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset in="SourceGraphic" dx="-2" dy="-1" result="cyan" />
            <feColorMatrix
              in="cyan"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="cyan"
            />
            <feBlend in="red" in2="cyan" mode="screen" result="blend" />
            <feBlend in="blend" in2="SourceGraphic" mode="normal" result="chromatic" />
            <feTurbulence baseFrequency="0 0.5" numOctaves="1" seed="10" result="lines" />
            <feDisplacementMap in="chromatic" in2="lines" scale="3" xChannelSelector="R" yChannelSelector="R" />
          </filter>
          <filter id="chromatic-shift-1">
            <feOffset in="SourceGraphic" dx="1" dy="0.5" result="red" />
            <feColorMatrix
              in="red"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset in="SourceGraphic" dx="-1" dy="-0.5" result="cyan" />
            <feColorMatrix
              in="cyan"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="cyan"
            />
            <feBlend in="red" in2="cyan" mode="screen" result="blend" />
            <feBlend in="blend" in2="SourceGraphic" mode="normal" />
          </filter>
          <filter id="chromatic-shift-2">
            <feOffset in="SourceGraphic" dx="3" dy="1.5" result="red" />
            <feColorMatrix
              in="red"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset in="SourceGraphic" dx="-3" dy="-1.5" result="cyan" />
            <feColorMatrix
              in="cyan"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="cyan"
            />
            <feBlend in="red" in2="cyan" mode="screen" result="blend" />
            <feBlend in="blend" in2="SourceGraphic" mode="normal" result="chromatic" />
            <feTurbulence baseFrequency="0 0.5" numOctaves="1" seed="20" result="lines" />
            <feDisplacementMap in="chromatic" in2="lines" scale="4" xChannelSelector="R" yChannelSelector="R" />
          </filter>
          <filter id="chromatic-shift-3">
            <feOffset in="SourceGraphic" dx="4" dy="2" result="red" />
            <feColorMatrix
              in="red"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feOffset in="SourceGraphic" dx="-4" dy="-2" result="cyan" />
            <feColorMatrix
              in="cyan"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="cyan"
            />
            <feBlend in="red" in2="cyan" mode="screen" result="blend" />
            <feBlend in="blend" in2="SourceGraphic" mode="normal" result="chromatic" />
            <feTurbulence baseFrequency="0 0.5" numOctaves="1" seed="30" result="lines" />
            <feDisplacementMap in="chromatic" in2="lines" scale="5" xChannelSelector="R" yChannelSelector="R" />
          </filter>
        </defs>
      </svg>
      <main css={styles.container} className={printMode ? 'print-mode' : ''}>
        <Menu color="#8b7355" secondaryColor="#a68b5b" />

        <header css={styles.header}>
          <h1 css={styles.title}>お品書き</h1>
          <p css={styles.subtitle}>Pon Pon Creamsoda アイテム一覧</p>
          <button data-html2canvas-ignore css={styles.downloadButton} onClick={handleDownloadImage}>
            画像としてダウンロード
          </button>
          <button data-html2canvas-ignore css={styles.printModeToggle} onClick={handleTogglePrintMode}>
            {printMode ? '印刷モード: ON' : '印刷モード: OFF'}
          </button>
        </header>

        {/* New Releases */}
        <section css={styles.section}>
          <div css={styles.sectionTitleWrapper}>
            <h2 css={styles.sectionTitle}>新刊</h2>
          </div>
          <div css={styles.featuredGridWrapper}>
            {groupItemsByType(itemList.newReleases).map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} css={styles.featuredGrid}>
                {group.map((item, itemIndex) => {
                  if (isGroupItem(item)) {
                    return <GroupItemComponent key={`item-${itemIndex}`} item={item} isFeatured={true} />
                  }
                  if (item.itemType === 'book') {
                    return <BookItem key={`item-${itemIndex}`} item={item} isFeatured={true} />
                  }
                  return null
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Back Catalog */}
        <section css={styles.section}>
          <div css={styles.sectionTitleWrapper}>
            <h2 css={styles.sectionTitle}>既刊</h2>
          </div>
          <div css={styles.itemGrid}>
            {itemList.backCatalog.toReversed().map((item, itemIndex) => {
              if (isGroupItem(item)) {
                // Flatten group items into individual items
                return item.items.map((childItem, childIndex) => {
                  if (childItem.itemType === 'book') {
                    return <BookItem key={`${itemIndex}-${childIndex}`} item={childItem} />
                  }
                  return null
                })
              }
              if (item.itemType === 'book') {
                return <BookItem key={itemIndex} item={item} />
              }
              return null
            })}
          </div>
        </section>

        {/* Stickers */}
        <section css={styles.section}>
          <div css={styles.sectionTitleWrapper}>
            <h2 css={styles.sectionTitle}>ステッカー</h2>
          </div>
          <div css={styles.stickerGrid}>
            {itemList.stickers.map((item, itemIndex) => {
              if (item.itemType === 'sticker') {
                return <StickerItem key={itemIndex} item={item} />
              }
              return null
            })}
          </div>
        </section>

        {/* Others */}
        <section css={styles.section}>
          <div css={styles.sectionTitleWrapper}>
            <h2 css={styles.sectionTitle}>その他</h2>
          </div>
          <div css={styles.otherItemsList}>
            {itemList.others.map((item, itemIndex) => {
              if (item.itemType === 'other') {
                return <OtherItem key={itemIndex} item={item} />
              }
              return null
            })}
          </div>
        </section>
      </main>
    </>
  )
}
