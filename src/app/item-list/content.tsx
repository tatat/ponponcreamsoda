'use client'

import { css, keyframes, useTheme } from '@emotion/react'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import Menu from '@/components/Menu'
import { itemList } from '@/item-list'
import type { Item, ItemBook, ItemSticker, ItemOther, GroupItem, AvailabilityState } from '@/item-list-type'
import { isGroupItem } from '@/item-list-type'

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
        font-size: 3.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        text-shadow: 1px 1px 2px rgba(139, 115, 85, 0.1);
        letter-spacing: 0.1em;

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

        @media ${theme.breakpoints.compact} {
          font-size: 1.5rem;
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
      itemCard: css`
        background: #f1ebe6;
        border: 2px solid rgba(212, 165, 116, 0.3);
        border-radius: 0;
        overflow: visible;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
          z-index: 3;
        }
      `,
      itemCardNoBorder: css`
        background: #f1ebe6;
        border: none;
        border-radius: 0;
        overflow: visible;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;

        &:hover {
          transform: translateY(-2px);
          z-index: 3;
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
      stickerCardNoBorder: css`
        background: #f1ebe6;
        border: none;
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
        padding: 1rem 1rem 0 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        @media ${theme.breakpoints.compact} {
          height: 280px;
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      featuredImageWrapper: css`
        height: 480px;
        background: rgba(236, 240, 241, 0.05);
        padding: 1rem 1rem 0 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

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
        padding: 1rem 1rem 0 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        @media ${theme.breakpoints.compact} {
          height: 160px;
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      stickerImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      itemInfo: css`
        padding: 1rem;
        overflow: visible;
        position: relative;
        z-index: 10;

        @media ${theme.breakpoints.compact} {
          padding: 0.5rem;
        }
      `,
      itemName: css`
        ${theme.styles.text};
        font-size: 1.1rem;
        font-weight: 700;
        color: #8b7355;
        margin: 0.5rem 0 0.1rem 0;
        line-height: 1.2;

        @media ${theme.breakpoints.compact} {
          font-size: 1rem;
          margin: 0.4rem 0 0.1rem 0;
        }
      `,
      featuredItemName: css`
        ${theme.styles.text};
        font-size: 1.3rem;
        font-weight: 700;
        color: #8b7355;
        margin: 0.5rem 0 0.1rem 0;
        line-height: 1.2;

        @media ${theme.breakpoints.compact} {
          font-size: 1rem;
          margin: 0.4rem 0 0.1rem 0;
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
        position: relative;
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 0.5rem;
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
      availabilityLabelWithTooltip: css`
        ${theme.styles.text};
        font-size: 0.8rem;
        font-weight: 600;
        color: #a68b5b;
        margin: 0;
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        cursor: help;
        flex-shrink: 0;

        &:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
      `,
      availabilityTooltip: css`
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 0.5rem;
        background: #fff;
        border: 2px solid #d4a574;
        border-radius: 4px;
        padding: 0.8rem;
        min-width: 250px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        pointer-events: none;
      `,
      availabilityTagsContainer: css`
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        flex: 1;
        justify-content: flex-end;
      `,
      availabilityTag: css`
        ${theme.styles.text};
        padding: 0.2rem 0.6rem;
        border-radius: 2px;
        font-size: 0.7rem;
        font-weight: 600;
        background-color: #a8d5a8;
        color: #2d5a2d;
        text-decoration: none;
        display: inline-block;
        transition: all 0.2s ease;

        &:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        a& {
          text-decoration: underline;
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
        font-size: 1.3rem;
        font-weight: 600;
        color: #8b7355;
        margin: 0;

        @media ${theme.breakpoints.compact} {
          font-size: 1.1rem;
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
      groupItemContainer: css`
        background: rgba(210, 200, 185, 0.3);
        border: 3px solid #d4a574;
        border-radius: 0;
        padding: 1rem;
        position: relative;
        margin: 0 auto;
        z-index: 2;

        @media ${theme.breakpoints.compact} {
          padding: 0.5rem;
        }
      `,
      groupItemTitle: css`
        font-size: 1.2rem;
        font-weight: 700;
        color: #5a4a3a;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #d4a574;

        @media ${theme.breakpoints.compact} {
          font-size: 1rem;
          margin-bottom: 0.8rem;
        }
      `,
      groupItemsGridFeatured: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

        @media ${theme.breakpoints.wide} {
          grid-template-columns: repeat(3, 1fr);
        }

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      `,
      groupItemsGridNormal: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;

        @media ${theme.breakpoints.compact} {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      `,
      groupInfoCard: css`
        background: #faf7f5;
        border-radius: 0;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        min-height: 200px;
        position: relative;
        z-index: 2;

        @media ${theme.breakpoints.compact} {
          padding: 1.5rem;
          min-height: 150px;
        }
      `,
      groupInfoTitle: css`
        ${theme.styles.text};
        font-size: 1.2rem;
        font-weight: 700;
        color: #5a4a3a;
        text-align: center;
        line-height: 1.6;
        margin: 0;

        @media ${theme.breakpoints.compact} {
          font-size: 1.1rem;
        }
      `,
      groupInfoDescription: css`
        ${theme.styles.text};
        font-size: 0.9rem;
        color: #6a5a4a;
        text-align: center;
        line-height: 1.6;
        width: 100%;

        @media ${theme.breakpoints.compact} {
          font-size: 0.85rem;
        }
      `,
      groupInfoImages: css`
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      `,
      groupInfoImageWrapper: css`
        padding: 1rem;
        background: repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 10px, #d0d0d0 10px, #d0d0d0 20px);
        border-radius: 4px;
      `,
      groupInfoImage: css`
        max-width: 100%;
        max-height: 360px;
        object-fit: contain;
        display: block;

        @media ${theme.breakpoints.compact} {
          max-height: 280px;
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
  isFeatured = false,
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
  isFeatured?: boolean
}) => {
  const styles = useStyles()

  const displayItemType = colorType ? `${itemType}・${colorType}` : itemType

  return (
    <div css={styles.itemInfo}>
      <h3 css={isFeatured ? styles.featuredItemName : styles.itemName}>{title}</h3>
      <div css={styles.itemTypeAndPrice}>
        <p css={styles.itemType}>{displayItemType}</p>
        <p css={styles.itemPrice}>{price}</p>
      </div>
      <div css={styles.availabilitySection}>
        <div css={styles.availabilityLabelWithTooltip}>
          <span>販売状況</span>
          <AiOutlineInfoCircle style={{ transform: 'translateY(1px)' }} />
          <div className="tooltip" css={styles.availabilityTooltip}>
            <ul css={styles.availabilityList}>
              <li css={styles.availabilityItem}>
                <span>イベント会場</span>
                <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.venue)]}>
                  {getAvailabilityStatusText(availability.venue)}
                </span>
              </li>
              {availability.onlinePhysical && (
                <li css={styles.availabilityItem}>
                  <span>通信販売</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlinePhysical)]}>
                    {getAvailabilityStatusText(availability.onlinePhysical)}
                  </span>
                </li>
              )}
              {availability.onlineDigital && (
                <li css={styles.availabilityItem}>
                  <span>デジタル</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(availability.onlineDigital)]}>
                    {getAvailabilityStatusText(availability.onlineDigital)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div css={styles.availabilityTagsContainer}>
          {availability.venue === 'available' && <span css={styles.availabilityTag}>イベント会場</span>}
          {availability.onlinePhysical === 'available' &&
            (links?.onlinePhysical && links.onlinePhysical.length > 0 ? (
              <a href={links.onlinePhysical[0]} target="_blank" rel="noopener noreferrer" css={styles.availabilityTag}>
                通信販売
              </a>
            ) : (
              <span css={styles.availabilityTag}>通信販売</span>
            ))}
          {availability.onlineDigital === 'available' &&
            (links?.onlineDigital && links.onlineDigital.length > 0 ? (
              <a href={links.onlineDigital[0]} target="_blank" rel="noopener noreferrer" css={styles.availabilityTag}>
                デジタル
              </a>
            ) : (
              <span css={styles.availabilityTag}>デジタル</span>
            ))}
        </div>
      </div>
    </div>
  )
}

