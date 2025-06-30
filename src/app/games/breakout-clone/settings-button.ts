import Phaser from 'phaser'
import { constants } from './constants'

export interface SettingsButtonConfig {
  x?: number
  y?: number
  fontSize?: string
  fadeInDelay?: number
}

/**
 * Shared settings button component for all game scenes
 */
export class SettingsButton {
  private scene: Phaser.Scene
  private container?: Phaser.GameObjects.Container
  private background?: Phaser.GameObjects.Graphics
  private icon?: Phaser.GameObjects.Image
  private config: Required<SettingsButtonConfig>

  constructor(scene: Phaser.Scene, config: SettingsButtonConfig = {}) {
    this.scene = scene
    this.config = {
      x: constants.GAME_WIDTH - 14,
      y: 14,
      fontSize: '16px',
      fadeInDelay: 1200,
      ...config,
    }
  }

  /**
   * Preload settings icon assets
   */
  preload(): void {
    this.scene.load.svg('settings-icon', '/games/breakout-clone/images/settings.svg', { width: 30, height: 30 })
  }

  create(): void {
    // Create container for button components
    this.container = this.scene.add.container(this.config.x, this.config.y)
    this.container.setDepth(100).setAlpha(0)

    // Create icon
    this.icon = this.scene.add.image(0, 0, 'settings-icon')
    this.icon.setOrigin(0.5)
    // No need to set display size - use original 30x30
    this.icon.setTint(0xffffff)

    // Set fixed button size for consistent appearance
    const padding = { x: 6, y: 6 }
    const bgWidth = 30 + padding.x * 2
    const bgHeight = 30 + padding.y * 2

    // Create rounded rectangle background
    this.background = this.scene.add.graphics()
    this.drawRoundedRect(this.background, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 2, 0x333333)

    // Add components to container
    this.container.add([this.background, this.icon])

    // Set container origin and make interactive
    this.container.setSize(bgWidth, bgHeight)
    this.container.setInteractive({ useHandCursor: true })

    // Adjust position for right alignment (considering button width)
    this.container.setPosition(this.config.x - bgWidth / 2, this.config.y + bgHeight / 2)

    // Fade in animation
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 800,
      delay: this.config.fadeInDelay,
    })

    // Click handler to open settings modal
    this.container.on(
      'pointerdown',
      (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
        this.openSettingsModal()
        event.stopPropagation()
      },
    )

    // Hover effects
    this.container.on('pointerover', () => {
      this.background?.clear()
      this.drawRoundedRect(this.background!, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 2, 0x555555)
    })

    this.container.on('pointerout', () => {
      this.background?.clear()
      this.drawRoundedRect(this.background!, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 2, 0x333333)
    })
  }

  private drawRoundedRect(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: number,
  ): void {
    graphics.fillStyle(color)
    graphics.fillRoundedRect(x, y, width, height, radius)
  }

  private openSettingsModal(): void {
    // Emit event to parent React component to open settings modal
    this.scene.game.events.emit('openSettings')
  }

  /**
   * Hide the button with fade out animation
   */
  hide(duration: number = 500): void {
    if (this.container) {
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        duration,
        ease: 'Power2',
      })
    }
  }

  /**
   * Show the button with fade in animation
   */
  show(duration: number = 500): void {
    if (this.container) {
      this.scene.tweens.add({
        targets: this.container,
        alpha: 1,
        duration,
        ease: 'Power2',
      })
    }
  }

  /**
   * Get the button container (for animations, etc.)
   */
  getButton(): Phaser.GameObjects.Container | undefined {
    return this.container
  }

  /**
   * Destroy the button
   */
  destroy(): void {
    this.container?.destroy()
    this.container = undefined
    this.background = undefined
    this.icon = undefined
  }
}
