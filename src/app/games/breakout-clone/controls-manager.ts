import * as Phaser from 'phaser'
import { constants } from './constants'

export interface ControlsState {
  isLeftPressed: boolean
  isRightPressed: boolean
  isFastMovePressed: boolean
  isJumping: boolean
}

export interface ControlsCallbacks {
  onStartGame: () => void
  onJump: () => void
  onPause: () => void
  onRestart: () => void
}

type Controls = Record<'jump' | 'pause' | 'fastMove' | 'left' | 'right', Phaser.GameObjects.Graphics>
type ControlTexts = Record<'fastMove' | 'jump', Phaser.GameObjects.Text>

export class ControlsManager {
  private scene: Phaser.Scene
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private spaceKey!: Phaser.Input.Keyboard.Key
  private shiftKey!: Phaser.Input.Keyboard.Key
  private aKey!: Phaser.Input.Keyboard.Key
  private dKey!: Phaser.Input.Keyboard.Key
  private callbacks: ControlsCallbacks
  private state: ControlsState = {
    isLeftPressed: false,
    isRightPressed: false,
    isFastMovePressed: false,
    isJumping: false,
  }

  // Virtual pad controls
  private controls: Controls | null = null
  private controlTexts: ControlTexts | null = null

  constructor(scene: Phaser.Scene, callbacks: ControlsCallbacks) {
    this.scene = scene
    this.callbacks = callbacks
  }

  public initialize() {
    this.setupKeyboardControls()
    this.setupTouchControls()
  }

  private setupKeyboardControls() {
    if (!this.scene.input.keyboard) {
      throw new Error('Keyboard input is not available')
    }

    // Create cursor keys
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    // Add keyboard event listeners
    this.scene.input.keyboard.on('keydown-R', this.callbacks.onRestart)
    this.scene.input.keyboard.on('keydown-SPACE', this.handleSpaceKeyPress.bind(this))
    this.scene.input.keyboard.on('keydown-P', this.handlePauseKeyPress.bind(this))
  }

  private setupTouchControls() {
    // Enable touch input
    this.scene.input.addPointer(2) // Allow up to 3 touch points

    // Create virtual pad
    this.createVirtualPad()
  }

