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
  isSet?: boolean // Whether this is a set of multiple items
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

export type ItemOther = {
  itemType: 'other'
  name: string
}

export type Item = ItemBook | ItemSticker | ItemOther

export type ItemListCategory = {
  title: string
  items: Item[]
}

export type ItemList = {
  newReleases: ItemListCategory[]
  backCatalog: ItemListCategory[]
  stickers: ItemListCategory[]
  others: ItemListCategory[]
}
