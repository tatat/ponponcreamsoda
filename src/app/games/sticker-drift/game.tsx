'use client'

import React, { useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import * as Phaser from 'phaser'
import { BootScene } from './scenes/boot-scene'
import { MainScene } from './scenes/main-scene'
import { constants } from './config'

export default function StickerDriftGame() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!gameContainerRef.current) return
    if (gameRef.current) return
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: gameContainerRef.current,
        width: constants.GAME_WIDTH,
        height: constants.GAME_HEIGHT,
        autoRound: false,
      },
      render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
      },
      scene: [BootScene, MainScene],
      backgroundColor: '#1a1a2e', // Dark blue space-like background
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: constants.GRAVITY }, // Constant downward gravity
          debug: false,
        },
      },
    }

    const game = new Phaser.Game(config)
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background-color: #000;
      `}
    >
      <div
        ref={gameContainerRef}
        css={css`
          width: 100%;
          max-width: ${constants.GAME_WIDTH}px;
          aspect-ratio: ${constants.GAME_WIDTH} / ${constants.GAME_HEIGHT};
        `}
      />
    </div>
  )
}
