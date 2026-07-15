'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Returns true only after the component has mounted on the client. Used to
 * defer random-position rendering so the server and client markup match
 * (avoids hydration mismatches).
 */
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/** Soft rising particles that fill the whole viewport behind everything. */
export function FloatingParticles({ count = 18 }: { count?: number }) {
  const mounted = useMounted()
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 12,
        delay: Math.random() * 16,
        duration: 16 + Math.random() * 14,
        opacity: 0.25 + Math.random() * 0.4,
      })),
    [count],
  )

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-40px] rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background:
              'radial-gradient(circle at 30% 30%, #ffffff, var(--rose-gold))',
            boxShadow: '0 0 12px rgba(183,110,121,0.4)',
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Butterfly({ color }: { color: string }) {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" fill="none">
      <path
        d="M17 15C13 4 4 2 3 8c-1 5 5 9 14 7Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M17 15C21 4 30 2 31 8c1 5-5 9-14 7Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M17 15C13 24 5 26 4 21c-1-4 5-7 13-6Z"
        fill={color}
        opacity="0.65"
      />
      <path
        d="M17 15C21 24 29 26 30 21c1-4-5-7-13-6Z"
        fill={color}
        opacity="0.55"
      />
      <rect x="16" y="7" width="2" height="16" rx="1" fill="#7a4a52" />
    </svg>
  )
}

/** A few butterflies that drift gently across the page. */
export function Butterflies({ count = 4 }: { count?: number }) {
  const mounted = useMounted()
  const colors = ['#b76e79', '#d8b26e', '#e6a3bd', '#c9a0dc']
  const flyers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: 10 + Math.random() * 70,
        left: Math.random() * 90,
        delay: Math.random() * 8,
        duration: 9 + Math.random() * 8,
        color: colors[i % colors.length],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count],
  )

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {flyers.map((f) => (
        <span
          key={f.id}
          className="absolute"
          style={{
            top: `${f.top}%`,
            left: `${f.left}%`,
            animation: `drift ${f.duration}s ease-in-out ${f.delay}s infinite`,
          }}
        >
          <span
            className="block"
            style={{
              animation: `drift ${f.duration * 0.6}s ease-in-out ${f.delay}s infinite`,
            }}
          >
            <Butterfly color={f.color} />
          </span>
        </span>
      ))}
    </div>
  )
}

/** Animated soft gradient wash behind the whole experience. */
export function GradientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20"
      style={{
        background:
          'radial-gradient(60% 50% at 20% 15%, #fce7f3 0%, transparent 60%), radial-gradient(55% 45% at 85% 25%, #f5f3ff 0%, transparent 55%), radial-gradient(70% 60% at 50% 100%, #fff8f0 0%, transparent 60%), var(--ivory)',
      }}
    />
  )
}
