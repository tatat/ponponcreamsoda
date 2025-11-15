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
  itemType: 'book'
  name: string
  imageUrl: string
  links?: {
    website?: string // Link to the book on the website
    onlinePhysical?: string[] // Link to the book on online physical store
    onlineDigital?: string[] // Link to the book on online digital store
  }
  bookType: BookType // Whether it's an illustration book or manga book
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

export type ItemGroup = {
  itemType: 'group'
  id: string // Unique identifier for the group
  name: string // Display name of the group/set
  price: string // Set price
  imageUrls: string[] // Thumbnails of items in the set
  itemCount: number // Number of items in the set
  availability: AvailabilityStatus
  links?: {
    website?: string
    onlinePhysical?: string[]
    onlineDigital?: string[]
  }
}

export type Item = ItemBook | ItemSticker | ItemOther

export type ItemOrGroup = Item | ItemGroup

export type ItemListCategory = {
  title: string
  items: ItemOrGroup[]
}

export type ItemList = {
  newReleases: ItemListCategory[]
  backCatalog: ItemListCategory[]
  stickers: ItemListCategory[]
  others: ItemListCategory[]
}
