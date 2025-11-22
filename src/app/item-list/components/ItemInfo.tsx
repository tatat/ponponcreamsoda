import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import type { AvailabilityState } from '@/item-list-type'
import { getAvailabilityStatusStyle, getAvailabilityStatusText } from '../utils'

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
        display: flex;
        align-items: center;
        gap: 0.5rem;
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

        .print-mode & {
          font-size: 1.22rem;
        }
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

        .print-mode & {
          font-size: 1.22rem;
        }
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

        .print-mode & {
          font-size: 1.38rem;
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
      infoIcon: css`
        transform: translateY(1px);

        .print-mode & {
          display: none;
        }
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

        .print-mode & {
          font-size: 1.22rem;
          text-decoration: none;
        }
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
        <div css={styles.availabilityLabelWithTooltip}>
          <span>販売状況</span>
          <AiOutlineInfoCircle css={styles.infoIcon} />
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
