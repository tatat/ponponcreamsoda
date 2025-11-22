import { css } from '@emotion/react'
import type { Item, AvailabilityState } from '@/item-list-type'
import { isGroupItem } from '@/item-list-type'

export const getAvailabilityStatusStyle = (status: AvailabilityState) => {
  switch (status) {
    case 'available':
      return css`
        background-color: #a8d5a8;
        color: #2d5a2d;
      `
    case 'unavailable':
      return css`
        background-color: #f5b7b1;
        color: #8b2635;
      `
    case 'preparing':
      return css`
        background-color: #fdeaa7;
        color: #8b6914;
      `
    default:
      return css`
        background-color: #d5d5d5;
        color: #5a5a5a;
      `
  }
}

export const getAvailabilityStatusText = (status: AvailabilityState) => {
  switch (status) {
    case 'available':
      return '販売中'
    case 'unavailable':
      return '販売終了'
    case 'preparing':
      return '準備中'
    case 'unknown':
      return '不明'
    case 'notApplicable':
      return '対象外'
    default:
      return status
  }
}

export const groupItemsByType = (items: Item[]) => {
  const groups: Item[][] = []
  let currentGroup: Item[] = []
  let currentType: 'group' | 'book' | null = null

  items.forEach((item) => {
    const itemType = isGroupItem(item) ? 'group' : 'book'

    if (currentType === null || currentType === itemType) {
      currentGroup.push(item)
      currentType = itemType
    } else {
      groups.push(currentGroup)
      currentGroup = [item]
      currentType = itemType
    }
  })

  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  return groups
}
