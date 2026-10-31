'use client'

import { css, useTheme } from '@emotion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import qrcode from 'qrcode-generator'
import Menu from '@/components/Menu'
import { LoopEngine, TRACKS, type Pattern } from './audio'
import { QrDecoder, loadImage, parseLoopCode } from './qr'

const PRESETS = ['1000', '1100', '1110', '1111', '0111', '0011', '1010', '0101']
const INITIAL_PATTERN: Pattern = [1, 0, 0, 0]
const INITIAL_MASTER = 0.8

const colors = {
  background: '#efe7e1',
  panel: '#ffffff',
  text: '#5c4a3a',
  heading: '#8b7355',
  muted: '#a8977f',
  line: '#e3d8ce',
  accent: '#e67e22',
  button: '#d4a574',
  off: '#e3d8ce',
}

const useStyles = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
      container: css`
        ${theme.styles.text};
        min-height: 100vh;
        min-height: 100lvh;
        background: ${colors.background};
        color: ${colors.text};
        padding: 80px 2rem 4rem;
        box-sizing: border-box;

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        [hidden] {
          display: none !important;
        }

        @media ${theme.breakpoints.compact} {
          padding: 64px 1rem 3rem;
        }
      `,
      wrap: css`
        max-width: 980px;
        margin: 0 auto;
        display: grid;
        gap: 24px;
      `,
      header: css`
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        justify-content: space-between;
        gap: 16px;
      `,
      title: css`
        ${theme.styles.textMenu};
        font-weight: 500;
        font-style: italic;
        font-size: clamp(2.2rem, 6vw, 3.4rem);
        line-height: 1;
        margin: 0;
        color: ${colors.heading};

        span {
          color: ${colors.accent};
        }
      `,
      subtitle: css`
        color: ${colors.muted};
        margin: 12px 0 0;
        max-width: 60ch;
        font-size: 0.9rem;
        line-height: 1.7;
      `,
      sectionTitle: css`
        ${theme.styles.textMenu};
        font-weight: 500;
        font-style: italic;
        font-size: 1.3rem;
        color: ${colors.heading};
        margin: 0;
      `,
      label: css`
        ${theme.styles.textMenu};
        font-style: italic;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        color: ${colors.muted};
      `,
      panel: css`
        position: relative;
        background: ${colors.panel};
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        padding: 22px 18px 18px;
        display: grid;
        gap: 14px;
        align-content: start;

        &::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 18px;
          right: 18px;
          border-top: 2px dashed ${colors.line};
        }
      `,
      top: css`
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
        gap: 24px;

        @media (max-width: 720px) {
          grid-template-columns: 1fr;
        }
      `,
      viewer: css`
        position: relative;
        aspect-ratio: 4 / 3;
        background: #333;
        overflow: hidden;
        display: grid;
        place-items: center;

        video,
        canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        canvas {
          object-fit: contain;
        }
      `,
      reticle: css`
        position: absolute;
        top: 12%;
        bottom: 12%;
        left: 50%;
        aspect-ratio: 1;
        transform: translateX(-50%);
        border: 2px dashed rgba(255, 255, 255, 0.6);
        pointer-events: none;
      `,
      viewerMessage: css`
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 20px;
        color: #bbbbbb;
        font-size: 0.9rem;
      `,
      row: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      `,
      button: css`
        ${theme.styles.text};
        position: relative;
        font-size: 0.9rem;
        font-weight: 600;
        border: none;
        background: ${colors.panel};
        color: ${colors.heading};
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
        padding: 9px 16px;
        cursor: pointer;
        transition:
          color 0.1s linear,
          box-shadow 0.1s linear;

        &:hover {
          color: ${colors.accent};
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }

        &:focus-visible,
        &:focus-within {
          outline: 2px solid ${colors.accent};
          outline-offset: 2px;
        }

        input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
        }
      `,
      primaryButton: css`
        background: ${colors.button};
        color: #ffffff;

        &:hover {
          background: ${colors.accent};
          color: #ffffff;
        }
      `,
      status: css`
        font-size: 0.82rem;
        color: ${colors.muted};
        min-height: 1.4em;

        b {
          color: ${colors.text};
        }
      `,
      code: css`
        ${theme.styles.textMenu};
        font-size: 2.8rem;
        font-weight: 500;
        font-style: italic;
        letter-spacing: 0.2em;
        color: ${colors.accent};
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      `,
      field: css`
        display: grid;
        gap: 4px;

        input[type='range'] {
          width: 100%;
          accent-color: ${colors.accent};
        }
      `,
      help: css`
        font-size: 0.85rem;
        color: ${colors.muted};
        line-height: 1.7;
        margin: 0;

        code {
          font-family: futura-pt, monospace;
          color: ${colors.text};
          background: ${colors.background};
          padding: 1px 6px;
        }
      `,
      strips: css`
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;

        @media (max-width: 620px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      `,
      strip: css`
        display: grid;
        gap: 10px;
        align-content: start;
      `,
      stripHead: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
      `,
      lamp: css`
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${colors.off};
        transition:
          background 0.3s,
          box-shadow 0.3s;
      `,
      lampOn: css`
        background: ${colors.accent};
        box-shadow: 0 0 10px ${colors.accent};
      `,
      meter: css`
        height: 120px;
        background: ${colors.background};
        position: relative;
        overflow: hidden;
      `,
      meterLevel: css`
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 0;
        background: linear-gradient(to top, ${colors.button}, ${colors.accent});
        transition: height 0.08s linear;
      `,
      meterGain: css`
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: ${colors.heading};
      `,
      stripPercent: css`
        ${theme.styles.textMenu};
        font-size: 0.85rem;
        font-variant-numeric: tabular-nums;
        color: ${colors.muted};
      `,
      stripSource: css`
        font-size: 0.75rem;
        color: ${colors.muted};
        overflow-wrap: anywhere;
      `,
      stripFileButton: css`
        font-size: 0.78rem;
        padding: 6px 10px;
        text-align: center;
      `,
      cards: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      `,
      card: css`
        ${theme.styles.text};
        background: #ffffff;
        color: #333333;
        border: none;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
        padding: 12px 10px 10px;
        display: grid;
        gap: 6px;
        justify-items: center;
        cursor: pointer;
        transition: box-shadow 0.1s linear;

        &:hover {
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        }

        svg {
          width: 100%;
          height: auto;
          max-width: 170px;
          shape-rendering: crispEdges;
        }
      `,
      cardActive: css`
        outline: 3px solid ${colors.accent};
        outline-offset: 2px;
      `,
      cardQr: css`
        display: flex;
        justify-content: center;
        width: 100%;
      `,
      cardPattern: css`
        display: flex;
        gap: 4px;

        i {
          width: 14px;
          height: 14px;
          border: 1.5px solid ${colors.heading};
        }

        i.f {
          background: ${colors.accent};
          border-color: ${colors.accent};
        }
      `,
      cardText: css`
        ${theme.styles.textMenu};
        font-style: italic;
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        color: ${colors.heading};
      `,
      motion: css`
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `,
    }),
    [theme],
  )
}

const presetSvgs = PRESETS.map((p) => {
  const q = qrcode(1, 'L')
  q.addData(`LOOP:${p}`)
  q.make()
  return q.createSvgTag({ cellSize: 6, margin: 4 })
})

export default function QrLoopMixer() {
  const styles = useStyles()

  const [pattern, setPattern] = useState<Pattern>(INITIAL_PATTERN)
  const [fadeSeconds, setFadeSeconds] = useState(2)
  const [scanStatus, setScanStatus] = useState<React.ReactNode>('待機中')
  const [lastRead, setLastRead] = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraMessage, setCameraMessage] = useState('「カメラ起動」を押すとQRを連続で読み取ります')
  const [photoShown, setPhotoShown] = useState(false)
  const [trackSources, setTrackSources] = useState<string[]>(() => TRACKS.map(() => '内蔵ループ'))

  const engineRef = useRef<LoopEngine | null>(null)
  const decoderRef = useRef<QrDecoder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanTimerRef = useRef<number | null>(null)
  const lastCodeRef = useRef({ text: '', time: 0 })
  const patternRef = useRef(pattern)
  const fadeRef = useRef(fadeSeconds)

  const viewerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const thumbRef = useRef<HTMLCanvasElement>(null)
  const reticleRef = useRef<HTMLDivElement>(null)
  const meterRefs = useRef<{ level: HTMLDivElement | null; gain: HTMLDivElement | null; pct: HTMLDivElement | null }[]>(
    TRACKS.map(() => ({ level: null, gain: null, pct: null })),
  )

  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new LoopEngine(patternRef.current, INITIAL_MASTER)
    return engineRef.current
  }, [])

  const getDecoder = useCallback(() => {
    if (!decoderRef.current) decoderRef.current = new QrDecoder()
    return decoderRef.current
  }, [])

  const play = useCallback(() => getEngine().play(), [getEngine])
  const stop = useCallback(() => engineRef.current?.stop(), [])

  const applyPattern = useCallback((p: Pattern, fade?: number) => {
    patternRef.current = p
    setPattern(p)
    engineRef.current?.applyPattern(p, fade ?? fadeRef.current)
  }, [])

  const handleCode = useCallback(
    (text: string) => {
      const now = performance.now()
      const last = lastCodeRef.current
      if (text === last.text && now - last.time < 2500) return
      lastCodeRef.current = { text, time: now }
      setLastRead(text)

      const parsed = parseLoopCode(text)
      if (!parsed) {
        setScanStatus('この形式のQRは使えません（LOOP:1011 の形式にしてください）')
        return
      }
      applyPattern(parsed.pattern, parsed.fade)
      setScanStatus(
        <>
          読み取り成功 → <b>{parsed.pattern.join('')}</b>
        </>,
      )
      try {
        navigator.vibrate?.(40)
      } catch {
        // 非対応端末
      }
    },
    [applyPattern],
  )

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (scanTimerRef.current !== null) window.clearInterval(scanTimerRef.current)
    scanTimerRef.current = null
    setCameraOn(false)
  }, [])

  const toggleCamera = useCallback(async () => {
    if (streamRef.current) {
      stopCamera()
      return
    }
    play()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()
      setCameraOn(true)
      setPhotoShown(false)
      setScanStatus('スキャン中…QRを枠に合わせてください')

      const decoder = getDecoder()
      scanTimerRef.current = window.setInterval(() => {
        if (!video.videoWidth || !viewerRef.current || !reticleRef.current) return
        let text: string | null = null
        try {
          text = decoder.decodeLive(video, viewerRef.current, reticleRef.current)
        } catch {
          // 次のフレームで再試行
        }
        if (text) handleCode(text)
      }, 200)
    } catch (e) {
      streamRef.current = null
      setCameraMessage('このブラウザではカメラを起動できませんでした。「写真で読み取る」でQRを撮影してください。')
      setScanStatus(`カメラ利用不可（${(e as Error).name || 'error'}）`)
    }
  }, [getDecoder, handleCode, play, stopCamera])

  const handlePhoto = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return
      setScanStatus('解析中…')
      try {
        const image = await loadImage(file)
        const thumb = thumbRef.current!
        thumb.width = 320
        thumb.height = Math.round((320 * image.h) / image.w)
        thumb.getContext('2d')?.drawImage(image.src, 0, 0, thumb.width, thumb.height)
        setPhotoShown(true)

        const decoder = getDecoder()
        const text = await decoder.decodeImage(image.src, image.w, image.h)
        image.release()
        const { engines, tries } = decoder.diagnostics
        setDiagnostics(`（${image.w}×${image.h} / ${engines.join('+')} / ${tries}回試行）`)
        if (text) {
          play()
          lastCodeRef.current = { text: '', time: 0 }
          handleCode(text)
        } else {
          setScanStatus('写真からQRが見つかりませんでした')
        }
      } catch (err) {
        setScanStatus(`エラー: ${(err as Error).message || err}`)
      }
    },
    [getDecoder, handleCode, play],
  )

  const handleTrackFile = useCallback(
    async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      try {
        await getEngine().replaceTrack(index, file)
        setTrackSources((prev) => prev.map((s, i) => (i === index ? file.name : s)))
      } catch {
        setTrackSources((prev) =>
          prev.map((s, i) => (i === index ? '読み込めない形式です（mp3 / wav / m4a を使ってください）' : s)),
        )
      }
    },
    [getEngine],
  )

  const toggleTrack = useCallback(
    (index: number) => applyPattern(patternRef.current.map((v, i) => (i === index ? (v ? 0 : 1) : v))),
    [applyPattern],
  )

  // メーター: React の再レンダリングを経由せず rAF で DOM を直接更新する
  useEffect(() => {
    let frame = 0
    const loop = () => {
      meterRefs.current.forEach((m, i) => {
        const { gain, rms } = engineRef.current?.readMeter(i) ?? { gain: patternRef.current[i], rms: 0 }
        if (m.level) m.level.style.height = `${Math.min(100, rms * 260)}%`
        if (m.gain) m.gain.style.bottom = `calc(${gain * 100}% - 2px)`
        if (m.pct) m.pct.textContent = `${Math.round(gain * 100)}%`
      })
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(
    () => () => {
      stopCamera()
      engineRef.current?.dispose()
    },
    [stopCamera],
  )

  const patternCode = pattern.join('')

  return (
    <main css={[styles.container, styles.motion]}>
      <Menu />
      <div css={styles.wrap}>
        <header css={styles.header}>
          <div>
            <h1 css={styles.title}>
              QR Loop <span>Mixer</span>
            </h1>
            <p css={styles.subtitle}>
              4トラックのループを同期再生し、QRコードを読み取るたびに鳴らすパートの組み合わせをフェードで切り替えます。
            </p>
          </div>
          <div css={styles.row}>
            <button type="button" css={[styles.button, styles.primaryButton]} onClick={play}>
              ▶ 再生
            </button>
            <button type="button" css={styles.button} onClick={stop}>
              ■ 停止
            </button>
          </div>
        </header>

        <section css={styles.top}>
          <div css={styles.panel}>
            <div css={styles.viewer} ref={viewerRef}>
              <video ref={videoRef} playsInline muted hidden={!cameraOn} />
              <canvas ref={thumbRef} hidden={cameraOn || !photoShown} />
              <div css={styles.reticle} ref={reticleRef} hidden={!cameraOn} />
              <div css={styles.viewerMessage} hidden={cameraOn || photoShown}>
                {cameraMessage}
              </div>
            </div>
            <div css={styles.row}>
              <button type="button" css={styles.button} onClick={toggleCamera}>
                {cameraOn ? 'カメラ停止' : 'カメラ起動'}
              </button>
              <label css={styles.button}>
                写真で読み取る
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
              </label>
            </div>
            <div css={styles.status}>{scanStatus}</div>
            <div css={styles.status}>{diagnostics}</div>
          </div>

          <div css={styles.panel}>
            <div>
              <div css={styles.label}>Current Pattern</div>
              <div css={styles.code}>{patternCode}</div>
              <div css={styles.status}>最後に読んだQR: {lastRead === null ? '—' : <b>{lastRead}</b>}</div>
            </div>
            <div css={styles.field}>
              <label css={styles.label} htmlFor="qr-loop-mixer-fade">
                Fade {fadeSeconds.toFixed(1)} sec
              </label>
              <input
                id="qr-loop-mixer-fade"
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={fadeSeconds}
                onChange={(e) => {
                  fadeRef.current = Number(e.target.value)
                  setFadeSeconds(fadeRef.current)
                }}
              />
            </div>
            <div css={styles.field}>
              <label css={styles.label} htmlFor="qr-loop-mixer-master">
                Master
              </label>
              <input
                id="qr-loop-mixer-master"
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={INITIAL_MASTER}
                onChange={(e) => getEngine().setMasterVolume(Number(e.target.value))}
              />
            </div>
            <p css={styles.help}>
              QRの中身は <code>LOOP:1011</code> の形式です。左から トラック1〜4 のオン(1)/オフ(0)。
              <code>LOOP:1011@5</code> のように書くとフェード秒数も指定できます。
            </p>
          </div>
        </section>

        <section css={styles.panel}>
          <h2 css={styles.sectionTitle}>Channels</h2>
          <div css={styles.strips}>
            {TRACKS.map((track, i) => (
              <div key={track.name} css={styles.strip} onDoubleClick={() => toggleTrack(i)}>
                <div css={styles.stripHead}>
                  <div>
                    <div css={styles.label}>CH {i + 1}</div>
                    <h3 css={styles.sectionTitle}>{track.name}</h3>
                  </div>
                  <div css={[styles.lamp, pattern[i] ? styles.lampOn : null]} />
                </div>
                <div css={styles.meter}>
                  <div
                    css={styles.meterLevel}
                    ref={(el) => {
                      meterRefs.current[i].level = el
                    }}
                  />
                  <div
                    css={styles.meterGain}
                    ref={(el) => {
                      meterRefs.current[i].gain = el
                    }}
                  />
                </div>
                <div
                  css={styles.stripPercent}
                  ref={(el) => {
                    meterRefs.current[i].pct = el
                  }}
                />
                <div css={styles.stripSource}>{trackSources[i]}</div>
                <label css={[styles.button, styles.stripFileButton]}>
                  音源を差し替え
                  <input type="file" accept="audio/*" onChange={(e) => handleTrackFile(i, e)} />
                </label>
              </div>
            ))}
          </div>
          <p css={styles.help}>
            各トラックは自分の音源ファイルに差し替えられます。同じ長さ・同じテンポで書き出したループを使うとずれません。ダブルクリックでオン/オフも切り替えられます。
          </p>
        </section>

        <section css={styles.panel}>
          <div css={[styles.row, { justifyContent: 'space-between' }]}>
            <h2 css={styles.sectionTitle}>QR Cue Cards</h2>
            <span css={styles.label}>タップでも切り替え可</span>
          </div>
          <div css={styles.cards}>
            {PRESETS.map((p, i) => (
              <button
                key={p}
                type="button"
                css={[styles.card, p === patternCode ? styles.cardActive : null]}
                onClick={async () => {
                  await play()
                  applyPattern(p.split('').map(Number))
                }}
              >
                <span css={styles.cardQr} dangerouslySetInnerHTML={{ __html: presetSvgs[i] }} />
                <span css={styles.cardPattern}>
                  {p.split('').map((x, j) => (
                    <i key={j} className={x === '1' ? 'f' : ''} />
                  ))}
                </span>
                <span css={styles.cardText}>LOOP:{p}</span>
              </button>
            ))}
          </div>
          <p css={styles.help}>
            別の端末にこの画面を表示するか、スクリーンショットを印刷してカメラにかざしてください。
          </p>
        </section>
      </div>
    </main>
  )
}
