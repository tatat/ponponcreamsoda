import * as Phaser from 'phaser'
import { constants } from './constants'
import { gameInfo } from './config'

/**
 * Interface for game data that UIManager needs to display
 */
export interface GameDisplayData {
  score: number
  lives: number
  formattedElapsedTime: string
}

/**
 * UIManager class - Manages all UI elements and visual effects for the BreakoutScene
 */
export class UIManager {
  private scene: Phaser.Scene

  // UI Text elements
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private elapsedTimeText!: Phaser.GameObjects.Text
  private gameOverText!: Phaser.GameObjects.Text
  private startText!: Phaser.GameObjects.Text
  private pauseText!: Phaser.GameObjects.Text

  // UI Graphics elements
  private fullScreenOverlay!: Phaser.GameObjects.Graphics

  // Current display data
  private currentData: GameDisplayData

  // Initial data for reset
  private initialData: GameDisplayData

  constructor(scene: Phaser.Scene, initialData: GameDisplayData) {
    this.scene = scene
    this.initialData = { ...initialData }
    this.currentData = { ...initialData }
  }

  /**
   * Initialize all UI elements
   */
  initialize(): void {
    this.createTexts()
    this.createOverlay()
    this.updateAllTexts()
  }

  /**
   * Create all text elements
   */
  private createTexts(): void {
    const textColor = '#ffffff'

    // Game status texts
    this.scoreText = this.scene.add.text(16, 16, `Score: ${this.currentData.score}`, {
      fontSize: '16px',
      color: textColor,
    })

    this.livesText = this.scene.add.text(16, 38, `Lives: ${this.currentData.lives}`, {
      fontSize: '16px',
      color: textColor,
    })

    this.elapsedTimeText = this.scene.add.text(16, 60, `Time: ${this.currentData.formattedElapsedTime}`, {
      fontSize: '16px',
      color: textColor,
    })

    // Game over text (initially hidden)
    this.gameOverText = this.scene.add.text(
      constants.GAME_CENTER_X,
      constants.GAME_CENTER_Y,
      `GAME OVER
Press R to restart`,
      {
        fontSize: '32px',
        color: '#ff6b6b', // Bright red
        align: 'center',
      },
    )
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setVisible(false)
    this.gameOverText.setDepth(101)

    // Start text (initially visible)
    this.startText = this.scene.add.text(
      constants.GAME_CENTER_X,
      constants.GAME_CENTER_Y,
      `Press SPACE to start

--- CONTROLS ---
← → / A D : Move paddle
SHIFT + ← → / A D : Fast move
SPACE : Jump (during game)
P : Pause/Resume
R : Restart`,
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
      },
    )
    this.startText.setOrigin(0.5)
    this.startText.setVisible(true)
    this.startText.setDepth(101)

    // Pause text (initially hidden)
    this.pauseText = this.scene.add.text(
      constants.GAME_CENTER_X,
      constants.GAME_CENTER_Y,
      `PAUSED
Press P to resume

--- CONTROLS ---
← → / A D : Move paddle
SHIFT + ← → / A D : Fast move
SPACE : Jump
P : Pause/Resume
R : Restart`,
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
  }

  /**
   * Create full-screen overlay
   */
  private createOverlay(): void {
    this.fullScreenOverlay = this.scene.add.graphics()
    this.fullScreenOverlay.fillStyle(0x000000, 0.6)
    this.fullScreenOverlay.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT)
    this.fullScreenOverlay.setDepth(100) // High depth to always display in front
    this.fullScreenOverlay.setVisible(true) // Initially visible (for start screen)

