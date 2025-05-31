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

export type ItemBook = {
  name: string
  imageUrl: string
  links?: {
    website?: string // Link to the book on the website
    onlinePhysical?: string[] // Link to the book on online physical store
    onlineDigital?: string[] // Link to the book on online digital store
  }
  type: BookType // Whether it's an illustration book or manga book
  availability: AvailabilityStatus
  price: string
}

export type ItemSticker = {
  imageUrl: string
  availability: VenueOnlyAvailability
  price: string
}

export type ItemOther = {
  name: string
}

export type Item = ItemBook | ItemSticker | ItemOther

export type ItemListCategory<T extends Item> = {
  title: string
  items: T[]
}

export type ItemList = {
  newReleases: ItemListCategory<ItemBook>[]
  backCatalog: ItemListCategory<ItemBook>[]
  stickers: ItemListCategory<ItemSticker>[]
  others: ItemListCategory<ItemOther>[]
}
