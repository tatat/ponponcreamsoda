import type { ReactNode } from 'react'

export type AvailabilityState = 'available' | 'unavailable' | 'unknown' | 'preparing' | 'notApplicable'

export type AvailabilityStatus = {
  venue: AvailabilityState // Sales at venue
  onlinePhysical: AvailabilityState // Online sales (physical)
  onlineDigital: AvailabilityState // Online sales (digital)
}

// Type for venue-only availability
export type VenueOnlyAvailability = {
  venue: AvailabilityState
}

export type BookType = 'illustration' | 'manga'
export type ColorType = 'fullColor' | 'monochrome'

export type ItemBook = {
  itemType: 'book'
  name: string
  imageUrl: string
  links?: {
    website?: string // Link to the book on the website
    onlinePhysical?: string[] // Link to the book on online physical store
    onlineDigital?: string[] // Link to the book on online digital store
  }
  bookType: BookType // Whether it's an illustration book or manga book
  colorType?: ColorType // Whether it's full color or monochrome
  availability: AvailabilityStatus
  price: string
}

export type ItemSticker = {
  itemType: 'sticker'
  imageUrl: string
  availability: VenueOnlyAvailability
  price: string
}

export type GroupItem = {
  itemType: 'group'
  name: string
  description?: ReactNode
  imageUrls?: string[]
  items: (ItemBook | ItemSticker | ItemOther)[]
}

export type ItemOther = {
  itemType: 'other'
  name: string
}

export type Item = ItemBook | ItemSticker | ItemOther | GroupItem

export type ItemList = {
  newReleases: Item[]
  backCatalog: Item[]
  stickers: Item[]
  others: Item[]
}

// Type guard for GroupItem
export function isGroupItem(item: Item): item is GroupItem {
  return item.itemType === 'group'
}
