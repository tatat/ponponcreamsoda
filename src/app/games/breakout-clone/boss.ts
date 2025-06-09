import * as Phaser from 'phaser'
import { constants } from './constants'
import { BrickGenerator } from './brick-generator'
import { destroyAndNull } from '@/helpers/cleanup'

export class Boss {
  private scene: Phaser.Scene
  private sprite: Phaser.Physics.Arcade.Sprite | null = null
  private floatTween: Phaser.Tweens.Tween | null = null
  private flashTween: Phaser.Tweens.Tween | null = null
  private hits = 0
  private maxHits: number
  private bossNumber: number
  private brickGenerator: BrickGenerator
  private isFlashing = false

  constructor(scene: Phaser.Scene, bossNumber: number, brickGenerator: BrickGenerator) {
    this.scene = scene
    this.bossNumber = bossNumber
    this.maxHits = 4 + bossNumber // Boss 1: 5 hits, Boss 2: 6 hits, etc.
    this.brickGenerator = brickGenerator
  }

  create(): Phaser.Physics.Arcade.Sprite {
    // Random boss image from available character images
    const bossImages = constants.BRICK_NAMES
    const randomBossImage = bossImages[Math.floor(Math.random() * bossImages.length)]
    const bossTexture = `brick-${randomBossImage}-300`

    // Create boss sprite
    this.sprite = this.scene.physics.add.sprite(constants.GAME_CENTER_X, 200, bossTexture)

    // Get aspect ratio information for proper scaling
    const aspectInfo = this.brickGenerator.getBrickAspectRatio(`brick-${randomBossImage}`)
    if (aspectInfo) {
      let bossWidth, bossHeight
      if (aspectInfo.aspectRatio >= 1) {
        bossWidth = 300
        bossHeight = 300 / aspectInfo.aspectRatio
      } else {
        bossWidth = 300 * aspectInfo.aspectRatio
        bossHeight = 300
      }
      this.sprite.setDisplaySize(bossWidth, bossHeight)
      this.sprite.setSize(bossWidth * 0.8, bossHeight * 0.8)
    } else {
      this.sprite.setDisplaySize(300, 300)
      this.sprite.setSize(240, 240)
    }

    this.sprite.refreshBody()
    this.sprite.setImmovable(true)
    this.sprite.setDepth(10)

    // Add floating animations
    this.addFloatingAnimations()

    return this.sprite
  }

  private addFloatingAnimations() {
    if (!this.sprite) return

    // Vertical floating
    this.floatTween = this.scene.tweens.add({
      targets: this.sprite,
      y: 250,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Horizontal floating
    this.scene.tweens.add({
      targets: this.sprite,
      x: constants.GAME_CENTER_X + 100,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  hit(): boolean {
    if (!this.sprite) return false

    this.hits++

    // Only start flash animation if not already flashing
    if (!this.isFlashing) {
      this.isFlashing = true

      // Stop any existing flash tween
      this.flashTween = destroyAndNull(this.flashTween)

      // Flash effect when hit
      this.flashTween = this.scene.tweens.add({
        targets: this.sprite,
        tint: 0xff0000,
        duration: 100,
        yoyo: true,
        ease: 'Power2',
        onComplete: () => {
          // Ensure sprite returns to normal color
          if (this.sprite) {
            this.sprite.setTint(0xffffff)
          }
          this.isFlashing = false
          this.flashTween = null
        },
        onYoyo: () => {
          // Ensure the yoyo back to normal color works properly
          if (this.sprite) {
            this.sprite.setTint(0xffffff)
          }
        },
      })
    }

    // Show hit counter
    const hitText = this.scene.add.text(this.sprite.x, this.sprite.y - 50, `${this.hits}/${this.maxHits}`, {
      fontSize: '24px',
      color: '#ff6b6b',
      align: 'center',
    })
    hitText.setOrigin(0.5)
    hitText.setDepth(105)

    this.scene.tweens.add({
      targets: hitText,
      y: hitText.y - 30,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        hitText.destroy()
      },
    })

    // Return true if boss is defeated
    return this.hits >= this.maxHits
  }

  defeat(): number {
    if (!this.sprite) return 0

    // Disable collision
    this.sprite.disableBody()

    // Stop floating animations
    this.floatTween = destroyAndNull(this.floatTween)

    // Stop flash animation and reset color
    this.flashTween = destroyAndNull(this.flashTween)

    this.isFlashing = false
    this.sprite.setTint(0xffffff) // Ensure normal color before defeat animation

    // Boss defeat animation
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      rotation: Math.PI * 2,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.sprite = destroyAndNull(this.sprite)
      },
    })

    // Return bonus score
    return 400 + this.bossNumber * 100
  }

  getSprite(): Phaser.Physics.Arcade.Sprite | null {
    return this.sprite
  }

  getBossNumber(): number {
    return this.bossNumber
  }

  getMaxHits(): number {
    return this.maxHits
  }

  destroy() {
    this.floatTween = destroyAndNull(this.floatTween)
    this.flashTween = destroyAndNull(this.flashTween)

    this.isFlashing = false

    this.sprite = destroyAndNull(this.sprite)
  }
}
