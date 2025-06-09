/**
 * Utility function to safely destroy an object and set the reference to null
 * @param obj - Object with a destroy method or null/undefined
 * @returns null
 */
export function destroyAndNull<T extends { destroy(): void } | null | undefined>(obj: T): null {
  if (obj && typeof obj.destroy === 'function') {
    obj.destroy()
  }
  return null
}
