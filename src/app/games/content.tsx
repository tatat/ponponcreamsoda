'use client'

import React, { useMemo } from 'react'
import { css, useTheme } from '@emotion/react'
import Menu from '@/components/Menu'
import { SmartLink } from '@/components/SmartLink'

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
      container: css`
        min-height: 100lvh;
        background: #1a1a1a;
        padding: 60px 40px;
        color: #e8e8e8;
        box-sizing: border-box;

        @media ${theme.breakpoints.portrait} {
          padding: 40px 20px;
        }
      `,
      header: css`
        margin-bottom: 60px;

        @media ${theme.breakpoints.portrait} {
          margin-bottom: 40px;
        }
      `,
      title: css`
        font-size: 32px;
        font-weight: normal;
        color: #f0f0f0;
        margin: 0 0 8px 0;
        font-family: 'Kaisei Decol', serif;

        @media ${theme.breakpoints.portrait} {
          font-size: 24px;
        }
      `,
      gamesList: css`
        max-width: 800px;
      `,
      gameItem: css`
        border-bottom: 1px solid #404040;
        padding: 24px 0;

        @media ${theme.breakpoints.portrait} {
          padding: 20px 0;
        }
      `,
      gameLink: css`
        display: block;
        text-decoration: none;
        color: inherit;
        transition: color 0.2s ease;

        &:hover {
          color: #d0d0d0;
        }
      `,
      gameTitle: css`
        font-size: 20px;
        font-weight: normal;
        margin: 0 0 8px 0;
        font-family: 'Kaisei Decol', serif;

        @media ${theme.breakpoints.portrait} {
          font-size: 18px;
        }
      `,
      gameDescription: css`
        font-size: 16px;
        color: #a0a0a0;
        margin: 0;
        line-height: 1.5;
        font-family: 'Kaisei Decol', serif;

        @media ${theme.breakpoints.portrait} {
          font-size: 14px;
        }
      `,
      comingSoonTitle: css`
        font-size: 20px;
        font-weight: normal;
        margin: 0 0 8px 0;
        font-family: 'Kaisei Decol', serif;
        color: #888888;

        @media ${theme.breakpoints.portrait} {
          font-size: 18px;
        }
      `,
      comingSoonDescription: css`
        font-size: 16px;
        color: #888888;
        margin: 0;
        line-height: 1.5;
        font-family: 'Kaisei Decol', serif;

        @media ${theme.breakpoints.portrait} {
          font-size: 14px;
        }
      `,
    }),
    [theme],
  )
}

const gameItems = [
  {
    title: 'バンドを始めたい女の子の話',
    description: 'シンプルなノベルゲーム',
    href: 'https://unityroom.com/games/tsunzaki_band',
  },
  {
    title: 'ブロック崩し',
    description: 'クラシックなブロック崩しゲーム。音楽的な要素とボス戦が楽しめる',
    href: '/games/breakout-clone/',
  },
]

export default function GamesContent() {
  const styles = useStyles()

  return (
    <div css={styles.container}>
      <Menu />

      {/* Header */}
      <div css={styles.header}>
        <h1 css={styles.title}>Games</h1>
      </div>

      {/* Games List */}
      <div css={styles.gamesList}>
        {gameItems.map((game) => (
          <div key={game.href} css={styles.gameItem}>
            <SmartLink href={game.href} css={styles.gameLink}>
              <h2 css={styles.gameTitle}>{game.title}</h2>
              <p css={styles.gameDescription}>{game.description}</p>
            </SmartLink>
          </div>
        ))}

        {/* Coming Soon */}
        <div css={styles.gameItem}>
          <h2 css={styles.comingSoonTitle}>Coming Soon...</h2>
          <p css={styles.comingSoonDescription}>新しいゲームを制作中？</p>
        </div>
      </div>
    </div>
  )
}
