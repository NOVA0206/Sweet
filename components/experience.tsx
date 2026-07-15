'use client'

import Lenis from 'lenis'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Butterflies,
  FloatingParticles,
  GradientBackdrop,
} from '@/components/atmosphere'
import { EasterEggs, HiddenHeart } from '@/components/easter-eggs'
import { ExperienceProvider } from '@/components/experience-context'
import { MusicPlayer } from '@/components/music-player'
import { SmileButton } from '@/components/smile-button'
import { LoadingScreen } from '@/components/sections/loading-screen'
import { Welcome } from '@/components/sections/welcome'
import { StoryTimeline } from '@/components/sections/story-timeline'
import { MemoryGallery } from '@/components/sections/memory-gallery'
import { VideoSection } from '@/components/sections/video-section'
import { MiniGames } from '@/components/sections/mini-games'
import { ComplimentGenerator } from '@/components/sections/compliment-generator'
import { MemoryGarden } from '@/components/sections/memory-garden'
import { FutureAdventures } from '@/components/sections/future-adventures'
import { Letter } from '@/components/sections/letter'
import { FinalSurprise } from '@/components/sections/final-surprise'

export function Experience() {
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  const scrollTo = useCallback((target: string) => {
    const el = document.querySelector(target)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <ExperienceProvider>
      <GradientBackdrop />
      <FloatingParticles />
      <Butterflies />

      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <MusicPlayer />
      <SmileButton />
      <EasterEggs />

      <main className="relative">
        <Welcome onBegin={() => scrollTo('#story')} />
        <StoryTimeline />
        <MemoryGallery />
        <VideoSection />
        <MiniGames />
        <ComplimentGenerator />
        <div className="relative">
          <MemoryGarden />
          <HiddenHeart className="left-6 top-24" />
        </div>
        <FutureAdventures />
        <Letter />
        <FinalSurprise />

        <footer className="relative pb-28 text-center text-xs text-muted-foreground">
          Made with care, just for you.
        </footer>
      </main>
    </ExperienceProvider>
  )
}
