export const gameInfo = {
  title: 'Sticker Drift',
  description: 'Avoid obstacles in zero gravity!',
}

export const constants = {
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,
  PLAYER_SPEED: 300, // Horizontal scroll speed (illusion)
  GRAVITY: 500, // Downward gravity force
  FLOAT_ACCELERATION: 1200, // Upward acceleration when floating (stronger than gravity)
  PLAYER_DRAG: 0, // No drag for crisp physics
  OBSTACLE_SPAWN_RATE: 1500, // Milliseconds between spawns
  OBSTACLE_SPEED_MIN: 200,
  OBSTACLE_SPEED_MAX: 400,
  HOMING_SPEED_MIN: 100, // Minimum homing speed
  HOMING_SPEED_MAX: 200, // Maximum homing speed
  HOMING_PROBABILITY: 0.5, // 50% chance for homing obstacles
} as const
