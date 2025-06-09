import * as Phaser from 'phaser'
import { constants } from './constants'
import { Boss } from './boss'
import { BrickGenerator } from './brick-generator'
import { destroyAndNull } from '@/helpers/cleanup'

export class BossManager {
  private scene: Phaser.Scene
  private brickGenerator: BrickGenerator
  private currentBoss: Boss | null = null
  private bossNumber = 0
  private isBossBattle = false

  // Callback mechanisms
  onBossBattleWillStart?: () => void
  onBossStarted?: () => void
  onBossDefeated?: () => void

  constructor(scene: Phaser.Scene, brickGenerator: BrickGenerator) {
    this.scene = scene
    this.brickGenerator = brickGenerator
  }

  checkBossBattle(score: number): boolean {
    if (this.isBossBattle) return false

    const nextBossThreshold = this.calculateNextBossThreshold()
    return score >= nextBossThreshold
  }

  startBossBattle(): void {
    if (this.isBossBattle) return

    // Call the onBossBattleWillStart callback if defined
    this.onBossBattleWillStart?.()

    this.isBossBattle = true
    this.bossNumber++

    // Show boss battle message
    const bossText = this.scene.add.text(constants.GAME_CENTER_X, constants.GAME_CENTER_Y - 200, 'BOSS BATTLE!', {
      fontSize: '48px',
      color: '#ff6b6b',
      align: 'center',
    })
    bossText.setOrigin(0.5)
    bossText.setDepth(102)

    this.scene.tweens.add({
      targets: bossText,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        bossText.destroy()
      },
    })

    // Create boss after bricks fade out
    this.scene.time.delayedCall(1000, () => {
      this.createBoss()

      // Call the onBossStarted callback after boss is created
      this.onBossStarted?.()
    })
  }

  private calculateNextBossThreshold(): number {
    let threshold = 1000 // First boss always at 1000

    for (let i = 1; i <= this.bossNumber; i++) {
      const bossBonus = 400 + i * 100 // Boss 1: 500, Boss 2: 600, Boss 3: 700, etc.
      threshold += bossBonus
      threshold += 1000
    }

    return threshold
  }

  private createBoss() {
    this.currentBoss = new Boss(this.scene, this.bossNumber, this.brickGenerator)
    const bossSprite = this.currentBoss.create()

    return bossSprite
  }

  createHitBossCallback(playHitSound?: () => void): Phaser.Types.Physics.Arcade.ArcadePhysicsCallback {
    return () => {
      if (!this.currentBoss) return

      // Play hit sound if provided
      playHitSound?.()

      const isDefeated = this.currentBoss.hit()

      if (isDefeated) {
        const bonusScore = this.defeatBoss()
        // Return the bonus score for the scene to handle
        return bonusScore
      }
    }
  }

  private defeatBoss(): number {
    if (!this.currentBoss) return 0

    const bonusScore = this.currentBoss.defeat()

    // Show victory message
    const victoryText = this.scene.add.text(
      constants.GAME_CENTER_X,
      constants.GAME_CENTER_Y,
      `BOSS DEFEATED!\n+${bonusScore} BONUS!`,
      {
        fontSize: '36px',
        color: '#ffd700',
        align: 'center',
      },
    )
    victoryText.setOrigin(0.5)
    victoryText.setDepth(102)

    this.scene.tweens.add({
      targets: victoryText,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        victoryText.destroy()
      },
    })

    // Reset boss battle state and restore normal bricks
    this.scene.time.delayedCall(2000, () => {
      this.isBossBattle = false
      this.currentBoss = null

      // Call the callback to recreate bricks
      if (this.onBossDefeated) {
        this.onBossDefeated()
      }
    })

    return bonusScore
  }

  addBossCollision(targets: Phaser.Physics.Arcade.Sprite[], playHitSound?: () => void) {
    const bossSprite = this.getBossSprite()
    if (!bossSprite) return

    // Add collision for all targets with the same process
    targets.forEach((target) => {
      this.scene.physics.add.collider(
        target,
        bossSprite,
        this.createHitBossCallback(playHitSound),
        undefined,
        this.scene,
      )
    })
  }

  getBossSprite(): Phaser.Physics.Arcade.Sprite | null {
    return this.currentBoss?.getSprite() || null
  }

  isBossBattleActive(): boolean {
    return this.isBossBattle
  }

  reset() {
    this.isBossBattle = false
    this.bossNumber = 0
    this.currentBoss = destroyAndNull(this.currentBoss)
  }
}
