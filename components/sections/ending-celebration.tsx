'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useExperience } from '@/components/experience-context'

type Choice = 'yes' | 'forever' | null

const balloonColors = ['#e6a3bd', '#d8b26e', '#c9a0dc', '#b76e79', '#f4c9a1']

export function EndingCelebration() {
  const { playSound, unlock } = useExperience()
  const [choice, setChoice] = useState<Choice>(null)

  const rainDrops = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: (i * 41) % 100,
        delay: (i % 13) * 0.35,
        duration: 5 + (i % 6),
        size: 12 + (i % 4) * 6,
      })),
    [],
  )

  const balloons = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        left: 6 + i * 10.5,
        delay: (i % 5) * 0.4,
        color: balloonColors[i % balloonColors.length],
        size: 34 + (i % 3) * 10,
      })),
    [],
  )

  const fireworks = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    const colors = ['#b76e79', '#d8b26e', '#e6a3bd', '#f5f3ff', '#c9a0dc']
    const burst = (x: number, y: number) =>
      confetti({
        particleCount: 90,
        spread: 100,
        startVelocity: 42,
        origin: { x, y },
        colors,
        scalar: 1.1,
        ticks: 200,
      })
    burst(0.2, 0.5)
    setTimeout(() => burst(0.8, 0.4), 220)
    setTimeout(() => burst(0.5, 0.3), 440)
    setTimeout(
      () =>
        confetti({
          particleCount: 160,
          spread: 130,
          startVelocity: 55,
          origin: { y: 0.6 },
          colors,
        }),
      660,
    )
  }, [])

  const celebrate = (pick: Exclude<Choice, null>) => {
    setChoice(pick)
    playSound('achievement')
    unlock(pick === 'forever' ? 'Forever Yes' : 'Said Yes')
    fireworks()
    if (pick === 'forever') {
      setTimeout(() => fireworks(), 500)
    }
  }

  return (
    <section
      id="forever"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 100%, #3a2438 0%, #241a2e 55%, #140f1c 100%)',
      }}
    >
      {/* balloons, always gently bobbing in the background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        {balloons.map((b) => (
          <span
            key={b.id}
            className="balloon-bob absolute bottom-0"
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <svg width={b.size} height={b.size * 1.3} viewBox="0 0 40 52" fill="none">
              <ellipse cx="20" cy="20" rx="18" ry="20" fill={b.color} opacity="0.85" />
              <path d="M20 40 L20 52" stroke={b.color} strokeWidth="1.5" opacity="0.6" />
            </svg>
          </span>
        ))}
      </div>

      <AnimatePresence>
        {choice && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {rainDrops.map((d) => (
              <span
                key={d.id}
                className="heart-rain-drop absolute top-[-40px] text-[#f6b8d0]/80"
                style={{
                  left: `${d.left}%`,
                  animationDuration: `${d.duration}s`,
                  animationDelay: `${d.delay}s`,
                }}
              >
                <Heart size={d.size} fill="currentColor" />
              </span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!choice ? (
          <motion.div
            key="ask"
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mb-6 text-primary"
            >
              <Heart size={36} className="text-[#e6a3bd]" fill="currentColor" />
            </motion.span>
            <h2 className="text-balance font-serif text-3xl leading-tight text-[#f3e9d2] sm:text-5xl">
              So... will you write this story with me?
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                onClick={() => celebrate('yes')}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="cute-bounce flex items-center gap-2 rounded-full bg-[#e6a3bd] px-8 py-4 text-lg font-medium text-[#2c1f38] shadow-lg"
              >
                ❤️ Yes
              </motion.button>
              <motion.button
                onClick={() => celebrate('forever')}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(216,178,110,0.5)',
                    '0 0 0 16px rgba(216,178,110,0)',
                  ],
                }}
                transition={{
                  boxShadow: { duration: 1.8, repeat: Infinity },
                }}
                className="flex items-center gap-2 rounded-full bg-[#d8b26e] px-8 py-4 text-lg font-medium text-[#2c1f38] shadow-lg"
              >
                💕 Forever Yes
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <motion.h2
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
              className="heartbeat text-balance font-serif text-4xl text-[#f6b8d0] sm:text-6xl"
            >
              I Love You ❤️
            </motion.h2>

            <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-[#f3e9d2]/90">
              {choice === 'forever'
                ? 'Forever it is, then. Thank you for choosing this with me, today and every day after.'
                : 'Thank you for saying yes. I promise to keep making moments worth remembering.'}
            </p>

            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="font-handwriting mt-6 text-4xl text-[#d8b26e] sm:text-5xl"
            >
              Here&apos;s to us.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
