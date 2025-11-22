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
          name: 'イラスト本 3 - 3冊セット（クリアファイル付き）',
          items: [
            {
              itemType: 'book',
              name: 'Now',
              imageUrl: '/images/item-list/book-06-1.jpg',
              bookType: 'illustration',
              colorType: 'fullColor',
              availability: {
                venue: 'available',
                onlinePhysical: 'preparing',
                onlineDigital: 'notApplicable',
              },
              price: '400yen',
            },
            {
              itemType: 'book',
              name: 'embalm',
              imageUrl: '/images/item-list/book-06-2.jpg',
              bookType: 'illustration',
              colorType: 'fullColor',
              availability: {
                venue: 'available',
                onlinePhysical: 'preparing',
                onlineDigital: 'notApplicable',
              },
              price: '400yen',
            },
            {
              itemType: 'book',
              name: 'A SONG RUNS THROUGH WORLD',
              imageUrl: '/images/item-list/book-06-3.jpg',
              bookType: 'illustration',
              colorType: 'fullColor',
              availability: {
                venue: 'available',
                onlinePhysical: 'preparing',
                onlineDigital: 'notApplicable',
              },
              price: '400yen',
            },
          ],
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
          name: '漫画本 1',
          imageUrl: '/images/item-list/book-01.jpg',
          links: {
            website: '/books/01',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347449'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5893999'],
          },
          bookType: 'manga',
          colorType: 'monochrome',
          availability: {
            venue: 'unavailable',
            onlinePhysical: 'unavailable',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: 'イラスト本 1',
          imageUrl: '/images/item-list/book-02.jpg',
          links: {
            website: '/books/02',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347486'],
          },
          bookType: 'illustration',
          colorType: 'fullColor',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
        },
        {
          itemType: 'book',
          name: '漫画本 2',
          imageUrl: '/images/item-list/book-03.jpg',
          links: {
            website: '/books/03',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5347672'],
            onlineDigital: ['https://ponponcreamsoda.booth.pm/items/5894079'],
          },
          bookType: 'manga',
          colorType: 'monochrome',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'available',
          },
          price: '500yen',
        },
        {
          itemType: 'book',
          name: 'イラスト本 2',
          imageUrl: '/images/item-list/book-04.jpg',
          links: {
            website: '/books/04',
            onlinePhysical: ['https://ponponcreamsoda.booth.pm/items/5781200'],
          },
          bookType: 'illustration',
          colorType: 'fullColor',
          availability: {
            venue: 'available',
            onlinePhysical: 'available',
            onlineDigital: 'notApplicable',
          },
          price: '600yen',
        },
        {
          itemType: 'book',
          name: '漫画本 3',
          imageUrl: '/images/item-list/book-05.jpg',
          links: {
            website: '/books/05',
          },
          bookType: 'manga',
          colorType: 'monochrome',
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
