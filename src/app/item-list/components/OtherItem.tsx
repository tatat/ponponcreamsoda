import { css, useTheme } from '@emotion/react'
import { useMemo } from 'react'
import type { ItemOther } from '@/item-list-type'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
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
          border-color: rgba(212, 165, 116, 0.6);
          z-index: 3;
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
    }),
    [theme],
  )
}

export const OtherItem = ({ item }: { item: ItemOther }) => {
  const styles = useStyles()

  return (
    <div css={styles.otherItem}>
      <h3 css={styles.otherItemName}>{item.name}</h3>
    </div>
  )
}
