export const TRACKS = [{ name: 'Drums' }, { name: 'Bass' }, { name: 'Chords' }, { name: 'Arp' }] as const

export type Pattern = number[]

const BPM = 96
const BARS = 4
const SR = 44100
const BEAT = 60 / BPM
const LOOP_SECONDS = BARS * 4 * BEAT

const CHORDS = [
  [57, 60, 64],
  [53, 57, 60],
  [55, 60, 64],
  [55, 59, 62],
]
const ROOTS = [45, 41, 36, 43]

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

const noiseBuffer = (c: BaseAudioContext) => {
  const b = c.createBuffer(1, SR, SR)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return b
}

const envelope = (c: BaseAudioContext, t: number, peak: number, attack: number, decay: number) => {
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  return g
}

// 各トラックを OfflineAudioContext で一度だけレンダリングしてループ素材にする
const renderers: ((c: OfflineAudioContext) => void)[] = [
  // Drums
  (c) => {
    const nb = noiseBuffer(c)
    for (let i = 0; i < BARS * 4; i++) {
      const t = i * BEAT
      const o = c.createOscillator()
      o.frequency.setValueAtTime(150, t)
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
      o.connect(envelope(c, t, 0.9, 0.004, 0.35)).connect(c.destination)
      o.start(t)
      o.stop(t + 0.4)

      if (i % 2 === 1) {
        const n = c.createBufferSource()
        n.buffer = nb
        const f = c.createBiquadFilter()
        f.type = 'highpass'
        f.frequency.value = 1500
        n.connect(f)
          .connect(envelope(c, t, 0.45, 0.002, 0.18))
          .connect(c.destination)
        n.start(t)
        n.stop(t + 0.25)
      }

      for (let h = 0; h < 2; h++) {
        const th = t + (h * BEAT) / 2
        const n = c.createBufferSource()
        n.buffer = nb
        const f = c.createBiquadFilter()
        f.type = 'highpass'
        f.frequency.value = 7000
        n.connect(f)
          .connect(envelope(c, th, h ? 0.16 : 0.08, 0.001, 0.05))
          .connect(c.destination)
        n.start(th)
        n.stop(th + 0.08)
      }
    }
  },
  // Bass
  (c) => {
    for (let bar = 0; bar < BARS; bar++) {
      for (let e = 0; e < 8; e++) {
        const t = (bar * 4 + e / 2) * BEAT
        const o = c.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = mtof(ROOTS[bar] + (e % 2 ? 12 : 0))
        const f = c.createBiquadFilter()
        f.type = 'lowpass'
        f.Q.value = 6
        f.frequency.setValueAtTime(900, t)
        f.frequency.exponentialRampToValueAtTime(180, t + 0.2)
        o.connect(f)
          .connect(envelope(c, t, 0.35, 0.005, 0.22))
          .connect(c.destination)
        o.start(t)
        o.stop(t + 0.3)
      }
    }
  },
  // Chords
  (c) => {
    const f = c.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1800
    f.connect(c.destination)
    for (let bar = 0; bar < BARS; bar++) {
      const t = bar * 4 * BEAT
      const d = 4 * BEAT
      CHORDS[bar].forEach((m) =>
        [-6, 6].forEach((detune) => {
          const o = c.createOscillator()
          o.type = 'triangle'
          o.frequency.value = mtof(m)
          o.detune.value = detune
          const g = c.createGain()
          g.gain.setValueAtTime(0, t)
          g.gain.linearRampToValueAtTime(0.06, t + 0.35)
          g.gain.setValueAtTime(0.06, t + d - 0.4)
          g.gain.linearRampToValueAtTime(0, t + d - 0.02)
          o.connect(g).connect(f)
          o.start(t)
          o.stop(t + d)
        }),
      )
    }
  },
  // Arp
  (c) => {
    const steps = [0, 1, 2, 3, 2, 1, 0, 1]
    for (let bar = 0; bar < BARS; bar++) {
      const tones = [...CHORDS[bar], CHORDS[bar][0] + 12].map((m) => m + 12)
      for (let s = 0; s < 16; s++) {
        const t = (bar * 4 + s / 4) * BEAT
        const o = c.createOscillator()
        o.type = 'square'
        o.frequency.value = mtof(tones[steps[s % 8]])
        const f = c.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 2600
        o.connect(f)
          .connect(envelope(c, t, 0.07, 0.003, 0.14))
          .connect(c.destination)
        o.start(t)
        o.stop(t + 0.2)
      }
    }
  },
]

