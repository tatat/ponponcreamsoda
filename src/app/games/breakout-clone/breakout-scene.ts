import * as Phaser from 'phaser'
import { assertNonNullable } from '@/helpers/assertions'
import { assertSpriteLight } from '@/helpers/phaser-assertions'
import { destroyAndNull } from '@/helpers/cleanup'
import { GameSettings, loadSettings } from './settings'
import { Starfield } from './starfield'
import { BrickGenerator } from './brick-generator'
import { BossManager } from './boss-manager'
import { ControlsManager } from './controls-manager'
import { constants } from './constants'
import { BreakoutState } from './breakout-state'
import { VisibilityManager } from './visibility-manager'
import { UIManager } from './ui-manager'
import { SoundManager } from './sound-manager'

/**
 * BreakoutScene class - Main scene for endless breakout game
 */
export class BreakoutScene extends Phaser.Scene {
  private paddle!: Phaser.Physics.Arcade.Sprite
  private ball!: Phaser.Physics.Arcade.Sprite
  private bricks!: Phaser.Physics.Arcade.StaticGroup
  private brickSpawnTimer: Phaser.Time.TimerEvent | null = null
  private brickGenerator!: BrickGenerator
  private bossManager!: BossManager
  private specialBallTimer: Phaser.Time.TimerEvent | null = null // Timer for special ball generation
  private controlsManager!: ControlsManager
  private gameSettings: GameSettings = loadSettings()
  private starfield!: Starfield
  private soundManager!: SoundManager
  private specialBalls: Phaser.Physics.Arcade.Sprite[] = [] // Array to track special balls
  private gameState!: BreakoutState
  private visibilityManager!: VisibilityManager
  private uiManager!: UIManager

  constructor() {
    super({ key: 'BreakoutScene' })
    this.gameState = new BreakoutState()
  }

  preload() {
    // Load pre-sized brick images (2x resolution for Retina support)
    constants.BRICK_NAMES.forEach((name) => {
      constants.BRICK_SIZES.forEach((size) => {
        this.load.image(`brick-${name}-${size}`, `/games/breakout-clone/images/i-${name}-${size}@2x.png`)
      })
    })

    // Initialize sound manager with settings from registry
    const registrySettings = this.registry.get('settings') as GameSettings
    const soundSettings = registrySettings ? registrySettings.sound : this.gameSettings.sound
    this.soundManager = new SoundManager(this, soundSettings)
    this.soundManager.preload()

    // Create graphics for game objects using proper sizes
    this.createGameGraphics()
  }

  private createGameGraphics() {
    // Create paddle texture
    const paddleGraphics = this.add.graphics()
    paddleGraphics.fillStyle(0xffffff) // White
    paddleGraphics.fillRect(0, 0, 100, 20)
    paddleGraphics.generateTexture('paddle', 100, 20)
    paddleGraphics.destroy()

    // Create ball texture
    const ballGraphics = this.add.graphics()
    ballGraphics.fillStyle(0xffffff) // White
    ballGraphics.fillCircle(8, 8, 8)
    ballGraphics.generateTexture('ball', 16, 16)
    ballGraphics.destroy()

    // Create special ball texture (fluorescent green with glow)
    const specialBallGraphics = this.add.graphics()
    // Create glow effect with multiple circles
    specialBallGraphics.fillStyle(0x00ff88, 0.3) // Outer glow
    specialBallGraphics.fillCircle(8, 8, 12)
    specialBallGraphics.fillStyle(0x00ff88, 0.6) // Middle glow
    specialBallGraphics.fillCircle(8, 8, 10)
    specialBallGraphics.fillStyle(0x00ff88, 1.0) // Core
    specialBallGraphics.fillCircle(8, 8, 8)
    specialBallGraphics.generateTexture('specialBall', 16, 16)
    specialBallGraphics.destroy()

    // Create brick texture
    const brickGraphics = this.add.graphics()
    brickGraphics.fillStyle(0xffb3ba) // Pastel pink
    brickGraphics.fillRect(0, 0, 60, 28)
    brickGraphics.generateTexture('brick', 60, 28)
    brickGraphics.destroy()
  }

