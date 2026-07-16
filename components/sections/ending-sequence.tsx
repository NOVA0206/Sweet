'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const steps = ['Chapter One Complete', 'Our Story...', 'Loading...']
const percents = [0, 25, 60, 100]

// Offset so the whole text/loading/stars timeline starts after the initial
// heartbeat beat has had a moment to breathe. Kept short on purpose — she
// should reach the loading bar quickly, not wait through a long preamble.
const START_OFFSET = 200

/** Background morphs pastel -> warm pink -> lavender -> twilight -> night. */
const skyStops = ['#fce7f3', '#f6b8d0', '#c9a0dc', '#4b3a63', '#1c1526']
const SKY_DURATION = 1.4

const CLOSE_DURATION = 0.6

export function EndingSequence({
  open,
  onClose,
  onContinue,
}: {
  open: boolean
  onClose: () => void
  onContinue?: () => void
}) {
  const [phase, setPhase] = useState<'pulse' | 'text' | 'loading' | 'stars'>('pulse')
  const [stepIndex, setStepIndex] = useState(0)
  const [pctIndex, setPctIndex] = useState(0)
  const [closingOut, setClosingOut] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!open) return
    setPhase('pulse')
    setStepIndex(0)
    setPctIndex(0)
    setClosingOut(false)
    const t = timers.current

    t.push(setTimeout(() => setPhase('text'), START_OFFSET))
    t.push(setTimeout(() => setStepIndex(1), START_OFFSET + 380))
    t.push(setTimeout(() => setStepIndex(2), START_OFFSET + 700))
    t.push(setTimeout(() => setPhase('loading'), START_OFFSET + 1000))
    percents.forEach((_, i) =>
      t.push(setTimeout(() => setPctIndex(i), START_OFFSET + 1000 + i * 220)),
    )
    t.push(
      setTimeout(() => setPhase('stars'), START_OFFSET + 1000 + percents.length * 220),
    )

    return () => {
      t.forEach(clearTimeout)
      timers.current = []
    }
  }, [open])

  const goldenMotes = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: (i * 43) % 100,
    delay: (i % 8) * 1.4,
    duration: 10 + (i % 6) * 2.5,
    size: 4 + (i % 3) * 3,
  }))

  const handleContinue = () => {
    setClosingOut(true)
    onContinue?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: closingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: closingOut ? CLOSE_DURATION : 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden text-center"
        >
          {/* the gradual sky morph: pastel -> pink -> lavender -> twilight -> night */}
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundColor: skyStops[0] }}
            animate={{ backgroundColor: skyStops }}
            transition={{ duration: SKY_DURATION, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 120% at 50% 20%, transparent 0%, rgba(20,16,31,0.35) 100%)',
            }}
          />

          {/* cinematic blur + vignette, kept subtle so it never feels harsh */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            style={{
              background:
                'radial-gradient(65% 60% at 50% 50%, transparent 0%, rgba(10,8,16,0.22) 100%)',
            }}
          />

          {/* starfield */}
          <div aria-hidden="true" className="absolute inset-0">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 61) % 100}%`,
                  width: 1 + (i % 3),
                  height: 1 + (i % 3),
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.15, 0.65, 0.15] }}
                transition={{
                  opacity: { duration: 2.6 + (i % 5) * 0.6, repeat: Infinity, delay: (i % 10) * 0.2 },
                }}
              />
            ))}
          </div>

          {/* golden particles, drifting continuously through the whole transition */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {goldenMotes.map((m) => (
              <span
                key={m.id}
                className="absolute bottom-[-30px] rounded-full"
                style={{
                  left: `${m.left}%`,
                  width: m.size,
                  height: m.size,
                  background: 'var(--soft-gold)',
                  boxShadow: '0 0 6px 2px rgba(216,178,110,0.45)',
                  animation: `float-up ${m.duration}s linear ${m.delay}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center px-6">
            <AnimatePresence mode="wait">
              {phase === 'pulse' && (
                <motion.div
                  key="pulse"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className="heartbeat text-[#f6b8d0]"
                >
                  <Heart size={40} fill="currentColor" />
                </motion.div>
              )}

              {phase === 'text' && (
                <motion.h2
                  key={steps[stepIndex]}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.7 }}
                  className="font-serif text-3xl tracking-wide text-[#f3e9d2] sm:text-5xl"
                >
                  {steps[stepIndex]}
                </motion.h2>
              )}

              {phase === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <p className="mb-4 font-sans text-sm uppercase tracking-[0.3em] text-[#d8b26e]">
                    Loading
                  </p>
                  <span className="font-serif text-6xl text-[#f3e9d2] sm:text-7xl tabular-nums">
                    {percents[pctIndex]}%
                  </span>
                  <div className="mt-6 h-1 w-56 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className="h-full rounded-full bg-[#d8b26e]"
                      animate={{ width: `${percents[pctIndex]}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              )}

              {phase === 'stars' && (
                <motion.div
                  key="stars"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <motion.h2
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-balance font-serif text-3xl text-[#f3e9d2] sm:text-5xl"
                  >
                    Our story Continues forever.
                  </motion.h2>
                  <p className="mt-4 font-sans text-sm tracking-[0.2em] text-[#d8b26e]">
                    — For you, Sharwari
                  </p>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleContinue}
                      disabled={closingOut}
                      className="rounded-full bg-[#d8b26e] px-7 py-3 text-sm font-medium text-[#241d33] shadow-lg transition-transform hover:scale-105 disabled:cursor-default disabled:opacity-70"
                    >
                      Continue Our Story
                    </button>
                    <button
                      onClick={onClose}
                      disabled={closingOut}
                      className="rounded-full border border-white/25 px-6 py-2.5 text-sm text-[#f3e9d2] transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-70"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
