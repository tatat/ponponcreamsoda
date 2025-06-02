import * as Phaser from 'phaser'

export interface BrickGeneratorConfig {
  gameWidth: number
  gameHeight: number
  brickAreaMargin: number
  brickAreaHeight: number
  brickSizes: readonly number[]
  brickNames: readonly string[]
}

export interface BrickArea {
  x: number
  y: number
  width: number
  height: number
}

export interface BrickInfo {
  x: number
  y: number
  width: number
  height: number
  texture: string
}

export interface AspectRatioInfo {
  aspectRatio: number
  originalWidth: number
  originalHeight: number
}

export class BrickGenerator {
  private scene: Phaser.Scene
  private config: BrickGeneratorConfig
  private bricks: Phaser.Physics.Arcade.StaticGroup
  private occupiedSpaces: Array<{ x: number; y: number; width: number; height: number }> = []
  private brickAspectRatios: Map<string, AspectRatioInfo> = new Map()

  constructor(scene: Phaser.Scene, bricks: Phaser.Physics.Arcade.StaticGroup, config: BrickGeneratorConfig) {
    this.scene = scene
    this.bricks = bricks
    this.config = config
  }

  /**
   * Initialize brick aspect ratios from pre-loaded textures
   */
  initializeBrickAspectRatios() {
    this.config.brickNames.forEach((name) => {
      // Use the first size (64) to get the aspect ratio
      const firstSizeTexture = this.scene.textures.get(`brick-${name}-64`)
      const firstSizeImage = firstSizeTexture.getSourceImage() as HTMLImageElement

      // Calculate aspect ratio from the 2x resolution image
      // Since our images are 2x resolution, we need to divide by 2 to get the logical size
      const logicalWidth = firstSizeImage.width / 2
      const logicalHeight = firstSizeImage.height / 2
      const aspectRatio = logicalWidth / logicalHeight

      // Store the aspect ratio information
      this.brickAspectRatios.set(`brick-${name}`, {
        aspectRatio,
        originalWidth: logicalWidth,
        originalHeight: logicalHeight,
      })
    })
  }

  /**
   * Generate initial bricks for the game start
   */
  generateInitialBricks(): void {
    const brickTextures = this.config.brickNames.map((name) => `brick-${name}`)
    const brickArea = this.getBrickArea()

    // Remove brick count limit and pack as many as possible
    const maxAttempts = 2000
    let attempts = 0
    let consecutiveFailures = 0
    const maxConsecutiveFailures = 100 // End if 100 consecutive failures

    while (attempts < maxAttempts && consecutiveFailures < maxConsecutiveFailures) {
      attempts++

      // Randomly select image
      const randomTexture = brickTextures[Math.floor(Math.random() * brickTextures.length)]

      // Get aspect ratio information for selected image
      const aspectInfo = this.brickAspectRatios.get(randomTexture)
      if (!aspectInfo) {
        consecutiveFailures++
        continue
      }

      // Random size (32px increments: 64, 96, 128, 160, 192, 224, 256)
      // Set lower probability for larger blocks
      const sizeWeights = [
        { size: 64, weight: 30 }, // 30% probability
        { size: 96, weight: 25 }, // 25% probability
        { size: 128, weight: 20 }, // 20% probability
        { size: 160, weight: 12 }, // 12% probability
        { size: 192, weight: 8 }, // 8% probability
        { size: 224, weight: 3 }, // 3% probability
        { size: 256, weight: 2 }, // 2% probability
      ]
      const baseSize = this.getWeightedRandomSize(sizeWeights)

      // Calculate actual size based on aspect ratio
      let brickWidth, brickHeight
      if (aspectInfo.aspectRatio >= 1) {
        // Horizontal or square
        brickWidth = baseSize
        brickHeight = baseSize / aspectInfo.aspectRatio
      } else {
        // Vertical
        brickWidth = baseSize * aspectInfo.aspectRatio
        brickHeight = baseSize
      }

      // Random position
      const x = Math.floor(Math.random() * (brickArea.width - brickWidth)) + brickArea.x
      const y = Math.floor(Math.random() * (brickArea.height - brickHeight)) + brickArea.y

      // Check if it doesn't overlap with other blocks
      const newBrick = { x, y, width: brickWidth, height: brickHeight }
      let overlaps = false

      for (const occupied of this.occupiedSpaces) {
        if (this.rectanglesOverlap(newBrick, occupied)) {
          overlaps = true
          break
        }
      }

      if (!overlaps) {
        // Select optimal texture
        const optimalTexture = this.getOptimalTexture(randomTexture, baseSize)

        // Create brick
        const brick = this.bricks.create(
          x + brickWidth / 2,
          y + brickHeight / 2,
          optimalTexture,
        ) as Phaser.Physics.Arcade.Sprite
        brick.setDisplaySize(brickWidth, brickHeight)
        brick.setSize(brickWidth, brickHeight)
        brick.refreshBody()

        this.occupiedSpaces.push(newBrick)
        consecutiveFailures = 0 // Reset on success
      } else {
        consecutiveFailures++
      }
    }
  }

