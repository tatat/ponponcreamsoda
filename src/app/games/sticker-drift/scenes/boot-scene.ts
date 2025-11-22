import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Load sticker images from shared games directory with @2x resolution for crisp display
    const stickers = ['d1', 'd2', 'r1', 'r2', 't1', 't2']
    const sizes = [64, 96] // Load sizes needed for player (64px) and obstacles (48-96px)

    stickers.forEach((name) => {
      sizes.forEach((size) => {
        this.load.image(`${name}-${size}`, `/games/common/images/stickers/${name}-${size}@2x.png`)
      })
    })
  }

  create() {
    this.scene.start('MainScene')
  }
}
