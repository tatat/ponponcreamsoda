export interface GameSettings {
  // Control settings
  showVirtualPad: boolean
  // Debug settings
  debugMode: boolean
}

export const defaultSettings: GameSettings = {
  // Control settings
  showVirtualPad: true,
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
