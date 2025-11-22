import Phaser from 'phaser'
import { constants } from '../config'

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private obstacles!: Phaser.Physics.Arcade.Group
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private isGameOver: boolean = false
  private gameSpeed: number = 1
  private lastSpawnTime: number = 0
  private backgroundStars: Phaser.GameObjects.Arc[] = []
  private isGameStarted: boolean = false
  private isFloating: boolean = false
  private startText!: Phaser.GameObjects.Text
  private gameOverText!: Phaser.GameObjects.Text
  private overlay!: Phaser.GameObjects.Graphics
  private debugButton!: Phaser.GameObjects.Text
  private static debugMode: boolean = false

  constructor() {
    super({ key: 'MainScene' })
  }

  create(data?: { isRestart: boolean; shouldFloat?: boolean }) {
    this.isGameOver = false
    this.isGameStarted = false
    this.isFloating = false
    this.score = 0
    this.gameSpeed = 1
    this.lastSpawnTime = 0

    this.createBackground()
    this.createPlayer()
    this.createObstacles()
    this.createUI()
    this.setupControls()

    // Collision - using collider like breakout-clone
    this.physics.add.collider(this.player, this.obstacles, this.handleCollision, undefined, this)

    // Apply saved debug mode
    this.physics.world.drawDebug = MainScene.debugMode
    if (MainScene.debugMode) {
      this.physics.world.createDebugGraphic()
    }

    // Pause physics initially
    this.physics.pause()

    if (data && data.isRestart) {
      this.startGame()
      // Preserve floating state if space/pointer was held during restart
      if (data.shouldFloat) {
        this.isFloating = true
      }
    }
  }

  private createBackground() {
    // Simple starfield effect
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, constants.GAME_WIDTH)
      const y = Phaser.Math.Between(0, constants.GAME_HEIGHT)
      const size = Phaser.Math.FloatBetween(1, 3)
      const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8))
      this.backgroundStars.push(star)
    }

    // Create ceiling and floor walls
    const wallHeight = 30
    const wallColor = 0x2a2a3e // Dark blue-gray
    const edgeColor = 0xff6b6b // Red edge for danger

    // Ceiling (top wall)
    const ceiling = this.add.graphics()
    ceiling.fillStyle(wallColor, 1)
    ceiling.fillRect(0, 0, constants.GAME_WIDTH, wallHeight)
    ceiling.fillStyle(edgeColor, 1)
    ceiling.fillRect(0, wallHeight - 3, constants.GAME_WIDTH, 3) // Red danger edge
    ceiling.setDepth(10)

    // Floor (bottom wall)
    const floor = this.add.graphics()
    floor.fillStyle(wallColor, 1)
    floor.fillRect(0, constants.GAME_HEIGHT - wallHeight, constants.GAME_WIDTH, wallHeight)
    floor.fillStyle(edgeColor, 1)
    floor.fillRect(0, constants.GAME_HEIGHT - wallHeight, constants.GAME_WIDTH, 3) // Red danger edge
    floor.setDepth(10)
  }

  private createPlayer() {
    // Use d1 as player
    this.player = this.physics.add.sprite(200, constants.GAME_HEIGHT / 2, 'sticker-d1')

    // Get original texture size
    const origWidth = this.player.width
    const origHeight = this.player.height

    // Set scale to maintain aspect ratio (target height: 64px)
    const targetSize = 64
    const scale = targetSize / Math.max(origWidth, origHeight)
    this.player.setScale(scale)

    // Reset visual properties (important for restart after game over animation)
    this.player.setAlpha(1)
    this.player.setAngle(0)
    this.player.setVisible(true)
    this.player.clearTint()

    // Set circular collision body - smaller radius to match visible part of sticker
    const radius = Math.min(origWidth, origHeight) * 0.35
    // Center the circle by offsetting from top-left
    const offsetX = (origWidth - radius * 2) / 2
    const offsetY = (origHeight - radius * 2) / 2
    this.player.setCircle(radius, offsetX, offsetY)
    this.player.refreshBody() // Update physics body to match new size

    this.player.setCollideWorldBounds(true)
    this.player.setDrag(0, constants.PLAYER_DRAG)
    this.player.setMaxVelocity(0, 800)

    // Add a subtle floating animation
    this.tweens.add({
      targets: this.player,
      angle: { from: -5, to: 5 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false, // Obstacles should not be affected by world gravity
    })
    // Spawning is now handled dynamically in update() based on gameSpeed
  }

  private spawnObstacle() {
    if (this.isGameOver || !this.isGameStarted) return

    const stickers = ['d2', 'r1', 'r2', 't1', 't2']
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)]

    const y = Phaser.Math.Between(50, constants.GAME_HEIGHT - 50)
    const obstacle = this.obstacles.create(
      constants.GAME_WIDTH + 100,
      y,
      `sticker-${randomSticker}`,
    ) as Phaser.Physics.Arcade.Sprite

    // Get original texture size before scaling
    const origWidth = obstacle.width
    const origHeight = obstacle.height

    // Set scale to maintain aspect ratio
    const targetSize = Phaser.Math.Between(48, 96)
    const scale = targetSize / Math.max(origWidth, origHeight)
    obstacle.setScale(scale)

    // Set circular collision body - smaller radius to match visible part of sticker
    const radius = Math.min(origWidth, origHeight) * 0.35
    // Center the circle by offsetting from top-left
    const offsetX = (origWidth - radius * 2) / 2
    const offsetY = (origHeight - radius * 2) / 2
    obstacle.setCircle(radius, offsetX, offsetY)

    // Move toward player direction
    const speed = Phaser.Math.Between(constants.OBSTACLE_SPEED_MIN, constants.OBSTACLE_SPEED_MAX) * this.gameSpeed
    const angleToPlayer = Phaser.Math.Angle.Between(obstacle.x, obstacle.y, this.player.x, this.player.y)

    // Set velocity toward player
    const velocityX = Math.cos(angleToPlayer) * speed
    const velocityY = Math.sin(angleToPlayer) * speed
    obstacle.setVelocity(velocityX, velocityY)

    // Add rotation for visual effect
    obstacle.setAngularVelocity(Phaser.Math.Between(-100, 100))

    // Randomly make some obstacles homing (track player)
    const isHoming = Math.random() < constants.HOMING_PROBABILITY
    if (isHoming) {
      const homingSpeed = Phaser.Math.Between(constants.HOMING_SPEED_MIN, constants.HOMING_SPEED_MAX)
      obstacle.setData('isHoming', true)
      obstacle.setData('homingSpeed', homingSpeed)
    } else {
      obstacle.setData('isHoming', false)
    }

    // Cleanup is handled in update loop
  }

  private createUI() {
    // Semi-transparent overlay for start and game over screens
    this.overlay = this.add.graphics()
    this.overlay.fillStyle(0x000000, 0.6)
    this.overlay.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT)
    this.overlay.setDepth(100)

    this.scoreText = this.add.text(20, 50, 'Score: 0', {
      fontSize: '16px',
      color: '#ffffff',
    })
    this.scoreText.setDepth(101)

    this.startText = this.add.text(
      constants.GAME_WIDTH / 2,
      constants.GAME_HEIGHT / 2,
      `Press SPACE or TAP to start

--- CONTROLS ---
SPACE / TAP : Float (hold to rise)
Release : Fall (gravity)`,
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      },
    )
    this.startText.setOrigin(0.5)
    this.startText.setDepth(101)

    this.gameOverText = this.add.text(
      constants.GAME_WIDTH / 2,
      constants.GAME_HEIGHT / 2,
      `GAME OVER
Press SPACE or TAP to restart`,
      {
        fontSize: '32px',
        color: '#ff6b6b',
        align: 'center',
      },
    )
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setDepth(101)
    this.gameOverText.setVisible(false)

    // Debug toggle button
    const initialText = MainScene.debugMode ? 'Debug: ON' : 'Debug: OFF'
    const initialColor = MainScene.debugMode ? '#00ff00' : '#ffffff'
    this.debugButton = this.add.text(constants.GAME_WIDTH - 20, 50, initialText, {
      fontSize: '16px',
      color: initialColor,
    })
    this.debugButton.setOrigin(1, 0)
    this.debugButton.setDepth(101)
    this.debugButton.setInteractive({ useHandCursor: true })
    this.debugButton.on(
      'pointerdown',
      (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
        // Stop event propagation to prevent game start
        event.stopPropagation()

        MainScene.debugMode = !MainScene.debugMode
        this.physics.world.drawDebug = MainScene.debugMode
        this.debugButton.setText(MainScene.debugMode ? 'Debug: ON' : 'Debug: OFF')
        this.debugButton.setColor(MainScene.debugMode ? '#00ff00' : '#ffffff')

        // Clear or recreate debug graphics
        if (MainScene.debugMode) {
          this.physics.world.createDebugGraphic()
        } else {
          this.physics.world.debugGraphic?.clear()
        }
      },
    )
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()

      // Space key for floating
      this.input.keyboard.on('keydown-SPACE', () => {
        // Only allow restart after game over UI is visible (after animation)
        if (this.isGameOver && this.gameOverText.visible) {
          this.scene.restart({ isRestart: true, shouldFloat: true })
          return
        }

        // Ignore input during game over animation
        if (this.isGameOver) {
          return
        }

        if (!this.isGameStarted) {
          this.startGame()
        }

        this.isFloating = true
      })

      this.input.keyboard.on('keyup-SPACE', () => {
        this.isFloating = false
      })
    }

    // Touch/Click controls
    this.input.on('pointerdown', () => {
      // Only allow restart after game over UI is visible (after animation)
      if (this.isGameOver && this.gameOverText.visible) {
        this.scene.restart({ isRestart: true, shouldFloat: true })
        return
      }

      // Ignore input during game over animation
      if (this.isGameOver) {
        return
      }

      if (!this.isGameStarted) {
        this.startGame()
      }

      // Hold to float
      this.isFloating = true
    })

    this.input.on('pointerup', () => {
      this.isFloating = false
    })
  }

  private startGame() {
    this.isGameStarted = true
    this.startText.setVisible(false)
    this.overlay.setVisible(false)
    this.debugButton.setVisible(false)
    this.physics.resume()
  }

  update(time: number, delta: number) {
    if (!this.isGameStarted) return

    // Only update gameplay if not game over
    if (!this.isGameOver) {
      // Update Score
      this.score += delta * 0.01
      this.scoreText.setText(`Score: ${Math.floor(this.score)}`)

      // Increase difficulty over time
      this.gameSpeed += delta * 0.00005

      // Dynamic obstacle spawning based on gameSpeed
      const spawnInterval = constants.OBSTACLE_SPAWN_RATE / this.gameSpeed
      if (time - this.lastSpawnTime >= spawnInterval) {
        this.spawnObstacle()
        this.lastSpawnTime = time
      }

      // Player Movement - Float when holding, fall when released
      if (this.isFloating) {
        this.player.setAccelerationY(-constants.FLOAT_ACCELERATION)
      } else {
        this.player.setAccelerationY(0) // Let gravity handle falling
      }

      // Check if player hit top or bottom walls (game over)
      const wallHeight = 30
      const playerRadius = 32 // Half of player display size (64/2)
      if (
        this.player.y - playerRadius <= wallHeight ||
        this.player.y + playerRadius >= constants.GAME_HEIGHT - wallHeight
      ) {
        this.handleCollision()
      }
    }

    // Background parallax (continue during death animation, stop after overlay is shown)
    if (!this.isGameOver || !this.overlay.visible) {
      this.backgroundStars.forEach((star) => {
        star.x -= 2 * this.gameSpeed
        if (star.x < 0) {
          star.x = constants.GAME_WIDTH
          star.y = Phaser.Math.Between(0, constants.GAME_HEIGHT)
        }
      })
    }

    // Homing obstacles and cleanup (continue during death animation)
    this.obstacles.children.entries.forEach((obstacle) => {
      const sprite = obstacle as Phaser.Physics.Arcade.Sprite

      // Homing behavior - gently track player Y position with smooth curves (only if game is active)
      if (!this.isGameOver && sprite.getData('isHoming') && sprite.body) {
        const homingSpeed = sprite.getData('homingSpeed')
        const playerY = this.player.y
        const obstacleY = sprite.y
        const diff = playerY - obstacleY

        // Only home if difference is significant (>10px)
        if (Math.abs(diff) > 10) {
          // Calculate target velocity
          const direction = diff > 0 ? 1 : -1
          const targetVelocity = direction * homingSpeed * this.gameSpeed

          // Get current velocity
          const body = sprite.body as Phaser.Physics.Arcade.Body
          const currentVelocity = body.velocity.y

          // Gradually accelerate towards target velocity - scale with gameSpeed for consistent curve
          const accelerationRate = 0.15 * Math.min(this.gameSpeed, 2.0) // Cap at 2x for playability
          const acceleration = (targetVelocity - currentVelocity) * accelerationRate
          sprite.setAccelerationY(acceleration)
        } else {
          sprite.setAccelerationY(0)
        }
      }

      // Cleanup off-screen obstacles
      if (sprite.x < -150) {
        sprite.destroy()
      }
    })
  }

  private handleCollision() {
    this.isGameOver = true

    const playerX = this.player.x
    const playerY = this.player.y

    // Stop player physics but keep obstacles moving
    this.player.disableBody()

    // Hide player immediately (Mega Man style)
    this.player.setVisible(false)

    // Create debris particles flying in 10 directions (like Mega Man death)
    const numDebris = 10
    const debrisSpeed = 300
    const debrisSize = 16
    const glowColor = 0xffffff // White

    for (let i = 0; i < numDebris; i++) {
      const angle = (i * 360) / numDebris
      const angleRad = Phaser.Math.DegToRad(angle)

      // Create a small ring debris with glowing color
      const debris = this.add.graphics()
      debris.lineStyle(3, glowColor, 1)
      debris.strokeCircle(0, 0, debrisSize)
      debris.setPosition(playerX, playerY)
      debris.setBlendMode(Phaser.BlendModes.ADD)

      // Calculate velocity
      const velocityX = Math.cos(angleRad) * debrisSpeed
      const velocityY = Math.sin(angleRad) * debrisSpeed

      // Animate debris flying out
      this.tweens.add({
        targets: debris,
        x: playerX + velocityX * 1.5,
        y: playerY + velocityY * 1.5,
        alpha: 0,
        duration: 800,
        ease: 'Linear',
        onComplete: () => {
          debris.destroy()
        },
      })
    }

    // Update game over text with final score
    const finalScore = Math.floor(this.score)
    this.gameOverText.setText(
      `GAME OVER
Final Score: ${finalScore}
Press SPACE or TAP to restart`,
    )

    // Show game over UI after animation
    this.time.delayedCall(1000, () => {
      this.physics.pause() // Pause all physics after animation
      this.overlay.setVisible(true)
      this.gameOverText.setVisible(true)
      this.debugButton.setVisible(true)
    })
  }
}
