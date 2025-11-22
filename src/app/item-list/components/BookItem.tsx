import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import Link from 'next/link'
import type { ItemBook } from '@/item-list-type'
import { ItemInfo } from './ItemInfo'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
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
      itemImageWrapper: css`
        height: 360px;
        background: linear-gradient(to bottom, rgb(150, 125, 95), rgb(130, 110, 80));
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        @media ${theme.breakpoints.compact} {
          height: 280px;
        }
      `,
      itemImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      featuredImageWrapper: css`
        height: 480px;
        background: linear-gradient(to bottom, rgb(150, 125, 95), rgb(130, 110, 80));
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        @media ${theme.breakpoints.compact} {
          height: 360px;
        }
      `,
      featuredImage: css`
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `,
      websiteLink: css`
        text-decoration: none;
        color: inherit;
        display: block;

        &:hover {
          text-decoration: underline;
        }
      `,
    }),
    [theme],
  )
}

export const BookItem = ({
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
