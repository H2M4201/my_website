import 'dotenv/config'
import { prisma } from '../src/db/prisma'

async function main() {
  console.log('Starting database seed...')

  console.log('Clearing existing data...')
  await prisma.section.deleteMany()
  await prisma.contact.deleteMany()

  console.log('Creating sections...')
  const sections = await prisma.section.createMany({
    data: [
      {
        SectionName: 'Resume',
        Description:
          'View my professional experience, education, and technical skills accumulated over decades.',
        Href: '/resume',
      },
      {
        SectionName: 'Trips',
        Description:
          "Discover the amazing places I've traveled and the experiences I've collected around the world.",
        Href: '/trips',
      },
      {
        SectionName: 'Blogs',
        Description: 'Read my thoughts on frontend development, best practices, and industry insights.',
        Href: '/blogs',
      },
      {
        SectionName: 'Recipe',
        Description: 'Explore my favorite recipes and culinary adventures outside of coding.',
        Href: '/recipe',
      },
    ],
  })

  console.log(`✓ Created ${sections.count} sections`)

  console.log('Creating contacts...')
  const contacts = await prisma.contact.createMany({
    data: [
      {
        ContactType: 'Phone',
        ContactInfo: '+1 234 567 890',
        Icon: 'phone',
      },
      {
        ContactType: 'Email',
        ContactInfo: 'your.email@example.com',
        Icon: 'mail',
      },
      {
        ContactType: 'GitHub',
        ContactInfo: 'username',
        Icon: 'github',
      },
      {
        ContactType: 'LinkedIn',
        ContactInfo: 'your-profile-url',
        Icon: 'linkedin',
      },
    ],
  })

  console.log(`✓ Created ${contacts.count} contacts`)
  console.log('✓ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