  create() {
    // Create starfield background with default settings
    // - 3 layers: 200, 80, 20 stars with sizes 1, 2, 3px
    // - Shooting stars every 8-20 seconds
    this.starfield = new Starfield(this, {
      width: constants.GAME_WIDTH,
      height: constants.GAME_HEIGHT,
    })
    this.starfield.create()

    // Set initial score to 900 in debug mode
    if (this.gameSettings.debugMode) {
      this.gameState.initializeDebugMode()
    }

    // Create paddle
    this.paddle = this.physics.add.sprite(constants.GAME_CENTER_X, constants.PADDLE_GROUND_Y, 'paddle')
    this.paddle.setDisplaySize(100, 20)
    this.paddle.setTint(0xffffff) // White
    this.paddle.setImmovable(true)
    this.paddle.setSize(100, 20)
    // Initially disable gravity - only enable during jumping
    this.paddle.setGravityY(0)

    // Create ball
    this.ball = this.physics.add.sprite(constants.GAME_CENTER_X, constants.BALL_START_Y, 'ball')
    this.ball.setDisplaySize(16, 16)
    this.ball.setTint(0xffffff) // White
    // Enable world bounds collision (with the 4th parameter onWorldBounds to true)
    this.ball.setCollideWorldBounds(true, undefined, undefined, true)
    // Manually disable bottom collision by setting world bounds
    this.physics.world.setBounds(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT, true, true, true, false)
    this.ball.setBounce(1, 1)
    this.ball.setCircle(8) // Make it a circle with radius 8
    // Don't start the ball moving yet
    this.ball.setVelocity(0, 0)

    // Add world bounds collision event for wall hit sounds
    this.physics.world.on('worldbounds', () => {
      this.playRandomHitSound()
    })

    // Create bricks
    this.bricks = this.physics.add.staticGroup()

    // Initialize brick generator after bricks group is created
    this.brickGenerator = new BrickGenerator(this, this.bricks, {
      gameWidth: constants.GAME_WIDTH,
      gameHeight: constants.GAME_HEIGHT,
      brickAreaMargin: constants.BRICK_AREA_MARGIN,
      brickAreaHeight: constants.BRICK_AREA_HEIGHT,
      brickSizes: constants.BRICK_SIZES,
      brickNames: constants.BRICK_NAMES,
    })
    this.brickGenerator.initializeBrickAspectRatios()

    // Initialize boss manager
    this.bossManager = new BossManager(this, this.brickGenerator, {
      onBossBattleWillStart: () => {
        // Hide all existing bricks with fade out effect when boss battle is about to start
        this.hideBricksWithFadeOut(() => {
          // Clear occupied spaces since all bricks are gone
          this.brickGenerator.clearOccupiedSpaces()
        })
      },
      onBossStarted: () => {
        // Add boss collision for main ball and special balls when boss is ready
        this.bossManager.addBossCollision([this.ball, ...this.specialBalls], () => this.playRandomHitSound())
      },
      onBossDefeated: () => {
        this.createBricksWithFadeIn()
      },
    })

    this.createBricks()

    // Collision detection will be set when the game starts

    // Initialize controls manager
    this.controlsManager = new ControlsManager(this, {
      onStartGame: () => {
        if (!this.gameState.isGameStarted && !this.gameState.isGameOver) {
          this.startGame()
        }
      },
      onJump: () => {
        if (!this.gameState.isGameStarted && !this.gameState.isGameOver) {
          this.startGame()
        } else if (this.gameState.canJump()) {
          this.startJump()
        }
      },
      onPause: () => {
        if (this.gameState.isGameStarted && !this.gameState.isGameOver) {
          this.togglePause()
        }
      },
      onRestart: () => {
        this.restartGame()
      },
    })
    this.controlsManager.initialize()

    // Initialize UI Manager with initial data from game state
    this.uiManager = new UIManager(this, {
      score: this.gameState.score,
      lives: this.gameState.lives,
      formattedElapsedTime: this.gameState.getFormattedElapsedTime(),
    })
    this.uiManager.initialize()

    // Initialize sound manager
    this.soundManager.initialize()

    // Apply settings from registry (latest settings)
    const currentSettings = this.registry.get('settings') as GameSettings
    if (currentSettings) {
      console.log('BreakoutScene applying registry settings:', currentSettings.sound)
      this.applySettings(currentSettings)
    } else {
      console.log('BreakoutScene applying default settings:', this.gameSettings.sound)
      this.applySettings(this.gameSettings)
    }

    // Add visibility change listener for auto-pause
    this.setupVisibilityListener()
  }

