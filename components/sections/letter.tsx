'use client'

import { motion, useInView } from 'framer-motion'
import { Feather } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Section, SectionLabel } from '@/components/section-shell'

const letterText = `Dear Sharwari,

I made this little corner of the internet just for you, one piece at a time, thinking about your smile the whole way through.

Thank you for coming into my life. I'm genuinely happy we met.

I'm looking forward to getting to know you better, at whatever pace feels right. And i will always be here just loving you unconditionally.

Always,`

export function Letter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= letterText.length) {
          clearInterval(id)
          return s
        }
        return s + 1
      })
    }, 28)
    return () => clearInterval(id)
  }, [inView])

  const done = shown >= letterText.length

  return (
    <Section id="letter">
      <SectionLabel>
        <Feather size={14} /> A Letter
      </SectionLabel>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, rotateX: 12, y: 30 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 w-full max-w-xl"
        style={{ perspective: 1000 }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] bg-card p-8 shadow-xl sm:p-12">
          {/* notebook lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 37px, var(--border) 37px, var(--border) 38px)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-10 top-0 h-full w-px bg-primary/20"
          />

          <p className="relative whitespace-pre-line font-serif text-lg italic leading-[38px] text-foreground sm:text-xl">
            {letterText.slice(0, shown)}
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block"
              >
                |
              </motion.span>
            )}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative mt-2 font-serif text-2xl italic text-primary"
          >
            Yours Jeevan.
          </motion.p>
        </div>
      </motion.div>
    </Section>
  )
}
