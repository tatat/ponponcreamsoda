import jsQR from 'jsqr'
import { BinaryBitmap, DecodeHintType, HybridBinarizer, QRCodeReader, RGBLuminanceSource } from '@zxing/library'
import type { Pattern } from './audio'

export type ParsedCode = { pattern: Pattern; fade?: number }

/** `LOOP:1011` / `LOOP:1011@5` 形式の QR テキストを解釈する */
export const parseLoopCode = (text: string): ParsedCode | null => {
  const m = String(text)
    .trim()
    .match(/^(?:LOOP:)?([01]{4})(?:@(\d+(?:\.\d+)?))?$/i)
  if (!m) return null
  return { pattern: m[1].split('').map(Number), fade: m[2] !== undefined ? Number(m[2]) : undefined }
}

type BarcodeDetectorLike = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> }
type BarcodeDetectorConstructor = new (options: { formats: string[] }) => BarcodeDetectorLike

type Rect = { left: number; top: number; width: number; height: number }
type Region = [number, number, number, number]

export type DecodeDiagnostics = { tries: number; engines: string[] }

/**
 * ネイティブ BarcodeDetector → ZXing → jsQR の順で試す QR デコーダ
 */
export class QrDecoder {
  private detector: BarcodeDetectorLike | null = null
  private canvas = document.createElement('canvas')
  private ctx = this.canvas.getContext('2d', { willReadFrequently: true })!
  private zxHints = new Map([[DecodeHintType.TRY_HARDER, true]])
  private liveStep = 0
  diagnostics: DecodeDiagnostics = { tries: 0, engines: [] }

  constructor() {
    const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
    if (Detector) {
      try {
        this.detector = new Detector({ formats: ['qr_code'] })
      } catch {
        this.detector = null
      }
    }
  }

  // 指定領域をスキャン用キャンバスに描画して ZXing / jsQR で読む
  private tryRegion(
    src: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    maxOut: number,
    boost: boolean,
  ): string | null {
    const s = Math.min(1, maxOut / Math.max(sw, sh))
    const w = Math.max(1, (sw * s) | 0)
    const h = Math.max(1, (sh * s) | 0)
    const { canvas, ctx } = this
    canvas.width = w
    canvas.height = h
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(src, sx, sy, sw, sh, 0, 0, w, h)
    const d = ctx.getImageData(0, 0, w, h)
    const p = d.data
    const L = new Uint8ClampedArray(w * h)
    let mn = 255
    let mx = 0
    for (let i = 0, j = 0; i < p.length; i += 4, j++) {
      const l = (p[i] * 77 + p[i + 1] * 150 + p[i + 2] * 29) >> 8
      L[j] = l
      if (l < mn) mn = l
      if (l > mx) mx = l
    }
    if (boost) {
      const k = 255 / Math.max(1, mx - mn)
      for (let j = 0; j < L.length; j++) {
        const v = (L[j] - mn) * k
        L[j] = v
        p[j * 4] = p[j * 4 + 1] = p[j * 4 + 2] = v
      }
    }
    this.diagnostics.tries++
    try {
      const bitmap = new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(L, w, h)))
      return new QRCodeReader().decode(bitmap, this.zxHints).getText()
    } catch {
      // ZXing で見つからなければ jsQR へ
    }
    const r = jsQR(p, w, h, { inversionAttempts: 'attemptBoth' })
    return r ? r.data : null
  }

  /** 写真などの静止画を、中央からの切り出しサイズを変えながら念入りに読む */
  async decodeImage(src: CanvasImageSource, w: number, h: number): Promise<string | null> {
    this.diagnostics = { tries: 0, engines: [this.detector ? 'native' : '', 'ZXing', 'jsQR'].filter(Boolean) }
    if (this.detector) {
      try {
        const r = await this.detector.detect(src)
        if (r.length) return r[0].rawValue
      } catch {
        // フォールバックへ
      }
    }
    const m = Math.min(w, h)
    const plan: [number, number, boolean][] = [
      [0.6, 900, false],
      [1, 1000, false],
      [0.4, 800, false],
      [0.8, 1200, false],
      [0.6, 900, true],
      [0.3, 700, false],
      [1, 1600, false],
      [0.5, 600, true],
      [0.25, 500, false],
    ]
    for (const [frac, out, boost] of plan) {
      const cw = frac === 1 ? w : m * frac
      const ch = frac === 1 ? h : m * frac
      const t = this.tryRegion(src, (w - cw) / 2, (h - ch) / 2, cw, ch, out, boost)
      if (t) return t
      await new Promise((r) => setTimeout(r, 0))
    }
    return null
  }

  /**
   * カメラ映像: ビューア上に見えている範囲（object-fit: cover でクロップされた範囲）を
   * レティクル優先で読む。1 フレームあたり 2 回だけ試し、プランを順に回す
   */
  decodeLive(video: HTMLVideoElement, viewer: HTMLElement, reticle: HTMLElement): string | null {
    const map = screenToVideo(video)
    const box = viewer.getBoundingClientRect()
    const clip = (r: Rect): Rect => {
      const l = Math.max(r.left, box.left)
      const t = Math.max(r.top, box.top)
      return {
        left: l,
        top: t,
        width: Math.min(r.left + r.width, box.right) - l,
        height: Math.min(r.top + r.height, box.bottom) - t,
      }
    }
    const ret = reticle.getBoundingClientRect()
    const plans: [Region, number, boolean][] = [
      [map(clip(grow(ret, 0.12))), 640, false],
      [map(box), 800, false],
      [map(clip(grow(ret, 0.12))), 900, true],
      [map(ret), 500, false],
    ]
    for (let k = 0; k < 2; k++) {
      const [r, out, boost] = plans[this.liveStep++ % plans.length]
      const t = this.tryRegion(video, r[0], r[1], r[2], r[3], out, boost)
      if (t) return t
    }
    return null
  }
}

const screenToVideo = (v: HTMLVideoElement) => {
  const vr = v.getBoundingClientRect()
  const vw = v.videoWidth
  const vh = v.videoHeight
  const sc = Math.max(vr.width / vw, vr.height / vh)
  const ox = (vw * sc - vr.width) / 2
  const oy = (vh * sc - vr.height) / 2
  return (r: Rect): Region => {
    const x = Math.max(0, (r.left - vr.left + ox) / sc)
    const y = Math.max(0, (r.top - vr.top + oy) / sc)
    return [x, y, Math.min(vw - x, r.width / sc), Math.min(vh - y, r.height / sc)]
  }
}

const grow = (r: Rect, f: number): Rect => {
  const dx = r.width * f
  const dy = r.height * f
  return { left: r.left - dx, top: r.top - dy, width: r.width + 2 * dx, height: r.height + 2 * dy }
}

export const loadImage = async (
  file: File,
): Promise<{ src: CanvasImageSource; w: number; h: number; release: () => void }> => {
  if ('createImageBitmap' in window) {
    try {
      const b = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { src: b, w: b.width, h: b.height, release: () => b.close() }
    } catch {
      // <img> へフォールバック
    }
  }
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.src = url
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = () => reject(new Error('画像を開けませんでした'))
  })
  return { src: img, w: img.naturalWidth, h: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
}
