import type { ItemList } from './item-list-type'

/**
 * Categories for the item list.
 * - New releases
 * - Back catalog
 * - Stickers
 * - Others
 */
export const itemList = {
  newReleases: [
    {
      title: 'New Releases',
      items: [
        {
          name: '漫画本（モノクロ）5',
          imageUrl: '/images/item-list/book-05.jpg',
          link: '/books/05',
          type: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'preparing',
          },
        },
      ],
    },
  ],
  backCatalog: [
    {
      title: 'Back Catalog',
      items: [
        {
          name: '漫画本（モノクロ）1',
          imageUrl: '/images/item-list/book-01.jpg',
          link: '/books/01',
          type: 'manga',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
        },
        {
          name: 'イラスト本（フルカラー）1',
          imageUrl: '/images/item-list/book-02.jpg',
          link: '/books/02',
          type: 'illustration',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'unavailable',
            onlineDigital: 'available',
          },
        },
        {
          name: '漫画本（モノクロ）2',
          imageUrl: '/images/item-list/book-03.jpg',
          link: '/books/03',
          type: 'manga',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
        },
        {
          name: 'イラスト本（フルカラー）2',
          imageUrl: '/images/item-list/book-04.jpg',
          link: '/books/04',
          type: 'illustration',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
        },
      ],
    },
  ],
  stickers: [
    {
      title: 'Stickers',
      items: [
        {
          imageUrl: '/images/item-list/sticker-r1.png',
          availability: {
            venue: 'available',
          },
        },
        {
          imageUrl: '/images/item-list/sticker-r2.png',
          availability: {
            venue: 'available',
          },
        },
        {
          imageUrl: '/images/item-list/sticker-d1.png',
          availability: {
            venue: 'available',
          },
        },
        {
          imageUrl: '/images/item-list/sticker-d2.png',
          availability: {
            venue: 'available',
          },
        },
        {
          imageUrl: '/images/item-list/sticker-t1.png',
          availability: {
            venue: 'available',
          },
        },
        {
          imageUrl: '/images/item-list/sticker-t2.png',
          availability: {
            venue: 'available',
          },
        },
      ],
    },
  ],
  others: [
    {
      title: 'Others',
      items: [
        {
          name: '缶バッヂ',
        },
        {
          name: 'シール',
        },
      ],
    },
  ],
} as const satisfies ItemList
