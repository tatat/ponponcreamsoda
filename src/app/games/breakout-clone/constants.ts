/**
 * Constants definition for BreakoutScene
 */
export const constants = {
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
  // Score settings for brick sizes
  SCORE_BY_SIZE: {
    64: 10, // Smallest block: 10 points
    96: 15, // Small block: 15 points
    128: 25, // Medium block: 25 points
    160: 40, // Large block: 40 points
    192: 60, // Extra large block: 60 points
    224: 90, // Super large block: 90 points
    256: 130, // Maximum block: 130 points
  } as const,
  DEFAULT_SCORE: 10, // Default score for unknown sizes

  // Musical scales definition (0-based index, where 0=C, 1=C#, 2=D, etc.)
  MUSICAL_SCALES: {
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // All notes
    major: [0, 2, 4, 5, 7, 9, 11], // C Major: C, D, E, F, G, A, B
    minor: [0, 2, 3, 5, 7, 8, 10], // C Minor: C, D, Eb, F, G, Ab, Bb
    pentatonic: [0, 2, 4, 7, 9], // C Pentatonic: C, D, E, G, A
    blues: [0, 3, 5, 6, 7, 10], // C Blues: C, Eb, F, F#, G, Bb
    dorian: [0, 2, 3, 5, 7, 9, 10], // C Dorian: C, D, Eb, F, G, A, Bb
    mixolydian: [0, 2, 4, 5, 7, 9, 10], // C Mixolydian: C, D, E, F, G, A, Bb
    wholeTone: [0, 2, 4, 6, 8, 10], // Whole tone: C, D, E, F#, G#, Bb
    diminished: [0, 2, 3, 5, 6, 8, 9, 11], // Diminished: C, D, Eb, F, F#, G#, A, B
  } as const,

  // Base key mapping (BaseKey to semitone offset from C)
  BASE_KEY_OFFSETS: {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11,
  } as const,
} as const
