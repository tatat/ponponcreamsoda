import React, { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import * as Phaser from 'phaser'
import { BreakoutScene } from './breakout-scene'
import { constants } from './constants'
import { GameSettings, loadSettings } from './settings'
import { SettingsModal } from './settings-modal'

export type BreakoutGameParams = {
  debugMode?: boolean
}

export const BreakoutGame: React.FC<BreakoutGameParams> = ({ debugMode: propDebugMode }) => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Get debug mode from settings, prioritize props if provided
  const debugMode = propDebugMode !== undefined ? propDebugMode : settings.debugMode

  useEffect(() => {
    if (!gameContainerRef.current) {
      return
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: gameContainerRef.current,
        width: constants.GAME_WIDTH,
        height: constants.GAME_HEIGHT,
        autoRound: false, // Smoother scaling
      },
      render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
        roundPixels: false, // Smoother rendering
        powerPreference: 'high-performance', // Use high-performance GPU
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR', // High-quality mipmaps
        batchSize: 4096, // Increase batch size
      },
      scene: BreakoutScene,
      backgroundColor: '#0a0a1a', // Deep space color
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: debugMode,
          fps: 60,
          fixedStep: true,
          timeScale: 1,
        },
      },
    })

    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [debugMode])

  const handleSettingsChange = (newSettings: GameSettings) => {
    const previousDebugMode = settings.debugMode
    setSettings(newSettings)

    // Reset game if debug mode changed
    if (newSettings.debugMode !== previousDebugMode) {
      // Destroy and recreate game
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
      // useEffect will re-run and recreate the game
    } else {
      // For other setting changes, apply normal settings
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene('BreakoutScene') as BreakoutScene
        if (scene) {
          scene.applySettings(newSettings)
        }
      }
    }
  }

  return (
    <>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          position: relative;
          max-width: ${constants.GAME_WIDTH}px;
          max-height: ${constants.GAME_HEIGHT}px;
          aspect-ratio: ${constants.GAME_WIDTH} / ${constants.GAME_HEIGHT};
          position: relative;
        `}
      >
        {/* Settings button */}
        <button
          onClick={() => {
            // Pause game when opening settings
            if (gameRef.current) {
              const scene = gameRef.current.scene.getScene('BreakoutScene') as BreakoutScene
              if (scene) {
                scene.pauseForSettings()
              }
            }
            setIsSettingsOpen(true)
          }}
          css={css`
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 200;
            background: #f5f5f5;
            border: none;
            border-radius: 2px;
            color: #333333;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s ease;
            box-shadow: none;

            &:hover {
              background: #e0e0e0;
            }

            &:active {
              background: #d0d0d0;
            }
          `}
        >
          設定
        </button>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
          data-phaser-game
          ref={gameContainerRef}
        />
      </div>

      {/* Settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </>
  )
}
