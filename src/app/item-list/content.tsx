'use client'

import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import Link from 'next/link'
import Menu from '@/components/Menu'
import { itemList } from '@/item-list'
import type { ItemBook, ItemSticker, ItemOther, ItemGroup, AvailabilityState } from '@/item-list-type'

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

        @media ${theme.breakpoints.portrait} {
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        &:hover {
          text-decoration: underline;
        }
      `,
      groupSetCard: css`
        background: rgba(255, 255, 255, 0.25);
        border: 2px solid #d4a574;
        border-radius: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-2px);
        }
      `,
      setBadge: css`
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: linear-gradient(135deg, #e67e22, #d35400);
        color: white;
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        z-index: 1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        @media ${theme.breakpoints.portrait} {
          font-size: 0.7rem;
          padding: 0.3rem 0.6rem;
        }
      `,
      groupImageGridWrapper: css`
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(236, 240, 241, 0.05);
        padding: 0.75rem 0.75rem 0 0.75rem;

        @media ${theme.breakpoints.portrait} {
          padding: 0.5rem 0.5rem 0 0.5rem;
        }
      `,
      groupImageGrid: css`
        display: grid;
        gap: 0.75rem;
        justify-content: space-between;
        width: 100%;

        @media ${theme.breakpoints.portrait} {
          gap: 0.5rem;
        }
      `,
      groupThumbnail: css`
        width: 100%;
        height: auto;
        object-fit: contain;
        display: block;
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

const ItemInfo = ({
  title,
  itemType,
  price,
  availability,
  links,
}: {
  title: string
  itemType: string
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

  return (
    <div css={styles.itemInfo}>
      <h3 css={styles.itemName}>{title}</h3>
      <div css={styles.itemTypeAndPrice}>
        <p css={styles.itemType}>{itemType}</p>
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

const BookItem = ({ item }: { item: ItemBook }) => {
  const styles = useStyles()

  const imageElement = <img src={item.imageUrl} alt={item.name} css={styles.itemImage} />

  return (
    <div css={styles.itemCard}>
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

const GroupSetItem = ({ group }: { group: ItemGroup }) => {
  const styles = useStyles()

  return (
    <div css={styles.groupSetCard}>
      <div css={styles.setBadge}>セット</div>
      <div css={styles.groupImageGridWrapper}>
        <div
          css={styles.groupImageGrid}
          style={{ gridTemplateColumns: `repeat(${Math.min(group.itemCount, 3)}, auto)` }}
        >
          {group.imageUrls.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`${group.name} - ${index + 1}`} css={styles.groupThumbnail} />
          ))}
        </div>
      </div>
      <ItemInfo
        title={group.name}
        itemType="セット"
        price={group.price}
        availability={group.availability}
        links={group.links}
      />
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
          <div css={styles.itemGrid}>
            {category.items.map((item, itemIndex) => {
              if (item.itemType === 'group') {
                return <GroupSetItem key={`item-${itemIndex}`} group={item} />
              } else if (item.itemType === 'book') {
                return <BookItem key={`item-${itemIndex}`} item={item} />
              }
              return null
            })}
          </div>
        </section>
      ))}

      {/* Back Catalog */}
      {itemList.backCatalog.map((category, categoryIndex) => (
        <section key={categoryIndex} css={styles.section}>
          <h2 css={styles.sectionTitle}>既刊</h2>
          <div css={styles.itemGrid}>
            {category.items.toReversed().map((item, itemIndex) => {
              if (item.itemType === 'group') {
                return <GroupSetItem key={itemIndex} group={item} />
              } else if (item.itemType === 'book') {
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
          <h2 css={styles.sectionTitle}>ステッカー</h2>
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
          <h2 css={styles.sectionTitle}>その他</h2>
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
  )
}
