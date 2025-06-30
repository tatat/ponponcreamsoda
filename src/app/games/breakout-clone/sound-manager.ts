import * as Phaser from 'phaser'
import { constants } from './constants'
import { SoundSettings } from './settings'

/**
 * SoundManager class - Handles all sound-related functionality for the breakout game
 */
export class SoundManager {
  private scene: Phaser.Scene
  private hitSounds: Phaser.Sound.BaseSound[]
  private soundEnabled: boolean
  private currentScale: keyof typeof constants.MUSICAL_SCALES
  private currentBaseKey: keyof typeof constants.BASE_KEY_OFFSETS

  constructor(scene: Phaser.Scene, soundSettings: SoundSettings) {
    this.scene = scene
    this.hitSounds = []
    this.soundEnabled = soundSettings.soundEnabled
    this.currentScale = soundSettings.musicalScale
    this.currentBaseKey = soundSettings.baseKey
  }

  /**
   * Load all sound assets
   */
  preload(): void {
    // Load hit sound effects (01.mp3 to 12.mp3)
    for (let i = 1; i <= 12; i++) {
      const soundKey = `hit${i.toString().padStart(2, '0')}`
      const soundPath = `/games/breakout-clone/sounds/hit/${i.toString().padStart(2, '0')}.mp3`
      this.scene.load.audio(soundKey, soundPath)
    }
  }

  /**
   * Initialize sound manager after assets are loaded
   */
  initialize(): void {
    // Initialize hit sounds array with all loaded hit sounds
    this.hitSounds = []
    for (let i = 1; i <= 12; i++) {
      const soundKey = `hit${i.toString().padStart(2, '0')}`
      const sound = this.scene.sound.add(soundKey, { volume: 0.3 })
      this.hitSounds.push(sound)
    }
  }

  /**
   * Play a random hit sound based on current musical scale and base key
   */
  playRandomHitSound(): void {
    // Check if sound is enabled
    if (!this.soundEnabled) {
      return
    }

    // Play a random hit sound from the current scale with base key transposition
    if (this.hitSounds.length > 0) {
      const scaleNotes = constants.MUSICAL_SCALES[this.currentScale]
      const randomScaleIndex = Math.floor(Math.random() * scaleNotes.length)
      const baseNoteIndex = scaleNotes[randomScaleIndex]

      // Apply base key offset (transposition)
      const baseKeyOffset = constants.BASE_KEY_OFFSETS[this.currentBaseKey]
      const transposedNoteIndex = (baseNoteIndex + baseKeyOffset) % 12

      // Ensure the note index is within bounds
      if (transposedNoteIndex < this.hitSounds.length) {
        const selectedSound = this.hitSounds[transposedNoteIndex]
        selectedSound.play()
      }
    }
  }

  /**
   * Update settings and apply changes
   */
  applySettings(newSettings: SoundSettings): void {
    this.soundEnabled = newSettings.soundEnabled
    this.currentScale = newSettings.musicalScale
    this.currentBaseKey = newSettings.baseKey
  }

  /**
   * Get current musical scale
   */
  getCurrentScale(): keyof typeof constants.MUSICAL_SCALES {
    return this.currentScale
  }

  /**
   * Set current musical scale
   */
  setCurrentScale(scale: keyof typeof constants.MUSICAL_SCALES): void {
    this.currentScale = scale
  }

  /**
   * Get current base key
   */
  getCurrentBaseKey(): keyof typeof constants.BASE_KEY_OFFSETS {
    return this.currentBaseKey
  }

  /**
   * Set current base key
   */
  setCurrentBaseKey(baseKey: keyof typeof constants.BASE_KEY_OFFSETS): void {
    this.currentBaseKey = baseKey
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.hitSounds.forEach((sound) => {
      if (sound) {
        sound.destroy()
      }
    })
    this.hitSounds = []
  }
}
