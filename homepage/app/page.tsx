import { Layout, MainContent } from '@/components/Layout'
import { HomeHero } from '@/components/HomeHero'
import { SectionCard } from '@/components/SectionCard'
import { SectionCardSkeletonGrid } from '@/components/SectionCardSkeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Phone, Mail } from 'lucide-react'
import { Suspense } from 'react'
import { getAllSections, getAllContacts } from '@/app/api/endpoints'
import type { ContactDTO, SectionDTO } from '@/lib/dto'

/**
 * Home page component with dynamic data from SQL Server
 * Sections and contacts are server-side fetched for better performance & SEO
 */
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <Layout>
      <MainContent>
        {/* Page Header with Animations (client: framer-motion) */}
        <HomeHero />

        {/* About Me Content */}
        <section className="mb-16 max-w-3xl mx-auto text-center">
          <h2 className="section-heading mb-4">
            About Me
          </h2>
          <p className="text-body text-lg">
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
            <div className="h-48 skeleton mb-16" />
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
        <h2 className="section-heading mb-8">Contact</h2>
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
  const iconClassName = contact.icon?.trim() || getFallbackIconClass(contact.type)

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
      className="flex flex-col items-center p-6 card-dark card-dark-hover"
    >
      <div className="w-8 h-8 text-accent mb-3 flex items-center justify-center">
        {iconClassName ? (
          <i className={`${iconClassName} text-2xl`} aria-hidden="true" />
        ) : (
          getFallbackIcon(contact.type)
        )}
      </div>
      <span className="font-medium text-heading capitalize">
        {contact.type}
      </span>
      <span className="text-sm text-muted mt-1 truncate w-full">
        {contact.info}
      </span>
    </a>
  )
}

function getFallbackIcon(contactType: string) {
  switch (contactType.toLowerCase()) {
    case 'phone':
      return <Phone className="w-8 h-8" />
    case 'email':
      return <Mail className="w-8 h-8" />
    default:
      return null
  }
}

function getFallbackIconClass(contactType: string) {
  switch (contactType.toLowerCase()) {
    case 'phone':
      return 'fas-solid fa-phone'
    case 'email':
      return 'fas-solid fa-envelope'
    case 'github':
      return 'fa-brands fa-github'
    case 'linkedin':
      return 'fa-brands fa-linkedin'
    default:
      return ''
  }
}
