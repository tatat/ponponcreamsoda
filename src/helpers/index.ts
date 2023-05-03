export const arrayWrap = <T>(value: T | T[] | undefined): T[] => {
  if (typeof value === 'undefined') {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function isDescendantOrSelfOf (element: Element, node: unknown): boolean {
  let current = node

  while (current) {
    if (current === element) {
      return true
    }

    current = (current as { parentElement: unknown }).parentElement
  }

  return false
}
