import 'dotenv/config'
import { prisma } from '../src/db/prisma'
import bcrypt from 'bcryptjs'

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

  // Seed admin user (upsert to avoid duplicates on re-seed)
  console.log('Creating admin user...')
  const hashedPassword = bcrypt.hashSync('admin123', 10)
  
  // Check if admin user already exists
  const existingUser = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
    'SELECT id FROM AdminUser WHERE username = @P1',
    'admin'
  )
  
  if (existingUser.length === 0) {
    const now = new Date().toISOString()
    const adminUser = await prisma.$executeRawUnsafe(
      'INSERT INTO AdminUser (username, password, email, name, passwordChangedAt, createdAt, updatedAt, failedLoginAttempts) VALUES (@P1, @P2, @P3, @P4, @P5, @P6, @P7, @P8)',
      'admin',
      hashedPassword,
      'admin@example.com',
      'Administrator',
      now,
      now,
      now,
      0
    )
    console.log('✓ Admin user created (username: admin, password: admin123)')
  } else {
    console.log('✓ Admin user already exists (username: admin)')
  }

  // ===== Seed Resume/Experience Data =====
  console.log('Creating experience data...')
  await prisma.experience.deleteMany()
  await prisma.jobDescription.deleteMany()
  await prisma.experienceSkill.deleteMany()
  await prisma.expertiseCategory.deleteMany()
  await prisma.expertiseSkill.deleteMany()

  // Experience 1: Keppel Vietnam
  const exp1 = await prisma.experience.create({
    data: {
      Title: 'Application Support Specialist',
      Company: 'Keppel Vietnam',
      Period: 'Nov 2024 - Now',
      Achievement: 'Take part and contribute in development and release of 4 new applications, and 2 critical system\'s migration projects.',
      IsActive: true,
      SortOrder: 0,
      jobDescriptions: {
        create: [
          { Description: 'Act as the first contact point for business users regarding issues with critical business applications like E-Invoice, Sales and other internal systems.', SortOrder: 0 },
          { Description: 'Ensure applications run smoothly and consistently with minimal downtime, meet business requirements, security and compliance regulations.', SortOrder: 1 },
          { Description: 'Identify, diagnose and resolve technical issues related to software applications. Coordinate with developers, vendors and Infra team.', SortOrder: 2 },
          { Description: 'Propose application changes/modifications to enhance security, as well as operation and user experience.', SortOrder: 3 },
        ],
      },
      skills: {
        create: [
          { Skill: 'AWS', SortOrder: 0 },
          { Skill: '.NET', SortOrder: 1 },
          { Skill: 'Network', SortOrder: 2 },
          { Skill: 'XML', SortOrder: 3 },
          { Skill: 'ServiceNow', SortOrder: 4 },
        ],
      },
    },
  })

  // Experience 2: HQSOFT Vietnam
  const exp2 = await prisma.experience.create({
    data: {
      Title: 'L2 Application Support',
      Company: 'HQSOFT Vietnam',
      Period: 'Sep 2024 - Jun 2025',
      Achievement: 'Handle roughly 20% of total monthly escalated tickets, with SLA-met ratio hits 90%.',
      IsActive: true,
      SortOrder: 1,
      jobDescriptions: {
        create: [
          { Description: 'L2 support for Retail system with around 2000 active users (Project-based contract).', SortOrder: 0 },
          { Description: 'Handle incidents escalated by L1 by inspecting data records, reviewing logs, and writing SQL queries to update database.', SortOrder: 1 },
          { Description: 'Work with developer team in writing automation scripts to reduce team effort on repetitive tasks.', SortOrder: 2 },
        ],
      },
      skills: {
        create: [
          { Skill: 'SQL', SortOrder: 0 },
          { Skill: 'Python', SortOrder: 1 },
          { Skill: 'Scripting', SortOrder: 2 },
          { Skill: 'SLA Management', SortOrder: 3 },
          { Skill: 'SaaS', SortOrder: 4 },
        ],
      },
    },
  })

  // Experience 3: iTechwx
  const exp3 = await prisma.experience.create({
    data: {
      Title: 'Technical Support Engineer',
      Company: 'iTechwx Co., Ltd',
      Period: 'Aug 2023 - Jun 2024',
      Achievement: 'Handle 120 tickets in 6 months, 70% are high severity that require 24x7 support.',
      IsActive: true,
      SortOrder: 2,
      jobDescriptions: {
        create: [
          { Description: 'Provide L1 support (100% in English) on behalf of Microsoft for worldwide enterprises.', SortOrder: 0 },
          { Description: 'Troubleshoot and analyze root cause for Windows Server performance issues following a systematic approach.', SortOrder: 1 },
          { Description: 'Utilize internal ticketing system to keep track of handle status and document progress for knowledge base.', SortOrder: 2 },
        ],
      },
      skills: {
        create: [
          { Skill: 'Windows Server', SortOrder: 0 },
          { Skill: 'Active Directory', SortOrder: 1 },
          { Skill: 'Troubleshooting', SortOrder: 2 },
        ],
      },
    },
  })

  console.log(`✓ Created 3 experiences`)

  // Seed Expertise Categories
  console.log('Creating expertise categories...')

  const cat1 = await prisma.expertiseCategory.create({
    data: {
      Category: 'Support',
      SortOrder: 0,
      skills: {
        create: [
          { Skill: 'SLA Management', SortOrder: 0 },
          { Skill: 'Troubleshooting', SortOrder: 1 },
          { Skill: 'Documentation', SortOrder: 2 },
        ],
      },
    },
  })

  const cat2 = await prisma.expertiseCategory.create({
    data: {
      Category: 'Systems',
      SortOrder: 1,
      skills: {
        create: [
          { Skill: 'AWS', SortOrder: 0 },
          { Skill: 'Windows Server', SortOrder: 1 },
          { Skill: 'SQL', SortOrder: 2 },
          { Skill: 'Networks', SortOrder: 3 },
        ],
      },
    },
  })

  const cat3 = await prisma.expertiseCategory.create({
    data: {
      Category: 'Development',
      SortOrder: 2,
      skills: {
        create: [
          { Skill: 'Python', SortOrder: 0 },
          { Skill: 'React', SortOrder: 1 },
          { Skill: 'Kotlin', SortOrder: 2 },
          { Skill: 'SQL', SortOrder: 3 },
          { Skill: '.NET', SortOrder: 4 },
          { Skill: 'XML', SortOrder: 5 },
          { Skill: 'REST API', SortOrder: 6 },
        ],
      },
    },
  })

  console.log('✓ Created 3 expertise categories with skills')
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
