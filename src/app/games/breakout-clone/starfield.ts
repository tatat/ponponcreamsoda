import * as Phaser from 'phaser'

export interface StarfieldConfig {
  width: number
  height: number
  starCounts?: number[] // Number of stars per layer (default: [200, 80, 20])
  starSizes?: number[] // Size of stars per layer in pixels (default: [1, 2, 3])
  twinkleSpeed?: number[] // Twinkle animation speed per layer in ms (default: [2000, 3000, 4000])
  shootingStarInterval?: { min: number; max: number } // Shooting star spawn interval in ms (default: 8000-20000)
}

export class Starfield {
  private scene: Phaser.Scene
  private config: Required<StarfieldConfig>
  private stars: Phaser.GameObjects.Graphics[] = []
  private starTweens: Phaser.Tweens.Tween[] = []
  private shootingStarTimer?: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, config: StarfieldConfig) {
    this.scene = scene
    this.config = {
      width: config.width,
      height: config.height,
      starCounts: config.starCounts || [200, 80, 20],
      starSizes: config.starSizes || [1, 2, 3],
      twinkleSpeed: config.twinkleSpeed || [2000, 3000, 4000],
      shootingStarInterval: config.shootingStarInterval || { min: 8000, max: 20000 },
    }
  }

  create() {
    this.createStarfield()
    this.startShootingStarTimer()
  }

  private createStarfield() {
    // Create multiple layers of stars with different sizes and twinkle speeds
    // Default: 3 layers with [200, 80, 20] stars, sizes [1, 2, 3], speeds [2000, 3000, 4000]ms
    const { starCounts, starSizes, twinkleSpeed, width, height } = this.config

    for (let layer = 0; layer < starCounts.length; layer++) {
      for (let i = 0; i < starCounts[layer]; i++) {
        const star = this.scene.add.graphics()
        const x = Math.random() * width
        const y = Math.random() * height
        const size = starSizes[layer]

        // Create star with white color and transparency (0.8 alpha)
        star.fillStyle(0xffffff, 0.8)
        star.fillCircle(0, 0, size)
        star.setPosition(x, y)
        star.setDepth(-10 + layer) // Background layers: -10, -9, -8

        this.stars.push(star)

        // Create twinkling effect: fade to 0.2 alpha and back
        const tween = this.scene.tweens.add({
          targets: star,
          alpha: 0.2,
          duration: twinkleSpeed[layer] + Math.random() * 1000, // Base speed + random variation
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: Math.random() * 2000, // Random start delay up to 2 seconds
        })

        this.starTweens.push(tween)
      }
    }
  }

  private startShootingStarTimer() {
    // Start timer for shooting stars with random intervals
    // Default: 8-20 seconds between shooting stars
    const { min, max } = this.config.shootingStarInterval
    this.shootingStarTimer = this.scene.time.addEvent({
      delay: min + Math.random() * (max - min), // Random delay between min and max
      callback: this.createShootingStar,
      callbackScope: this,
      loop: true,
    })
  }

  private createShootingStar() {
    // Skip if game is paused (check if scene has these properties)
    const scene = this.scene as Phaser.Scene & { isGameOver?: boolean; isPaused?: boolean }
    if (scene.isGameOver || scene.isPaused) return

    const { width, height } = this.config
    // Start from random X position at top of screen
    const startX = Math.random() * width
    const startY = -10 // Just above screen
    // End position: slight horizontal drift (±200px) and bottom of screen
    const endX = startX + (Math.random() - 0.5) * 400 // ±200px horizontal drift
    const endY = height + 10 // Just below screen

    // Create shooting star as a white line (20px long)
    const shootingStar = this.scene.add.graphics()
    shootingStar.lineStyle(2, 0xffffff, 0.8) // 2px width, white, 80% alpha
    shootingStar.lineBetween(0, 0, 20, 0) // 20px horizontal line
    shootingStar.setPosition(startX, startY)
    shootingStar.setDepth(-5) // In front of stars but behind game objects

    // Animate the shooting star: move diagonally and fade out
    this.scene.tweens.add({
      targets: shootingStar,
      x: endX,
      y: endY,
      alpha: 0, // Fade out during movement
      duration: 2000, // 2 second animation
      ease: 'Power2',
      onComplete: () => {
        shootingStar.destroy()
      },
    })

    // Rotate the shooting star to match its trajectory angle
    const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY)
    shootingStar.setRotation(angle)
  }

  destroy() {
    // Clean up stars
    this.stars.forEach((star) => star.destroy())
    this.stars = []

    // Clean up tweens
    this.starTweens.forEach((tween) => tween.destroy())
    this.starTweens = []

    // Clean up timer
    if (this.shootingStarTimer) {
      this.shootingStarTimer.destroy()
      this.shootingStarTimer = undefined
    }
  }
}
