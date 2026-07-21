'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Award, Heart, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useExperience } from './experience-context'
import { hiddenHeartMessages } from '@/lib/experience-data'

const logoMessages = [
  'Okay, curious one. I like that.',
  'Still tapping? You are adorable.',
  'You found a secret. Achievement unlocked.',
]

export function EasterEggs() {
  const { playSound, unlock, achievements } = useExperience()
  const [logoTaps, setLogoTaps] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [showBadges, setShowBadges] = useState(false)
  const [funny, setFunny] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flash = useCallback(
    (msg: string) => {
      setToast(msg)
      playSound('chime')
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 3200)
    },
    [playSound],
  )

  const handleLogo = () => {
    const next = logoTaps + 1
    setLogoTaps(next)
    playSound('pop')
    if (next === 5) {
      flash(logoMessages[Math.floor(Math.random() * logoMessages.length)])
      unlock('Secret Tapper')
      setLogoTaps(0)
    }
  }

  // Swipe gestures (mobile) + arrow keys (desktop)
  useEffect(() => {
    let startX = 0
    let startY = 0
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) < 90 || Math.abs(dy) > 60) return
      if (dx < 0) {
        flash(
          hiddenHeartMessages[
            Math.floor(Math.random() * hiddenHeartMessages.length)
          ],
        )
        unlock('Swipe Whisperer')
      } else {
        setFunny(true)
        unlock('Swipe Whisperer')
        setTimeout(() => setFunny(false), 2600)
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [flash, unlock])

  return (
    <>
      {/* Logo top-left */}
      <button
        onClick={handleLogo}
        aria-label="Tap the logo"
        className="glass fixed z-50 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
        style={{
          top: 'max(1rem, env(safe-area-inset-top))',
          left: 'max(1rem, env(safe-area-inset-left))',
        }}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Heart size={16} fill="currentColor" />
        </span>
        <span className="font-serif text-sm text-secondary-foreground">
          For Sharwari
        </span>
      </button>

      {/* Achievements toggle */}
      <button
        onClick={() => {
          setShowBadges((s) => !s)
          playSound('click')
        }}
        aria-label="View achievements"
        className="glass fixed z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-secondary-foreground shadow-sm transition-transform hover:scale-[1.03]"
        style={{
          top: 'max(4.5rem, calc(4.5rem + env(safe-area-inset-top)))',
          left: 'max(1rem, env(safe-area-inset-left))',
        }}
      >
        <Award size={14} />
        {achievements.length}
      </button>

      <AnimatePresence>
        {showBadges && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass fixed z-50 w-56 rounded-3xl p-4 shadow-lg"
            style={{
              top: 'max(7rem, calc(7rem + env(safe-area-inset-top)))',
              left: 'max(1rem, env(safe-area-inset-left))',
            }}
          >
            <p className="mb-2 font-serif text-sm text-secondary-foreground">
              Achievements
            </p>
            {achievements.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Explore, tap, and swipe to discover secrets.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {achievements.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-1.5 text-xs text-secondary-foreground"
                  >
                    <Sparkles size={13} className="text-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="glass fixed left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm text-secondary-foreground shadow-lg"
            style={{ top: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-top)))' }}
          >
            <Sparkles size={16} className="text-accent" />
            <span className="max-w-[70vw] text-pretty">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Funny swipe-right burst */}
      <AnimatePresence>
        {funny && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  opacity: 0,
                  scale: 1.4,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="absolute text-3xl"
              >
                <Heart className="text-primary" fill="currentColor" />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** A tiny hidden heart sections can scatter. Reveals a sweet message on tap. */
export function HiddenHeart({
  className = '',
  message,
}: {
  className?: string
  message?: string
}) {
  const { playSound, unlock } = useExperience()
  const [found, setFound] = useState(false)
  const [show, setShow] = useState(false)
  const msg =
    message ??
    hiddenHeartMessages[Math.floor(Math.random() * hiddenHeartMessages.length)]

  return (
    <span className={`absolute z-30 ${className}`}>
      <button
        aria-label="A hidden heart"
        onClick={() => {
          setFound(true)
          setShow((s) => !s)
          playSound('chime')
          unlock('Heart Hunter')
        }}
        className={`transition-opacity ${found ? 'opacity-100' : 'opacity-25 hover:opacity-70'}`}
      >
        <Heart
          size={18}
          className="text-primary drop-shadow"
          fill={found ? 'currentColor' : 'none'}
        />
      </button>
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            className="glass absolute left-1/2 top-6 z-40 w-44 -translate-x-1/2 rounded-2xl px-3 py-2 text-center text-[11px] leading-relaxed text-secondary-foreground shadow-lg"
          >
            {msg}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
