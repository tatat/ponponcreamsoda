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
    this.matter.world.setBounds()

    const { top, left } = this.matter.world.walls
    const x = {
      min: 0,
      max: top?.bounds.max.x ?? 0,
    }
    const y = {
      min: 0,
      max: left?.bounds.max.y ?? 0,
    }

    Array.from({ length: 3 }).forEach(() => {
      objectNames.forEach(n => {
        const block = this.matter.add.image(
          Phaser.Math.Between(x.min + 100, x.max - 100),
          Phaser.Math.Between(y.min, y.max / 2),
          n,
          undefined,
          {
            restitution: 1,
          }
        )
        const width = block.width / 2 * 0.2

        block.setScale(0.2)
        block.setCircle(width * 0.7)
        block.setDepth(Math.floor(Math.random() * 100))
        block.setBounce(0.95)
        block.setMass(Math.pow(width / 50, 2))
        block.setVelocity(Phaser.Math.Between(0, 10), Phaser.Math.Between(0, 10))
        block.setFriction(0)

        this.matter.add.mouseSpring()
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
        default: 'matter',
        matter: {
          gravity: {
            y: 0.1,
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
          object-fit: cover;
        }
      `}
      ref={gameContainerRef}
    />
  )
}
