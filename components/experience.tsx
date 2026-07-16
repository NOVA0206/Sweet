'use client'

import Lenis from 'lenis'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Butterflies,
  FloatingParticles,
  FloatingPetals,
  GlowSparkles,
  GradientBackdrop,
} from '@/components/atmosphere'
import { CursorTrail } from '@/components/cursor-trail'
import { SectionDivider } from '@/components/section-divider'
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
import { Confession } from '@/components/sections/confession'
import { EndingCelebration } from '@/components/sections/ending-celebration'

export function Experience() {
  const [loaded, setLoaded] = useState(false)
  const [storyUnlocked, setStoryUnlocked] = useState(false)
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

  // Mounts the Confession + Ending Celebration sections underneath the
  // still-visible transition overlay, well before they are actually
  // scrolled into view — so the "next chapter" already exists in the
  // canvas rather than popping in at the last second.
  const mountFinalChapter = useCallback(() => {
    setStoryUnlocked(true)
  }, [])

  // Called once she confirms inside the cinematic overlay; the overlay
  // itself stays on screen while this scroll happens, so the camera move
  // is masked and never reads as an abrupt jump.
  const revealFinalChapter = useCallback(() => {
    scrollTo('#confession')
  }, [scrollTo])

  return (
    <ExperienceProvider>
      <GradientBackdrop />
      <FloatingParticles />
      <FloatingPetals />
      <GlowSparkles />
      <Butterflies />
      <CursorTrail />

      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <MusicPlayer />
      <SmileButton />
      <EasterEggs />

      <main className="relative">
        <Welcome onBegin={() => scrollTo('#story')} />
        <StoryTimeline />
        <SectionDivider index={0} />
        <MemoryGallery />
        <SectionDivider index={1} />
        <VideoSection />
        <MiniGames />
        <SectionDivider index={2} />
        <ComplimentGenerator />
        <div className="relative">
          <MemoryGarden />
          <HiddenHeart className="left-6 top-24" />
        </div>
        <SectionDivider index={3} />
        <FutureAdventures />
        <Letter />
        <SectionDivider index={4} />
        <FinalSurprise
          onChapterClosing={mountFinalChapter}
          onReveal={revealFinalChapter}
        />

        <AnimatePresence>
          {storyUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Confession />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <EndingCelebration />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="relative pb-28 text-center text-xs text-muted-foreground">
          Made with care, just for you.
        </footer>
      </main>
    </ExperienceProvider>
  )
}
