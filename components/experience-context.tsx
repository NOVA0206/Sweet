'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type SoundName = 'click' | 'chime' | 'pop' | 'achievement'

type ExperienceContextValue = {
  muted: boolean
  toggleMuted: () => void
  playSound: (name: SoundName) => void
  achievements: string[]
  unlock: (name: string) => void
  duckLevel: number
  duckMusic: (target: number, ms?: number) => void
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error('useExperience must be used within ExperienceProvider')
  return ctx
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [duckLevel, setDuckLevel] = useState(1)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const duckLevelRef = useRef(1)
  const duckRafRef = useRef<number | null>(null)

  const duckMusic = useCallback((target: number, ms = 1200) => {
    if (duckRafRef.current) cancelAnimationFrame(duckRafRef.current)
    const start = performance.now()
    const from = duckLevelRef.current
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const eased = from + (target - from) * t
      duckLevelRef.current = eased
      setDuckLevel(eased)
      if (t < 1) duckRafRef.current = requestAnimationFrame(step)
    }
    duckRafRef.current = requestAnimationFrame(step)
  }, [])

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (AC) audioCtxRef.current = new AC()
    }
    return audioCtxRef.current
  }, [])

  const playSound = useCallback(
    (name: SoundName) => {
      if (mutedRef.current) return
      const ctx = ensureCtx()
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume().catch(() => {})

      const now = ctx.currentTime
      const notes: Record<SoundName, number[]> = {
        click: [520],
        pop: [660],
        chime: [660, 880],
        achievement: [523.25, 659.25, 783.99],
      }
      const freqs = notes[name]
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = f
        const start = now + i * 0.08
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32)
        osc.connect(gain).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.34)
      })
    },
    [ensureCtx],
  )

  const unlock = useCallback(
    (name: string) => {
      setAchievements((prev) => {
        if (prev.includes(name)) return prev
        playSound('achievement')
        return [...prev, name]
      })
    },
    [playSound],
  )

  const toggleMuted = useCallback(() => setMuted((m) => !m), [])

  useEffect(() => {
    const resume = () => {
      const ctx = ensureCtx()
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
    }
    window.addEventListener('pointerdown', resume, { once: true })
    return () => window.removeEventListener('pointerdown', resume)
  }, [ensureCtx])

  return (
    <ExperienceContext.Provider
      value={{ muted, toggleMuted, playSound, achievements, unlock, duckLevel, duckMusic }}
    >
      {children}
    </ExperienceContext.Provider>
  )
}
