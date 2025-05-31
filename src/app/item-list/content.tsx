'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import Link from 'next/link'
import Menu from '@/components/Menu'
import { itemList } from '@/item-list'
import type { ItemBook, ItemSticker, ItemOther, AvailabilityState } from '@/item-list-type'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
      container: css`
        position: relative;
        background: linear-gradient(135deg, #f8f4f0 0%, #e8ddd4 50%, #f0e6dc 100%);
        min-height: 100vh;
        min-height: 100lvh;
        padding: 2rem;
        box-sizing: border-box;

        @media ${theme.breakpoints.portrait} {
          padding: 1rem;
        }
      `,
      header: css`
        text-align: center;
        margin-bottom: 3rem;
        padding-top: 2rem;

        @media ${theme.breakpoints.portrait} {
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

        @media ${theme.breakpoints.portrait} {
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

        @media ${theme.breakpoints.portrait} {
          font-size: 1rem;
        }
      `,
      section: css`
        margin-bottom: 4rem;

        @media ${theme.breakpoints.portrait} {
          margin-bottom: 3rem;
        }
      `,
      sectionTitle: css`
        ${theme.styles.text};
        color: #8b7355;
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(139, 115, 85, 0.1);
        letter-spacing: 0.08em;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4a574, transparent);
        }

        @media ${theme.breakpoints.portrait} {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
      `,
      itemGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;

        @media ${theme.breakpoints.portrait} {
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 600px;
        }
      `,
      newReleaseGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 600px;
        margin: 0 auto;

        @media ${theme.breakpoints.portrait} {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      `,
      stickerGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        max-width: 800px;
        margin: 0 auto;

        @media ${theme.breakpoints.portrait} {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
      `,
      itemCard: css`
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      `,
      stickerCard: css`
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;

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
      itemImage: css`
        width: 100%;
        height: 360px;
        object-fit: contain;
        display: block;
        background: rgba(236, 240, 241, 0.05);
        padding: 0.75rem 0.75rem 0 0.75rem;
        box-sizing: border-box;

        @media ${theme.breakpoints.portrait} {
          height: 280px;
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      newReleaseImage: css`
        width: 100%;
        height: 500px;
        object-fit: contain;
        display: block;
        background: rgba(236, 240, 241, 0.05);
        padding: 1rem 1rem 0 1rem;
        box-sizing: border-box;

        @media ${theme.breakpoints.portrait} {
          height: 400px;
          padding: 0.75rem 0.75rem 0 0.75rem;
        }
      `,
      stickerImage: css`
        width: 100%;
        height: 200px;
        object-fit: contain;
        display: block;
        background: rgba(236, 240, 241, 0.1);
        padding: 1rem;
        box-sizing: border-box;

        @media ${theme.breakpoints.portrait} {
          height: 160px;
          padding: 0.5rem;
        }
      `,
      itemInfo: css`
        padding: 0.75rem;

        @media ${theme.breakpoints.portrait} {
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
        padding: 0 0.75rem;

        @media ${theme.breakpoints.portrait} {
          font-size: 0.9rem;
          padding: 0 0.5rem;
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

        @media ${theme.breakpoints.portrait} {
          grid-template-columns: 1fr;
        }
      `,
      otherItem: css`
        background: rgba(255, 255, 255, 0.15);
        border: none;
        border-radius: 0;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }

        @media ${theme.breakpoints.portrait} {
          padding: 1rem;
        }
      `,
      otherItemName: css`
        ${theme.styles.text};
        font-size: 1.2rem;
        font-weight: 600;
        color: #8b7355;
        margin: 0;

        @media ${theme.breakpoints.portrait} {
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

        &:hover {
          text-decoration: underline;
        }
      `,
    }),
    [theme],
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

const BookItem = ({ item, isNewRelease = false }: { item: ItemBook; isNewRelease?: boolean }) => {
  const styles = useStyles()

  const imageAndTitle = (
    <>
      <img src={item.imageUrl} alt={item.name} css={isNewRelease ? styles.newReleaseImage : styles.itemImage} />
      <h3 css={styles.itemName}>{item.name}</h3>
    </>
  )

  const content = (
    <div css={styles.itemCard}>
      {item.links?.website ? (
        <Link href={item.links.website} css={styles.websiteLink}>
          {imageAndTitle}
        </Link>
      ) : (
        imageAndTitle
      )}
      <div css={styles.itemInfo}>
        <div css={styles.itemTypeAndPrice}>
          <p css={styles.itemType}>{item.type === 'manga' ? 'マンガ' : 'イラスト'}</p>
          <p css={styles.itemPrice}>{item.price}</p>
        </div>
        <div css={styles.availabilitySection}>
          <h4 css={styles.availabilityTitle}>販売状況</h4>
          <ul css={styles.availabilityList}>
            <li css={styles.availabilityItem}>
              <span>会場販売</span>
              <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(item.availability.venue)]}>
                {getAvailabilityStatusText(item.availability.venue)}
              </span>
            </li>
            <li css={styles.availabilityItem}>
              {item.links?.onlinePhysical && item.links.onlinePhysical.length > 0 ? (
                <a
                  href={item.links.onlinePhysical[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.availabilityLink}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                >
                  <span>オンライン（物理）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(item.availability.onlinePhysical)]}>
                    {getAvailabilityStatusText(item.availability.onlinePhysical)}
                  </span>
                </a>
              ) : (
                <>
                  <span>オンライン（物理）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(item.availability.onlinePhysical)]}>
                    {getAvailabilityStatusText(item.availability.onlinePhysical)}
                  </span>
                </>
              )}
            </li>
            <li css={styles.availabilityItem}>
              {item.links?.onlineDigital && item.links.onlineDigital.length > 0 ? (
                <a
                  href={item.links.onlineDigital[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  css={styles.availabilityLink}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                >
                  <span>オンライン（デジタル）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(item.availability.onlineDigital)]}>
                    {getAvailabilityStatusText(item.availability.onlineDigital)}
                  </span>
                </a>
              ) : (
                <>
                  <span>オンライン（デジタル）</span>
                  <span css={[styles.availabilityStatus, getAvailabilityStatusStyle(item.availability.onlineDigital)]}>
                    {getAvailabilityStatusText(item.availability.onlineDigital)}
                  </span>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )

  return content
}

const StickerItem = ({ item }: { item: ItemSticker }) => {
  const styles = useStyles()

  return (
    <div css={styles.stickerCard}>
      <img src={item.imageUrl} alt="ステッカー" css={styles.stickerImage} />
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
  const styles = useStyles()

  return (
    <main css={styles.container}>
      <Menu color="#8b7355" secondaryColor="#a68b5b" />

      <header css={styles.header}>
        <h1 css={styles.title}>お品書き</h1>
        <p css={styles.subtitle}>Pon Pon Creamsoda アイテム一覧</p>
      </header>

      {/* New Releases */}
      {itemList.newReleases.map((category, categoryIndex) => (
        <section key={categoryIndex} css={styles.section}>
          <h2 css={styles.sectionTitle}>新刊</h2>
          <div css={styles.newReleaseGrid}>
            {category.items.map((item, itemIndex) => (
              <BookItem key={itemIndex} item={item} isNewRelease={true} />
            ))}
          </div>
        </section>
      ))}

      {/* Back Catalog */}
      {itemList.backCatalog.map((category, categoryIndex) => (
        <section key={categoryIndex} css={styles.section}>
          <h2 css={styles.sectionTitle}>既刊</h2>
          <div css={styles.itemGrid}>
            {[...category.items].reverse().map((item, itemIndex) => (
              <BookItem key={itemIndex} item={item} />
            ))}
          </div>
        </section>
      ))}

      {/* Stickers */}
      {itemList.stickers.map((category, categoryIndex) => (
        <section key={categoryIndex} css={styles.section}>
          <h2 css={styles.sectionTitle}>ステッカー</h2>
          <div css={styles.stickerGrid}>
            {category.items.map((item, itemIndex) => (
              <StickerItem key={itemIndex} item={item} />
            ))}
          </div>
        </section>
      ))}

      {/* Others */}
      {itemList.others.map((category, categoryIndex) => (
        <section key={categoryIndex} css={styles.section}>
          <h2 css={styles.sectionTitle}>その他</h2>
          <div css={styles.otherItemsList}>
            {category.items.map((item, itemIndex) => (
              <OtherItem key={itemIndex} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
