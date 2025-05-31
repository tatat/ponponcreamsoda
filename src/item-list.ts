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
          links: {
            website: '/books/05',
          },
          type: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'preparing',
          },
          price: '500yen',
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
          links: {
            website: '/books/01',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347449'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5893999'],
          },
          type: 'manga',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'unavailable',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          name: 'イラスト本（フルカラー）1',
          imageUrl: '/images/item-list/book-02.jpg',
          links: {
            website: '/books/02',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347486'],
          },
          type: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
        },
        {
          name: '漫画本（モノクロ）2',
          imageUrl: '/images/item-list/book-03.jpg',
          links: {
            website: '/books/03',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347672'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5894079'],
          },
          type: 'manga',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          name: 'イラスト本（フルカラー）2',
          imageUrl: '/images/item-list/book-04.jpg',
          links: {
            website: '/books/04',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5781200'],
          },
          type: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
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
          price: '200yen',
        },
        {
          imageUrl: '/images/item-list/sticker-r2.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          imageUrl: '/images/item-list/sticker-d1.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          imageUrl: '/images/item-list/sticker-d2.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          imageUrl: '/images/item-list/sticker-t1.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          imageUrl: '/images/item-list/sticker-t2.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
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
