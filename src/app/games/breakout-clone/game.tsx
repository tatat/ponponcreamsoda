import React, { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import * as Phaser from 'phaser'
import type { OpeningScene } from './opening-scene'
import type { BreakoutScene } from './breakout-scene'
import { OpeningScene as OpeningSceneClass } from './opening-scene'
import { BreakoutScene as BreakoutSceneClass } from './breakout-scene'
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
  const settingsRef = useRef<GameSettings>(settings)

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
      scene: [OpeningSceneClass, BreakoutSceneClass],
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

    // Store initial settings in Phaser's registry for all scenes to access
    game.registry.set('settings', settingsRef.current)

    // Listen for settings modal open event from game scenes
    game.events.on('openSettings', () => {
      setIsSettingsOpen(true)
      
      // Auto-pause the BreakoutScene when settings open (OpeningScene doesn't need pausing)
      const breakoutScene = game.scene.getScene('BreakoutScene')
      if (breakoutScene && breakoutScene.scene.isActive() && 'pauseForSettings' in breakoutScene) {
        ;(breakoutScene as BreakoutScene).pauseForSettings()
      }
    })

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [debugMode])

  const handleSettingsChange = (newSettings: GameSettings) => {
    const previousDebugMode = settings.debugMode
    setSettings(newSettings)
    settingsRef.current = newSettings

    // Reset game if debug mode changed
    if (newSettings.debugMode !== previousDebugMode) {
      // Destroy and recreate game
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
      // useEffect will re-run and recreate the game
    } else {
      // For other setting changes, update registry and notify all active scenes
      if (gameRef.current) {
        // Update settings in registry
        gameRef.current.registry.set('settings', newSettings)

        // Apply settings to all active scenes
        const scenes = gameRef.current.scene.scenes
        scenes.forEach((scene) => {
          if (scene.scene.isActive() && 'applySettings' in scene) {
            ;(scene as BreakoutScene | OpeningScene).applySettings(newSettings)
          }
        })
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
          position: relative;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: ${constants.GAME_WIDTH} / ${constants.GAME_HEIGHT};
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
