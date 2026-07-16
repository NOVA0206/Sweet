'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Heart, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Reveal, Section, SectionLabel, SectionTitle } from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { galleryItems } from '@/lib/experience-data'

function TiltCard({
  index,
  onOpen,
}: {
  index: number
  onOpen: (i: number) => void
}) {
  const item = galleryItems[index]
  const [hover, setHover] = useState(false)

  return (
    <motion.button
      onClick={() => onOpen(index)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ rotate: index % 2 ? 1.5 : -1.5, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="photo-frame group relative mb-4 block w-full overflow-hidden rounded-3xl"
      style={{ aspectRatio: item.tall ? '3 / 4' : '4 / 3' }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${item.hue}, #fffdf8)`,
        }}
      >
        {item.src ? (
          <Image
            src={item.src}
            alt={item.caption}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <Camera size={26} className="text-primary/50" />
        )}
        {/* soft glow wash on hover */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/10 group-hover:opacity-100" />
      </div>

      {/* floating hearts on hover */}
      <AnimatePresence>
        {hover &&
          Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, x: 20 + i * 12 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: i * 0.12, repeat: Infinity }}
              className="pointer-events-none absolute bottom-2 text-primary"
            >
              <Heart size={12} fill="currentColor" />
            </motion.span>
          ))}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-foreground/50 to-transparent p-3 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-sm text-primary-foreground">{item.caption}</p>
      </div>
    </motion.button>
  )
}

export function MemoryGallery() {
  const { playSound } = useExperience()
  const [active, setActive] = useState<number | null>(null)

  const open = (i: number) => {
    setActive(i)
    playSound('pop')
  }

  return (
    <Section id="gallery">
      <SectionLabel>Memory Gallery</SectionLabel>
      <SectionTitle>Moments worth keeping</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          A little wall of my Phulpakhru
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-12 w-full">
        <div className="columns-2 gap-4 sm:columns-3">
          {galleryItems.map((_, i) => (
            <TiltCard key={i} index={i} onOpen={open} />
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/60 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="photo-frame relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground"
              >
                <X size={18} />
              </button>
              <div
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${galleryItems[active].hue}, #fffdf8)`,
                }}
              >
                {galleryItems[active].src ? (
                  <Image
                    src={galleryItems[active].src!}
                    alt={galleryItems[active].caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                  />
                ) : (
                  <Camera size={40} className="text-primary/50" />
                )}
              </div>
              <p className="p-5 text-center font-serif text-lg text-foreground">
                {galleryItems[active].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