  private setupVisibilityListener() {
    // Initialize visibility manager
    this.visibilityManager = new VisibilityManager((isWindowHidden: boolean) => {
      // Auto-pause when window becomes inactive/hidden
      if (isWindowHidden) {
        // Auto-pause if game is running
        if (this.gameState.isGameStarted && !this.gameState.isGameOver && !this.gameState.isPaused) {
          this.togglePause()
        }
      }
    })

    this.visibilityManager.startListening()

    // Clean up listeners when scene is destroyed
    this.events.on('destroy', () => {
      this.visibilityManager.stopListening()
      this.soundManager.destroy()
    })
  }

  update() {
    // Update paddle movement
    this.updatePaddleMovement()

    if (this.gameState.isGameOver || this.gameState.isPaused) {
      return
    }

    // Update elapsed time if game is started
    if (this.gameState.isGameActive()) {
      this.gameState.elapsedTimeMs = this.gameState.calculateElapsedTime()
      this.uiManager.updateElapsedTime(this.gameState.getFormattedElapsedTime())
    }

    // Handle jumping physics
    if (this.gameState.isJumping) {
      this.gameState.addJumpDuration(this.game.loop.delta)

      // Check if paddle should land (only when actually at ground level and falling)
      if (this.paddle.y >= constants.PADDLE_GROUND_Y && (this.paddle.body?.velocity.y ?? 0) >= 0) {
        // Natural landing - let physics handle it smoothly
        this.paddle.y = constants.PADDLE_GROUND_Y
        this.paddle.setVelocityY(0)
        this.paddle.setGravityY(0)
        this.gameState.endJump()

        // Add a small bounce effect after landing
        this.tweens.add({
          targets: this.paddle,
          scaleY: 0.9,
          duration: 120,
          yoyo: true,
          ease: 'Power2',
        })
      }
    }

    // Ensure paddle stays at ground level when not jumping
    if (!this.gameState.isJumping) {
      if (this.paddle.y !== constants.PADDLE_GROUND_Y) {
        this.paddle.y = constants.PADDLE_GROUND_Y
        this.paddle.setVelocityY(0)
      }
      this.paddle.setGravityY(0)
    }

    // Check if ball falls below paddle
    if (this.ball.y > constants.BALL_DEATH_Y) {
      // Check before ball completely leaves screen
      this.ballDied()
    }

    // Check if special balls fall below paddle (just remove them, no life loss)
    for (let i = this.specialBalls.length - 1; i >= 0; i--) {
      const specialBall = this.specialBalls[i]
      if (specialBall.y > constants.BALL_DEATH_Y) {
        this.removeSpecialBallAt(i)
      }
    }
  }

