import { describe, it, expect } from 'vitest'
import { arrayWrap, isDescendantOrSelfOf } from './index'

describe('arrayWrap', () => {
  it('should return empty array for undefined', () => {
    expect(arrayWrap(undefined)).toEqual([])
  })

  it('should return the same array if input is already an array', () => {
    const input = [1, 2, 3]
    expect(arrayWrap(input)).toBe(input)
  })

  it('should wrap a single value in an array', () => {
    expect(arrayWrap('hello')).toEqual(['hello'])
    expect(arrayWrap(42)).toEqual([42])
    expect(arrayWrap(null)).toEqual([null])
    expect(arrayWrap(false)).toEqual([false])
  })

  it('should handle objects', () => {
    const obj = { key: 'value' }
    expect(arrayWrap(obj)).toEqual([obj])
  })

  it('should handle empty arrays', () => {
    const emptyArray: string[] = []
    expect(arrayWrap(emptyArray)).toBe(emptyArray)
  })
})

describe('isDescendantOrSelfOf', () => {
  it('should return true if node is the same as element', () => {
    const element = document.createElement('div')
    expect(isDescendantOrSelfOf(element, element)).toBe(true)
  })

  it('should return true if node is a descendant of element', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    const grandchild = document.createElement('p')

    parent.appendChild(child)
    child.appendChild(grandchild)

    expect(isDescendantOrSelfOf(parent, child)).toBe(true)
    expect(isDescendantOrSelfOf(parent, grandchild)).toBe(true)
  })

  it('should return false if node is not a descendant of element', () => {
    const element1 = document.createElement('div')
    const element2 = document.createElement('span')

    expect(isDescendantOrSelfOf(element1, element2)).toBe(false)
  })

  it('should return false if node is a parent of element', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')

    parent.appendChild(child)

    expect(isDescendantOrSelfOf(child, parent)).toBe(false)
  })

  it('should return false for null or undefined node', () => {
    const element = document.createElement('div')
    expect(isDescendantOrSelfOf(element, null)).toBe(false)
    expect(isDescendantOrSelfOf(element, undefined)).toBe(false)
  })

  it('should handle nodes without parentElement property', () => {
    const element = document.createElement('div')
    const nodeWithoutParent = { parentElement: null }

    expect(isDescendantOrSelfOf(element, nodeWithoutParent)).toBe(false)
  })
})
