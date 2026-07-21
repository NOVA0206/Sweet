'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useExperience } from '@/components/experience-context'

export function Welcome({ onBegin }: { onBegin: () => void }) {
  const { playSound } = useExperience()
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([])
  const idRef = useRef(0)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    let last = 0
    const onMove = (e: PointerEvent) => {
      const now = Date.now()
      if (now - last < 60) return
      last = now
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = idRef.current++
      setTrail((t) => [...t.slice(-14), { id, x, y }])
      setTimeout(() => {
        setTrail((t) => t.filter((p) => p.id !== id))
      }, 900)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section
      id="welcome"
      ref={areaRef}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {trail.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0.7, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.4, y: -30 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="pointer-events-none absolute z-10 text-primary"
          style={{ left: p.x, top: p.y }}
        >
          <Heart size={16} fill="currentColor" />
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 45%, #fce7f3 0%, transparent 70%)',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground"
      >
        A little something
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="text-balance font-serif text-5xl leading-tight text-foreground sm:text-7xl"
      >
        Hi Sharwari{' '}
        <motion.span
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2 }}
          className="inline-block text-primary"
        >
          <Heart className="inline size-10 sm:size-14" fill="currentColor" />
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground"
      >
        This isn&apos;t just another website. It&apos;s something I made
        especially for you.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playSound('chime')
          onBegin()
        }}
        className="group relative isolate mt-10 overflow-hidden rounded-full bg-primary px-10 py-4 text-base font-medium text-primary-foreground shadow-lg"
      >
        <span className="relative z-10">Begin</span>
        <span className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
      </motion.button>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 text-muted-foreground"
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  )
}
