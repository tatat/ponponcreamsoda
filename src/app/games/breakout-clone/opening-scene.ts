import Phaser from 'phaser'
import { constants } from './constants'
import { GameSettings } from './settings'
import { SoundManager } from './sound-manager'

export class OpeningScene extends Phaser.Scene {
  private titleLogo?: Phaser.GameObjects.Image
  private gameNameText?: Phaser.GameObjects.Text
  private startText?: Phaser.GameObjects.Text
  private background?: Phaser.GameObjects.Rectangle
  private stars: Phaser.GameObjects.Arc[] = []
  private isTransitioning = false
  private soundManager?: SoundManager
  private settings?: GameSettings

  constructor() {
    super({ key: 'OpeningScene' })
  }

  preload() {
    // Load brick images for floating effect
    constants.BRICK_NAMES.forEach((name) => {
      const sizes = [128, 160, 192] // Load larger sizes for better visibility
      sizes.forEach((size) => {
        this.load.image(`brick-${name}-${size}`, `/games/breakout-clone/images/i-${name}-${size}@2x.png`)
      })
    })

    // Load logo for title with specific size to avoid scaling blur
    this.load.svg('logo-tssh', '/games/breakout-clone/images/logo-tssh.svg', { width: 360, height: 326 })

    // Load hit sound effects for game start sound
    for (let i = 1; i <= 12; i++) {
      const soundKey = `hit${i.toString().padStart(2, '0')}`
      const soundPath = `/games/breakout-clone/sounds/hit/${i.toString().padStart(2, '0')}.mp3`
      this.load.audio(soundKey, soundPath)
    }
  }

  create() {
    // Get settings from registry
    this.settings = this.registry.get('settings') as GameSettings

    // Initialize sound manager
    this.soundManager = new SoundManager(this, this.settings.sound)
    this.soundManager.initialize()

    this.createBackground()
    this.createStarfield()
    this.createTitle()
    this.createGameNameText()
    this.createStartText()
    this.createFloatingBricks()
    this.setupInputHandlers()
  }

  private createBackground() {
    this.background = this.add.rectangle(
      constants.GAME_WIDTH / 2,
      constants.GAME_HEIGHT / 2,
      constants.GAME_WIDTH,
      constants.GAME_HEIGHT,
      0x0a0a1a,
    )
  }

  private createStarfield() {
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, constants.GAME_WIDTH)
      const y = Phaser.Math.Between(0, constants.GAME_HEIGHT)
      const radius = Phaser.Math.Between(1, 3)
      const alpha = Phaser.Math.FloatBetween(0.3, 1)

      const star = this.add.circle(x, y, radius, 0xffffff, alpha)
      this.stars.push(star)

      this.tweens.add({
        targets: star,
        alpha: alpha * 0.3,
        duration: Phaser.Math.Between(1000, 3000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
      })
    }
  }

  private createFloatingBricks() {
    // Fixed positions for background bricks (6 positions for 6 brick types)
    const brickPositions = [
      { x: 836, y: 198 }, // d1
      { x: 849, y: 490 }, // d2
      { x: 568, y: 210 }, // r1
      { x: 588, y: 500 }, // r2
      { x: 1089, y: 209 }, // t1
      { x: 1114, y: 491 }, // t2
    ]

    // Create static brick images using 128 size only
    brickPositions.forEach((pos, index) => {
      const brickName = constants.BRICK_NAMES[index]
      const brickKey = `brick-${brickName}-128`

      // Create regular image (no physics)
      const brick = this.add.image(pos.x, pos.y, brickKey)

      // Background effect with subtle styling (no scale change)
      brick.setAlpha(0) // Start transparent for fade in
      brick.setDepth(0)

      // Initial fade in
      this.tweens.add({
        targets: brick,
        alpha: 1.0,
        duration: 1500,
        ease: 'Power2.easeOut',
        delay: 800 + index * 100,
      })

      // Add floating animation
      this.tweens.add({
        targets: brick,
        y: pos.y + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(3000, 5000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: 2000 + index * 200,
      })

      // Add fade in/out animation
      this.tweens.add({
        targets: brick,
        alpha: { from: 1.0, to: 0.2 },
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: 2500 + index * 300,
      })
    })
  }

  private createTitle() {
    this.titleLogo = this.add.image(231, 205, 'logo-tssh').setOrigin(0.5).setAlpha(0).setDepth(1) // Put logo in front of bricks

    // Add physics body to title logo for collision detection
    this.physics.add.existing(this.titleLogo, true) // true = static body

    // Set the collision area to match the logo bounds
    const logoBounds = this.titleLogo.getBounds()
    this.titleLogo.setSize(logoBounds.width, logoBounds.height)

    this.tweens.add({
      targets: this.titleLogo,
      alpha: 1,
      duration: 1500,
      ease: 'Power2.easeOut',
    })
  }

  private createGameNameText() {
    this.gameNameText = this.add
      .text(50, 596, 'ブロック崩し', {
        fontSize: '38px',
        fontFamily: '"Kaisei Decol", serif',
        color: '#e8e8e8',
      })
      .setOrigin(0)
      .setAlpha(0)
      .setDepth(1) // Put text in front of bricks

    // Add physics body to game name text for collision detection
    this.physics.add.existing(this.gameNameText, true) // true = static body

    // Set the collision area to match the text bounds
    const gameNameBounds = this.gameNameText.getBounds()
    this.gameNameText.setSize(gameNameBounds.width, gameNameBounds.height)

    this.tweens.add({
      targets: this.gameNameText,
      alpha: 1,
      duration: 1500,
      ease: 'Power2.easeOut',
      delay: 500,
    })
  }

  private createStartText() {
    this.startText = this.add
      .text(50, 650, 'SPACE OR TAP/CLICK TO ENTER', {
        fontSize: '24px',
        fontFamily: '"Kaisei Decol", serif',
        color: '#a0a0a0',
        stroke: '#1a1a1a',
        strokeThickness: 1,
      })
      .setOrigin(0)
      .setAlpha(0)
      .setDepth(1) // Put text in front of bricks

    // Add physics body to start text for collision detection
    this.physics.add.existing(this.startText, true) // true = static body

    // Set the collision area to match the text bounds
    const startTextBounds = this.startText.getBounds()
    this.startText.setSize(startTextBounds.width, startTextBounds.height)

    this.tweens.add({
      targets: this.startText,
      alpha: 1,
      duration: 800,
      delay: 1000,
    })

    this.tweens.add({
      targets: this.startText,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 1800,
    })
  }

  private setupInputHandlers() {
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.isTransitioning) {
        this.startGame()
      }
    })

    this.input.on('pointerdown', () => {
      if (!this.isTransitioning) {
        this.startGame()
      }
    })
  }

  private startGame() {
    this.isTransitioning = true

    // Play random hit sound when starting game
    if (this.soundManager) {
      this.soundManager.playRandomHitSound()
    }

    this.tweens.add({
      targets: [this.titleLogo, this.gameNameText, this.startText],
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: this.cameras.main,
          alpha: 0,
          duration: 500,
          ease: 'Power2',
          onComplete: () => {
            this.scene.start('BreakoutScene')
          },
        })
      },
    })
  }

  update() {
    // 星の微妙な動き
    this.stars.forEach((star, index) => {
      star.x += Math.sin(this.time.now * 0.0001 + index) * 0.1
    })
  }

  // Apply settings from the settings modal
  applySettings(newSettings: GameSettings) {
    this.settings = newSettings

    // Update sound manager with new settings
    if (this.soundManager) {
      this.soundManager.applySettings(newSettings.sound)
    }
  }
}
