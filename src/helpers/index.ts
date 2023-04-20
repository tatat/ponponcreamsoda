export const arrayWrap = <T>(value: T | T[] | undefined): T[] => {
  if (typeof value === 'undefined') {
    return []
  }

  return Array.isArray(value) ? value : [value]
}
