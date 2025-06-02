import * as Phaser from 'phaser'

/**
 * TypeScript assertion function to validate if a value is a Phaser.Physics.Arcade.Sprite
 * Performs comprehensive validation of sprite properties and methods
 * @param val - The value to check
 * @throws Error if the value is not a Phaser.Physics.Arcade.Sprite
 */
export function assertSprite(val: unknown): asserts val is Phaser.Physics.Arcade.Sprite {
  if (!val || typeof val !== 'object') {
    throw new Error('Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object')
  }

  const obj = val as Record<string, unknown>

  // Check for essential Phaser.Physics.Arcade.Sprite properties and methods
  if (
    typeof obj.x !== 'number' ||
    typeof obj.y !== 'number' ||
    typeof obj.visible !== 'boolean' ||
    typeof obj.setPosition !== 'function' ||
    typeof obj.setVelocity !== 'function' ||
    typeof obj.destroy !== 'function'
  ) {
    throw new Error('Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods')
  }

  // Check if it has a physics body (can be null)
  if (obj.body !== null && obj.body !== undefined) {
    const body = obj.body as Record<string, unknown>
    if (
      typeof body.velocity !== 'object' ||
      body.velocity === null ||
      typeof (body.velocity as Record<string, unknown>).x !== 'number' ||
      typeof (body.velocity as Record<string, unknown>).y !== 'number'
    ) {
      throw new Error('Expected sprite to have a valid physics body with velocity properties')
    }
  }

  // Additional check for Phaser-specific properties
  if (typeof obj.scene !== 'object' || obj.scene === null) {
    throw new Error('Expected sprite to have a valid Phaser scene reference')
  }
}

/**
 * Light version of assertSprite with minimal validation
 * Only checks basic sprite properties without deep validation
 * @param val - The value to check
 * @throws Error if the value is not a basic sprite-like object
 */
export function assertSpriteLight(val: unknown): asserts val is Phaser.Physics.Arcade.Sprite {
  if (!val || typeof val !== 'object') {
    throw new Error('Expected value to be a sprite object, but received a non-object')
  }

  const obj = val as Record<string, unknown>

  // Check only essential position properties
  if (typeof obj.x !== 'number' || typeof obj.y !== 'number') {
    throw new Error('Expected sprite to have numeric x and y properties')
  }

  // Check for basic sprite methods
  if (typeof obj.setPosition !== 'function') {
    throw new Error('Expected sprite to have setPosition method')
  }
}