  private updatePaddleMovement() {
    // Get movement input from ControlsManager
    const movementInput = this.controlsManager.getMovementInput()

    // Paddle movement (disabled during game over or pause)
    if (this.gameState.canMove()) {
      // Check if fast move is pressed for acceleration
      const isAccelerated = movementInput.isFastMovePressed
      const baseSpeed = 400
      const acceleratedSpeed = baseSpeed * 1.75 // 1.75x speed when fast move is pressed
      const speed = isAccelerated ? acceleratedSpeed : baseSpeed

      if (movementInput.isLeftPressed) {
        this.paddle.setVelocityX(-speed)
      } else if (movementInput.isRightPressed) {
        this.paddle.setVelocityX(speed)
      } else {
        this.paddle.setVelocityX(0)
      }
    } else {
      // Stop paddle movement during game over or pause
      this.paddle.setVelocityX(0)
    }

    // Keep paddle within bounds (considering paddle width)
    const paddleHalfWidth = 50 // Paddle width is 100px so half is 50px
    const leftBound = paddleHalfWidth
    const rightBound = constants.GAME_WIDTH - paddleHalfWidth

    if (this.paddle.x <= leftBound) {
      this.paddle.x = leftBound
      // Restrict only leftward movement (allow rightward movement)
      if ((this.paddle.body?.velocity.x ?? 0) < 0) {
        this.paddle.setVelocityX(0)
      }
    } else if (this.paddle.x >= rightBound) {
      this.paddle.x = rightBound
      // Restrict only rightward movement (allow leftward movement)
      if ((this.paddle.body?.velocity.x ?? 0) > 0) {
        this.paddle.setVelocityX(0)
      }
    }
  }

  private createBricks() {
    // Generate initial bricks using BrickGenerator
    this.brickGenerator.generateInitialBricks()
  }

  private addNewBrick() {
    if (
      this.gameState.isGameOver ||
      !this.gameState.isGameStarted ||
      this.gameState.isPaused ||
      this.bossManager.isBossBattleActive()
    ) {
      return
    }

    // Use BrickGenerator to add new brick
    this.brickGenerator.addNewBrick()
  }

  private getScoreBySize(size: number): number {
    // Use scoring system from BreakoutConstants
    return constants.SCORE_BY_SIZE[size as keyof typeof constants.SCORE_BY_SIZE] ?? constants.DEFAULT_SCORE
  }

