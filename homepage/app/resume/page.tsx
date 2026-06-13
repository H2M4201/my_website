'use client'

import { useState, useEffect } from 'react'
import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  GraduationCap,
  Code,
  Terminal,
  Calendar,
  MapPin,
  ChevronRight,
  Trophy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { getAllExperiences, getAllExpertiseCategories } from '@/app/api/endpoints'
import type { ExperienceDTO, ExpertiseCategoryDTO } from '@/lib/dto'

function ExperienceCard({ exp, index }: { exp: ExperienceDTO; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const bgColors = ['bg-blue-600', 'bg-blue-400', 'bg-blue-200']
  const textColors = ['text-white', 'text-white', 'text-white']

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className={`timeline-dot ${bgColors[index % bgColors.length]} ${textColors[index % textColors.length]}`}>
        <Briefcase className="w-5 h-5" />
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] timeline-card shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h3 className="font-bold text-xl text-blue-300">{exp.title}</h3>
          <time className="text-sm font-medium text-blue-400 flex items-center gap-1 whitespace-nowrap">
            <Calendar className="w-4 h-4" /> {exp.period}
          </time>
        </div>
        <div className="flex items-center text-white gap-1 text-muted mb-4 text-sm font-medium">
          <MapPin className="w-4 h-4" /> {exp.company}
        </div>

        {/* Skills always visible */}
        {exp.skills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {exp.skills.map((skill) => (
              <span key={skill.id} className="tag">
                {skill.skill}
              </span>
            ))}
          </div>
        )}

        {/* Show Detail / Hide button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-400 transition-colors mb-2"
        >
          {isOpen ? (
            <>Hide Details <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show Details <ChevronDown className="w-4 h-4" /></>
          )}
        </button>

        {/* Collapsible content */}
        {isOpen && (
          <div className="animate-fadeIn">
            <ul className="space-y-2 text-body text-sm">
              {exp.jobDescriptions.map((jd) => (
                <li key={jd.id} className="flex gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{jd.description}</span>
                </li>
              ))}
            </ul>
            {exp.achievement && (
              <div className="mt-4 pt-4 border-t border-blue-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold uppercase text-yellow-500 tracking-wider">Key Achievement</span>
                </div>
                <p className="text-sm text-muted text-white italic">{exp.achievement}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ExperienceTimeline({ experiences }: { experiences: ExperienceDTO[] }) {
  return (
    <section className="resume-section-alt">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="section-heading mb-12 flex items-center gap-3">
          <Briefcase className="w-8 h-8" />
          Professional Experience
        </h2>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 timeline-line">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExpertiseGrid({ categories }: { categories: ExpertiseCategoryDTO[] }) {
  return (
    <section className="resume-section-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="section-heading mb-12 flex items-center gap-3">
          <GraduationCap className="w-8 h-8" />
          Skill
        </h2>

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          Education Card
          <div className="education-card">
            <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              Education
            </h3>
            <div className="space-y-6">
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <h4 className="font-bold text-lg text-blue-300">Bachelor of IT</h4>
                <p className="text-sm text-muted">Ho Chi Minh City University of Science</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="tag">GPA: 7.78/10</span>
                </div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4 py-1">
                <h4 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
                  TOEIC 905
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </h4>
                <p className="text-sm text-muted">High proficiency in English communication</p>
              </div>
            </div>
          </div> */}

          {/* Expertise Category Cards */}
          {categories.map((cat) => (
            <div key={cat.id} className="expertise-card">
              <h3 className="text-heading text-lg font-bold mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span key={skill.id} className="tag-skill">
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        {/* </div> */}
      </div>
    </section>
  )
}

export default function Resume() {
  const [experiences, setExperiences] = useState<ExperienceDTO[]>([])
  const [expertiseCategories, setExpertiseCategories] = useState<ExpertiseCategoryDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [expData, catData] = await Promise.all([
          getAllExperiences(),
          getAllExpertiseCategories(),
        ])
        setExperiences(expData)
        setExpertiseCategories(catData)
      } catch (error) {
        console.error('[Resume] Failed to fetch resume data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <MainContent>
        {/* Hero / About Me Section */}
        <section className="resume-hero">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-accent mb-6 tracking-tight">Resume</h1>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-900/30 shadow-xl shadow-blue-500/5">
              <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                About Me
              </h2>
              <p className="text-lg text-body leading-relaxed">
                An <span className="text-accent font-medium">IT Support Engineer with 2 years of experience</span>,
                and a career goal of becoming IT Operation Manager in the next 5 years. Good at troubleshooting,
                team work, and delivering support in accordance with SLA with high satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <ExperienceTimeline experiences={experiences} />

        {/* Side Projects Section */}
        <section className="resume-section-zinc">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="section-heading mb-12 flex items-center gap-3">
              <Code className="w-8 h-8" />
              Side Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">

              <Card className="project-card">
                <div className="h-2 bg-blue-600 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-heading text-xl font-bold">Online Ticket Selling</CardTitle>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-900/40 text-blue-300 rounded uppercase">Graduation Project</span>
                  </div>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Mar 2024 - Jul 2024
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-body mb-4 leading-relaxed">
                    A comprehensive platform allowing event organizers to manage events and sell tickets,
                    while users can browse, purchase, and rate events.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Python Flask', 'Postman', 'REST API', 'JSON'].map(tag => (
                      <span key={tag} className="tag-project">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="project-card">
                <div className="h-2 bg-emerald-500 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-heading text-xl font-bold">Meal Planning App</CardTitle>
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-900/40 text-emerald-300 rounded uppercase">Personal Project</span>
                  </div>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Dec 2025 - Feb 2026
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-body mb-4 leading-relaxed">
                    An Android application for weekly meal planning, grocery list management,
                    and inventory tracking using MVVM architecture.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Kotlin', 'Jetpack Compose', 'Room', 'Android', 'SQLite'].map(tag => (
                      <span key={tag} className="tag-project">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Education & Skills Section */}
        <ExpertiseGrid categories={expertiseCategories} />

        {/* Call to Action / Back Home */}
        <div className="flex justify-center py-20 border-t border-zinc-800">
          <Link href="/">
            <Button variant="outline" className="px-8 py-6 text-lg rounded-full group transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600">
              <span className="mr-2 group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Back to Home
            </Button>
          </Link>
        </div>
      </MainContent>
    </Layout>
  )
}