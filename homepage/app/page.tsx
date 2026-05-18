import { Layout, MainContent } from '@/components/Layout'
import { HomeHero } from '@/components/HomeHero'
import { SectionCard } from '@/components/SectionCard'
import { SectionCardSkeletonGrid } from '@/components/SectionCardSkeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Phone, Mail } from 'lucide-react'
import { Suspense } from 'react'
import { getAllSections, getAllContacts } from '@/lib/api'
import type { ContactDTO, SectionDTO } from '@/lib/dto'

/**
 * Home page component with dynamic data from SQL Server
 * Sections and contacts are server-side fetched for better performance & SEO
 */
export default function Home() {
  return (
    <Layout>
      <MainContent>
        {/* Page Header with Animations (client: framer-motion) */}
        <HomeHero />

        {/* About Me Content */}
        <section className="mb-16 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">
            About Me
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            I am a passionate frontend developer with 30 years of experience building beautiful,
            performant, and accessible web applications. My journey has taken me through countless
            projects, teams, and technologies, always with a focus on user experience and code
            quality.
          </p>
        </section>

        {/* Section Cards - Dynamic */}
        <Suspense fallback={<SectionCardSkeletonGrid count={4} />}>
          <SectionGridServer />
        </Suspense>

        {/* Contact Content - Dynamic */}
        <Suspense
          fallback={
            <div className="h-48 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse mb-16" />
          }
        >
          <ContactGridServer />
        </Suspense>
      </MainContent>
    </Layout>
  )
}

async function SectionGridServer() {
  try {
    const sections = await getAllSections()

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            title={section.title}
            description={section.description || ''}
            href={section.href || '#'}
            images={[]} // TODO: extend schema to support images
          />
        ))}
      </div>
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load sections'
    return (
      <ErrorBoundary message={message} section="sections" />
    )
  }
}

async function ContactGridServer() {
  try {
    const contacts = await getAllContacts()

    return (
      <section id="contact" className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-300">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load contacts'
    return (
      <ErrorBoundary message={message} section="contacts" />
    )
  }
}

function ContactCard({ contact }: { contact: ContactDTO }) {
  const IconComponent = getIconComponent(contact.type)

  const getHref = () => {
    switch (contact.type.toLowerCase()) {
      case 'phone':
        return `tel:${contact.info}`
      case 'email':
        return `mailto:${contact.info}`
      case 'github':
        return `https://github.com/${contact.info}`
      case 'linkedin':
        return `https://linkedin.com/in/${contact.info}`
      default:
        return '#'
    }
  }

  const isExternal = contact.type !== 'phone' && contact.type !== 'email'

  return (
    <a
      href={getHref()}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-slate-100 dark:border-zinc-700"
    >
      <div className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3">{IconComponent}</div>
      <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
        {contact.type}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate w-full">
        {contact.info}
      </span>
    </a>
  )
}

function getIconComponent(type: string) {
  switch (type.toLowerCase()) {
    case 'phone':
      return <Phone className="w-8 h-8" />
    case 'email':
      return <Mail className="w-8 h-8" />
    case 'github':
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 7.43c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
        </svg>
      )
    default:
      return null
  }
}
