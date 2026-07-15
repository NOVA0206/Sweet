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
  const { muted, toggleMuted, playSound } = useExperience()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [hasAudio, setHasAudio] = useState(true)

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  const togglePlay = async () => {
    playSound('click')
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      try {
        await el.play()
        setPlaying(true)
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
