'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'
import {
  Reveal,
  Section,
  SectionLabel,
  SectionTitle,
} from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { loveVideos } from '@/lib/experience-data'

export function VideoSection() {
  const { playSound } = useExperience()
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const active = loveVideos[activeIndex]

  const select = (index: number) => {
    playSound('pop')
    setActiveIndex(index)
    setPlaying(true)
  }

  return (
    <Section id="videos">
      <SectionLabel>Press play</SectionLabel>
      <SectionTitle>Songs that sound like how I feel</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md text-pretty text-center leading-relaxed text-muted-foreground">
          Some things are easier sung than said. These are the ones I keep coming
          back to, thinking of you.
        </p>
      </Reveal>

      {/* Featured player */}
      <Reveal delay={0.15} className="mt-12 w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl">
          <div className="relative aspect-video w-full bg-muted">
            {playing ? (
              <iframe
                key={active.id}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                title={`${active.title} by ${active.artist}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  playSound('chime')
                  setPlaying(true)
                }}
                className="group absolute inset-0 h-full w-full"
                aria-label={`Play ${active.title} by ${active.artist}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${active.id}/hqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const parent = t.parentElement!
                    parent.style.background = 'linear-gradient(135deg, #fce7f3, #f5f3ff)'
                    const label = document.createElement('div')
                    label.className = 'absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center'
                    label.innerHTML = `<p class="font-serif text-lg text-foreground/80">${active.title}</p><p class="text-sm text-muted-foreground">${active.artist}</p>`
                    parent.appendChild(label)
                  }}
                />
                <span className="absolute inset-0 bg-foreground/25" />
                <motion.span
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </motion.span>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1 px-6 py-5 text-center">
            <h3 className="font-serif text-2xl text-foreground">
              {active.title}
            </h3>
            <p className="text-sm text-muted-foreground">{active.artist}</p>
            <p className="mt-2 font-serif text-lg italic text-primary">
              {active.note}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Playlist */}
      <Reveal delay={0.2} className="mt-8 w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {loveVideos.map((video, index) => {
            if (index === activeIndex) return null
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => select(index)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm transition-shadow hover:shadow-md"
                aria-label={`Play ${video.title} by ${video.artist}`}
              >
                <span className="relative block aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const t = e.currentTarget
                      t.style.display = 'none'
                      const parent = t.parentElement!
                      parent.style.background = 'linear-gradient(135deg, #fce7f3, #f5f3ff)'
                      const label = document.createElement('div')
                      label.className = 'absolute inset-0 flex items-center justify-center p-2 text-center'
                      label.innerHTML = `<p class="text-xs font-medium text-foreground/70 leading-tight">${video.title}</p>`
                      parent.appendChild(label)
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </span>
                  </span>
                </span>
                <span className="flex flex-col gap-0.5 px-3 py-2.5">
                  <span className="truncate font-medium text-foreground">
                    {video.title}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {video.artist}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </Reveal>
    </Section>
  )
}
