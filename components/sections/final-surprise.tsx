'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkles, Star } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Reveal, Section } from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { EndingSequence } from '@/components/sections/ending-sequence'

export function FinalSurprise({
  onChapterClosing,
  onReveal,
}: {
  /** Fired once the button has finished its morph, so the next chapter can
   * mount underneath while the transition overlay still covers the screen. */
  onChapterClosing?: () => void
  /** Fired when she confirms inside the overlay; triggers the camera move. */
  onReveal?: () => void
}) {
  const { playSound, unlock, duckMusic } = useExperience()
  const [revealed, setRevealed] = useState(false)
  const [closing, setClosing] = useState(false)
  const [ending, setEnding] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const fireConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    const colors = ['#b76e79', '#d8b26e', '#fce7f3', '#f5f3ff', '#e6a3bd']
    const end = Date.now() + 1400
      ; (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors,
          scalar: 1.1,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors,
          scalar: 1.1,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      })()
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors,
    })
  }, [])

  const reveal = () => {
    setRevealed(true)
    playSound('achievement')
    unlock('The Whole Journey')
    fireConfetti()
  }

  const closeChapter = useCallback(() => {
    if (closing) return
    setClosing(true)
    playSound('chime')
    duckMusic(0.18, 450)
    timers.current.push(
      setTimeout(() => {
        setEnding(true)
        onChapterClosing?.()
      }, 380),
    )
  }, [closing, playSound, duckMusic, onChapterClosing])

  return (
    <Section id="surprise" className="min-h-screen justify-center">
      {/* twinkling stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {revealed &&
          Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.4, 1], scale: 1 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.12,
              }}
              className="absolute text-accent"
              style={{
                left: `${(i * 53) % 96}%`,
                top: `${(i * 71) % 90}%`,
              }}
            >
              <Star size={10 + (i % 3) * 6} fill="currentColor" />
            </motion.span>
          ))}
      </div>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="button"
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Reveal>
              <p className="mb-6 text-center text-muted-foreground">
                You made it all the way here.
              </p>
            </Reveal>
            <motion.button
              onClick={reveal}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(183,110,121,0.4)',
                  '0 0 0 18px rgba(183,110,121,0)',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-lg font-medium text-primary-foreground shadow-lg"
            >
              <Sparkles size={20} />
              One Last Thing...
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={
              closing
                ? { opacity: 0.35, scale: 0.98, y: -20, filter: 'blur(2px)' }
                : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
            }
            transition={{ duration: closing ? 0.6 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ duration: 1 }}
              className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Sparkles size={28} />
            </motion.div>
            <h2 className="text-balance font-serif text-3xl leading-tight text-foreground sm:text-5xl">
              Thank you for being with me.
            </h2>
            <p className="mt-6 max-w-md text-pretty text-lg text-muted-foreground">
              I hope this little website made you smile. Here&apos;s to whatever
              comes next.
            </p>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mt-8 font-serif text-2xl text-primary"
            >
              — For you, Sharwari
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{
                opacity: closing ? [1, 1, 0] : 1,
                scale: closing ? [1, 1.04, 0.92] : 1,
                boxShadow: closing
                  ? [
                      '0 0 0 0 rgba(216,178,110,0)',
                      '0 0 18px 6px rgba(216,178,110,0.4)',
                      '0 0 0 0 rgba(216,178,110,0)',
                    ]
                  : '0 0 0 0 rgba(216,178,110,0)',
              }}
              transition={
                closing
                  ? { duration: 0.65, times: [0, 0.45, 1], ease: 'easeInOut' }
                  : { delay: 1.2 }
              }
              onClick={closeChapter}
              disabled={closing}
              whileHover={closing ? undefined : { scale: 1.05 }}
              whileTap={closing ? undefined : { scale: 0.96 }}
              className="mt-10 flex items-center justify-center rounded-full border border-primary/40 px-7 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-default"
            >
              <AnimatePresence mode="wait">
                {!closing ? (
                  <motion.span key="label">Close Chapter One</motion.span>
                ) : (
                  <motion.span
                    key="heart"
                    initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1, 0.7], rotate: [-12, 0, 0, 6] }}
                    transition={{ duration: 0.65, times: [0, 0.35, 0.75, 1] }}
                    className="flex text-primary"
                  >
                    <Heart size={18} fill="currentColor" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <EndingSequence
        open={ending}
        onClose={() => setEnding(false)}
        onContinue={() => {
          onReveal?.()
          duckMusic(1, 1000)
          timers.current.push(setTimeout(() => setEnding(false), 800))
        }}
      />
    </Section>
  )
}
