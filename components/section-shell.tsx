'use client'

import { motion } from 'framer-motion'
import React, { type ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Section({
  id,
  children,
  className = '',
  style,
}: {
  id: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-24 sm:py-32 ${className}`}
      style={style}
    >
      {children}
    </section>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-secondary-foreground">
        {children}
      </span>
    </Reveal>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Reveal delay={0.05}>
      <h2 className="text-balance text-center font-serif text-3xl leading-tight text-foreground sm:text-5xl">
        {children}
      </h2>
    </Reveal>
  )
}
