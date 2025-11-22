import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import type { GroupItem } from '@/item-list-type'
import { BookItem } from './BookItem'
import { StickerItem } from './StickerItem'
import { OtherItem } from './OtherItem'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
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
      groupItemsGridFeatured: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        align-items: start;

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
        align-items: start;

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

        .print-mode & {
          font-size: 2.4rem;
        }

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

        .print-mode & {
          font-size: 1.44rem;
        }

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
      featuredGroupWrapper: css`
        grid-column: 1 / -1;
        width: 100%;

        @media ${theme.breakpoints.compact} {
          max-width: 100%;
        }
      `,
    }),
    [theme],
  )
}

export const GroupItemComponent = ({ item, isFeatured = false }: { item: GroupItem; isFeatured?: boolean }) => {
  const styles = useStyles()
  const theme = useTheme()
  const itemCount = item.items.length

  const groupInfoCardStyle = css`
    ${styles.groupInfoCard};

    grid-column: ${itemCount === 4 ? '1 / -1' : 'auto'};

    @media ${theme.breakpoints.wide} {
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