    // Store overlay reference for all text elements
    this.gameOverText.setData('overlay', this.fullScreenOverlay)
    this.startText.setData('overlay', this.fullScreenOverlay)
    this.pauseText.setData('overlay', this.fullScreenOverlay)
  }

  /**
   * Update all text contents
   */
  updateAllTexts(): void {
    // Update start text for all devices (keyboard + virtual pad controls)
    this.startText.setText(
      `${gameInfo.title}

PRESS SPACE OR TAP/CLICK TO START

--- KEYBOARD CONTROLS ---
← → / A D : Move paddle
SHIFT + ← → / A D : Fast move
SPACE : Jump (during game)
P : Pause/Resume
R : Restart

--- VIRTUAL PAD CONTROLS ---
← → buttons: Move paddle
JUMP button: Jump
PAUSE button: Pause/Resume
FAST button: Fast move
Tap/Click anywhere: Start game`,
    )

    // Update pause text for all devices
    this.pauseText.setText(
      `${gameInfo.title}

PAUSED
Press P or tap/click PAUSE to resume

--- KEYBOARD CONTROLS ---
← → / A D : Move paddle
SHIFT + ← → / A D : Fast move
SPACE : Jump
P : Pause/Resume
R : Restart

--- VIRTUAL PAD CONTROLS ---
← → buttons: Move paddle
JUMP button: Jump
PAUSE button: Pause/Resume
FAST button: Fast move`,
    )
  }

  /**
   * Update display data and refresh UI
   */
  updateDisplayData(data: GameDisplayData): void {
    this.currentData = { ...data }
    this.scoreText.setText(`Score: ${this.currentData.score}`)
    this.livesText.setText(`Lives: ${this.currentData.lives}`)
    this.elapsedTimeText.setText(`Time: ${this.currentData.formattedElapsedTime}`)
  }

  /**
   * Update score display
   */
  updateScore(score: number): void {
    this.currentData.score = score
    this.scoreText.setText(`Score: ${score}`)
  }

  /**
   * Update lives display
   */
  updateLives(lives: number): void {
    this.currentData.lives = lives
    this.livesText.setText(`Lives: ${lives}`)
  }

  /**
   * Update elapsed time display
   */
  updateElapsedTime(formattedTime: string): void {
    this.currentData.formattedElapsedTime = formattedTime
    this.elapsedTimeText.setText(`Time: ${formattedTime}`)
  }

  /**
   * Show start screen
   */
  showStartScreen(): void {
    this.startText.setVisible(true)
    this.fullScreenOverlay.setVisible(true)
    this.gameOverText.setVisible(false)
    this.pauseText.setVisible(false)
  }

  /**
   * Hide start screen
   */
  hideStartScreen(): void {
    this.startText.setVisible(false)
    this.fullScreenOverlay.setVisible(false)
  }

  /**
   * Show game over screen with final stats
   */
  showGameOverScreen(finalScore: number, finalTimeMs: number): void {
    const finalSeconds = (finalTimeMs / 1000).toFixed(1)
    this.gameOverText.setText(
      `GAME OVER
Final Score: ${finalScore}
Time: ${finalSeconds}s
Press R or tap to restart`,
    )
    this.gameOverText.setVisible(true)
    this.fullScreenOverlay.setVisible(true)
  }

  /**
   * Hide game over screen
   */
  hideGameOverScreen(): void {
    this.gameOverText.setVisible(false)
  }

  /**
   * Show pause screen
   */
  showPauseScreen(): void {
    this.pauseText.setVisible(true)
    this.fullScreenOverlay.setVisible(true)
  }

  /**
   * Hide pause screen
   */
  hidePauseScreen(): void {
    this.pauseText.setVisible(false)
    this.fullScreenOverlay.setVisible(false)
  }

  /**
   * Show points effect at specified position
   */
  showPointsEffect(x: number, y: number, points: number): void {
    // Create point display text
    const pointsText = this.scene.add.text(x, y, `+${points}`, {
      fontSize: '24px',
      color: '#00ff88', // Bright green
      align: 'center',
    })
    pointsText.setOrigin(0.5)
    pointsText.setDepth(105) // Display in front of other effects

    // Point text animation
    this.scene.tweens.add({
      targets: pointsText,
      y: y - 60, // Move up
      alpha: 0, // Fade out
      scaleX: 1.5, // Slightly enlarge
      scaleY: 1.5,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => {
        pointsText.destroy()
      },
    })
  }

  /**
   * Show bonus effect for all bricks cleared
   */
  showBonusEffect(): void {
    const bonusText = this.scene.add.text(constants.GAME_CENTER_X, constants.GAME_CENTER_Y - 112, '+100 BONUS!', {
      fontSize: '48px',
      color: '#ffd700', // Gold
      align: 'center',
    })
    bonusText.setOrigin(0.5)
    bonusText.setDepth(102)

    // Bonus text animation
    this.scene.tweens.add({
      targets: bonusText,
      y: constants.GAME_CENTER_Y - 162,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        bonusText.destroy()
      },
    })
  }

  /**
   * Show explosion effect at specified position
   */
  showExplosionEffect(x: number, y: number): void {
    // Death effect: explosion-like circular effect
    const explosionGraphics = this.scene.add.graphics()
    explosionGraphics.setDepth(103)

    // Create explosion effect with multiple circles
    const colors = [0xff6b6b, 0xff9f43, 0xfeca57, 0xff6348]
    for (let i = 0; i < 4; i++) {
      explosionGraphics.fillStyle(colors[i], 0.7)
      explosionGraphics.fillCircle(x, y, 5)
    }

    // Explosion animation
    this.scene.tweens.add({
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
  }

  /**
   * Show miss effect at specified position
   */
  showMissEffect(x: number, y: number): void {
    // "MISS!" text effect
    const missText = this.scene.add.text(x, y - 50, 'MISS!', {
      fontSize: '32px',
      color: '#ff6b6b', // Red
      align: 'center',
    })
    missText.setOrigin(0.5)
    missText.setDepth(104)

    // MISS text animation
    this.scene.tweens.add({
      targets: missText,
      y: y - 100,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        missText.destroy()
      },
    })
  }

  /**
   * Shake the camera for visual feedback
   */
  shakeCamera(duration: number = 300, intensity: number = 0.01): void {
    this.scene.cameras.main.shake(duration, intensity)
  }

  /**
   * Reset all UI elements to initial state
   */
  reset(): void {
    // Reset to initial values
    this.currentData = { ...this.initialData }

    // Update displays with reset values
    this.updateScore(this.currentData.score)
    this.updateLives(this.currentData.lives)
    this.updateElapsedTime(this.currentData.formattedElapsedTime)

    // Show start screen
    this.showStartScreen()
  }
}
