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

  constructor() {
    super({ key: 'MainScene' })
  }

  create(data?: { isRestart: boolean }) {
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

    // Pause physics initially
    this.physics.pause()

    if (data && data.isRestart) {
      this.startGame()
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
    this.scoreText = this.add.text(20, 50, 'Score: 0', {
      fontSize: '32px',
      color: '#ffffff',
    })
    this.scoreText.setDepth(100)

    this.startText = this.add.text(
      constants.GAME_WIDTH / 2,
      constants.GAME_HEIGHT / 2,
      'STICKER DRIFT\nTap or Click to Start',
      {
        fontSize: '64px',
        fontFamily: '"Kaisei Decol", serif',
        color: '#ffffff',
        align: 'center',
      },
    )
    this.startText.setOrigin(0.5)
    this.startText.setDepth(100)

    this.gameOverText = this.add.text(
      constants.GAME_WIDTH / 2,
      constants.GAME_HEIGHT / 2,
      'GAME OVER\nTap or Click to Restart',
      {
        fontSize: '64px',
        fontFamily: '"Kaisei Decol", serif',
        color: '#ff6b6b',
        align: 'center',
      },
    )
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setDepth(100)
    this.gameOverText.setVisible(false)
  }

  private setupControls() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()

      // Space key for floating
      this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.isGameStarted) {
          this.startGame()
          return
        }
        if (this.isGameOver) {
          this.scene.restart({ isRestart: true })
          return
        }
        this.isFloating = true
      })

      this.input.keyboard.on('keyup-SPACE', () => {
        this.isFloating = false
      })
    }

    // Touch/Click controls
    this.input.on('pointerdown', () => {
      if (!this.isGameStarted) {
        this.startGame()
        return
      }

      if (this.isGameOver) {
        this.scene.restart({ isRestart: true })
        return
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
    this.physics.resume()
  }

  update(time: number, delta: number) {
    if (this.isGameOver || !this.isGameStarted) return

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

    // Background parallax
    this.backgroundStars.forEach((star) => {
      star.x -= 2 * this.gameSpeed
      if (star.x < 0) {
        star.x = constants.GAME_WIDTH
        star.y = Phaser.Math.Between(0, constants.GAME_HEIGHT)
      }
    })

    // Homing obstacles and cleanup
    this.obstacles.children.entries.forEach((obstacle) => {
      const sprite = obstacle as Phaser.Physics.Arcade.Sprite

      // Homing behavior - gently track player Y position with smooth curves
      if (sprite.getData('isHoming') && sprite.body) {
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

          // Gradually accelerate towards target velocity (0.15 = 15% change for smooth curves)
          const acceleration = (targetVelocity - currentVelocity) * 0.15
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
    this.physics.pause()
    this.isGameOver = true
    this.player.setTint(0xff0000)

    this.gameOverText.setVisible(true)
  }
}
