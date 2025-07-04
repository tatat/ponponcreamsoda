import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import Link from 'next/link'
import { GameSettings, saveSettings, resetSettings, MusicalScale, BaseKey } from './settings'

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
          background: #fefcf9;
          border-radius: 3px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        `}
      >
        {/* Header */}
        <div
          css={css`
            background: #f5f1eb;
            padding: 12px 20px;
            border-bottom: 1px solid #e8dcc6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 3px 3px 0 0;
          `}
        >
          <h2
            css={css`
              color: #5d4e37;
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
              color: #8b7355;
              font-size: 24px;
              cursor: pointer;
              padding: 0;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              &:hover {
                background: rgba(113, 128, 150, 0.15);
              }
            `}
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div
          css={css`
            padding: 20px 32px;
            max-height: 400px;
            overflow-y: auto;
            color: #5d4e37;
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
                color: #5d4e37;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #e8dcc6;
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
                  border: 1px solid #e8dcc6;
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
                    color: #8b7355;
                  `}
                >
                  タッチデバイスでの操作用ボタンを表示します
                </div>
              </div>
            </label>
          </div>

          {/* 音楽設定セクション */}
          <div
            css={css`
              margin-bottom: 32px;
            `}
          >
            <h3
              css={css`
                color: #5d4e37;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #e8dcc6;
              `}
            >
              音楽設定
            </h3>
            <div
              css={css`
                margin-bottom: 16px;
              `}
            >
              <div
                css={css`
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 8px;
                `}
              >
                サウンド設定
              </div>
              <div
                css={css`
                  font-size: 12px;
                  color: #8b7355;
                  margin-bottom: 12px;
                `}
              >
                ゲーム内のサウンド効果を有効/無効にします
              </div>
              <label
                css={css`
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                `}
              >
                <input
                  type="checkbox"
                  checked={localSettings.sound.soundEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, sound: { ...prev.sound, soundEnabled: e.target.checked } }))
                  }
                  css={css`
                    margin-right: 12px;
                    accent-color: #ffffff;
                    transform: scale(1.2);
                    border: 1px solid #e8dcc6;
                    &:checked {
                      border: 1px solid #d4a574;
                    }
                  `}
                />
                <span>サウンドを有効にする</span>
              </label>
            </div>

            <div css={css``}>
              <div
                css={css`
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 8px;
                `}
              >
                音楽スケール
              </div>
              <div
                css={css`
                  font-size: 12px;
                  color: #8b7355;
                  margin-bottom: 12px;
                `}
              >
                ヒット音で使用する音楽スケールを選択します
              </div>
              <select
                value={localSettings.sound.musicalScale}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    sound: { ...prev.sound, musicalScale: e.target.value as MusicalScale },
                  }))
                }
                css={css`
                  width: 100%;
                  padding: 8px 12px;
                  background: #ffffff;
                  border: 1px solid #e8dcc6;
                  border-radius: 3px;
                  color: #5d4e37;
                  font-size: 14px;
                  margin-bottom: 16px;
                  &:focus {
                    outline: none;
                    border-color: #d4a574;
                  }
                `}
              >
                <option value="chromatic">クロマティック（全12音）</option>
                <option value="major">メジャースケール（長調）</option>
                <option value="minor">マイナースケール（短調）</option>
                <option value="pentatonic">ペンタトニック（5音階）</option>
                <option value="blues">ブルーススケール</option>
                <option value="dorian">ドリアンスケール</option>
                <option value="mixolydian">ミクソリディアンスケール</option>
                <option value="wholeTone">全音階</option>
                <option value="diminished">ディミニッシュスケール</option>
              </select>

              <div
                css={css`
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 8px;
                `}
              >
                ベースキー（根音）
              </div>
              <div
                css={css`
                  font-size: 12px;
                  color: #8b7355;
                  margin-bottom: 12px;
                `}
              >
                スケールの基準となる音程を選択します
              </div>
              <select
                value={localSettings.sound.baseKey}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    sound: { ...prev.sound, baseKey: e.target.value as BaseKey },
                  }))
                }
                css={css`
                  width: 100%;
                  padding: 8px 12px;
                  background: #ffffff;
                  border: 1px solid #e8dcc6;
                  border-radius: 3px;
                  color: #5d4e37;
                  font-size: 14px;
                  &:focus {
                    outline: none;
                    border-color: #d4a574;
                  }
                `}
              >
                <option value="C">C（ド）</option>
                <option value="C#">C#（ド#）</option>
                <option value="D">D（レ）</option>
                <option value="D#">D#（レ#）</option>
                <option value="E">E（ミ）</option>
                <option value="F">F（ファ）</option>
                <option value="F#">F#（ファ#）</option>
                <option value="G">G（ソ）</option>
                <option value="G#">G#（ソ#）</option>
                <option value="A">A（ラ）</option>
                <option value="A#">A#（ラ#）</option>
                <option value="B">B（シ）</option>
              </select>
            </div>
          </div>

          {/* ナビゲーションセクション */}
          <div
            css={css`
              margin-bottom: 32px;
            `}
          >
            <h3
              css={css`
                color: #5d4e37;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #e8dcc6;
              `}
            >
              ナビゲーション
            </h3>
            <div css={css``}>
              <div
                css={css`
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 8px;
                `}
              >
                ページ移動
              </div>
              <div
                css={css`
                  font-size: 12px;
                  color: #8b7355;
                  margin-bottom: 12px;
                `}
              >
                他のページに移動できます
              </div>
              <Link
                href="/"
                css={css`
                  color: #4299e1;
                  font-size: 14px;
                  font-weight: bold;
                  text-decoration: underline;
                  text-underline-offset: 2px;
                  transition: color 0.2s ease;
                  &:hover {
                    color: #3182ce;
                    text-decoration: underline;
                  }
                `}
              >
                ホームに戻る
              </Link>
            </div>
          </div>

          {/* 開発用設定セクション */}
          <div>
            <h3
              css={css`
                color: #5d4e37;
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: bold;
                padding-bottom: 8px;
                border-bottom: 1px solid #e8dcc6;
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
                  border: 1px solid #e8dcc6;
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
                    color: #8b7355;
                  `}
                >
                  物理エンジンの当たり判定を可視化します
                </div>
                <div
                  css={css`
                    font-size: 11px;
                    color: #8b7355;
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
            background: #f5f1eb;
            padding: 12px 20px;
            border-top: 1px solid #e8dcc6;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            border-radius: 0 0 3px 3px;
          `}
        >
          <button
            onClick={handleReset}
            css={css`
              background: #fc8181;
              border: none;
              border-radius: 3px;
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
                background: #8b7355;
                border: none;
                border-radius: 3px;
                color: #ffffff;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s ease;
                &:hover {
                  background: #a08970;
                }
              `}
            >
              キャンセル
            </button>

            <button
              onClick={handleSave}
              css={css`
                background: #4299e1;
                border: none;
                border-radius: 3px;
                color: #ffffff;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s ease;
                &:hover {
                  background: #3182ce;
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
