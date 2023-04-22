/** @jsxImportSource @emotion/react */
'use client'

import Phaser from 'phaser'
import React, { useEffect, useRef } from 'react'
import { siteOrigin } from '@/config'
import { css } from '@emotion/react'

const objectNames = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
]

class Scene extends Phaser.Scene {
  preload () {
    this.load.setBaseURL(siteOrigin)

    objectNames.forEach(n => {
      this.load.image(n, `images/book01/${n}.png`)
    })
  }

  create () {
    const blocks: Phaser.GameObjects.GameObject[] = []

    objectNames.forEach(n => {
      const pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds, new Phaser.Geom.Point(0, 0))
      const block = this.physics.add.image(pos.x, pos.y, n).setScale(0.2)

      block.setSize(block.width * 0.7, block.height * 0.7)

      block.setVelocity(Phaser.Math.Between(200, 400), Phaser.Math.Between(200, 400))
      block.setBounce(0.95).setCollideWorldBounds(true)
      block.setDepth(Math.floor(Math.random() * 100))
      block.setInteractive()

      this.input.setDraggable(block)

      if (Math.random() > 0.5) {
        block.body.velocity.x *= -1
      } else {
        block.body.velocity.y *= -1
      }

      blocks.push(block)
    })

    this.physics.add.collider(blocks, blocks)

    this.input.on('drag', (
      _pointer: Phaser.Input.Pointer,
      gameObject: Phaser.GameObjects.GameObject,
      dragX: number,
      dragY: number,
    ) => {
      if (gameObject instanceof Phaser.Physics.Arcade.Image) {
        gameObject.setPosition(dragX, dragY)
      }
    })

    this.input.on('pointerdown', (
      _pointer: Phaser.Input.Pointer,
      gameObjects: Phaser.GameObjects.GameObject[]
    ) => {
      gameObjects.forEach((gameObject) => {
        if (gameObject instanceof Phaser.Physics.Arcade.Image) {
          gameObject.setVelocity(0)
          ;(gameObject.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        }
      })
    })

    this.input.on('pointerup', (
      _pointer: Phaser.Input.Pointer,
      gameObjects: Phaser.GameObjects.GameObject[]
    ) => {
      gameObjects.forEach((gameObject) => {
        if (gameObject instanceof Phaser.Physics.Arcade.Image) {
          (gameObject.body as Phaser.Physics.Arcade.Body).setAllowGravity(true)
        }
      })
    })
  }
}

export const Game: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!gameContainerRef.current) {
      return
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: gameContainerRef.current,
        width: 1280,
        height: 720,
      },
      scene: Scene,
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 100,
          },
          // debug: true,
        },
      },
    })

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        canvas {
          /* width: 100% !important;
          height: 100% !important; */
          object-fit: cover;
        }
      `}
      ref={gameContainerRef}
    />
  )
}
