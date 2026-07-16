'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Music, Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useExperience } from './experience-context'

/**
 * Floating glassmorphism music player.
 * Drop MP3 files into /public/music and list them below to enable playback.
 */
const playlist = [
  { title: 'Our Song', artist: 'Add your favorite', src: '/music/track-1.mp3' },
  { title: 'Soft Instrumental', artist: 'Placeholder slot', src: '/music/track-2.mp3' },
  { title: 'Late Night', artist: 'Placeholder slot', src: '/music/track-3.mp3' },
]

export function MusicPlayer() {
  const { muted, toggleMuted, playSound, duckLevel } = useExperience()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [hasAudio, setHasAudio] = useState(true)
  const [volume, setVolume] = useState(0.7)
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume * duckLevel
  }, [volume, duckLevel])

  const fadeTo = (target: number, ms = 500) => {
    const el = audioRef.current
    if (!el) return
    if (fadeRef.current) clearInterval(fadeRef.current)
    const steps = 12
    const start = el.volume
    const delta = (target - start) / steps
    let i = 0
    fadeRef.current = setInterval(() => {
      i += 1
      el.volume = Math.min(1, Math.max(0, start + delta * i))
      if (i >= steps && fadeRef.current) {
        clearInterval(fadeRef.current)
        fadeRef.current = null
      }
    }, ms / steps)
  }

  const togglePlay = async () => {
    playSound('click')
    const el = audioRef.current
    if (!el) return
    if (playing) {
      fadeTo(0, 400)
      setTimeout(() => el.pause(), 420)
      setPlaying(false)
    } else {
      try {
        el.volume = 0
        await el.play()
        setPlaying(true)
        fadeTo(volume, 500)
      } catch {
        setHasAudio(false)
      }
    }
  }

  const next = () => {
    playSound('click')
    setIndex((i) => (i + 1) % playlist.length)
    setPlaying(false)
  }

  const track = playlist[index]

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={next}
        onError={() => setHasAudio(false)}
        loop={false}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="glass w-64 rounded-3xl p-4 shadow-lg"
          >
            <p className="font-serif text-base text-secondary-foreground">
              {track.title}
            </p>
            <p className="text-xs text-muted-foreground">{track.artist}</p>

            {!hasAudio && (
              <p className="mt-2 rounded-xl bg-secondary/60 px-3 py-2 text-[11px] leading-relaxed text-secondary-foreground">
                Add MP3s to{' '}
                <code className="font-mono text-[10px]">/public/music</code> to
                play your shared favorites.
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={togglePlay}
                aria-label={playing ? 'Pause music' : 'Play music'}
                className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={next}
                aria-label="Next track"
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-105"
              >
                <SkipForward size={16} />
              </button>
              <button
                onClick={() => {
                  toggleMuted()
                  playSound('click')
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-105"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <VolumeX size={12} className="shrink-0 text-muted-foreground" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setVolume(v)
                  if (audioRef.current) audioRef.current.volume = v
                }}
                aria-label="Volume"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
              />
              <Volume2 size={12} className="shrink-0 text-muted-foreground" />
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {playlist.map((t, i) => (
                <button
                  key={t.src}
                  onClick={() => {
                    setIndex(i)
                    setPlaying(false)
                    playSound('click')
                  }}
                  className={`rounded-full px-2.5 py-1 text-[10px] transition-colors ${
                    i === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setOpen((o) => !o)
          playSound('click')
        }}
        aria-label="Toggle music player"
        className="glass flex size-14 items-center justify-center rounded-full text-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <motion.span
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            repeat: playing ? Infinity : 0,
            duration: 6,
            ease: 'linear',
          }}
        >
          <Music size={22} />
        </motion.span>
      </button>
    </div>
  )
}
