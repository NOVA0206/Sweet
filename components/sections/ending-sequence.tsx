'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const steps = ['Chapter One Complete', 'Our Story...', 'Loading...']
const percents = [0, 25, 60, 100]

export function EndingSequence({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [phase, setPhase] = useState<'text' | 'loading' | 'stars'>('text')
  const [stepIndex, setStepIndex] = useState(0)
  const [pctIndex, setPctIndex] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!open) return
    setPhase('text')
    setStepIndex(0)
    setPctIndex(0)
    const t = timers.current

    t.push(setTimeout(() => setStepIndex(1), 1600))
    t.push(setTimeout(() => setStepIndex(2), 3000))
    t.push(setTimeout(() => setPhase('loading'), 4200))
    percents.forEach((_, i) =>
      t.push(setTimeout(() => setPctIndex(i), 4200 + i * 700)),
    )
    t.push(setTimeout(() => setPhase('stars'), 4200 + percents.length * 700))

    return () => {
      t.forEach(clearTimeout)
      timers.current = []
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden text-center"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 20%, #3a2f4a 0%, #241d33 45%, #14101f 100%)',
          }}
        >
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
                animate={{ opacity: [0.15, 0.9, 0.15] }}
                transition={{
                  duration: 2 + (i % 5) * 0.6,
                  repeat: Infinity,
                  delay: (i % 10) * 0.2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center px-6">
            <AnimatePresence mode="wait">
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
                  <button
                    onClick={onClose}
                    className="mt-10 rounded-full border border-white/25 px-6 py-2.5 text-sm text-[#f3e9d2] transition-colors hover:bg-white/10"
                  >
                    Replay the moment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
