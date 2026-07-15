'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section, SectionLabel, SectionTitle } from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { gardenNotes } from '@/lib/experience-data'

const petalColors = ['#f6b8d0', '#e6a3bd', '#d8b26e', '#c9a0dc', '#f4c9a1', '#b76e79']

function Flower({
  index,
  open,
  onToggle,
}: {
  index: number
  open: boolean
  onToggle: () => void
}) {
  const color = petalColors[index % petalColors.length]
  return (
    <button
      onClick={onToggle}
      aria-label={`Open note ${index + 1}`}
      className="relative flex size-24 items-center justify-center"
    >
      <motion.svg
        width="88"
        height="88"
        viewBox="0 0 100 100"
        animate={{ rotate: open ? 90 : 0, scale: open ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.ellipse
            key={i}
            cx="50"
            cy="28"
            rx="12"
            ry="22"
            fill={color}
            opacity={0.9}
            style={{ transformOrigin: '50px 50px' }}
            animate={{
              rotate: i * 60,
              scaleY: open ? 1 : 0.72,
            }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
          />
        ))}
        <circle cx="50" cy="50" r="12" fill="var(--soft-gold)" />
      </motion.svg>
    </button>
  )
}

export function MemoryGarden() {
  const { playSound, unlock } = useExperience()
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => {
    const next = open === i ? null : i
    setOpen(next)
    playSound('pop')
    if (next !== null) unlock('Gardener')
  }

  return (
    <Section id="garden">
      <SectionLabel>Memory Garden</SectionLabel>
      <SectionTitle>A garden of little notes</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          Every flower is hiding something I wanted to say. Tap one to let it
          bloom.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-12 w-full max-w-2xl">
        <div className="flex flex-wrap items-start justify-center gap-6">
          {gardenNotes.map((note, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div whileHover={{ y: -4 }}>
                <Flower index={i} open={open === i} onToggle={() => toggle(i)} />
              </motion.div>
              <div className="h-10 w-1 rounded-full bg-[color:var(--soft-gold)]/40" />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {open !== null && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="glass mx-auto mt-6 max-w-md rounded-3xl p-6 text-center shadow-sm"
            >
              <span className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-primary">
                {gardenNotes[open].label}
              </span>
              <p className="text-pretty font-serif text-xl leading-relaxed text-foreground">
                {gardenNotes[open].text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}
