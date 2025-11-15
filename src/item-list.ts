import type { ItemList } from './item-list-type'

/**
 * Categories for the item list.
 * - New releases
 * - Back catalog
 * - Stickers
 * - Others
 */
export const itemList: ItemList = {
  newReleases: [
    {
      title: 'New Releases',
      items: [
        {
          itemType: 'group',
          id: 'spring-series-set',
          name: '春シリーズ 3冊セット',
          price: '1,200yen',
          imageUrls: [
            '/images/item-list/spring-01.jpg',
            '/images/item-list/spring-02.jpg',
            '/images/item-list/spring-03.jpg',
          ],
          itemCount: 3,
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'notApplicable',
          },
        },
        {
          itemType: 'book',
          name: '春の本 1',
          imageUrl: '/images/item-list/spring-01.jpg',
          bookType: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'notApplicable',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: '春の本 2',
          imageUrl: '/images/item-list/spring-02.jpg',
          bookType: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'notApplicable',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: '春の本 3',
          imageUrl: '/images/item-list/spring-03.jpg',
          bookType: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'preparing',
            onlineDigital: 'notApplicable',
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
          itemType: 'book',
          name: '漫画本（モノクロ）1',
          imageUrl: '/images/item-list/book-01.jpg',
          links: {
            website: '/books/01',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347449'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5893999'],
          },
          bookType: 'manga',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'unavailable',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: 'イラスト本（フルカラー）1',
          imageUrl: '/images/item-list/book-02.jpg',
          links: {
            website: '/books/02',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347486'],
          },
          bookType: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
        },
        {
          itemType: 'book',
          name: '漫画本（モノクロ）2',
          imageUrl: '/images/item-list/book-03.jpg',
          links: {
            website: '/books/03',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347672'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5894079'],
          },
          bookType: 'manga',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: 'イラスト本（フルカラー）2',
          imageUrl: '/images/item-list/book-04.jpg',
          links: {
            website: '/books/04',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5781200'],
          },
          bookType: 'illustration',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
        },
        {
          itemType: 'book',
          name: '漫画本（モノクロ）3',
          imageUrl: '/images/item-list/book-05.jpg',
          links: {
            website: '/books/05',
          },
          bookType: 'illustration',
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
  stickers: [
    {
      title: 'Stickers',
      items: [
        {
          itemType: 'sticker',
          imageUrl: '/images/item-list/sticker-r1.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          itemType: 'sticker',
          imageUrl: '/images/item-list/sticker-r2.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          itemType: 'sticker',
          imageUrl: '/images/item-list/sticker-d1.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          itemType: 'sticker',
          imageUrl: '/images/item-list/sticker-d2.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          itemType: 'sticker',
          imageUrl: '/images/item-list/sticker-t1.png',
          availability: {
            venue: 'available',
          },
          price: '200yen',
        },
        {
          itemType: 'sticker',
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
          itemType: 'other',
          name: '缶バッヂ',
        },
        {
          itemType: 'other',
          name: 'シール',
        },
      ],
    },
  ],
}
