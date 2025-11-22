'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { AiOutlinePrinter } from 'react-icons/ai'
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
      logoImage: css`
        width: 100%;
        max-width: 800px;
        height: auto;
        margin: 0 auto 0.75rem;
        display: block;

        .print-mode & {
          max-width: 1200px;
          margin-bottom: 1.125rem;
        }

        @media ${theme.breakpoints.compact} {
          max-width: 400px;
        }
      `,
      subtitle: css`
        ${theme.styles.text};
        color: #e67e22;
        font-size: 1.5rem;
        margin: 0 0 1.5rem 0;
        font-weight: 600;
        letter-spacing: 0.1em;

        .print-mode & {
          font-size: 3rem;
        }

        @media ${theme.breakpoints.compact} {
          font-size: 1.2rem;
        }
      `,
      downloadButton: css`
        ${theme.styles.text};
        background: #d4a574;
        color: white;
        border: none;
        padding: 0 1.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.05em;
        position: fixed;
        top: 0;
        right: 110px;
        height: 39px;
        z-index: 1000;

        @media ${theme.breakpoints.compact} {
          position: static;
          margin: 0 auto;
          display: block;
          height: auto;
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem;
        }
      `,
      printModeToggle: css`
        position: fixed;
        top: 1rem;
        left: 1rem;
        background: rgba(241, 235, 230, 0.9);
        color: #8b7355;
        border: none;
        padding: 0.5rem;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 4px;
        display: none;
        z-index: 1000;
        line-height: 1;

        .print-mode & {
          background: rgba(230, 126, 34, 0.8);
          color: white;
        }

        @media ${theme.breakpoints.wide} {
          display: flex;
          align-items: center;
          justify-content: center;
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
          font-size: 5.1rem;
        }

        .print-mode &::after {
          left: calc(50% - 60px);
          width: 120px;
          height: 4px;
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

    // Remember the original print mode state
    const wasPrintModeOn = printMode

    // Auto-apply print-mode class for download (only if not already on)
    if (!wasPrintModeOn) {
      element.classList.add('print-mode')
    }

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
      // Only remove print-mode if it wasn't on before download
      if (!wasPrintModeOn) {
        element.classList.remove('print-mode')
      }
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
          <img src="/images/logo-kana-brown.png" alt="Pon Pon Creamsoda" css={styles.logoImage} />
          <p css={styles.subtitle}>〜お品書き〜</p>
          <button data-html2canvas-ignore css={styles.downloadButton} onClick={handleDownloadImage}>
            画像としてダウンロード
          </button>
        </header>

        <button
          data-html2canvas-ignore
          css={styles.printModeToggle}
          onClick={handleTogglePrintMode}
          title={printMode ? '印刷モード: ON' : '印刷モード: OFF'}
        >
          <AiOutlinePrinter />
        </button>

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