const BookItem = ({
  item,
  isFeatured = false,
  inGroup = false,
}: {
  item: ItemBook
  isFeatured?: boolean
  inGroup?: boolean
}) => {
  const styles = useStyles()

  const imageElement = (
    <div
      css={isFeatured ? styles.featuredImageWrapper : styles.itemImageWrapper}
      data-testid={isFeatured ? 'featured-image-wrapper' : 'image-wrapper'}
    >
      <img src={item.imageUrl} alt={item.name} css={isFeatured ? styles.featuredImage : styles.itemImage} />
    </div>
  )

  const content = (
    <div
      css={inGroup ? styles.itemCardNoBorder : styles.itemCard}
      data-testid={isFeatured ? 'featured-book-item' : 'book-item'}
    >
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
        isFeatured={isFeatured}
      />
    </div>
  )

  return content
}

const StickerItem = ({ item, inGroup = false }: { item: ItemSticker; inGroup?: boolean }) => {
  const styles = useStyles()

  return (
    <div css={inGroup ? styles.stickerCardNoBorder : styles.stickerCard}>
      <div css={styles.stickerImageWrapper}>
        <img src={item.imageUrl} alt="ステッカー" css={styles.stickerImage} />
      </div>
      <div css={styles.stickerInfo}>
        <p css={styles.stickerPrice}>{item.price}</p>
      </div>
    </div>
  )
}

