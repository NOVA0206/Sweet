'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useExperience } from '@/components/experience-context'

const confessionText = `Sharwari,

I don't think you fully know how much you mean to me. Somewhere between the late night talks and the small, ordinary moments, you quietly became the best part of my life.

You changed things for me, more than I know how to put into words. You made me softer, calmer, and so much happier than I was before you.

Every moment with you feels precious, even the ones that seem small. A message, a laugh, a random Tuesday, all of it feels like something I want to hold onto.

You are my safe place. The person I want to come back to no matter how the day went.

I want a hundred more memories with you. Sunsets, silly arguments, road trips, quiet Sundays, all of it, with you.

Because here's the truth: I choose you. Not just today, but every single day, again and again, without a second thought.

So here is my heart, completely and honestly yours.

Will you keep writing this love story with me?`

function useTypewriter(text: string, active: boolean, speed = 16, chunk = 3) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active) return
    setShown(0)
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          clearInterval(id)
          return s
        }
        return Math.min(text.length, s + chunk)
      })
    }, speed)
    return () => clearInterval(id)
  }, [active, text, speed, chunk])
  return { rendered: text.slice(0, shown), done: shown >= text.length }
}

/**
 * The climax section: a slow cinematic confession. Sits after every existing
 * section as a brand-new addition — nothing prior is modified or removed.
 */
export function Confession() {
  const { playSound, unlock } = useExperience()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-140px' })
  const { rendered, done } = useTypewriter(confessionText, inView)

  useEffect(() => {
    if (inView) playSound('chime')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    if (done) unlock('Read the Confession')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        delay: (i % 7) * 1.1,
        duration: 9 + (i % 5) * 2,
        size: 10 + (i % 4) * 6,
      })),
    [],
  )

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: (i * 53) % 100,
        top: (i * 71) % 100,
        delay: (i % 10) * 0.25,
        duration: 2 + (i % 5) * 0.5,
        size: 1 + (i % 3),
      })),
    [],
  )

  return (
    <section
      id="confession"
      ref={ref}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 0%, #2c1f38 0%, #1c1526 55%, #100c18 100%)',
      }}
    >
      {/* glowing lights */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="glow-pulse absolute left-[10%] top-[15%] size-56 rounded-full"
          style={{ background: 'radial-gradient(circle, #b76e79 0%, transparent 70%)' }}
        />
        <span
          className="glow-pulse absolute right-[8%] top-[35%] size-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, #d8b26e 0%, transparent 70%)',
            animationDelay: '1.2s',
          }}
        />
        <span
          className="glow-pulse absolute bottom-[10%] left-[30%] size-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, #c9a0dc 0%, transparent 70%)',
            animationDelay: '0.6s',
          }}
        />
      </div>

      {/* twinkling stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>

      {/* floating hearts drifting up */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {inView &&
          floatingHearts.map((h) => (
            <span
              key={h.id}
              className="heart-rain-drop absolute bottom-[-40px] text-[#e6a3bd]/70"
              style={{
                left: `${h.left}%`,
                animationDuration: `${h.duration}s`,
                animationDelay: `${h.delay}s`,
                animationDirection: 'reverse',
              }}
            >
              <Heart size={h.size} fill="currentColor" />
            </span>
          ))}
      </div>

      {/* soft blur vignette so text stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 backdrop-blur-[2px]"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 45%, rgba(16,12,24,0) 0%, rgba(16,12,24,0.55) 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-8 flex size-16 items-center justify-center rounded-full bg-[#e6a3bd]/20 text-[#f6b8d0]"
      >
        <span className="heartbeat">
          <Heart size={30} fill="currentColor" />
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mb-6 text-xs uppercase tracking-[0.4em] text-[#d8b26e]"
      >
        <Sparkles className="mr-1.5 inline size-3.5" />
        Before anything else
      </motion.p>

      <div className="relative z-10 max-w-2xl">
        <p className="whitespace-pre-line text-pretty font-serif text-lg italic leading-[2rem] text-[#f3e9d2] sm:text-xl sm:leading-[2.2rem]">
          {rendered}
          {!done && inView && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block"
            >
              |
            </motion.span>
          )}
        </p>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-handwriting mt-8 text-4xl text-[#f6b8d0] sm:text-5xl"
            >
              Every day, still choosing you.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
