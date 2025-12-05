import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import type { AvailabilityState } from '@/item-list-type'
import { AvailabilityInfo } from './AvailabilityInfo'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
      itemInfo: css`
        padding: 0.5rem 1rem 1rem 1rem;
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

        .print-mode & {
          font-size: 1.86rem;
        }

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

        .print-mode & {
          font-size: 2.18rem;
        }

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

        .print-mode & {
          font-size: 1.22rem;
        }
      `,
      itemPrice: css`
        ${theme.styles.text};
        font-size: 0.9rem;
        font-weight: 600;
        color: #e67e22;
        margin: 0;

        .print-mode & {
          font-size: 1.9rem;
        }
      `,
      availabilitySection: css`
        margin-top: 0.5rem;
        position: relative;
        z-index: 100;
      `,
    }),
    [theme],
  )
}

export const ItemInfo = ({
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
        <AvailabilityInfo availability={availability} links={links} />
      </div>
    </div>
  )
}
