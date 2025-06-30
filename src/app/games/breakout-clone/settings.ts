export type MusicalScale =
  | 'chromatic'
  | 'major'
  | 'minor'
  | 'pentatonic'
  | 'blues'
  | 'dorian'
  | 'mixolydian'
  | 'wholeTone'
  | 'diminished'

export type BaseKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export interface SoundSettings {
  soundEnabled: boolean
  musicalScale: MusicalScale
  baseKey: BaseKey
}

export interface GameSettings {
  // Control settings
  showVirtualPad: boolean
  // Audio settings
  sound: SoundSettings
  // Debug settings
  debugMode: boolean
}

export const defaultSettings: GameSettings = {
  // Control settings
  showVirtualPad: true,
  // Audio settings
  sound: {
    soundEnabled: true,
    musicalScale: 'major',
    baseKey: 'C',
  },
  // Debug settings
  debugMode: false,
}

// Local storage key
export const SETTINGS_STORAGE_KEY = 'breakout-clone-settings'

// Save settings
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save settings:', error)
  }
}

// Load settings
export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)

      // Migrate old settings format to new format
      if ('soundEnabled' in parsed || 'musicalScale' in parsed || 'baseKey' in parsed) {
        const migrated: GameSettings = {
          ...getDeviceSpecificDefaults(),
          showVirtualPad: parsed.showVirtualPad ?? getDeviceSpecificDefaults().showVirtualPad,
          debugMode: parsed.debugMode ?? false,
          sound: {
            soundEnabled: parsed.soundEnabled ?? true,
            musicalScale: parsed.musicalScale ?? 'major',
            baseKey: parsed.baseKey ?? 'C',
          },
        }
        // Save migrated settings
        saveSettings(migrated)
        return migrated
      }

      // Merge with device-specific defaults to handle cases where new settings are added
      return { ...getDeviceSpecificDefaults(), ...parsed }
    }
  } catch (error) {
    console.warn('Failed to load settings:', error)
  }
  return getDeviceSpecificDefaults()
}

// Device type detection
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific property
    navigator.msMaxTouchPoints > 0
  )
}

// Get device-specific default settings
export function getDeviceSpecificDefaults(): GameSettings {
  const isTouch = isTouchDevice()
  return {
    ...defaultSettings,
    showVirtualPad: isTouch,
  }
}

// Reset settings
export function resetSettings(): GameSettings {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to reset settings:', error)
  }
  return getDeviceSpecificDefaults()
}
