'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Gamepad2, Heart, Search, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal, Section, SectionLabel, SectionTitle } from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { compliments, quiz } from '@/lib/experience-data'

type Tab = 'catch' | 'quiz' | 'find'

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: 'catch', label: 'Catch Hearts', icon: Heart },
  { id: 'quiz', label: 'Quiz', icon: Sparkles },
  { id: 'find', label: 'Find Hearts', icon: Search },
]

function CatchHearts() {
  const { playSound, unlock } = useExperience()
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(20)
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [reward, setReward] = useState<string | null>(null)
  const idRef = useRef(0)

  const start = () => {
    playSound('chime')
    setRunning(true)
    setScore(0)
    setTime(20)
    setReward(null)
  }

  useEffect(() => {
    if (!running) return
    const spawn = setInterval(() => {
      const id = idRef.current++
      setHearts((h) => [
        ...h,
        { id, x: 8 + Math.random() * 80, y: 12 + Math.random() * 72 },
      ])
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 1600)
    }, 650)
    const tick = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(tick)
          clearInterval(spawn)
          setRunning(false)
          setHearts([])
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      clearInterval(spawn)
      clearInterval(tick)
    }
  }, [running])

  const catchHeart = (id: number) => {
    setHearts((h) => h.filter((x) => x.id !== id))
    setScore((s) => {
      const next = s + 1
      if (next === 5) unlock('Heart Catcher')
      return next
    })
    setReward(compliments[Math.floor(Math.random() * compliments.length)])
    playSound('pop')
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Caught: {score}</span>
        <span>{running ? `${time}s left` : 'Ready when you are'}</span>
      </div>
      <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-border bg-cream/50">
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            {reward ? (
              <p className="max-w-xs text-pretty font-serif text-lg text-secondary-foreground">
                {reward}
              </p>
            ) : (
              <p className="max-w-xs text-sm text-muted-foreground">
                Catch the floating hearts. Each one unlocks a little compliment.
              </p>
            )}
            <button
              onClick={start}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {reward ? 'Play again' : 'Start'}
            </button>
          </div>
        )}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.button
              key={h.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => catchHeart(h.id)}
              className="absolute text-primary"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label="Catch heart"
            >
              <Heart size={30} fill="currentColor" />
            </motion.button>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {running && reward && (
            <motion.p
              key={reward}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass absolute inset-x-4 bottom-3 rounded-2xl px-4 py-2 text-center text-xs text-secondary-foreground"
            >
              {reward}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Quiz() {
  const { playSound, unlock } = useExperience()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const item = quiz[i]

  const pick = (idx: number) => {
    setPicked(idx)
    playSound('chime')
    if (i === quiz.length - 1) unlock('Quiz Champ')
  }

  const nextQ = () => {
    setPicked(null)
    setI((v) => (v + 1) % quiz.length)
    playSound('click')
  }

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-border bg-cream/50 p-6 text-center">
      <span className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
        Question {i + 1} of {quiz.length}
      </span>
      <h3 className="mb-6 font-serif text-2xl text-foreground">{item.q}</h3>
      <div className="flex w-full max-w-xs flex-col gap-2">
        {item.options.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => pick(idx)}
            disabled={picked !== null}
            className={`rounded-full px-5 py-2.5 text-sm transition-all ${
              picked === idx
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary disabled:opacity-60'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex flex-col items-center gap-3"
          >
            <p className="text-pretty text-sm text-secondary-foreground">
              {item.reply}
            </p>
            <button
              onClick={nextQ}
              className="rounded-full bg-accent px-5 py-2 text-xs font-medium text-accent-foreground transition-transform hover:scale-105"
            >
              Next question
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FindHearts() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-cream/50 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
        <Search className="text-primary" size={24} />
      </span>
      <h3 className="font-serif text-xl text-foreground">Find the hidden hearts</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        There are faint little hearts tucked into the corners of this
        experience. Tap around as you explore. Each one you find reveals a sweet
        note, and unlocks an achievement.
      </p>
      <p className="text-xs text-muted-foreground">
        Hint: try tapping the logo five times, and swiping left or right.
      </p>
    </div>
  )
}

export function MiniGames() {
  const { playSound } = useExperience()
  const [tab, setTab] = useState<Tab>('catch')

  const switchTab = useCallback(
    (t: Tab) => {
      setTab(t)
      playSound('click')
    },
    [playSound],
  )

  return (
    <Section id="games">
      <SectionLabel>
        <Gamepad2 size={14} /> Mini Games
      </SectionLabel>
      <SectionTitle>A little play</SectionTitle>

      <Reveal delay={0.1} className="mt-8 w-full max-w-xl">
        <div className="mb-6 flex justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  tab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'catch' && <CatchHearts />}
            {tab === 'quiz' && <Quiz />}
            {tab === 'find' && <FindHearts />}
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}
