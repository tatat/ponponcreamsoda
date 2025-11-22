import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import type { ItemSticker } from '@/item-list-type'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
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

        .print-mode & {
          font-size: 1.54rem;
        }
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
    }),
    [theme],
  )
}

export const StickerItem = ({ item, inGroup = false }: { item: ItemSticker; inGroup?: boolean }) => {
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
