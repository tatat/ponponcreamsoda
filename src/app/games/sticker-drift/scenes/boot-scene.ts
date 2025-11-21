import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Load sticker images
    const stickers = ['d1', 'd2', 'r1', 'r2', 't1', 't2']
    stickers.forEach((name) => {
      // Assuming images are in public/images/item-list/
      // We use the 2x versions if available or standard ones
      // Based on previous file search, they are in public/images/item-list/sticker-*.png
      this.load.image(`sticker-${name}`, `/images/item-list/sticker-${name}.png`)
    })
  }

  create() {
    this.scene.start('MainScene')
  }
}
