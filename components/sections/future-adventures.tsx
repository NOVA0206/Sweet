'use client'

import { motion } from 'framer-motion'
import {
  CupSoda,
  Dices,
  IceCreamCone,
  Moon,
  Sunset,
  UtensilsCrossed,
} from 'lucide-react'
import {
  Reveal,
  Section,
  SectionLabel,
  SectionTitle,
} from '@/components/section-shell'
import { useExperience } from '@/components/experience-context'
import { adventures } from '@/lib/experience-data'

const icons = [Sunset, IceCreamCone, CupSoda, Dices, UtensilsCrossed, Moon]
const backLines = [
  'Windows down, your playlist, zero agenda.',
  'Two scoops. Maybe three. No judgment.',
  'The corner seat is ours. I called it.',
  'Loser does the dishes. Prepare to lose.',
  'A little flour on your nose, guaranteed.',
  'Just the sky, and no reason to hurry.',
]

export function FutureAdventures() {
  const { playSound } = useExperience()

  return (
    <Section id="adventures">
      <SectionLabel>Future Adventures</SectionLabel>
      <SectionTitle>Someday, maybe</SectionTitle>
      <Reveal delay={0.1}>
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          Not plans or expectations, just a few ideas I think we&apos;d enjoy.
          Hover to peek. No pressure at all.
        </p>
      </Reveal>

      <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adventures.map((a, i) => {
          const Icon = icons[i % icons.length]
          return (
            <Reveal key={a.title} delay={i * 0.06}>
              <div
                className="group h-full [perspective:1200px]"
                onMouseEnter={() => playSound('pop')}
              >
                <div className="relative h-52 w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* front */}
                  <div className="glass absolute inset-0 flex flex-col rounded-3xl p-6 shadow-sm [backface-visibility:hidden]">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon size={22} />
                    </span>
                    <h3 className="font-serif text-xl text-foreground">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {a.blurb}
                    </p>
                  </div>
                  {/* back */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-primary p-6 text-center text-primary-foreground shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <Icon size={26} className="mb-3 opacity-90" />
                    <p className="text-pretty font-serif text-lg leading-snug">
                      {backLines[i % backLines.length]}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
