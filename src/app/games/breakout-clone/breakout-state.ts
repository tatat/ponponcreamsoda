/**
 * BreakoutState class - Manages all game state for the BreakoutScene
 */
export class BreakoutState {
  // Score and lives
  score = 0
  lives = 3

  // Time tracking
  startTime = 0
  elapsedTimeMs = 0
  pauseStartTime = 0
  totalPausedTime = 0

  // Game flow states
  isGameOver = false
  isGameStarted = false
  isPaused = false

  // Jumping mechanics
  isJumping = false
  jumpDuration = 0
  jumpVelocity = -225
  gravity = 600

  constructor() {
    this.reset()
  }

  // Score methods
  addScore(points: number): void {
    this.score += points
  }

  // Lives methods
  loseLife(): void {
    this.lives--
  }

  // Time tracking methods
  startPause(): void {
    this.pauseStartTime = Date.now()
  }

  endPause(): void {
    if (this.pauseStartTime > 0) {
      this.totalPausedTime += Date.now() - this.pauseStartTime
      this.pauseStartTime = 0
    }
  }

  calculateElapsedTime(): number {
    return Date.now() - this.startTime - this.totalPausedTime
  }

  // Game flow methods
  togglePause(): boolean {
    this.isPaused = !this.isPaused
    return this.isPaused
  }

  // Jumping methods
  addJumpDuration(delta: number): void {
    this.jumpDuration += delta
  }

  startJump(): void {
    this.isJumping = true
    this.jumpDuration = 0
  }

  endJump(): void {
    this.isJumping = false
    this.jumpDuration = 0
  }

  // Game state checks
  isGameActive(): boolean {
    return this.isGameStarted && !this.isGameOver && !this.isPaused
  }

  canMove(): boolean {
    return !this.isGameOver && !this.isPaused
  }

  canJump(): boolean {
    return this.isGameStarted && !this.isJumping && !this.isPaused && !this.isGameOver
  }

  // Reset methods
  reset(): void {
    this.score = 0
    this.lives = 3
    this.startTime = 0
    this.elapsedTimeMs = 0
    this.pauseStartTime = 0
    this.totalPausedTime = 0
    this.isGameOver = false
    this.isGameStarted = false
    this.isPaused = false
    this.isJumping = false
    this.jumpDuration = 0
  }

  resetTime(): void {
    this.startTime = 0
    this.elapsedTimeMs = 0
    this.pauseStartTime = 0
    this.totalPausedTime = 0
  }

  resetJumping(): void {
    this.isJumping = false
    this.jumpDuration = 0
  }

  // Debug mode initialization
  initializeDebugMode(): void {
    this.score = 900
  }

  // Get formatted elapsed time
  getFormattedElapsedTime(): string {
    const elapsedSeconds = (this.elapsedTimeMs / 1000).toFixed(1)
    return `${elapsedSeconds}s`
  }
}
