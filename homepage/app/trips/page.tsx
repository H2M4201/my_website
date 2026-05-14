'use client'

import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'

export default function Trips() {
  const trips = [
    {
      id: 1,
      slug: 'tokyo-japan',
      title: 'Tokyo, Japan',
      location: 'Shibuya & Akihabara',
      date: 'Summer 2024',
      description: 'Street food, urban design, and a high-energy cityscape come together in a memorable Tokyo journey.',
    },
    {
      id: 2,
      slug: 'paris-france',
      title: 'Paris, France',
      location: 'Montmartre & Seine',
      date: 'Spring 2024',
      description: 'A blend of refined culture, architecture, cafés, and evening river lights.',
    },
    {
      id: 3,
      slug: 'bali-indonesia',
      title: 'Bali, Indonesia',
      location: 'Ubud & Seminyak',
      date: 'Winter 2023',
      description: 'Tropical scenery, temple rituals, and creative retreats in island paradise.',
    },
  ]

  return (
    <Layout>
      <MainContent>
        <div className="space-y-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Travel Stories</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Discover the travels that shaped my perspective, with curated stories for each destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="group bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">{trip.location}</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{trip.title}</h2>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{trip.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{trip.description}</p>
                <Link
                  href={`/trips/${trip.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                >
                  Read Story
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-medium hover:underline"
          >
            ← Back Home
          </Link>
        </div>
      </MainContent>
    </Layout>
  )
}