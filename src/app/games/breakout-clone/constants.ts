/**
 * Constants definition for BreakoutScene
 */
export const BreakoutConstants = {
  // Game dimensions - change these to resize the game
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,

  // Calculated positions based on game dimensions
  get GAME_CENTER_X() {
    return this.GAME_WIDTH / 2
  },
  get GAME_CENTER_Y() {
    return this.GAME_HEIGHT / 2
  },
  get PADDLE_GROUND_Y() {
    return this.GAME_HEIGHT - 55
  },
  get BALL_START_Y() {
    return this.PADDLE_GROUND_Y - 35
  },
  PADDLE_BOUNDS_LEFT: 50,
  get PADDLE_BOUNDS_RIGHT() {
    return this.GAME_WIDTH - 50
  },
  get BALL_DEATH_Y() {
    return this.GAME_HEIGHT - 25
  },
  BRICK_AREA_MARGIN: 50,
  BRICK_AREA_HEIGHT: 280,
  // Available brick sizes constants
  BRICK_SIZES: [64, 96, 128, 160, 192, 224, 256, 300],
  // Brick image name constants
  BRICK_NAMES: ['d1', 'd2', 'r1', 'r2', 't1', 't2'],
} as const
