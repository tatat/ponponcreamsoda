import * as Phaser from 'phaser'
import React, { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import { assertNonNullable } from '@/helpers/assertions'
import { assertSpriteLight } from '@/helpers/phaser-assertions'
import { gameInfo } from './config'
import { GameSettings, loadSettings } from './settings'
import { SettingsModal } from './settings-modal'
import { Starfield } from './starfield'
import { BrickGenerator } from './brick-generator'
import { BreakoutConstants } from './constants'

/**
 * BreakoutScene class - Main scene for endless breakout game
 */
class BreakoutScene extends Phaser.Scene {
  private paddle!: Phaser.Physics.Arcade.Sprite
  private ball!: Phaser.Physics.Arcade.Sprite
  private bricks!: Phaser.Physics.Arcade.StaticGroup
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private spaceKey!: Phaser.Input.Keyboard.Key
  private shiftKey!: Phaser.Input.Keyboard.Key
  private score = 0
  private lives = 3
  private startTime = 0
  private elapsedTimeMs = 0
  private pauseStartTime = 0
  private totalPausedTime = 0
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private elapsedTimeText!: Phaser.GameObjects.Text
  private gameOverText!: Phaser.GameObjects.Text
  private isGameOver = false
  private isGameStarted = false
  private isPaused = false
  private startText!: Phaser.GameObjects.Text
  private pauseText!: Phaser.GameObjects.Text
  private brickSpawnTimer!: Phaser.Time.TimerEvent
  private brickGenerator!: BrickGenerator
  private isJumping = false
  private jumpVelocity = -225
  private gravity = 600
  private jumpDuration = 0
  private controls: {
    jump?: Phaser.GameObjects.Graphics
    pause?: Phaser.GameObjects.Graphics
    restart?: Phaser.GameObjects.Graphics
    fastMove?: Phaser.GameObjects.Graphics
    left?: Phaser.GameObjects.Graphics
    right?: Phaser.GameObjects.Graphics
  } = {}
  private controlTexts: {
    fastMove?: Phaser.GameObjects.Text
    jump?: Phaser.GameObjects.Text
  } = {}
  private isFastMovePressed = false
  private isLeftPressed = false
  private isRightPressed = false
  private gameSettings: GameSettings = loadSettings()
  private starfield!: Starfield
  // Boss battle system
  private isBossBattle = false
  private boss: Phaser.Physics.Arcade.Sprite | null = null
  private bossHits = 0
  private bossMaxHits = 5 // Will be calculated based on boss number
  private bossFloatTween: Phaser.Tweens.Tween | null = null
  private bossNumber = 0 // Track which boss this is (0 = first boss)
  private specialBalls: Phaser.Physics.Arcade.Sprite[] = [] // Special balls for every 30 seconds
  private specialBallTimer: Phaser.Time.TimerEvent | null = null // Timer for special ball generation

  constructor() {
    super({ key: 'BreakoutScene' })
  }

  preload() {
    // Load pre-sized brick images (2x resolution for Retina support)
    BreakoutConstants.BRICK_NAMES.forEach((name) => {
      BreakoutConstants.BRICK_SIZES.forEach((size) => {
        this.load.image(`brick-${name}-${size}`, `/games/breakout-clone/i-${name}-${size}@2x.png`)
      })
    })

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
      width: BreakoutConstants.GAME_WIDTH,
      height: BreakoutConstants.GAME_HEIGHT,
    })
    this.starfield.create()

    // Set initial score to 900 in debug mode
    if (this.gameSettings.debugMode) {
      this.score = 900
    }

    // Create paddle
    this.paddle = this.physics.add.sprite(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.PADDLE_GROUND_Y, 'paddle')
    this.paddle.setDisplaySize(100, 20)
    this.paddle.setTint(0xffffff) // White
    this.paddle.setImmovable(true)
    this.paddle.setSize(100, 20)
    // Initially disable gravity - only enable during jumping
    this.paddle.setGravityY(0)

    // Create ball
    this.ball = this.physics.add.sprite(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.BALL_START_Y, 'ball')
    this.ball.setDisplaySize(16, 16)
    this.ball.setTint(0xffffff) // White
    this.ball.setCollideWorldBounds(true) // Enable world bounds collision
    // Manually disable bottom collision by setting world bounds
    this.physics.world.setBounds(
      0,
      0,
      BreakoutConstants.GAME_WIDTH,
      BreakoutConstants.GAME_HEIGHT,
      true,
      true,
      true,
      false,
    )
    this.ball.setBounce(1, 1)
    this.ball.setCircle(8) // Make it a circle with radius 8
    // Don't start the ball moving yet
    this.ball.setVelocity(0, 0)

    // Create bricks
    this.bricks = this.physics.add.staticGroup()

    // Initialize brick generator after bricks group is created
    this.brickGenerator = new BrickGenerator(this, this.bricks, {
      gameWidth: BreakoutConstants.GAME_WIDTH,
      gameHeight: BreakoutConstants.GAME_HEIGHT,
      brickAreaMargin: BreakoutConstants.BRICK_AREA_MARGIN,
      brickAreaHeight: BreakoutConstants.BRICK_AREA_HEIGHT,
      brickSizes: BreakoutConstants.BRICK_SIZES,
      brickNames: BreakoutConstants.BRICK_NAMES,
    })
    this.brickGenerator.initializeBrickAspectRatios()

    this.createBricks()

    // Collision detection will be set when the game starts

    // Create input
    assertNonNullable(this.input.keyboard, 'Keyboard input is not available')
    this.cursors = this.input.keyboard.createCursorKeys()
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    // Create UI text
    const textColor = '#ffffff'

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '16px',
      color: textColor,
    })
    this.livesText = this.add.text(16, 38, 'Lives: 3', {
      fontSize: '16px',
      color: textColor,
    })
    this.elapsedTimeText = this.add.text(16, 60, 'Time: 0.0s', {
      fontSize: '16px',
      color: textColor,
    })

    // Create full-screen overlay for all instruction messages
    const fullScreenOverlay = this.add.graphics()
    fullScreenOverlay.fillStyle(0x000000, 0.6)
    fullScreenOverlay.fillRect(0, 0, BreakoutConstants.GAME_WIDTH, BreakoutConstants.GAME_HEIGHT)
    fullScreenOverlay.setDepth(100) // High depth to always display in front
    fullScreenOverlay.setVisible(true) // Initially visible (for start screen)

    // Game over text (initially hidden)
    this.gameOverText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y,
      'GAME OVER\nPress R to restart',
      {
        fontSize: '32px',
        color: '#ff6b6b', // Bright red
        align: 'center',
      },
    )
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setVisible(false)

    // Start text (initially visible)
    this.startText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y,
      'Press SPACE to start\n\n--- CONTROLS ---\n← → : Move paddle\nSHIFT + ← → : Fast move\nSPACE : Jump (during game)\nP : Pause/Resume\nR : Restart',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      },
    )
    this.startText.setOrigin(0.5)
    this.startText.setVisible(true)

    // Set text depth to appear above overlay
    this.gameOverText.setDepth(101)
    this.startText.setDepth(101)

    // Store overlay reference for all text elements
    this.gameOverText.setData('overlay', fullScreenOverlay)
    this.startText.setData('overlay', fullScreenOverlay)

    // Pause text (initially hidden)
    this.pauseText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y,
      'PAUSED\nPress P to resume\n\n--- CONTROLS ---\n← → : Move paddle\nSHIFT + ← → : Fast move\nSPACE : Jump\nP : Pause/Resume\nR : Restart',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      },
    )
    this.pauseText.setOrigin(0.5)
    this.pauseText.setVisible(false)
    this.pauseText.setDepth(101)
    this.pauseText.setData('overlay', fullScreenOverlay)

    // Add restart key
    assertNonNullable(this.input.keyboard, 'Keyboard input is not available')
    this.input.keyboard.on('keydown-R', this.restartGame, this)
    // Add space key for jumping during gameplay
    this.input.keyboard.on('keydown-SPACE', this.handleSpaceKeyPress, this)
    // Add pause key
    this.input.keyboard.on('keydown-P', this.handlePauseKeyPress, this)

    // Setup touch controls for all devices
    this.setupTouchControls()
    this.updateTexts()

    // Apply initial settings
    this.applySettings(this.gameSettings)
  }

  update() {
    // Paddle movement (disabled during game over or pause)
    if (!this.isGameOver && !this.isPaused) {
      // Check if Shift is held or fast move button is pressed for acceleration
      const isAccelerated = this.shiftKey.isDown || this.isFastMovePressed
      const baseSpeed = 400
      const acceleratedSpeed = baseSpeed * 1.75 // 1.75x speed when Shift is held or fast move button is pressed
      const speed = isAccelerated ? acceleratedSpeed : baseSpeed

      if (this.cursors.left.isDown || this.isLeftPressed) {
        this.paddle.setVelocityX(-speed)
      } else if (this.cursors.right.isDown || this.isRightPressed) {
        this.paddle.setVelocityX(speed)
      } else {
        this.paddle.setVelocityX(0)
      }
    } else {
      // Stop paddle movement during game over
      this.paddle.setVelocityX(0)
    }

    if (this.isGameOver || this.isPaused) {
      return
    }

    // Update elapsed time if game is started
    if (this.isGameStarted && !this.isGameOver && !this.isPaused) {
      this.elapsedTimeMs = Date.now() - this.startTime - this.totalPausedTime
      const elapsedSeconds = (this.elapsedTimeMs / 1000).toFixed(1)
      this.elapsedTimeText.setText('Time: ' + elapsedSeconds + 's')
    }

    // Handle jumping physics
    if (this.isJumping) {
      this.jumpDuration += this.game.loop.delta

      // Check if paddle should land (only when actually at ground level and falling)
      if (this.paddle.y >= BreakoutConstants.PADDLE_GROUND_Y && (this.paddle.body?.velocity.y ?? 0) >= 0) {
        // Natural landing - let physics handle it smoothly
        this.paddle.y = BreakoutConstants.PADDLE_GROUND_Y
        this.paddle.setVelocityY(0)
        this.paddle.setGravityY(0)
        this.isJumping = false
        this.jumpDuration = 0

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
    if (!this.isJumping) {
      if (this.paddle.y !== BreakoutConstants.PADDLE_GROUND_Y) {
        this.paddle.y = BreakoutConstants.PADDLE_GROUND_Y
        this.paddle.setVelocityY(0)
      }
      this.paddle.setGravityY(0)
    }

    // Keep paddle within bounds (considering paddle width)
    const paddleHalfWidth = 50 // Paddle width is 100px so half is 50px
    const leftBound = paddleHalfWidth
    const rightBound = BreakoutConstants.GAME_WIDTH - paddleHalfWidth

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

    // Check if ball falls below paddle
    if (this.ball.y > BreakoutConstants.BALL_DEATH_Y) {
      // Check before ball completely leaves screen
      this.ballDied()
    }

    // Check if special balls fall below paddle (just remove them, no life loss)
    for (let i = this.specialBalls.length - 1; i >= 0; i--) {
      const specialBall = this.specialBalls[i]
      if (specialBall.y > BreakoutConstants.BALL_DEATH_Y) {
        specialBall.destroy()
        this.specialBalls.splice(i, 1)
      }
    }
  }

  private createBricks() {
    // Generate initial bricks using BrickGenerator
    this.brickGenerator.generateInitialBricks()
  }

  private addNewBrick() {
    if (this.isGameOver || !this.isGameStarted || this.isPaused || this.isBossBattle) {
      return
    }

    // Use BrickGenerator to add new brick
    this.brickGenerator.addNewBrick()
  }

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

  private getOptimalTexture(baseName: string, targetSize: number): string {
    // Available sizes
    const availableSizes = [...BreakoutConstants.BRICK_SIZES] as number[]

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

  private getScoreBySize(size: number): number {
    // Scoring system based on size
    switch (size) {
      case 64:
        return 10 // Smallest block: 10 points
      case 96:
        return 15 // Small block: 15 points
      case 128:
        return 25 // Medium block: 25 points
      case 160:
        return 40 // Large block: 40 points
      case 192:
        return 60 // Extra large block: 60 points
      case 224:
        return 90 // Super large block: 90 points
      case 256:
        return 130 // Maximum block: 130 points
      default:
        return 10 // Default
    }
  }

  private showPointsEffect(x: number, y: number, points: number) {
    // ポイント表示テキストを作成
    const pointsText = this.add.text(x, y, `+${points}`, {
      fontSize: '24px',
      color: '#00ff88', // 明るい緑
      align: 'center',
    })
    pointsText.setOrigin(0.5)
    pointsText.setDepth(105) // 他のエフェクトより前面に表示

    // ポイントテキストのアニメーション
    this.tweens.add({
      targets: pointsText,
      y: y - 60, // 上に移動
      alpha: 0, // フェードアウト
      scaleX: 1.5, // 少し拡大
      scaleY: 1.5,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => {
        pointsText.destroy()
      },
    })
  }

  private rectanglesOverlap(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number },
  ): boolean {
    // 程よいスペースを確保するためのマージンを追加
    const margin = 8 // 8pxのスペースを確保

    // マージンを含めた範囲で重複チェック
    const rect1WithMargin = {
      x: rect1.x - margin,
      y: rect1.y - margin,
      width: rect1.width + margin * 2,
      height: rect1.height + margin * 2,
    }

    // 重複判定（マージンを含めて完全に重ならないようにする）
    return !(
      rect1WithMargin.x + rect1WithMargin.width <= rect2.x ||
      rect2.x + rect2.width <= rect1WithMargin.x ||
      rect1WithMargin.y + rect1WithMargin.height <= rect2.y ||
      rect2.y + rect2.height <= rect1WithMargin.y
    )
  }

  private hitPaddle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, paddle) => {
    assertSpriteLight(ball)
    assertSpriteLight(paddle)
    const ballSprite = ball
    const paddleSprite = paddle

    // パドルが動いている場合、その速度を跳ね返り角度に反映
    assertNonNullable(paddleSprite.body, 'Paddle body is not available')
    assertNonNullable(ballSprite.body, 'Ball body is not available')
    const paddleVelocityX = paddleSprite.body.velocity.x
    const currentBallVelocityX = ballSprite.body.velocity.x
    const currentBallVelocityY = ballSprite.body.velocity.y

    // パドルの動きを考慮した新しいX速度を計算
    // パドルの速度の30%を加算して、より自然な跳ね返りにする
    const newVelocityX = currentBallVelocityX + paddleVelocityX * 0.3

    // Y速度は上向きを保証（最低でも-150の速度）
    const newVelocityY = Math.min(currentBallVelocityY, -150)

    ballSprite.setVelocity(newVelocityX, newVelocityY)
  }

  private hitBrick: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, brick) => {
    assertSpriteLight(brick)
    const brickSprite = brick
    const brickX = brickSprite.x
    const brickY = brickSprite.y

    // ブロックのテクスチャ名からベースサイズを取得
    const textureName = brickSprite.texture.key
    // テクスチャ名から直接ベースサイズを抽出（例: "brick-d1-100" -> 100）
    const sizeMatch = textureName.match(/-([0-9]+)$/)
    let baseSize = 50 // デフォルト

    if (sizeMatch) {
      baseSize = parseInt(sizeMatch[1], 10)
    }

    brickSprite.destroy()

    // ベースサイズに応じた得点を加算
    const points = this.getScoreBySize(baseSize)
    this.score += points
    this.scoreText.setText('Score: ' + this.score)

    // ポイント表示エフェクト
    this.showPointsEffect(brickX, brickY, points)

    // Update occupied spaces using BrickGenerator
    this.brickGenerator.updateOccupiedSpaces()

    // Check for boss battle trigger
    this.checkBossBattle()

    // Check for special ball trigger (30 second timer)
    this.checkSpecialBall()

    // 全部のブロックが破壊された場合、ボーナスポイントを取得してブロックを復活
    if (this.bricks.children.size === 0) {
      this.allBricksCleared()
    }
  }

  private ballDied() {
    // 既に死亡処理中の場合は何もしない
    if (this.isGameOver) {
      return
    }

    // ボールの位置を記録
    const ballX = this.ball.x
    const ballY = this.ball.y

    // ボールを停止して画面外に移動（再度条件に引っかからないように）
    this.ball.setVelocity(0, 0)
    this.ball.setPosition(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.BALL_START_Y) // 安全な位置に移動
    this.ball.disableBody() // ボールの物理を無効にする

    // ライフを減らして次の処理
    this.lives--
    this.livesText.setText('Lives: ' + this.lives)

    // 最後のライフの場合は即座にボールを非表示
    if (this.lives <= 0) {
      this.ball.setVisible(false)
    }

    // 死亡エフェクト: 爆発のような円形エフェクト
    const explosionGraphics = this.add.graphics()
    explosionGraphics.setDepth(103)

    // 複数の円で爆発エフェクトを作成
    const colors = [0xff6b6b, 0xff9f43, 0xfeca57, 0xff6348]
    for (let i = 0; i < 4; i++) {
      explosionGraphics.fillStyle(colors[i], 0.7)
      explosionGraphics.fillCircle(ballX, ballY, 5)
    }

    // 爆発アニメーション
    this.tweens.add({
      targets: explosionGraphics,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        explosionGraphics.destroy()
      },
    })

    // 「MISS!」テキストエフェクト
    const missText = this.add.text(ballX, ballY - 50, 'MISS!', {
      fontSize: '32px',
      color: '#ff6b6b', // 赤
      align: 'center',
    })
    missText.setOrigin(0.5)
    missText.setDepth(104)

    // MISSテキストのアニメーション
    this.tweens.add({
      targets: missText,
      y: ballY - 100,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        missText.destroy()
      },
    })

    // 画面を少し揺らす
    this.cameras.main.shake(300, 0.01)

    // 少し遅延してから次の処理
    this.time.delayedCall(1000, () => {
      if (this.lives <= 0) {
        this.gameOver()
      } else {
        this.resetBall()
      }
    })
  }

  private allBricksCleared() {
    // ボーナスポイントを取得（100ポイント）
    this.score += 100
    this.scoreText.setText('Score: ' + this.score)

    // ボーナス取得のエフェクトを表示
    const bonusText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y - 112,
      '+100 BONUS!',
      {
        fontSize: '48px',
        color: '#ffd700', // ゴールド
        align: 'center',
      },
    )
    bonusText.setOrigin(0.5)
    bonusText.setDepth(102)

    // ボーナステキストのアニメーション
    this.tweens.add({
      targets: bonusText,
      y: BreakoutConstants.GAME_CENTER_Y - 162,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        bonusText.destroy()
      },
    })

    // 全部のブリックを復活させる
    this.brickGenerator.clearOccupiedSpaces()
    this.createBricks()
  }

  private resetBall() {
    this.ball.setPosition(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.BALL_START_Y)
    this.ball.setVelocity(0, 0) // ボールを停止
    this.ball.disableBody()

    // 1秒後に自動的に当たり判定を有効にしてボールを再開
    this.time.delayedCall(1000, () => {
      this.ball.enableBody()
      this.resumeGame()
    })
  }

  private startGame() {
    if (!this.isGameStarted && !this.isGameOver) {
      this.isGameStarted = true
      this.startTime = Date.now() // Record start time
      this.elapsedTimeMs = 0
      this.startText.setVisible(false)
      const overlay = this.startText.getData('overlay')
      if (overlay) overlay.setVisible(false)

      // Enable ball physics body before starting
      this.ball.enableBody()

      // ボールが動き出す瞬間に当たり判定を有効にする
      this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, undefined, this)
      this.physics.add.collider(this.ball, this.bricks, this.hitBrick, undefined, this)

      // ランダムな角度でボールを発射
      const speed = 250
      const angle = Phaser.Math.Between(-45, 45) // -45度から45度のランダム角度
      const radians = Phaser.Math.DegToRad(angle)
      const velocityX = Math.sin(radians) * speed
      const velocityY = -Math.cos(radians) * speed // 上向きを保証

      this.ball.setVelocity(velocityX, velocityY)

      // ブロック追加タイマーを開始（5秒間隔）
      this.brickSpawnTimer = this.time.addEvent({
        delay: 5000,
        callback: this.addNewBrick,
        callbackScope: this,
        loop: true,
      })
    }
  }

  private handleSpaceKeyPress() {
    if (!this.isGameStarted && !this.isGameOver) {
      this.startGame()
    } else if (this.isGameStarted && !this.isJumping && !this.isPaused) {
      // Paddle jumping - only when game is started and not already jumping
      this.startJump()
    }
  }

  private handlePauseKeyPress() {
    if (this.isGameStarted && !this.isGameOver) {
      this.togglePause()
    }
  }

  private togglePause() {
    this.isPaused = !this.isPaused

    if (this.isPaused) {
      // Record pause start time
      this.pauseStartTime = Date.now()

      // Pause the game
      this.physics.pause()
      this.pauseText.setVisible(true)
      const overlay = this.pauseText.getData('overlay')
      if (overlay) overlay.setVisible(true)

      // Pause the brick spawn timer
      if (this.brickSpawnTimer) {
        this.brickSpawnTimer.paused = true
      }

      // Pause the special ball timer
      if (this.specialBallTimer) {
        this.specialBallTimer.paused = true
      }
    } else {
      // Calculate paused duration and add to total
      if (this.pauseStartTime > 0) {
        this.totalPausedTime += Date.now() - this.pauseStartTime
        this.pauseStartTime = 0
      }

      // Resume the game
      this.physics.resume()
      this.pauseText.setVisible(false)
      const overlay = this.pauseText.getData('overlay')
      if (overlay) overlay.setVisible(false)

      // Resume the brick spawn timer
      if (this.brickSpawnTimer) {
        this.brickSpawnTimer.paused = false
      }

      // Resume the special ball timer
      if (this.specialBallTimer) {
        this.specialBallTimer.paused = false
      }
    }
  }

  private resumeGame() {
    // 当たり判定を再度有効にしてボールを動かす
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, undefined, this)
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, undefined, this)

    // ランダムな角度でボールを発射
    const speed = 250
    const angle = Phaser.Math.Between(-45, 45) // -45度から45度のランダム角度
    const radians = Phaser.Math.DegToRad(angle)
    const velocityX = Math.sin(radians) * speed
    const velocityY = -Math.cos(radians) * speed // 上向きを保証

    this.ball.setVelocity(velocityX, velocityY)
  }

  private startJump() {
    this.isJumping = true
    this.jumpDuration = 0

    // Set initial jump velocity with easing
    this.paddle.setVelocityY(this.jumpVelocity)
    this.paddle.setGravityY(this.gravity)

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
    this.isGameOver = true
    this.ball.setVelocity(0, 0)
    this.ball.setVisible(false) // ボールを非表示にする

    // 特殊ボールも全て削除
    this.specialBalls.forEach((ball) => ball.destroy())
    this.specialBalls = []

    // 特殊ボールタイマーも停止
    if (this.specialBallTimer) {
      this.specialBallTimer.destroy()
      this.specialBallTimer = null
    }

    // パドルを落下させる演出
    this.paddle.setImmovable(false) // パドルを動かせるようにする
    this.paddle.setGravityY(800) // 重力を適用
    this.paddle.setVelocityY(0) // 初期速度をリセット
    this.isJumping = false

    // パドルが落ちてから少し遅延してゲームオーバー表示
    this.time.delayedCall(1500, () => {
      // ゲームオーバー時に取得ポイントと経過時間の記録を表示
      const finalSeconds = (this.elapsedTimeMs / 1000).toFixed(1)
      this.gameOverText.setText(
        `GAME OVER\nFinal Score: ${this.score}\nTime: ${finalSeconds}s\nPress R or tap to restart`,
      )
      this.gameOverText.setVisible(true)
      const overlay = this.gameOverText.getData('overlay')
      if (overlay) overlay.setVisible(true)

      // Add touch restart for all devices
      this.setupGameOverTouchRestart()
    })

    // ブロック追加タイマーを停止
    if (this.brickSpawnTimer) {
      this.brickSpawnTimer.destroy()
    }
  }

  private restartGame() {
    // Reset game state
    this.isGameOver = false
    this.isGameStarted = false
    this.isPaused = false
    this.score = 0
    this.lives = 3
    this.startTime = 0
    this.elapsedTimeMs = 0
    this.pauseStartTime = 0
    this.totalPausedTime = 0

    // Reset jumping state
    this.isJumping = false
    this.jumpDuration = 0

    // Reset mobile control states
    this.isFastMovePressed = false
    this.isLeftPressed = false
    this.isRightPressed = false

    // Reset boss battle state
    this.isBossBattle = false
    if (this.boss) {
      this.boss.destroy()
      this.boss = null
    }
    this.bossHits = 0
    this.bossMaxHits = 5
    if (this.bossFloatTween) {
      this.bossFloatTween.destroy()
      this.bossFloatTween = null
    }
    this.bossNumber = 0

    // Reset special balls
    this.specialBalls.forEach((ball) => ball.destroy())
    this.specialBalls = []
    if (this.specialBallTimer) {
      this.specialBallTimer.destroy()
      this.specialBallTimer = null
    }

    // Resume physics if it was paused
    this.physics.resume()

    // Stop brick spawn timer if it exists
    if (this.brickSpawnTimer) {
      this.brickSpawnTimer.destroy()
    }

    // Hide game over text and pause text, show start text
    this.gameOverText.setVisible(false)
    this.pauseText.setVisible(false)
    this.startText.setVisible(true)

    // Show overlay for start screen
    const overlay = this.startText.getData('overlay')
    if (overlay) overlay.setVisible(true)

    // Update UI
    // デバッグモード時は初期スコアを900に設定
    if (this.gameSettings.debugMode) {
      this.score = 900
    }
    this.scoreText.setText(`Score: ${this.score}`)
    this.livesText.setText('Lives: 3')
    this.elapsedTimeText.setText('Time: 0.0s')

    // Reset ball and paddle
    this.paddle.setPosition(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.PADDLE_GROUND_Y)
    this.paddle.setVelocity(0, 0)
    this.paddle.setGravityY(0) // Initially disable gravity
    this.paddle.setImmovable(true) // パドルを固定に戻す
    this.isJumping = false
    this.ball.setVisible(true) // ボールを再表示

    // Reset ball to initial state (don't auto-start like resetBall() does)
    this.ball.setPosition(BreakoutConstants.GAME_CENTER_X, BreakoutConstants.BALL_START_Y)
    this.ball.setVelocity(0, 0)
    this.ball.disableBody() // Keep disabled until game starts

    // Clear occupied spaces and recreate bricks
    this.brickGenerator.clearOccupiedSpaces()
    this.bricks.clear(true, true)
    this.createBricks()
  }

  private setupTouchControls() {
    // Enable touch input
    this.input.addPointer(2) // Allow up to 3 touch points

    // Create mobile buttons
    this.createMobileButtons()
  }

  private createMobileButtons() {
    const buttonSize = 108 // Base size for interaction area
    const interactionSize = buttonSize // Same as visual size
    const rightButtonSize = Math.round(buttonSize * 1.2) // 20% larger for right side buttons
    const buttonMargin = 15 // Margin for edge placement
    const buttonSpacing = 15 // Spacing between adjacent buttons (same as margin)

    // Pause button (right top) with pause symbol
    this.controls.pause = this.add.graphics()
    this.controls.pause.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    this.controls.pause.fillRect(
      BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
      buttonMargin,
      rightButtonSize,
      rightButtonSize,
    )

    // Draw pause symbol (two vertical lines)
    this.controls.pause.lineStyle(4, 0xffffff, 0.8)
    const pauseX = BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize / 2
    const pauseY = buttonMargin + rightButtonSize / 2
    this.controls.pause.lineBetween(pauseX - 8, pauseY - 12, pauseX - 8, pauseY + 12)
    this.controls.pause.lineBetween(pauseX + 8, pauseY - 12, pauseX + 8, pauseY + 12)
    this.controls.pause.setDepth(110)
    this.controls.pause.setInteractive(
      new Phaser.Geom.Rectangle(
        BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
        buttonMargin,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Left button - full height rectangle with spacing
    const controlAreaWidth = BreakoutConstants.GAME_WIDTH / 4
    const leftRightSpacing = 2 // Spacing between left and right buttons
    const leftButtonWidth = (controlAreaWidth - leftRightSpacing) / 2
    const leftButtonHeight = BreakoutConstants.GAME_HEIGHT
    const leftButtonX = 0
    const leftButtonY = 0

    this.controls.left = this.add.graphics()
    this.controls.left.fillStyle(0x000000, 0.1) // Very transparent fill
    this.controls.left.fillRect(leftButtonX, leftButtonY, leftButtonWidth, leftButtonHeight)

    // Draw left triangle 100px from bottom
    const leftCenterX = leftButtonX + leftButtonWidth / 2
    const leftCenterY = leftButtonY + leftButtonHeight - 100
    this.controls.left.fillStyle(0xffffff, 0.6)
    this.controls.left.beginPath()
    this.controls.left.moveTo(leftCenterX - 15, leftCenterY)
    this.controls.left.lineTo(leftCenterX + 10, leftCenterY - 15)
    this.controls.left.lineTo(leftCenterX + 10, leftCenterY + 15)
    this.controls.left.closePath()
    this.controls.left.fillPath()
    this.controls.left.setDepth(110)
    this.controls.left.setInteractive(
      new Phaser.Geom.Rectangle(leftButtonX, leftButtonY, leftButtonWidth, leftButtonHeight),
      Phaser.Geom.Rectangle.Contains,
    )

    // Right button - full height rectangle with spacing
    const rightButtonWidth = (controlAreaWidth - leftRightSpacing) / 2
    const rightButtonHeight = BreakoutConstants.GAME_HEIGHT
    const rightButtonX = leftButtonWidth + leftRightSpacing
    const rightButtonY = 0

    this.controls.right = this.add.graphics()
    this.controls.right.fillStyle(0x000000, 0.1) // Very transparent fill
    this.controls.right.fillRect(rightButtonX, rightButtonY, rightButtonWidth, rightButtonHeight)

    // Draw right triangle 100px from bottom
    const rightCenterX = rightButtonX + rightButtonWidth / 2
    const rightCenterY = rightButtonY + rightButtonHeight - 100
    this.controls.right.fillStyle(0xffffff, 0.6)
    this.controls.right.beginPath()
    this.controls.right.moveTo(rightCenterX + 15, rightCenterY)
    this.controls.right.lineTo(rightCenterX - 10, rightCenterY - 15)
    this.controls.right.lineTo(rightCenterX - 10, rightCenterY + 15)
    this.controls.right.closePath()
    this.controls.right.fillPath()
    this.controls.right.setDepth(110)
    this.controls.right.setInteractive(
      new Phaser.Geom.Rectangle(rightButtonX, rightButtonY, rightButtonWidth, rightButtonHeight),
      Phaser.Geom.Rectangle.Contains,
    )

    // Fast move button (right side, bottom)
    this.controls.fastMove = this.add.graphics()
    this.controls.fastMove.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    this.controls.fastMove.fillRect(
      BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
      BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize,
      rightButtonSize,
      rightButtonSize,
    )

    this.controls.fastMove.setDepth(110)
    this.controls.fastMove.setInteractive(
      new Phaser.Geom.Rectangle(
        BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
        BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Fast move button text
    this.controlTexts.fastMove = this.add.text(
      BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize / 2,
      BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize / 2,
      'FAST',
      {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
      },
    )
    this.controlTexts.fastMove.setOrigin(0.5)
    this.controlTexts.fastMove.setDepth(111)

    // Jump button (right side, above fast button with increased spacing)
    this.controls.jump = this.add.graphics()
    this.controls.jump.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    this.controls.jump.fillRect(
      BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
      BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize * 2 - buttonSpacing,
      rightButtonSize,
      rightButtonSize,
    )

    this.controls.jump.setDepth(110)
    this.controls.jump.setInteractive(
      new Phaser.Geom.Rectangle(
        BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize,
        BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize * 2 - buttonSpacing,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Jump button text
    this.controlTexts.jump = this.add.text(
      BreakoutConstants.GAME_WIDTH - buttonMargin - rightButtonSize / 2,
      BreakoutConstants.GAME_HEIGHT - buttonMargin - rightButtonSize * 1.5 - buttonSpacing,
      'JUMP',
      {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
      },
    )
    this.controlTexts.jump.setOrigin(0.5)
    this.controlTexts.jump.setDepth(111)

    // Button event handlers
    this.controls.jump?.on('pointerdown', () => {
      if (!this.isGameStarted && !this.isGameOver) {
        this.startGame()
      } else if (this.isGameStarted && !this.isJumping && !this.isPaused) {
        this.startJump()
      }
    })

    this.controls.pause?.on('pointerdown', () => {
      if (this.isGameStarted && !this.isGameOver) {
        this.togglePause()
      }
    })

    // Fast move button event handlers
    this.controls.fastMove?.on('pointerdown', () => {
      this.isFastMovePressed = true
    })

    this.controls.fastMove?.on('pointerup', () => {
      this.isFastMovePressed = false
    })

    this.controls.fastMove?.on('pointerout', () => {
      this.isFastMovePressed = false
    })

    // Left and Right button event handlers
    this.controls.left?.on('pointerdown', () => {
      this.isLeftPressed = true
    })

    this.controls.left?.on('pointerup', () => {
      this.isLeftPressed = false
    })

    this.controls.left?.on('pointerout', () => {
      this.isLeftPressed = false
    })

    this.controls.right?.on('pointerdown', () => {
      this.isRightPressed = true
    })

    this.controls.right?.on('pointerup', () => {
      this.isRightPressed = false
    })

    this.controls.right?.on('pointerout', () => {
      this.isRightPressed = false
    })

    // Tap anywhere to start (when game not started)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.isGameStarted && !this.isGameOver) {
        // Only if not clicking on buttons
        const jumpButtonBounds = new Phaser.Geom.Circle(
          BreakoutConstants.GAME_WIDTH - buttonMargin - buttonSize / 2,
          BreakoutConstants.GAME_HEIGHT - buttonMargin - buttonSize / 2,
          interactionSize / 2,
        )
        const pauseButtonBounds = new Phaser.Geom.Circle(
          buttonMargin + buttonSize / 2,
          buttonMargin + buttonSize / 2,
          interactionSize / 2,
        )

        if (
          !Phaser.Geom.Circle.Contains(jumpButtonBounds, pointer.x, pointer.y) &&
          !Phaser.Geom.Circle.Contains(pauseButtonBounds, pointer.x, pointer.y)
        ) {
          this.startGame()
        }
      }
    })
  }

  private updateTexts() {
    // Update start text for all devices (keyboard + virtual pad controls)
    this.startText.setText(
      `${gameInfo.title}\n\nPRESS SPACE OR TAP/CLICK TO START\n\n--- KEYBOARD CONTROLS ---\n← → : Move paddle\nSHIFT + ← → : Fast move\nSPACE : Jump (during game)\nP : Pause/Resume\nR : Restart\n\n--- VIRTUAL PAD CONTROLS ---\n← → buttons: Move paddle\nJUMP button: Jump\nPAUSE button: Pause/Resume\nFAST button: Fast move\nTap/Click anywhere: Start game`,
    )

    // Update pause text for all devices
    this.pauseText.setText(
      `${gameInfo.title}\n\nPAUSED\nPress P or tap/click PAUSE to resume\n\n--- KEYBOARD CONTROLS ---\n← → : Move paddle\nSHIFT + ← → : Fast move\nSPACE : Jump\nP : Pause/Resume\nR : Restart\n\n--- VIRTUAL PAD CONTROLS ---\n← → buttons: Move paddle\nJUMP button: Jump\nPAUSE button: Pause/Resume\nFAST button: Fast move`,
    )
  }

  private setupGameOverTouchRestart() {
    // Add touch restart for game over (without removing existing listeners)
    const gameOverTouchHandler = () => {
      if (this.isGameOver) {
        this.restartGame()
      }
    }

    // Add the game over specific handler
    this.input.on('pointerdown', gameOverTouchHandler)
  }

  private checkBossBattle() {
    // Check if we should trigger a boss battle
    // Boss battles occur at cumulative thresholds based on bonus scores
    if (this.isBossBattle) return

    const nextBossThreshold = this.calculateNextBossThreshold()
    if (this.score >= nextBossThreshold) {
      this.startBossBattle()
    }
  }

  private checkSpecialBall() {
    // Start special ball timer if not already running
    if (!this.specialBallTimer && this.isGameStarted && !this.isGameOver && !this.isPaused) {
      this.startSpecialBallTimer()
    }
  }

  private startSpecialBallTimer() {
    // Create special ball every 30 seconds
    this.specialBallTimer = this.time.addEvent({
      delay: 30000, // 30 seconds
      callback: this.createSpecialBall,
      callbackScope: this,
      loop: true,
    })
  }

  private calculateNextBossThreshold(): number {
    // Calculate cumulative threshold for next boss
    // 1st boss: 1000
    // 2nd boss: 1000 + 500 + 1000 = 2500
    // 3rd boss: 1000 + 500 + 1000 + 600 + 1000 = 4100
    // Pattern: 1000 + sum of all previous bonuses + 1000 for each subsequent boss

    let threshold = 1000 // First boss always at 1000

    for (let i = 1; i <= this.bossNumber; i++) {
      // Add bonus score for boss i (500 for first, +100 for each subsequent)
      const bossBonus = 400 + i * 100 // Boss 1: 500, Boss 2: 600, Boss 3: 700, etc.
      threshold += bossBonus

      // Add 1000 points for the next boss requirement
      threshold += 1000
    }

    return threshold
  }

  private startBossBattle() {
    this.isBossBattle = true
    this.bossHits = 0
    this.bossNumber++ // Increment boss number

    // Calculate boss max hits: 5 for first boss, then +1 for each subsequent boss
    this.bossMaxHits = 4 + this.bossNumber // Boss 1: 5 hits, Boss 2: 6 hits, etc.

    // Hide all existing bricks with fade out effect
    this.bricks.children.entries.forEach((brick) => {
      const brickSprite = brick as Phaser.Physics.Arcade.Sprite
      this.tweens.add({
        targets: brickSprite,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          brickSprite.destroy()
        },
      })
    })

    // Create boss after bricks fade out
    this.time.delayedCall(1000, () => {
      this.createBoss()
    })

    // Show boss battle message
    const bossText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y - 200,
      'BOSS BATTLE!',
      {
        fontSize: '48px',
        color: '#ff6b6b',
        align: 'center',
      },
    )
    bossText.setOrigin(0.5)
    bossText.setDepth(102)

    this.tweens.add({
      targets: bossText,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        bossText.destroy()
      },
    })
  }

  private createBoss() {
    // Random boss image from available character images
    const bossImages = BreakoutConstants.BRICK_NAMES
    const randomBossImage = bossImages[Math.floor(Math.random() * bossImages.length)]
    const bossTexture = `brick-${randomBossImage}-300` // Use 300px size for boss

    // Create boss at center top area
    this.boss = this.physics.add.sprite(BreakoutConstants.GAME_CENTER_X, 200, bossTexture)

    // Get aspect ratio information for proper scaling
    const aspectInfo = this.brickGenerator.getBrickAspectRatio(`brick-${randomBossImage}`)
    if (aspectInfo) {
      // Calculate proper dimensions while maintaining aspect ratio
      let bossWidth, bossHeight
      if (aspectInfo.aspectRatio >= 1) {
        // Horizontal or square image
        bossWidth = 300
        bossHeight = 300 / aspectInfo.aspectRatio
      } else {
        // Vertical image
        bossWidth = 300 * aspectInfo.aspectRatio
        bossHeight = 300
      }
      this.boss.setDisplaySize(bossWidth, bossHeight)
      // Set collision box to be slightly smaller than display size for better gameplay
      this.boss.setSize(bossWidth * 0.8, bossHeight * 0.8)
    } else {
      // Fallback to square if aspect ratio info is not available
      this.boss.setDisplaySize(300, 300)
      this.boss.setSize(240, 240) // 80% of display size for collision
    }

    // Refresh the physics body to apply the new size
    this.boss.refreshBody()

    this.boss.setImmovable(true)
    this.boss.setDepth(10)

    // Add floating animation
    this.bossFloatTween = this.tweens.add({
      targets: this.boss,
      y: 250,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Add horizontal floating movement
    this.tweens.add({
      targets: this.boss,
      x: BreakoutConstants.GAME_CENTER_X + 100,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Add boss collision with ball
    this.physics.add.collider(this.ball, this.boss, this.hitBoss, undefined, this)

    // Add boss collision with all existing special balls
    this.specialBalls.forEach((specialBall) => {
      if (this.boss) {
        this.physics.add.collider(specialBall, this.boss, this.hitBoss, undefined, this)
      }
    })

    // Clear occupied spaces since all bricks are gone
    this.brickGenerator.clearOccupiedSpaces()
  }

  private hitBoss: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (ball, boss) => {
    assertSpriteLight(boss)
    const bossSprite = boss

    this.bossHits++

    // Flash effect when hit
    this.tweens.add({
      targets: bossSprite,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      ease: 'Power2',
    })

    // Show hit counter
    const hitText = this.add.text(bossSprite.x, bossSprite.y - 50, `${this.bossHits}/${this.bossMaxHits}`, {
      fontSize: '24px',
      color: '#ff6b6b',
      align: 'center',
    })
    hitText.setOrigin(0.5)
    hitText.setDepth(105)

    this.tweens.add({
      targets: hitText,
      y: hitText.y - 30,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        hitText.destroy()
      },
    })

    // Check if boss is defeated
    if (this.bossHits >= this.bossMaxHits) {
      // Immediately disable boss collision when defeated
      bossSprite.disableBody()
      this.defeatBoss()
    }
  }

  private defeatBoss() {
    if (!this.boss) return

    // Boss collision already disabled in hitBoss method

    // Stop floating animations
    if (this.bossFloatTween) {
      this.bossFloatTween.destroy()
      this.bossFloatTween = null
    }

    // Boss defeat animation
    this.tweens.add({
      targets: this.boss,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      rotation: Math.PI * 2,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        if (this.boss) {
          this.boss.destroy()
          this.boss = null
        }
      },
    })

    // Add bonus score: 500 for first boss, then +100 for each subsequent boss
    const bonusScore = 400 + this.bossNumber * 100 // Boss 1: 500, Boss 2: 600, Boss 3: 700, etc.
    this.score += bonusScore
    this.scoreText.setText('Score: ' + this.score)

    // Show victory message and bonus
    const victoryText = this.add.text(
      BreakoutConstants.GAME_CENTER_X,
      BreakoutConstants.GAME_CENTER_Y,
      `BOSS DEFEATED!\n+${bonusScore} BONUS!`,
      {
        fontSize: '36px',
        color: '#ffd700',
        align: 'center',
      },
    )
    victoryText.setOrigin(0.5)
    victoryText.setDepth(102)

    this.tweens.add({
      targets: victoryText,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        victoryText.destroy()
      },
    })

    // Reset boss battle state and restore normal bricks
    this.time.delayedCall(2000, () => {
      this.isBossBattle = false
      this.bossHits = 0

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
    })
  }

  private createSpecialBall() {
    // Skip if game is paused or not started
    if (this.isPaused || !this.isGameStarted || this.isGameOver) {
      return
    }

    // Create special ball at random position
    const offsetX = Math.random() * 200 - 100 // Random offset from center
    const specialBall = this.physics.add.sprite(
      BreakoutConstants.GAME_CENTER_X + offsetX,
      BreakoutConstants.BALL_START_Y,
      'specialBall',
    )
    specialBall.setDisplaySize(16, 16)
    specialBall.setTint(0x00ff88) // Fluorescent green color
    specialBall.setCollideWorldBounds(true)
    // Disable bottom collision for special ball - it just disappears when it falls
    this.physics.world.setBounds(
      0,
      0,
      BreakoutConstants.GAME_WIDTH,
      BreakoutConstants.GAME_HEIGHT,
      true,
      true,
      true,
      false,
    )
    specialBall.setBounce(1, 1)
    specialBall.setCircle(8)
    specialBall.setDepth(5)

    // Add collision with paddle, bricks, and boss
    this.physics.add.collider(specialBall, this.paddle, this.hitPaddle, undefined, this)
    this.physics.add.collider(specialBall, this.bricks, this.hitBrick, undefined, this)
    if (this.boss) {
      this.physics.add.collider(specialBall, this.boss, this.hitBoss, undefined, this)
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
    this.specialBalls.push(specialBall)
  }

  // 設定を適用するメソッド
  public applySettings(newSettings: GameSettings) {
    this.gameSettings = newSettings

    // Virtual Padの表示/非表示切り替え
    Object.values(this.controls).forEach((control) => {
      if (control) {
        control.setVisible(newSettings.showVirtualPad)
      }
    })

    // Virtual Padのテキストも表示/非表示切り替え
    Object.values(this.controlTexts).forEach((text) => {
      if (text) {
        text.setVisible(newSettings.showVirtualPad)
      }
    })
  }
}

export type BreakoutGameParams = {
  debugMode?: boolean
}

export const BreakoutGame: React.FC<BreakoutGameParams> = ({ debugMode: propDebugMode }) => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // デバッグモードは設定から取得、propsがあればそれを優先
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
        width: BreakoutConstants.GAME_WIDTH,
        height: BreakoutConstants.GAME_HEIGHT,
        autoRound: false, // より滑らかなスケーリング
      },
      render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
        roundPixels: false, // より滑らかなレンダリング
        powerPreference: 'high-performance', // 高性能GPU使用
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR', // 高品質ミップマップ
        batchSize: 4096, // バッチサイズを増加
      },
      scene: BreakoutScene,
      backgroundColor: '#0a0a1a', // 深い宇宙の色
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

    // デバッグモードが変更された場合はゲームをリセット
    if (newSettings.debugMode !== previousDebugMode) {
      // ゲームを破棄して再作成
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
      // useEffectが再実行されてゲームが再作成される
    } else {
      // デバッグモード以外の設定変更の場合は通常の設定適用
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
          max-width: ${BreakoutConstants.GAME_WIDTH}px;
          max-height: ${BreakoutConstants.GAME_HEIGHT}px;
          aspect-ratio: ${BreakoutConstants.GAME_WIDTH} / ${BreakoutConstants.GAME_HEIGHT};
          position: relative;
        `}
      >
        {/* 設定ボタン */}
        <button
          onClick={() => setIsSettingsOpen(true)}
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

      {/* 設定モーダル */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </>
  )
}
