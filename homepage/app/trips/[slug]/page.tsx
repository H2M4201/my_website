

import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'

const trips = [
  {
    slug: 'tokyo-japan',
    title: 'Tokyo, Japan',
    location: 'Shibuya · Akihabara · Asakusa',
    date: 'Summer 2024',
    summary: 'A dynamic blend of neon-lit streets, elevated cuisine, and cultural contrasts. This trip captured the future-ready energy of Tokyo while staying deeply rooted in tradition.',
    highlights: [
      'Sunset at Shibuya Crossing and immersive street ramen.',
      'Explored Akihabara’s tech streets and the latest Japanese design.',
      'Found calm moments at Senso-ji Temple and Asakusa riverside cafes.',
    ],
    details: [
      'Built a visual travel story around the contrast between modern district life and historical temples.',
      'Captured how design systems and user flows translate into real-world journeys.',
      'Noted the influence of Japanese minimalism on my frontend design aesthetic.',
    ],
  },
  {
    slug: 'paris-france',
    title: 'Paris, France',
    location: 'Montmartre · Seine · Le Marais',
    date: 'Spring 2024',
    summary: 'Elegant architecture, vibrant street cafés, and creative inspiration at every corner. Paris was a study in rhythm, light, and storytelling through design.',
    highlights: [
      'Wandered through Montmartre, stopping at galleries and hidden courtyards.',
      'Captured golden-hour light along the Seine with a design-focused lens.',
      'Explored modern French cafés that blend hospitality and minimal UX.',
    ],
    details: [
      'Used the trip as inspiration for more polished typography and whitespace in portfolio layouts.',
      'Observed how Parisian branding balances craft, luxury, and clarity.',
      'Noted the importance of atmosphere in product presentation and storytelling.',
    ],
  },
  {
    slug: 'bali-indonesia',
    title: 'Bali, Indonesia',
    location: 'Ubud · Seminyak · Canggu',
    date: 'Winter 2023',
    summary: 'A sensory-rich escape into tropical culture, nature, and mindful creativity. Bali inspired fresh color palettes, legacy systems, and calm motion design.',
    highlights: [
      'Explored rice terraces and village temples in Ubud’s lush landscapes.',
      'Tasted local street food and learned about island culinary rituals.',
      'Found inspiration in Balinese craftsmanship, patterns, and natural materials.',
    ],
    details: [
      'Collected references for relaxed page pacing and immersive storytelling.',
      'Refined how to balance bold visuals with approachable layouts.',
      'Applied lessons in contrast and texture to responsive portfolio components.',
    ],
  },
]

export function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }))
}

interface TripPageProps {
  params: {
    slug: string
  }
}

export default function TripDetail({ params: { slug } }: TripPageProps) {
  const trip = trips.find((item) => item.slug === slug)

  if (!trip) {
    return (
      <Layout>
        <MainContent>
          <div className="max-w-3xl mx-auto text-center py-24">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Trip not found</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">The story you are looking for has not been published yet.</p>
            <Link href="/trips" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Back to Trips
            </Link>
          </div>
        </MainContent>
      </Layout>
    )
  }

  return (
    <Layout>
      <MainContent>
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-slate-900 to-purple-700 px-8 py-12 md:px-14 md:py-16">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200 mb-4">Travel story</p>
              <h1 className="text-5xl font-semibold tracking-tight mb-4">{trip.title}</h1>
              <p className="text-lg text-slate-200 max-w-3xl">{trip.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">{trip.location}</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">{trip.date}</span>
              </div>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <article className="space-y-8">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">What made this trip special</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  This journey blends cultural discovery and design inspiration. Each destination contributed new ideas for motion, typography, and spatial hierarchy in digital experiences.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Highlights</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                  {trip.highlights.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Design notes</h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                  {trip.details.map((note) => (
                    <li key={note} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">{note}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Next steps</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Apply the visual and interaction ideas from this story to future portfolio pieces, product case studies, and travel-inspired design systems.
                </p>
              </div>
              <Link
                href="/trips"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
              >
                Back to Trips
              </Link>
            </aside>
          </div>
        </div>
      </MainContent>
    </Layout>
  )
}