const GroupItemComponent = ({ item, isFeatured = false }: { item: GroupItem; isFeatured?: boolean }) => {
  const styles = useStyles()
  const theme = useTheme()
  const itemCount = item.items.length

  // Dynamic grid-column based on item count and screen size
  const groupInfoCardStyle = css`
    ${styles.groupInfoCard};

    /* Default (2-column layout): */
    /* 3 items: auto (2nd column, 2nd row) */
    /* 4 items: full width (3rd row) */
    grid-column: ${itemCount === 4 ? '1 / -1' : 'auto'};

    /* Wide (3-column layout): */
    @media ${theme.breakpoints.wide} {
      /* 3 items: full width (2nd row) */
      /* 4 items: columns 2-3 (2nd row) */
      grid-column: ${itemCount === 3 ? '1 / -1' : '2 / 4'};
    }
  `

  const gridStyle = isFeatured ? styles.groupItemsGridFeatured : styles.groupItemsGridNormal

  return (
    <div css={isFeatured ? styles.featuredGroupWrapper : undefined}>
      <div css={styles.groupItemContainer}>
        <div css={gridStyle}>
          {item.items.map((childItem, index) => {
            if (childItem.itemType === 'book') {
              return <BookItem key={`group-item-${index}`} item={childItem} isFeatured={isFeatured} inGroup={true} />
            }
            if (childItem.itemType === 'sticker') {
              return <StickerItem key={`group-item-${index}`} item={childItem} inGroup={true} />
            }
            if (childItem.itemType === 'other') {
              return <OtherItem key={`group-item-${index}`} item={childItem} />
            }
            return null
          })}
          <div css={groupInfoCardStyle}>
            <h3 css={styles.groupInfoTitle}>{item.name}</h3>
            {item.description && <div css={styles.groupInfoDescription}>{item.description}</div>}
            {item.imageUrls && item.imageUrls.length > 0 && (
              <div css={styles.groupInfoImages}>
                {item.imageUrls.map((imageUrl, index) => (
                  <div key={index} css={styles.groupInfoImageWrapper}>
                    <img src={imageUrl} alt={`${item.name} - ${index + 1}`} css={styles.groupInfoImage} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

  // Group items by type (consecutive items of same type are grouped together)
  const groupItemsByType = (items: Item[]) => {
    const groups: Item[][] = []
    let currentGroup: Item[] = []
    let currentType: 'group' | 'book' | null = null

    items.forEach((item) => {
      const itemType = isGroupItem(item) ? 'group' : 'book'

      if (currentType === null || currentType === itemType) {
        currentGroup.push(item)
        currentType = itemType
      } else {
        groups.push(currentGroup)
        currentGroup = [item]
        currentType = itemType
      }
    })

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }

  const handleDownloadImage = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const element = document.querySelector('main')
    if (!element) return

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
