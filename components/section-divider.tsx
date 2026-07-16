'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { loveQuotes } from '@/lib/experience-data'

/**
 * A small cinematic divider dropped between existing sections: a heartbeat
 * icon plus a rotating love quote. Purely additive connective tissue — it
 * never replaces or restructures the sections around it.
 */
export function SectionDivider({ index = 0 }: { index?: number }) {
  const quote = loveQuotes[index % loveQuotes.length]

  return (
    <div
      aria-hidden={false}
      className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-6 py-10 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="heartbeat text-primary"
      >
        <Heart size={22} fill="currentColor" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-handwriting text-2xl leading-snug text-primary/90 sm:text-3xl"
      >
        &ldquo;{quote}&rdquo;
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-px w-24 origin-center bg-[color:var(--soft-gold)]/50"
      />
    </div>
  )
}
