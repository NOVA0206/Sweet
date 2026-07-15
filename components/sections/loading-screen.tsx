'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { loadingMessages } from '@/lib/experience-data'

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, loadingMessages.length - 1))
    }, 2000)
    const done = setTimeout(() => {
      setGone(true)
      setTimeout(onDone, 900)
    }, loadingMessages.length * 2000)
    return () => {
      clearInterval(msgTimer)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 40%, #fce7f3 0%, #f5f3ff 45%, #fffdf8 100%)',
          }}
        >
          {/* glowing lights */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${8 + (i * 7.5) % 90}%`,
                top: `${(i * 37) % 90}%`,
                width: 8 + (i % 4) * 6,
                height: 8 + (i % 4) * 6,
                background:
                  'radial-gradient(circle at 30% 30%, #fff, var(--rose-gold))',
                filter: 'blur(1px)',
              }}
              animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.5 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8 flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Heart size={34} fill="currentColor" />
          </motion.div>

          <div className="h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-lg text-secondary-foreground sm:text-xl"
              >
                {loadingMessages[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-6 h-1.5 w-52 overflow-hidden rounded-full bg-white/50">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: loadingMessages.length * 2,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
