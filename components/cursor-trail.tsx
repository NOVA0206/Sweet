'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Site-wide, subtle cursor trail: tiny hearts/sparkles that drift up and fade
 * where the pointer moves. Throttled and desktop-only (pointer: fine) so it
 * never competes with touch scrolling or the Welcome section's own trail.
 */
export function CursorTrail() {
  const [points, setPoints] = useState<
    { id: number; x: number; y: number; heart: boolean }[]
  >([])
  const idRef = useRef(0)
  const lastRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const now = Date.now()
      if (now - lastRef.current < 140) return
      lastRef.current = now
      const id = idRef.current++
      setPoints((p) => [
        ...p.slice(-10),
        { id, x: e.clientX, y: e.clientY, heart: id % 3 === 0 },
      ])
      setTimeout(() => {
        setPoints((p) => p.filter((pt) => pt.id !== id))
      }, 950)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] hidden sm:block"
    >
      <AnimatePresence>
        {points.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.6, scale: 0.5, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.1, y: p.y - 34 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-primary/70"
          >
            {p.heart ? (
              <Heart size={12} fill="currentColor" />
            ) : (
              <Sparkles size={11} className="text-accent/80" />
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