  private hitPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, paddle) => {
    assertSpriteLight(ball)
    assertSpriteLight(paddle)
    const ballSprite = ball
    const paddleSprite = paddle

    // Play random hit sound
    this.playRandomHitSound()

    // If paddle is moving, reflect its velocity in the ball's bounce angle
    assertNonNullable(paddleSprite.body, 'Paddle body is not available')
    assertNonNullable(ballSprite.body, 'Ball body is not available')
    const paddleVelocityX = paddleSprite.body.velocity.x
    const currentBallVelocityX = ballSprite.body.velocity.x
    const currentBallVelocityY = ballSprite.body.velocity.y

    // Calculate new X velocity considering paddle movement
    // Add 30% of paddle velocity for more natural bounce
    const newVelocityX = currentBallVelocityX + paddleVelocityX * 0.3

    // Ensure Y velocity is upward (minimum -150 velocity)
    const newVelocityY = Math.min(currentBallVelocityY, -150)

    ballSprite.setVelocity(newVelocityX, newVelocityY)
  }

  private hitBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, brick) => {
    assertSpriteLight(brick)
    const brickSprite = brick
    const brickX = brickSprite.x
    const brickY = brickSprite.y

    // Get base size from brick texture name
    const textureName = brickSprite.texture.key
    // Extract base size directly from texture name (e.g., "brick-d1-100" -> 100)
    const sizeMatch = textureName.match(/-([0-9]+)$/)
    let baseSize = 50 // Default

    if (sizeMatch) {
      baseSize = parseInt(sizeMatch[1], 10)
    }

    brickSprite.destroy()

    // Play random hit sound
    this.playRandomHitSound()

    // Add points based on base size
    const points = this.getScoreBySize(baseSize)
    this.gameState.addScore(points)
    this.uiManager.updateScore(this.gameState.score)

    // Point display effect
    this.uiManager.showPointsEffect(brickX, brickY, points)

    // Update occupied spaces using BrickGenerator
    this.brickGenerator.updateOccupiedSpaces()

    // Check for boss battle trigger
    const shouldStartBoss = this.bossManager.checkBossBattle(this.gameState.score)
    if (shouldStartBoss) {
      // Start the boss battle (collision will be added automatically via onBossStarted callback)
      this.bossManager.startBossBattle()
    }

    // If all bricks are destroyed, get bonus points and respawn bricks
    // However, disable all-clear check during boss battles
    if (this.bricks.children.size === 0 && !this.bossManager.isBossBattleActive()) {
      this.allBricksCleared()
    }
  }

  private createBricksWithFadeIn() {
    // Recreate normal bricks with fade in
    this.createBricks()

    // Fade in all new bricks
    this.bricks.children.entries.forEach((brick) => {
      const brickSprite = brick as Phaser.Physics.Arcade.Sprite
      brickSprite.setAlpha(0)
      this.tweens.add({
        targets: brickSprite,
        alpha: 1,
        duration: 1000,
        ease: 'Power2',
      })
    })
  }

  private hideBricksWithFadeOut(onComplete?: () => void) {
    const brickEntries = this.bricks.children.entries
    let completedAnimations = 0
    const totalBricks = brickEntries.length

    if (totalBricks === 0) {
      onComplete?.()
      return
    }

    brickEntries.forEach((brick) => {
      const brickSprite = brick as Phaser.Physics.Arcade.Sprite
      this.tweens.add({
        targets: brickSprite,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          brickSprite.destroy()
          completedAnimations++

          // Call onComplete callback when all animations are finished
          if (completedAnimations === totalBricks) {
            onComplete?.()
          }
        },
      })
    })
  }

  private ballDied() {
    // Do nothing if already processing death
    if (this.gameState.isGameOver) {
      return
    }

    // Record ball position
    const ballX = this.ball.x
    const ballY = this.ball.y

    // Stop ball and move off-screen (to avoid retriggering condition)
    this.ball.setVelocity(0, 0)
    this.ball.setPosition(constants.GAME_CENTER_X, constants.BALL_START_Y) // Move to safe position
    this.ball.disableBody() // Disable ball physics

    // Reduce lives and proceed to next process
    this.gameState.loseLife()
    this.uiManager.updateLives(this.gameState.lives)

    // Hide ball immediately if it's the last life
    if (this.gameState.lives <= 0) {
      this.ball.setVisible(false)
    }

    // Show explosion and miss effects using UIManager
    this.uiManager.showExplosionEffect(ballX, ballY)
    this.uiManager.showMissEffect(ballX, ballY)

    // Shake screen slightly
    this.uiManager.shakeCamera(300, 0.01)

    // Proceed to next process with slight delay
    this.time.delayedCall(1000, () => {
      if (this.gameState.lives <= 0) {
        this.gameOver()
      } else {
        this.resetBall()
      }
    })
  }

  private allBricksCleared() {
    // Get bonus points (100 points)
    this.gameState.addScore(100)
    this.uiManager.updateScore(this.gameState.score)

    // Display bonus acquisition effect
    this.uiManager.showBonusEffect()

    // Respawn all bricks
    this.brickGenerator.clearOccupiedSpaces()
    this.createBricks()
  }

  private resetBall() {
    this.ball.setPosition(constants.GAME_CENTER_X, constants.BALL_START_Y)
    this.ball.setVelocity(0, 0) // Stop ball
    this.ball.disableBody()

    // Automatically enable collision detection and restart ball after 1 second
    this.time.delayedCall(1000, () => {
      this.ball.enableBody()
      this.resumeGame()
    })
  }

  private launchBallWithRandomAngle() {
    const speed = 250
    const angle = Phaser.Math.Between(-45, 45)
    const radians = Phaser.Math.DegToRad(angle)
    const velocityX = Math.sin(radians) * speed
    const velocityY = -Math.cos(radians) * speed
    this.ball.setVelocity(velocityX, velocityY)
  }

  private startGame() {
    if (!this.gameState.isGameStarted && !this.gameState.isGameOver) {
      this.gameState.isGameStarted = true
      this.gameState.startTime = Date.now() // Record start time
      this.gameState.elapsedTimeMs = 0
      this.uiManager.hideStartScreen()

      // Enable ball physics body before starting
      this.ball.enableBody()

      // Enable collision detection the moment ball starts moving
      this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, undefined, this)
      this.physics.add.collider(this.ball, this.bricks, this.hitBrick, undefined, this)

      this.launchBallWithRandomAngle()

      // Start brick addition timer (5 second intervals)
      this.brickSpawnTimer = this.time.addEvent({
        delay: 5000,
        callback: this.addNewBrick,
        callbackScope: this,
        loop: true,
      })

      // Start special ball timer (30 second intervals)
      this.specialBallTimer = this.time.addEvent({
        delay: 30000,
        callback: this.createSpecialBall,
        callbackScope: this,
        loop: true,
      })
    }
  }

  private togglePause() {
    this.gameState.togglePause()

    const { isPaused } = this.gameState

    if (isPaused) {
      // Record pause start time
      this.gameState.startPause()

      // Pause the game
      this.physics.pause()
      this.uiManager.showPauseScreen()
    } else {
      // Calculate paused duration and add to total
      this.gameState.endPause()

      // Resume the game
      this.physics.resume()
      this.uiManager.hidePauseScreen()
    }

    if (this.brickSpawnTimer) {
      this.brickSpawnTimer.paused = isPaused
    }

    if (this.specialBallTimer) {
      this.specialBallTimer.paused = isPaused
    }
  }

  private resumeGame() {
    // Re-enable collision detection and move ball
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, undefined, this)
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, undefined, this)

    this.launchBallWithRandomAngle()
  }

  private startJump() {
    this.gameState.startJump()

    // Set initial jump velocity with easing
    this.paddle.setVelocityY(this.gameState.jumpVelocity)
    this.paddle.setGravityY(this.gameState.gravity)

    // Add a slight scale effect for visual feedback
    this.tweens.add({
      targets: this.paddle,
      scaleY: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Power2',
    })
  }

  private gameOver() {
    this.gameState.isGameOver = true
    this.ball.setVelocity(0, 0)
    this.ball.setVisible(false) // Hide ball

    // Destroy all special balls
    this.clearSpecialBalls()

    // Stop special ball timer
    this.specialBallTimer = destroyAndNull(this.specialBallTimer)

    // Make paddle fall with animation
    this.paddle.setImmovable(false) // Make paddle movable
    this.paddle.setGravityY(800) // Apply gravity
    this.paddle.setVelocityY(0) // Reset initial velocity
    this.gameState.isJumping = false

    // Display game over after paddle falls with slight delay
    this.time.delayedCall(1500, () => {
      // Show game over screen using UIManager
      this.uiManager.showGameOverScreen(this.gameState.score, this.gameState.elapsedTimeMs)

      // Add touch restart for all devices
      this.setupGameOverTouchRestart()
    })

    // Stop timers
    this.brickSpawnTimer = destroyAndNull(this.brickSpawnTimer)
  }

  private restartGame() {
    // Reset game state
    this.gameState.reset()

    // Clear special balls
    this.clearSpecialBalls()

    // Reset controls manager state
    this.controlsManager.resetState()

    // Reset boss manager
    this.bossManager.reset()

    // Stop special ball timer if it exists
    this.specialBallTimer = destroyAndNull(this.specialBallTimer)

    this.physics.resume()

    // Stop brick spawn timer if it exists
    this.brickSpawnTimer = destroyAndNull(this.brickSpawnTimer)

    // Reset UI using UIManager
    this.uiManager.reset()

    // Set initial score to 900 in debug mode
    if (this.gameSettings.debugMode) {
      this.gameState.initializeDebugMode()
      this.uiManager.updateScore(this.gameState.score)
    }

    // Reset ball and paddle
    this.paddle.setPosition(constants.GAME_CENTER_X, constants.PADDLE_GROUND_Y)
    this.paddle.setVelocity(0, 0)
    this.paddle.setGravityY(0) // Initially disable gravity
    this.paddle.setImmovable(true) // Return paddle to fixed state
    this.gameState.resetJumping()
    this.ball.setVisible(true) // Show ball again

    // Reset ball to initial state (don't auto-start like resetBall() does)
    this.ball.setPosition(constants.GAME_CENTER_X, constants.BALL_START_Y)
    this.ball.setVelocity(0, 0)
    this.ball.disableBody() // Keep disabled until game starts

    // Clear occupied spaces and recreate bricks
    this.brickGenerator.clearOccupiedSpaces()
    this.bricks.clear(true, true)
    this.createBricks()
  }

  private setupGameOverTouchRestart() {
    // Use ControlsManager for game over touch restart
    this.controlsManager.setupGameOverTouchRestart(() => {
      if (this.gameState.isGameOver) {
        this.restartGame()
      }
    })
  }

  private createSpecialBall() {
    // Skip if game is paused or not started
    if (this.gameState.isPaused || !this.gameState.isGameStarted || this.gameState.isGameOver) {
      return
    }

    // Create special ball at random position
    const offsetX = Math.random() * 200 - 100 // Random offset from center
    const specialBall = this.physics.add.sprite(
      constants.GAME_CENTER_X + offsetX,
      constants.BALL_START_Y,
      'specialBall',
    )
    specialBall.setDisplaySize(16, 16)
    specialBall.setTint(0x00ff88) // Fluorescent green color
    // Enable world bounds collision (with the 4th parameter onWorldBounds to true)
    specialBall.setCollideWorldBounds(true, undefined, undefined, true)
    // Disable bottom collision for special ball - it just disappears when it falls
    this.physics.world.setBounds(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT, true, true, true, false)
    specialBall.setBounce(1, 1)
    specialBall.setCircle(8)
    specialBall.setDepth(5)

    // Add collision with paddle, bricks, and boss
    this.physics.add.collider(specialBall, this.paddle, this.hitPaddle, undefined, this)
    this.physics.add.collider(specialBall, this.bricks, this.hitBrick, undefined, this)

    // Add boss collision if boss exists
    const bossSprite = this.bossManager.getBossSprite()
    if (bossSprite) {
      this.physics.add.collider(
        specialBall,
        bossSprite,
        this.bossManager.createHitBossCallback(() => this.playRandomHitSound()),
        undefined,
        this,
      )
    }

    // Launch special ball with random angle
    const speed = 200
    const angle = Phaser.Math.Between(-30, 30)
    const radians = Phaser.Math.DegToRad(angle)
    const velocityX = Math.sin(radians) * speed
    const velocityY = -Math.cos(radians) * speed
    specialBall.setVelocity(velocityX, velocityY)

    // Add stronger glowing effect for fluorescent green
    this.tweens.add({
      targets: specialBall,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Add scale pulsing for extra glow effect
    this.tweens.add({
      targets: specialBall,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Add to special balls array
    this.addSpecialBall(specialBall)
  }

  private playRandomHitSound() {
    // Don't play sound if disabled in settings
    if (!this.gameSettings.sound.soundEnabled) {
      return
    }

    // Don't play sound if window is not visible/active to prevent queued audio playback
    if (this.visibilityManager.isWindowHidden()) {
      return
    }

    // Delegate to sound manager for actual sound playback
    this.soundManager.playRandomHitSound()
  }

  // Method to apply settings
  public applySettings(newSettings: GameSettings) {
    this.gameSettings = newSettings

    // Update sound manager settings
    this.soundManager.applySettings(newSettings.sound)

    // Toggle Virtual Pad visibility
    this.controlsManager.setVirtualPadVisibility(newSettings.showVirtualPad)
  }

  // Method to pause game when settings modal opens
  public pauseForSettings() {
    if (this.gameState.isGameStarted && !this.gameState.isGameOver && !this.gameState.isPaused) {
      this.togglePause()
    }
  }

  // Special balls management methods
  private addSpecialBall(ball: Phaser.Physics.Arcade.Sprite): void {
    this.specialBalls.push(ball)
  }

  private clearSpecialBalls(): void {
    this.specialBalls.forEach((ball) => ball.destroy())
    this.specialBalls = []
  }

  private removeSpecialBallAt(index: number): void {
    if (index >= 0 && index < this.specialBalls.length) {
      this.specialBalls[index].destroy()
      this.specialBalls.splice(index, 1)
    }
  }
}
