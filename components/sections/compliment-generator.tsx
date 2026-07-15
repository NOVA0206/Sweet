'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Quote, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Reveal, Section, SectionLabel, SectionTitle } from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { compliments } from '@/lib/experience-data'

export function ComplimentGenerator() {
  const { playSound, unlock } = useExperience()
  const [current, setCurrent] = useState(
    'Tap the button for a little reminder of how lovely you are.',
  )
  const [count, setCount] = useState(0)
  const [key, setKey] = useState(0)

  const generate = () => {
    let next = current
    while (next === current) {
      next = compliments[Math.floor(Math.random() * compliments.length)]
    }
    setCurrent(next)
    setKey((k) => k + 1)
    const c = count + 1
    setCount(c)
    if (c === 10) unlock('Compliment Collector')
    playSound('chime')
  }

  return (
    <Section id="compliments">
      <SectionLabel>Compliment Generator</SectionLabel>
      <SectionTitle>Just because</SectionTitle>

      <Reveal delay={0.1} className="mt-10 w-full max-w-lg">
        <div className="glass relative flex min-h-56 flex-col items-center justify-center rounded-[2rem] p-8 text-center shadow-sm">
          <Quote
            className="absolute left-6 top-6 text-primary/25"
            size={30}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={key}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="text-balance font-serif text-2xl leading-snug text-foreground sm:text-3xl"
            >
              {current}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={generate}
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <RefreshCw
              size={18}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
            Generate
          </button>
          {count > 0 && (
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'compliment' : 'compliments'} so far, and
              there are over a hundred more.
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
