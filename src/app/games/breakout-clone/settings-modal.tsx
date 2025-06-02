import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { GameSettings, saveSettings, resetSettings } from './settings'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    onSettingsChange(localSettings)
    saveSettings(localSettings)
    onClose()
  }

  const handleReset = () => {
    const resetted = resetSettings()
    setLocalSettings(resetted)
    onSettingsChange(resetted)
  }

  const handleCancel = () => {
    setLocalSettings(settings) // Revert to original settings
    onClose()
  }

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (!isOpen) return null

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      `}
    >
      <div
        css={css`
          background: #2d3748;
          border-radius: 2px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `}
      >
        {/* Header */}
        <div
          css={css`
            background: #4a5568;
            padding: 20px;
            border-bottom: 1px solid #718096;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <h2
            css={css`
              color: #e2e8f0;
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            `}
          >
            ゲーム設定
          </h2>
          <button
            onClick={handleCancel}
            css={css`
              background: none;
              border: none;
              color: #a0aec0;
              font-size: 24px;
              cursor: pointer;
              padding: 0;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 2px;
              &:hover {
                background: rgba(160, 174, 192, 0.2);
              }
            `}
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div
          css={css`
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
            color: #e2e8f0;
          `}
        >
          {/* バーチャルパッド設定セクション */}
          <div
            css={css`
              margin-bottom: 32px;
            `}
          >
            <h3
              css={css`
                color: #e2e8f0;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #718096;
              `}
            >
              バーチャルパッド設定
            </h3>
            <label
              css={css`
                display: flex;
                align-items: center;
                cursor: pointer;
                margin-bottom: 20px;
                padding: 16px;
                background: #4a5568;
                border-radius: 2px;
                border: 1px solid #718096;
              `}
            >
              <input
                type="checkbox"
                checked={localSettings.showVirtualPad}
                onChange={(e) => updateSetting('showVirtualPad', e.target.checked)}
                css={css`
                  margin-right: 12px;
                  accent-color: #ffffff;
                  transform: scale(1.2);
                `}
              />
              <div>
                <div
                  css={css`
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 4px;
                  `}
                >
                  バーチャルパッド表示
                </div>
                <div
                  css={css`
                    font-size: 12px;
                    color: #a0aec0;
                  `}
                >
                  タッチデバイスでの操作用ボタンを表示します
                </div>
              </div>
            </label>
          </div>

          {/* 開発用設定セクション */}
          <div>
            <h3
              css={css`
                color: #e2e8f0;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #718096;
              `}
            >
              開発用設定
            </h3>
            <label
              css={css`
                display: flex;
                align-items: center;
                cursor: pointer;
                margin-bottom: 20px;
                padding: 16px;
                background: #4a5568;
                border-radius: 2px;
                border: 1px solid #718096;
              `}
            >
              <input
                type="checkbox"
                checked={localSettings.debugMode}
                onChange={(e) => updateSetting('debugMode', e.target.checked)}
                css={css`
                  margin-right: 12px;
                  accent-color: #ffffff;
                  transform: scale(1.2);
                `}
              />
              <div>
                <div
                  css={css`
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 4px;
                  `}
                >
                  デバッグモード
                </div>
                <div
                  css={css`
                    font-size: 12px;
                    color: #a0aec0;
                  `}
                >
                  物理エンジンの当たり判定を可視化します
                </div>
                <div
                  css={css`
                    font-size: 11px;
                    color: #a0aec0;
                    margin-top: 2px;
                  `}
                >
                  開発者向け機能：スコア900でスタートしてボス戦をすぐに体験できます
                </div>
                <div
                  css={css`
                    font-size: 11px;
                    color: #ff9999;
                    margin-top: 4px;
                    font-weight: bold;
                  `}
                >
                  ⚠️ 注意: 変更するとゲームがリセットされます
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div
          css={css`
            background: #4a5568;
            padding: 20px;
            border-top: 1px solid #718096;
            display: flex;
            justify-content: space-between;
            gap: 12px;
          `}
        >
          <button
            onClick={handleReset}
            css={css`
              background: #fc8181;
              border: none;
              border-radius: 2px;
              color: #ffffff;
              padding: 10px 20px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              transition: background 0.2s ease;
              &:hover {
                background: #f56565;
              }
            `}
          >
            リセット
          </button>

          <div
            css={css`
              display: flex;
              gap: 12px;
            `}
          >
            <button
              onClick={handleCancel}
              css={css`
                background: #718096;
                border: none;
                border-radius: 2px;
                color: #ffffff;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s ease;
                &:hover {
                  background: #a0aec0;
                }
              `}
            >
              キャンセル
            </button>

            <button
              onClick={handleSave}
              css={css`
                background: #ffffff;
                border: none;
                border-radius: 2px;
                color: #000000;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s ease;
                &:hover {
                  background: #f7fafc;
                }
              `}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
