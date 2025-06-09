const _isWindowHidden = (): boolean => {
  return document.hidden || !document.hasFocus()
}

type VisibilityChangeHandler = (isWindowHidden: boolean) => void

/**
 * VisibilityManager class - Handles window visibility changes for auto-pause functionality
 */
export class VisibilityManager {
  private _handleVisibilityChange: VisibilityChangeHandler
  private handleVisibilityChange: () => void
  private isListening: boolean = false

  constructor(onVisibilityChange: VisibilityChangeHandler) {
    this._handleVisibilityChange = onVisibilityChange
    this.handleVisibilityChange = () => {
      this._handleVisibilityChange(_isWindowHidden())
    }
  }

  /**
   * Start listening for visibility changes
   */
  public startListening(): void {
    if (this.isListening) {
      return
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    window.addEventListener('blur', this.handleVisibilityChange)

    this.isListening = true
  }

  /**
   * Stop listening for visibility changes
   */
  public stopListening(): void {
    if (!this.isListening) {
      return
    }

    // Remove event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('blur', this.handleVisibilityChange)

    this.isListening = false
  }

  /**
   * Static method to check if window is currently hidden or unfocused
   */
  public static isWindowHidden(): boolean {
    return _isWindowHidden()
  }
}