const renderAll = () =>
  Promise.all(
    renderers.map((render) => {
      const c = new OfflineAudioContext(2, Math.round(SR * LOOP_SECONDS), SR)
      render(c)
      return c.startRendering()
    }),
  )

/**
 * 4トラックのループを同期再生し、トラックごとのゲインをフェードで切り替える
 */
export class LoopEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private gains: GainNode[] = []
  private analysers: AnalyserNode[] = []
  private sources: AudioBufferSourceNode[] = []
  private buffers: (AudioBuffer | null)[] = [null, null, null, null]
  private initializing: Promise<void> | null = null
  private meterBuffer = new Float32Array(512)
  playing = false

  constructor(
    private pattern: Pattern,
    private masterVolume: number,
  ) {}

  private ensureContext(): Promise<void> {
    if (!this.initializing) {
      this.initializing = (async () => {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioContextClass()
        this.ctx = ctx
        this.master = ctx.createGain()
        this.master.gain.value = this.masterVolume
        this.master.connect(ctx.destination)
        for (let i = 0; i < TRACKS.length; i++) {
          const g = ctx.createGain()
          g.gain.value = this.pattern[i]
          const a = ctx.createAnalyser()
          a.fftSize = 512
          g.connect(a)
          a.connect(this.master)
          this.gains.push(g)
          this.analysers.push(a)
        }
        const rendered = await renderAll()
        rendered.forEach((b, i) => {
          if (!this.buffers[i]) this.buffers[i] = b
        })
      })()
    }
    return this.initializing
  }

  private startSources() {
    const ctx = this.ctx
    if (!ctx) return
    this.stopSources()
    const t0 = ctx.currentTime + 0.08
    this.buffers.forEach((b, i) => {
      const s = ctx.createBufferSource()
      s.buffer = b
      s.loop = true
      s.connect(this.gains[i])
      s.start(t0)
      this.sources.push(s)
    })
  }

  private stopSources() {
    this.sources.forEach((s) => {
      try {
        s.stop()
      } catch {
        // 既に停止済み
      }
    })
    this.sources = []
  }

  async play() {
    await this.ensureContext()
    await this.ctx?.resume()
    if (!this.playing) {
      this.startSources()
      this.playing = true
    }
  }

  stop() {
    this.stopSources()
    this.playing = false
  }

  applyPattern(pattern: Pattern, fadeSeconds: number) {
    this.pattern = pattern.slice()
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    this.gains.forEach((g, i) => {
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.linearRampToValueAtTime(pattern[i], now + Math.max(0.02, fadeSeconds))
    })
  }

  setMasterVolume(volume: number) {
    this.masterVolume = volume
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05)
  }

  async replaceTrack(index: number, file: File) {
    await this.ensureContext()
    if (!this.ctx) return
    this.buffers[index] = await this.ctx.decodeAudioData(await file.arrayBuffer())
    if (this.playing) this.startSources()
  }

  /** メーター表示用: 現在のゲインと RMS レベル */
  readMeter(index: number): { gain: number; rms: number } {
    const gain = this.gains[index] ? this.gains[index].gain.value : this.pattern[index]
    let rms = 0
    const analyser = this.analysers[index]
    if (analyser && this.playing) {
      const buf = this.meterBuffer
      analyser.getFloatTimeDomainData(buf)
      for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i]
      rms = Math.sqrt(rms / buf.length)
    }
    return { gain, rms }
  }

  dispose() {
    this.stop()
    this.ctx?.close()
  }
}