  private createVirtualPad() {
    const buttonSize = 108 // Base size for interaction area
    const rightButtonSize = Math.round(buttonSize * 1.2) // 20% larger for right side buttons
    const buttonMargin = 15 // Margin for edge placement
    const buttonSpacing = 15 // Spacing between adjacent buttons (same as margin)

    // Pause button (right top) with pause symbol
    const pauseControl = this.scene.add.graphics()
    pauseControl.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    pauseControl.fillRect(
      constants.GAME_WIDTH - buttonMargin - rightButtonSize,
      buttonMargin,
      rightButtonSize,
      rightButtonSize,
    )

    // Draw pause symbol (two vertical lines)
    pauseControl.lineStyle(4, 0xffffff, 0.8)
    const pauseX = constants.GAME_WIDTH - buttonMargin - rightButtonSize / 2
    const pauseY = buttonMargin + rightButtonSize / 2
    pauseControl.lineBetween(pauseX - 8, pauseY - 12, pauseX - 8, pauseY + 12)
    pauseControl.lineBetween(pauseX + 8, pauseY - 12, pauseX + 8, pauseY + 12)
    pauseControl.setDepth(110)
    pauseControl.setInteractive(
      new Phaser.Geom.Rectangle(
        constants.GAME_WIDTH - buttonMargin - rightButtonSize,
        buttonMargin,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Left button - full height rectangle with spacing
    const controlAreaWidth = constants.GAME_WIDTH / 4
    const leftRightSpacing = 2 // Spacing between left and right buttons
    const leftButtonWidth = (controlAreaWidth - leftRightSpacing) / 2
    const leftButtonHeight = constants.GAME_HEIGHT
    const leftButtonX = 0
    const leftButtonY = 0

    const leftControl = this.scene.add.graphics()
    leftControl.fillStyle(0x000000, 0.1) // Very transparent fill
    leftControl.fillRect(leftButtonX, leftButtonY, leftButtonWidth, leftButtonHeight)

    // Draw left triangle 100px from bottom
    const leftCenterX = leftButtonX + leftButtonWidth / 2
    const leftCenterY = leftButtonY + leftButtonHeight - 100
    leftControl.fillStyle(0xffffff, 0.6)
    leftControl.beginPath()
    leftControl.moveTo(leftCenterX - 15, leftCenterY)
    leftControl.lineTo(leftCenterX + 10, leftCenterY - 15)
    leftControl.lineTo(leftCenterX + 10, leftCenterY + 15)
    leftControl.closePath()
    leftControl.fillPath()
    leftControl.setDepth(110)
    leftControl.setInteractive(
      new Phaser.Geom.Rectangle(leftButtonX, leftButtonY, leftButtonWidth, leftButtonHeight),
      Phaser.Geom.Rectangle.Contains,
    )

    // Right button - full height rectangle with spacing
    const rightButtonWidth = (controlAreaWidth - leftRightSpacing) / 2
    const rightButtonHeight = constants.GAME_HEIGHT
    const rightButtonX = leftButtonWidth + leftRightSpacing
    const rightButtonY = 0

    const rightControl = this.scene.add.graphics()
    rightControl.fillStyle(0x000000, 0.1) // Very transparent fill
    rightControl.fillRect(rightButtonX, rightButtonY, rightButtonWidth, rightButtonHeight)

    // Draw right triangle 100px from bottom
    const rightCenterX = rightButtonX + rightButtonWidth / 2
    const rightCenterY = rightButtonY + rightButtonHeight - 100
    rightControl.fillStyle(0xffffff, 0.6)
    rightControl.beginPath()
    rightControl.moveTo(rightCenterX + 15, rightCenterY)
    rightControl.lineTo(rightCenterX - 10, rightCenterY - 15)
    rightControl.lineTo(rightCenterX - 10, rightCenterY + 15)
    rightControl.closePath()
    rightControl.fillPath()
    rightControl.setDepth(110)
    rightControl.setInteractive(
      new Phaser.Geom.Rectangle(rightButtonX, rightButtonY, rightButtonWidth, rightButtonHeight),
      Phaser.Geom.Rectangle.Contains,
    )

    // Fast move button (right side, bottom)
    const fastMoveControl = this.scene.add.graphics()
    fastMoveControl.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    fastMoveControl.fillRect(
      constants.GAME_WIDTH - buttonMargin - rightButtonSize,
      constants.GAME_HEIGHT - buttonMargin - rightButtonSize,
      rightButtonSize,
      rightButtonSize,
    )

    fastMoveControl.setDepth(110)
    fastMoveControl.setInteractive(
      new Phaser.Geom.Rectangle(
        constants.GAME_WIDTH - buttonMargin - rightButtonSize,
        constants.GAME_HEIGHT - buttonMargin - rightButtonSize,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Fast move button text
    const fastMoveText = this.scene.add.text(
      constants.GAME_WIDTH - buttonMargin - rightButtonSize / 2,
      constants.GAME_HEIGHT - buttonMargin - rightButtonSize / 2,
      'FAST',
      {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
      },
    )
    fastMoveText.setOrigin(0.5)
    fastMoveText.setDepth(111)

    // Jump button (right side, above fast button with increased spacing)
    const jumpControl = this.scene.add.graphics()
    jumpControl.fillStyle(0x000000, 0.3) // Semi-transparent black fill
    jumpControl.fillRect(
      constants.GAME_WIDTH - buttonMargin - rightButtonSize,
      constants.GAME_HEIGHT - buttonMargin - rightButtonSize * 2 - buttonSpacing,
      rightButtonSize,
      rightButtonSize,
    )

    jumpControl.setDepth(110)
    jumpControl.setInteractive(
      new Phaser.Geom.Rectangle(
        constants.GAME_WIDTH - buttonMargin - rightButtonSize,
        constants.GAME_HEIGHT - buttonMargin - rightButtonSize * 2 - buttonSpacing,
        rightButtonSize,
        rightButtonSize,
      ),
      Phaser.Geom.Rectangle.Contains,
    )

    // Jump button text
    const jumpText = this.scene.add.text(
      constants.GAME_WIDTH - buttonMargin - rightButtonSize / 2,
      constants.GAME_HEIGHT - buttonMargin - rightButtonSize * 1.5 - buttonSpacing,
      'JUMP',
      {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
      },
    )
    jumpText.setOrigin(0.5)
    jumpText.setDepth(111)

    // Assign to instance variables before other operations
    this.controls = {
      pause: pauseControl,
      jump: jumpControl,
      fastMove: fastMoveControl,
      left: leftControl,
      right: rightControl,
    }
    this.controlTexts = {
      fastMove: fastMoveText,
      jump: jumpText,
    }

    // Setup virtual pad event handlers
    this.setupVirtualPadEventHandlers()

    // Setup tap-to-start functionality
    this.setupTapToStart()
  }

  private setupVirtualPadEventHandlers() {
    const { controls } = this

    if (!controls) {
      throw new Error('Controls not initialized')
    }

    // Jump button event handlers
    controls.jump.on('pointerdown', () => {
      this.callbacks.onJump()
    })

    // Pause button event handlers
    controls.pause.on('pointerdown', () => {
      this.callbacks.onPause()
    })

    // Fast move button event handlers
    controls.fastMove.on('pointerdown', () => {
      this.state.isFastMovePressed = true
    })

    controls.fastMove.on('pointerup', () => {
      this.state.isFastMovePressed = false
    })

    controls.fastMove.on('pointerout', () => {
      this.state.isFastMovePressed = false
    })

    // Left and Right button event handlers
    controls.left.on('pointerdown', () => {
      this.state.isLeftPressed = true
    })

    controls.left.on('pointerup', () => {
      this.state.isLeftPressed = false
    })

    controls.left.on('pointerout', () => {
      this.state.isLeftPressed = false
    })

    controls.right.on('pointerdown', () => {
      this.state.isRightPressed = true
    })

    controls.right.on('pointerup', () => {
      this.state.isRightPressed = false
    })

    controls.right.on('pointerout', () => {
      this.state.isRightPressed = false
    })
  }

  private setupTapToStart() {
    // Tap anywhere to start (when game not started)
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Check if not clicking on buttons before starting game
      const buttonSize = 108
      const buttonMargin = 15
      const interactionSize = buttonSize

      const jumpButtonBounds = new Phaser.Geom.Circle(
        constants.GAME_WIDTH - buttonMargin - buttonSize / 2,
        constants.GAME_HEIGHT - buttonMargin - buttonSize / 2,
        interactionSize / 2,
      )
      const pauseButtonBounds = new Phaser.Geom.Circle(
        buttonMargin + buttonSize / 2,
        buttonMargin + buttonSize / 2,
        interactionSize / 2,
      )

      if (
        !Phaser.Geom.Circle.Contains(jumpButtonBounds, pointer.x, pointer.y) &&
        !Phaser.Geom.Circle.Contains(pauseButtonBounds, pointer.x, pointer.y)
      ) {
        this.callbacks.onStartGame()
      }
    })
  }

  private handleSpaceKeyPress() {
    this.callbacks.onJump()
  }

  private handlePauseKeyPress() {
    this.callbacks.onPause()
  }

  public getMovementInput() {
    return {
      isLeftPressed: this.cursors.left.isDown || this.aKey.isDown || this.state.isLeftPressed,
      isRightPressed: this.cursors.right.isDown || this.dKey.isDown || this.state.isRightPressed,
      isFastMovePressed: this.shiftKey.isDown || this.state.isFastMovePressed,
    }
  }

  public setupGameOverTouchRestart(onRestart: () => void) {
    // Add touch restart for game over (without removing existing listeners)
    const gameOverTouchHandler = () => {
      onRestart()
    }

    // Add the game over specific handler
    this.scene.input.on('pointerdown', gameOverTouchHandler)
  }

  private forEachControl(callback: (control: Phaser.GameObjects.Graphics | Phaser.GameObjects.Text) => void) {
    Object.values(this.controls ?? {}).forEach(callback)
    Object.values(this.controlTexts ?? {}).forEach(callback)
  }

  public setVirtualPadVisibility(visible: boolean) {
    this.forEachControl((control) => {
      control.setVisible(visible)
    })
  }

  public resetState() {
    this.state = {
      isLeftPressed: false,
      isRightPressed: false,
      isFastMovePressed: false,
      isJumping: false,
    }
  }

  public destroy() {
    this.forEachControl((control) => {
      control.destroy()
    })

    this.controls = null
    this.controlTexts = null
  }
}
