import { describe, it, expect } from 'vitest'
import { assertSprite, assertSpriteLight } from './phaser-assertions'

// Mock Phaser sprite for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockSprite = (overrides: any = {}): any => {
  const mockVelocity = {
    x: 0,
    y: 0,
  }

  const mockBody = {
    velocity: mockVelocity,
    width: 32,
    height: 32,
    collideWorldBounds: false,
  }

  const mockScene = {
    physics: {
      world: {
        bounds: { x: 0, y: 0, width: 800, height: 600 },
      },
    },
  }

  return {
    x: 100,
    y: 100,
    visible: true,
    tint: 0xffffff,
    body: mockBody,
    scene: mockScene,
    setPosition: () => {},
    setVelocity: () => {},
    destroy: () => {},
    ...overrides,
  }
}

describe('assertSprite', () => {
  it('should pass for valid Phaser.Physics.Arcade.Sprite', () => {
    const sprite = createMockSprite()
    expect(() => assertSprite(sprite)).not.toThrow()
  })

  it('should pass for sprite with null body', () => {
    const sprite = createMockSprite({ body: null })
    expect(() => assertSprite(sprite)).not.toThrow()
  })

  it('should throw for null value', () => {
    expect(() => assertSprite(null)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object',
    )
  })

  it('should throw for undefined value', () => {
    expect(() => assertSprite(undefined)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object',
    )
  })

  it('should throw for primitive values', () => {
    expect(() => assertSprite(42)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object',
    )
    expect(() => assertSprite('string')).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object',
    )
    expect(() => assertSprite(true)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite, but received a non-object',
    )
  })

  it('should throw for object missing required properties', () => {
    const invalidObject = { x: 100 }
    expect(() => assertSprite(invalidObject)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing x property', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.x
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing y property', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.y
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing visible property', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.visible
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing setPosition method', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.setPosition
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing setVelocity method', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.setVelocity
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object missing destroy method', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.destroy
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected value to be a Phaser.Physics.Arcade.Sprite with required properties and methods',
    )
  })

  it('should throw for object with invalid physics body', () => {
    const invalidSprite = createMockSprite({
      body: { velocity: null },
    })
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected sprite to have a valid physics body with velocity properties',
    )
  })

  it('should throw for object with physics body missing velocity.x', () => {
    const invalidSprite = createMockSprite({
      body: { velocity: { y: 0 } },
    })
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected sprite to have a valid physics body with velocity properties',
    )
  })

  it('should throw for object with physics body missing velocity.y', () => {
    const invalidSprite = createMockSprite({
      body: { velocity: { x: 0 } },
    })
    expect(() => assertSprite(invalidSprite)).toThrow(
      'Expected sprite to have a valid physics body with velocity properties',
    )
  })

  it('should throw for object missing scene', () => {
    const invalidSprite = createMockSprite()
    delete invalidSprite.scene
    expect(() => assertSprite(invalidSprite)).toThrow('Expected sprite to have a valid Phaser scene reference')
  })

  it('should throw for object with null scene', () => {
    const invalidSprite = createMockSprite({ scene: null })
    expect(() => assertSprite(invalidSprite)).toThrow('Expected sprite to have a valid Phaser scene reference')
  })

  it('should provide type narrowing after assertion', () => {
    const unknownValue: unknown = createMockSprite()

    // Before assertion, TypeScript doesn't know the type
    // unknownValue.x // This would be a TypeScript error

    assertSprite(unknownValue)

    // After assertion, TypeScript knows it's a Phaser.Physics.Arcade.Sprite
    expect(typeof unknownValue.x).toBe('number')
    expect(typeof unknownValue.y).toBe('number')
    expect(typeof unknownValue.visible).toBe('boolean')
    expect(typeof unknownValue.setPosition).toBe('function')
  })
})

describe('assertSpriteLight', () => {
  it('should pass for valid sprite with minimal properties', () => {
    const sprite = createMockSprite()
    expect(() => assertSpriteLight(sprite)).not.toThrow()
  })

  it('should pass for object with only basic sprite properties', () => {
    const basicSprite = {
      x: 100,
      y: 200,
      setPosition: () => {},
    }
    expect(() => assertSpriteLight(basicSprite)).not.toThrow()
  })

  it('should throw for null value', () => {
    expect(() => assertSpriteLight(null)).toThrow('Expected value to be a sprite object, but received a non-object')
  })

  it('should throw for undefined value', () => {
    expect(() => assertSpriteLight(undefined)).toThrow(
      'Expected value to be a sprite object, but received a non-object',
    )
  })

  it('should throw for primitive values', () => {
    expect(() => assertSpriteLight(42)).toThrow('Expected value to be a sprite object, but received a non-object')
    expect(() => assertSpriteLight('string')).toThrow('Expected value to be a sprite object, but received a non-object')
  })

  it('should throw for object missing x property', () => {
    const invalidSprite = { y: 100, setPosition: () => {} }
    expect(() => assertSpriteLight(invalidSprite)).toThrow('Expected sprite to have numeric x and y properties')
  })

  it('should throw for object missing y property', () => {
    const invalidSprite = { x: 100, setPosition: () => {} }
    expect(() => assertSpriteLight(invalidSprite)).toThrow('Expected sprite to have numeric x and y properties')
  })

  it('should throw for object with non-numeric x', () => {
    const invalidSprite = { x: 'not a number', y: 100, setPosition: () => {} }
    expect(() => assertSpriteLight(invalidSprite)).toThrow('Expected sprite to have numeric x and y properties')
  })

  it('should throw for object with non-numeric y', () => {
    const invalidSprite = { x: 100, y: 'not a number', setPosition: () => {} }
    expect(() => assertSpriteLight(invalidSprite)).toThrow('Expected sprite to have numeric x and y properties')
  })

  it('should throw for object missing setPosition method', () => {
    const invalidSprite = { x: 100, y: 200 }
    expect(() => assertSpriteLight(invalidSprite)).toThrow('Expected sprite to have setPosition method')
  })

  it('should NOT check for other properties like visible, scene, body', () => {
    // This should pass even without visible, scene, body, etc.
    const minimalSprite = {
      x: 100,
      y: 200,
      setPosition: () => {},
      // Missing: visible, scene, body, setVelocity, destroy
    }
    expect(() => assertSpriteLight(minimalSprite)).not.toThrow()
  })

  it('should provide type narrowing after assertion', () => {
    const unknownValue: unknown = {
      x: 100,
      y: 200,
      setPosition: () => {},
    }

    assertSpriteLight(unknownValue)

    // After assertion, TypeScript knows it's a Phaser.Physics.Arcade.Sprite
    expect(typeof unknownValue.x).toBe('number')
    expect(typeof unknownValue.y).toBe('number')
    expect(typeof unknownValue.setPosition).toBe('function')
  })
})
