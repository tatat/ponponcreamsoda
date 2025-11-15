'use client'

import { css, keyframes, useTheme } from '@emotion/react'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import Menu from '@/components/Menu'
import { itemList } from '@/item-list'
import type { ItemBook, ItemSticker, ItemOther, AvailabilityState } from '@/item-list-type'

const scanlineAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`

const chromaticAberrationAnimation = keyframes`
  0% {
    filter: url(#chromatic-shift-1);
  }
  0.78125% {
    filter: url(#chromatic-shift-2);
  }
  1.5625% {
    filter: url(#lines-chromatic);
  }
  2.34375% {
    filter: url(#chromatic-shift-1);
  }
  3.125% {
    filter: url(#chromatic-normal);
  }
  50% {
    filter: url(#chromatic-shift-1);
  }
  50.78125% {
    filter: url(#chromatic-shift-2);
  }
  51.5625% {
    filter: url(#lines-chromatic);
  }
  52.34375% {
    filter: url(#chromatic-shift-1);
  }
  52.725% {
    filter: url(#chromatic-shift-1);
  }
  53.50625% {
    filter: url(#chromatic-shift-3);
  }
  54.2875% {
    filter: url(#lines-chromatic);
  }
  55.06875% {
    filter: url(#chromatic-shift-1);
  }
  56.25%,
  100% {
    filter: url(#chromatic-normal);
  }
`

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
        font-size: 3rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        text-shadow: 1px 1px 2px rgba(139, 115, 85, 0.1);
        letter-spacing: 0.1em;

        @media ${theme.breakpoints.compact} {
          font-size: 2rem;
        }
      `,
      subtitle: css`
        ${theme.styles.text};
        color: #a68b5b;
        font-size: 1.2rem;
        margin: 0;
        font-weight: 300;
        letter-spacing: 0.05em;

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
        font-size: 2rem;
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

        @media ${theme.breakpoints.compact} {
          font-size: 1.5rem;
        }
      `,
      itemGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 600px;
        }
      `,
      featuredGrid: css`
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        justify-content: center;

        > * {
          flex: 1 1 450px;
          max-width: 600px;
        }

        @media ${theme.breakpoints.compact} {
          gap: 1.5rem;
          max-width: 600px;

          > * {
            flex: 1 1 100%;
            max-width: 100%;
          }
        }
      `,
      stickerGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        max-width: 800px;
        margin: 0 auto;

        @media ${theme.breakpoints.compact} {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      `,
      itemCard: css`
        background: #f1ebe6;
        border: 2px solid rgba(212, 165, 116, 0.3);
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
        }
      `,
      stickerCard: css`
        background: #f1ebe6;
        border: 2px solid rgba(212, 165, 116, 0.3);
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
        }
      `,
      stickerInfo: css`
        padding: 0.75rem;
        text-align: center;
      `,
      stickerPrice: css`
        ${theme.styles.text};
        font-size: 0.9rem;
        font-weight: 600;
        color: #e67e22;
        margin: 0;
      `,
      itemImageWrapper: css`
        height: 360px;
        background: rgba(236, 240, 241, 0.05);
        padding: 0.75rem 0.75rem 0 0.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        @media ${theme.breakpoints.compact} {
          height: 280px;
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      featuredImageWrapper: css`
        height: 480px;
        background: rgba(236, 240, 241, 0.05);
        padding: 0.75rem 0.75rem 0 0.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        @media ${theme.breakpoints.compact} {
          height: 360px;
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      itemImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      featuredImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      stickerImageWrapper: css`
        height: 200px;
        background: rgba(236, 240, 241, 0.1);
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        @media ${theme.breakpoints.compact} {
          height: 160px;
          padding: 0.5rem;
        }
      `,
      stickerImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      itemInfo: css`
        padding: 0.75rem;

        @media ${theme.breakpoints.compact} {
          padding: 0.5rem;
        }
      `,
      itemName: css`
        ${theme.styles.text};
        font-size: 1rem;
        font-weight: 700;
        color: #8b7355;
        margin: 0.5rem 0 0.5rem 0;
        line-height: 1.2;

        @media ${theme.breakpoints.compact} {
          font-size: 0.9rem;
          margin: 0.4rem 0 0.4rem 0;
        }
      `,
      itemTypeAndPrice: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 0.5rem 0;
      `,
      itemType: css`
        ${theme.styles.text};
        font-size: 0.7rem;
        color: #a68b5b;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
      `,
      itemPrice: css`
        ${theme.styles.text};
        font-size: 0.9rem;
        font-weight: 600;
        color: #e67e22;
        margin: 0;
      `,
      availabilitySection: css`
        margin-top: 0.5rem;
      `,
      availabilityTitle: css`
        ${theme.styles.text};
        font-size: 0.8rem;
        font-weight: 600;
        color: #a68b5b;
        margin: 0 0 0.3rem 0;
      `,
      availabilityList: css`
        list-style: none;
        padding: 0;
        margin: 0;
      `,
      availabilityItem: css`
        ${theme.styles.text};
        font-size: 0.7rem;
        margin: 0.15rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #a68b5b;
      `,
      availabilityStatus: css`
        padding: 0.15rem 0.5rem;
        border-radius: 2px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        min-width: 60px;
        text-align: center;
        display: inline-block;
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
      otherItem: css`
        background: #f1ebe6;
        border: 2px solid rgba(212, 165, 116, 0.3);
        border-radius: 0;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
        }

        @media ${theme.breakpoints.compact} {
          padding: 1rem;
        }
      `,
      otherItemName: css`
        ${theme.styles.text};
        font-size: 1.2rem;
        font-weight: 600;
        color: #8b7355;
        margin: 0;

        @media ${theme.breakpoints.compact} {
          font-size: 1rem;
        }
      `,
      websiteLink: css`
        text-decoration: none;
        color: inherit;
        display: block;

        &:hover {
          text-decoration: underline;
        }
      `,
      availabilityLink: css`
        text-decoration: none;
        color: inherit;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        &:hover {
          text-decoration: underline;
        }
      `,
      groupSetCard: css`
        background: #f1ebe6;
        border: 2px solid #d4a574;
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
        }
      `,
      setBadge: css`
        position: absolute;
        top: 0;
        right: 0;
        background: #e67e22;
        color: white;
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        z-index: 1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        @media ${theme.breakpoints.compact} {
          font-size: 0.7rem;
          padding: 0.3rem 0.6rem;
        }
      `,
    }),
    [theme, enableAnimation],
  )
}

const getAvailabilityStatusStyle = (status: AvailabilityState) => {
  switch (status) {
    case 'available':
      return css`
        background-color: #a8d5a8;
        color: #2d5a2d;
      `
    case 'unavailable':
      return css`
        background-color: #f5b7b1;
        color: #8b2635;
      `
    case 'preparing':
      return css`
        background-color: #fdeaa7;
        color: #8b6914;
      `
    default:
      return css`
        background-color: #d5d5d5;
        color: #5a5a5a;
      `
  }
}

const getAvailabilityStatusText = (status: AvailabilityState) => {
  switch (status) {
    case 'available':
      return '販売中'
    case 'unavailable':
      return '販売終了'
    case 'preparing':
      return '準備中'
    case 'unknown':
      return '不明'
    case 'notApplicable':
      return '対象外'
    default:
      return status
  }
}

const ItemInfo = ({
  title,
  itemType,
  colorType,
  price,
  availability,
  links,
}: {
  title: string
  itemType: string
  colorType?: string
  price: string
  availability: {
    venue: AvailabilityState
    onlinePhysical?: AvailabilityState
    onlineDigital?: AvailabilityState
  }
  links?: {
    onlinePhysical?: string[]
    onlineDigital?: string[]
  }
}) => {
  const styles = useStyles()

  const displayItemType = colorType ? `${itemType}・${colorType}` : itemType

  return (
    <div css={styles.itemInfo}>
      <h3 css={styles.itemName}>{title}</h3>
      <div css={styles.itemTypeAndPrice}>
        <p css={styles.itemType}>{displayItemType}</p>
        <p css={styles.itemPrice}>{price}</p>
      </div>
      <div css={styles.availabilitySection}>
        <h4 css={styles.availabilityTitle}>販売状況</h4>
        <ul css={styles.availabilityList}>
          <li css={styles.availabilityItem}>
            <span>会場販売</span>
            <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.venue)]}>
              {getAvailabilityStatusText(availability.venue)}
            </span>
          </li>
          {availability.onlinePhysical && (
            <li css={styles.availabilityItem}>
              {links?.onlinePhysical && links.onlinePhysical.length > 0 ? (
                <a
                  href={links.onlinePhysical[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.availabilityLink}
                >
                  <span>オンライン（物理）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlinePhysical)]}>
                    {getAvailabilityStatusText(availability.onlinePhysical)}
                  </span>
                </a>
              ) : (
                <>
                  <span>オンライン（物理）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlinePhysical)]}>
                    {getAvailabilityStatusText(availability.onlinePhysical)}
                  </span>
                </>
              )}
            </li>
          )}
          {availability.onlineDigital && (
            <li css={styles.availabilityItem}>
              {links?.onlineDigital && links.onlineDigital.length > 0 ? (
                <a
                  href={links.onlineDigital[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.availabilityLink}
                >
                  <span>オンライン（デジタル）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlineDigital)]}>
                    {getAvailabilityStatusText(availability.onlineDigital)}
                  </span>
                </a>
              ) : (
                <>
                  <span>オンライン（デジタル）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlineDigital)]}>
                    {getAvailabilityStatusText(availability.onlineDigital)}
                  </span>
                </>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const BookItem = ({ item, isFeatured = false }: { item: ItemBook; isFeatured?: boolean }) => {
  const styles = useStyles()

  const imageElement = (
    <div
      css={isFeatured ? styles.featuredImageWrapper : styles.itemImageWrapper}
      data-testid={isFeatured ? 'featured-image-wrapper' : 'image-wrapper'}
    >
      <img src={item.imageUrl} alt={item.name} css={isFeatured ? styles.featuredImage : styles.itemImage} />
    </div>
  )

  return (
    <div
      css={item.isSet ? styles.groupSetCard : styles.itemCard}
      data-testid={isFeatured ? 'featured-book-item' : 'book-item'}
    >
      {item.isSet && <div css={styles.setBadge}>セット</div>}
      {item.links?.website ? (
        <Link href={item.links.website} css={styles.websiteLink}>
          {imageElement}
        </Link>
      ) : (
        imageElement
      )}
      <ItemInfo
        title={item.name}
        itemType={item.bookType === 'manga' ? 'マンガ' : 'イラスト'}
        colorType={
          item.colorType === 'fullColor' ? 'フルカラー' : item.colorType === 'monochrome' ? 'モノクロ' : undefined
        }
        price={item.price}
        availability={item.availability}
        links={item.links}
      />
    </div>
  )
}

const StickerItem = ({ item }: { item: ItemSticker }) => {
  const styles = useStyles()

  return (
    <div css={styles.stickerCard}>
      <div css={styles.stickerImageWrapper}>
        <img src={item.imageUrl} alt="ステッカー" css={styles.stickerImage} />
      </div>
      <div css={styles.stickerInfo}>
        <p css={styles.stickerPrice}>{item.price}</p>
      </div>
    </div>
  )
}

const OtherItem = ({ item }: { item: ItemOther }) => {
  const styles = useStyles()

  return (
    <div css={styles.otherItem}>
      <h3 css={styles.otherItemName}>{item.name}</h3>
    </div>
  )
}

export default function ItemListContent() {
  const [enableAnimation, setEnableAnimation] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    // Enable animation for all browsers except Safari
    // Safari: CSS animation with filter: url(#id) is not supported
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    setEnableAnimation(!isSafari)
  }, [])

  const styles = useStyles(enableAnimation)

  const handleDownloadImage = async () => {
    const element = document.body
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: window.devicePixelRatio,
      width: 1400,
      windowWidth: 1400,
    })

    const link = document.createElement('a')
    link.download = `item-list-${new Date().toISOString().split('T')[0]}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
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
      <main css={styles.container}>
        <Menu color="#8b7355" secondaryColor="#a68b5b" />

        <header css={styles.header}>
          <h1 css={styles.title}>お品書き</h1>
          <p css={styles.subtitle}>Pon Pon Creamsoda アイテム一覧</p>
          <button data-html2canvas-ignore css={styles.downloadButton} onClick={handleDownloadImage}>
            画像としてダウンロード
          </button>
        </header>

        {/* New Releases */}
        {itemList.newReleases.map((category, categoryIndex) => (
          <section key={categoryIndex} css={styles.section}>
            <div css={styles.sectionTitleWrapper}>
              <h2 css={styles.sectionTitle}>新刊</h2>
            </div>
            <div css={styles.featuredGrid}>
              {category.items.map((item, itemIndex) => {
                if (item.itemType === 'book') {
                  return <BookItem key={`item-${itemIndex}`} item={item} isFeatured={true} />
                }
                return null
              })}
            </div>
          </section>
        ))}

        {/* Back Catalog */}
        {itemList.backCatalog.map((category, categoryIndex) => (
          <section key={categoryIndex} css={styles.section}>
            <div css={styles.sectionTitleWrapper}>
              <h2 css={styles.sectionTitle}>既刊</h2>
            </div>
            <div css={styles.itemGrid}>
              {category.items.toReversed().map((item, itemIndex) => {
                if (item.itemType === 'book') {
                  return <BookItem key={itemIndex} item={item} />
                }
                return null
              })}
            </div>
          </section>
        ))}

        {/* Stickers */}
        {itemList.stickers.map((category, categoryIndex) => (
          <section key={categoryIndex} css={styles.section}>
            <div css={styles.sectionTitleWrapper}>
              <h2 css={styles.sectionTitle}>ステッカー</h2>
            </div>
            <div css={styles.stickerGrid}>
              {category.items.map((item, itemIndex) => {
                if (item.itemType === 'sticker') {
                  return <StickerItem key={itemIndex} item={item} />
                }
                return null
              })}
            </div>
          </section>
        ))}

        {/* Others */}
        {itemList.others.map((category, categoryIndex) => (
          <section key={categoryIndex} css={styles.section}>
            <div css={styles.sectionTitleWrapper}>
              <h2 css={styles.sectionTitle}>その他</h2>
            </div>
            <div css={styles.otherItemsList}>
              {category.items.map((item, itemIndex) => {
                if (item.itemType === 'other') {
                  return <OtherItem key={itemIndex} item={item} />
                }
                return null
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