  /**
   * Add a new brick during gameplay
   */
  addNewBrick(): boolean {
    const brickTextures = this.config.brickNames.map((name) => `brick-${name}`)
    const brickArea = this.getBrickArea()

    // Number of attempts to place new brick
    const maxAttempts = 100
    let attempts = 0

    while (attempts < maxAttempts) {
      attempts++

      // Randomly select image
      const randomTexture = brickTextures[Math.floor(Math.random() * brickTextures.length)]

      // Get aspect ratio information for selected image
      const aspectInfo = this.brickAspectRatios.get(randomTexture)
      if (!aspectInfo) continue

      // Random size (32px increments: 64, 96, 128, 160, 192, 224, 256)
      // Set lower probability for larger blocks
      const sizeWeights = [
        { size: 64, weight: 30 }, // 30% probability
        { size: 96, weight: 25 }, // 25% probability
        { size: 128, weight: 20 }, // 20% probability
        { size: 160, weight: 12 }, // 12% probability
        { size: 192, weight: 8 }, // 8% probability
        { size: 224, weight: 3 }, // 3% probability
        { size: 256, weight: 2 }, // 2% probability
      ]
      const baseSize = this.getWeightedRandomSize(sizeWeights)

      // Calculate actual size based on aspect ratio
      let brickWidth, brickHeight
      if (aspectInfo.aspectRatio >= 1) {
        // Horizontal or square
        brickWidth = baseSize
        brickHeight = baseSize / aspectInfo.aspectRatio
      } else {
        // Vertical
        brickWidth = baseSize * aspectInfo.aspectRatio
        brickHeight = baseSize
      }

      // Random position
      const x = Math.floor(Math.random() * (brickArea.width - brickWidth)) + brickArea.x
      const y = Math.floor(Math.random() * (brickArea.height - brickHeight)) + brickArea.y

      // Check if it doesn't overlap with other blocks
      const newBrick = { x, y, width: brickWidth, height: brickHeight }
      let overlaps = false

      for (const occupied of this.occupiedSpaces) {
        if (this.rectanglesOverlap(newBrick, occupied)) {
          overlaps = true
          break
        }
      }

      if (!overlaps) {
        // Select optimal texture
        const optimalTexture = this.getOptimalTexture(randomTexture, baseSize)

        // Create brick
        const brick = this.bricks.create(
          x + brickWidth / 2,
          y + brickHeight / 2,
          optimalTexture,
        ) as Phaser.Physics.Arcade.Sprite
        brick.setDisplaySize(brickWidth, brickHeight)
        brick.setSize(brickWidth, brickHeight)
        brick.refreshBody()

        // Fade in effect
        brick.setAlpha(0)
        this.scene.tweens.add({
          targets: brick,
          alpha: 1,
          duration: 500,
          ease: 'Power2',
        })

        this.occupiedSpaces.push(newBrick)
        return true // Successfully added brick
      }
    }

    return false // Failed to add brick
  }

  /**
   * Update occupied spaces based on current bricks
   */
  updateOccupiedSpaces(): void {
    this.occupiedSpaces = []
    this.bricks.children.entries.forEach((brick) => {
      const brickSprite = brick as Phaser.Physics.Arcade.Sprite
      const brickWidth = brickSprite.displayWidth
      const brickHeight = brickSprite.displayHeight
      this.occupiedSpaces.push({
        x: brickSprite.x - brickWidth / 2,
        y: brickSprite.y - brickHeight / 2,
        width: brickWidth,
        height: brickHeight,
      })
    })
  }

  /**
   * Clear all occupied spaces
   */
  clearOccupiedSpaces(): void {
    this.occupiedSpaces = []
  }

  /**
   * Get current occupied spaces
   */
  getOccupiedSpaces(): Array<{ x: number; y: number; width: number; height: number }> {
    return [...this.occupiedSpaces]
  }

  /**
   * Get brick aspect ratio information
   */
  getBrickAspectRatio(textureName: string): AspectRatioInfo | undefined {
    return this.brickAspectRatios.get(textureName)
  }

  /**
   * Get brick area configuration
   */
  private getBrickArea(): BrickArea {
    return {
      x: this.config.brickAreaMargin,
      y: 80,
      width: this.config.gameWidth - this.config.brickAreaMargin * 2,
      height: this.config.brickAreaHeight,
    }
  }

  /**
   * Get weighted random size based on probability weights
   */
  private getWeightedRandomSize(weights: Array<{ size: number; weight: number }>): number {
    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0)
    let random = Math.random() * totalWeight

    for (const item of weights) {
      random -= item.weight
      if (random <= 0) {
        return item.size
      }
    }

    // Fallback (normally unreachable)
    return weights[0].size
  }

  /**
   * Get optimal texture for target size
   */
  private getOptimalTexture(baseName: string, targetSize: number): string {
    // Available sizes
    const availableSizes = [...this.config.brickSizes] as number[]

    // Select size closest to target size
    let bestSize = availableSizes[0]
    let minDifference = Math.abs(targetSize - bestSize)

    for (const size of availableSizes) {
      const difference = Math.abs(targetSize - size)
      if (difference < minDifference) {
        minDifference = difference
        bestSize = size
      }
    }

    // Extract image type from base name (e.g., "brick-d1" -> "d1")
    const imageType = baseName.replace('brick-', '')

    // Return optimal texture key
    return `brick-${imageType}-${bestSize}`
  }

  /**
   * Check if two rectangles overlap with margin
   */
  private rectanglesOverlap(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number },
  ): boolean {
    // Add margin to ensure proper spacing
    const margin = 8 // 8px spacing

    // Check overlap with margin included
    const rect1WithMargin = {
      x: rect1.x - margin,
      y: rect1.y - margin,
      width: rect1.width + margin * 2,
      height: rect1.height + margin * 2,
    }

    // Overlap detection (ensure complete non-overlap with margin)
    return !(
      rect1WithMargin.x + rect1WithMargin.width <= rect2.x ||
      rect2.x + rect2.width <= rect1WithMargin.x ||
      rect1WithMargin.y + rect1WithMargin.height <= rect2.y ||
      rect2.y + rect2.height <= rect1WithMargin.y
    )
  }
}
