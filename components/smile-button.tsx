'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Smile, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { useExperience } from '@/components/experience-context'
import { smileContent } from '@/lib/experience-data'

export function SmileButton() {
  const { playSound, unlock } = useExperience()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<(typeof smileContent)[number] | null>(
    null,
  )
  const bagRef = useRef<number[]>([])
  const countRef = useRef(0)

  const next = useCallback(() => {
    // no-repeat until the "bag" is exhausted, then reshuffle
    if (bagRef.current.length === 0) {
      bagRef.current = smileContent
        .map((_, i) => i)
        .sort(() => Math.random() - 0.5)
    }
    const idx = bagRef.current.pop() as number
    setCurrent(smileContent[idx])
    setOpen(true)
    playSound('pop')
    countRef.current += 1
    if (countRef.current >= 3) unlock('Smile Collector')
  }, [playSound, unlock])

  return (
    <>
      <motion.button
        onClick={next}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="glass fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full py-3 pl-4 pr-5 text-sm font-medium text-primary shadow-lg"
        aria-label="Need a smile? Show me something cute"
      >
        <motion.span
          animate={{ rotate: [0, -12, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <Smile size={18} />
        </motion.span>
        Need a smile?
      </motion.button>

      <AnimatePresence>
        {open && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6 backdrop-blur-sm"
          >
            <motion.div
              key={current.text}
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {current.type === 'meme' && current.src && (
                <div className="relative mx-auto mb-4 aspect-square w-full overflow-hidden rounded-2xl">
                  <Image
                    src={current.src || '/placeholder.svg'}
                    alt={current.alt ?? 'Something cute'}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              )}

              <p className="text-pretty font-serif text-xl leading-snug text-foreground">
                {current.text}
              </p>

              <motion.button
                onClick={next}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md"
              >
                One more
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
