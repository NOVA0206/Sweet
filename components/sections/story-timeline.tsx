'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal, Section, SectionLabel, SectionTitle } from '@/components/section-shell'
import { HiddenHeart } from '@/components/easter-eggs'
import { useExperience } from '@/components/experience-context'
import { timeline } from '@/lib/experience-data'

function Doodle({ type }: { type: string }) {
  const common = { stroke: 'var(--rose-gold)', strokeWidth: 2, fill: 'none' }
  switch (type) {
    case 'chat':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <path d="M4 5h16v10H9l-4 4V5Z" strokeLinejoin="round" />
        </svg>
      )
    case 'moon':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <path d="M18 14A8 8 0 0 1 9 5a7 7 0 1 0 9 9Z" strokeLinejoin="round" />
        </svg>
      )
    case 'film':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 5v14M16 5v14" />
        </svg>
      )
    case 'heart':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-7 9-7 9Z" />
        </svg>
      )
    case 'sun':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" />
        </svg>
      )
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" {...common}>
          <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />
        </svg>
      )
  }
}

export function StoryTimeline() {
  const { playSound } = useExperience()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="story">
      <SectionLabel>Our Story</SectionLabel>
      <SectionTitle>How we got here</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          Tap each moment to open it. Little chapters of a story that&apos;s
          only just beginning.
        </p>
      </Reveal>

      <div className="relative mt-14 w-full max-w-2xl">
        {/* center line */}
        <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" />

        <div className="flex flex-col gap-6">
          {timeline.map((item, i) => {
            const isOpen = open === i
            const left = i % 2 === 0
            return (
              <Reveal key={item.title} delay={i * 0.05}>
                <div
                  className={`relative flex ${
                    left ? 'sm:justify-start' : 'sm:justify-end'
                  }`}
                >
                  {/* node */}
                  <span className="absolute left-4 top-6 z-10 -translate-x-1/2 sm:left-1/2">
                    <motion.span
                      animate={isOpen ? { scale: [1, 1.4, 1] } : {}}
                      className="block size-3 rounded-full bg-primary ring-4 ring-secondary"
                    />
                  </span>

                  <motion.button
                    layout
                    onClick={() => {
                      setOpen(isOpen ? null : i)
                      playSound('pop')
                    }}
                    whileHover={{ y: -3 }}
                    className={`glass ml-10 w-full rounded-3xl p-5 text-left shadow-sm sm:ml-0 sm:w-[46%] ${
                      isOpen ? 'ring-1 ring-primary/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Doodle type={item.doodle} />
                      </span>
                      <h3 className="font-serif text-lg text-foreground">
                        {item.title}
                      </h3>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >

                          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                            {item.note}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </Reveal>
            )
          })}
        </div>
        <HiddenHeart className="right-2 top-1/3" />
      </div>
    </Section>
  )
}
