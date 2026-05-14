'use client'

import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Terminal, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Database,
  Globe,
  Smartphone,
  CheckCircle2,
  Trophy,
  Languages
} from 'lucide-react'

export default function Resume() {
  return (
    <Layout>
      <MainContent>
        {/* Hero / About Me Section */}
        <section className="w-full py-20 bg-gradient-to-b from-blue-50/80 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 tracking-tight">Resume</h1>
            <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 dark:border-zinc-700 shadow-xl shadow-blue-500/5">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                About Me
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                An <span className="text-blue-700 dark:text-blue-400 font-medium">IT Support Engineer with 2 years of experience</span>, 
                and a career goal of becoming IT Operation Manager in the next 5 years. Good at troubleshooting, 
                team work, and delivering support in accordance with SLA with high satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="w-full py-16 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-600" />
              Professional Experience
            </h2>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 before:to-transparent dark:before:via-blue-900">
              
              {/* Experience 1: Keppel Vietnam */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-800 p-6 rounded-xl border border-blue-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100">Application Support Specialist</h3>
                    <time className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Nov 2024 - Now
                    </time>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> Keppel Vietnam
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Act as the first contact point for business users regarding issues with critical business applications like E-Invoice, Sales and other internal systems.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Ensure applications run smoothly and consistently with minimal downtime, meet business requirements, security and compliance regulations.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Identify, diagnose and resolve technical issues related to software applications. Coordinate with developers, vendors and Infra team.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Propose application changes/modifications to enhance security, as well as operation and user experience.</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-blue-50 dark:border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Key Achievement</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Take part and contribute in development and release of 4 new applications, and 2 critical system's migration projects.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['AWS', '.NET', 'Network', 'XML', 'ServiceNow'].map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience 2: HQSOFT Vietnam */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-800 p-6 rounded-xl border border-blue-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100">L2 Application Support</h3>
                    <time className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Sep 2024 - Jun 2025
                    </time>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> HQSOFT Vietnam
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>L2 support for Retail system with around 2000 active users (Project-based contract).</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Handle incidents escalated by L1 by inspecting data records, reviewing logs, and writing SQL queries to update database.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Work with developer team in writing automation scripts to reduce team effort on repetitive tasks.</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-blue-50 dark:border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Key Achievement</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Handle roughly 20% of total monthly escalated tickets, with SLA-met ratio hits 90%.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['SQL', 'Python', 'Scripting', 'SLA Management', 'SaaS'].map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience 3: iTechwx */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-200 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-800 p-6 rounded-xl border border-blue-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100">Technical Support Engineer</h3>
                    <time className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Aug 2023 - Jun 2024
                    </time>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> iTechwx Co., Ltd
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Provide L1 support (100% in English) on behalf of Microsoft for worldwide enterprises.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Troubleshoot and analyze root cause for Windows Server performance issues following a systematic approach.</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Utilize internal ticketing system to keep track of handle status and document progress for knowledge base.</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-blue-50 dark:border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Key Achievement</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Handle 120 tickets in 6 months, 70% are high severity that require 24x7 support.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Windows Server', 'Active Directory', 'Troubleshooting'].map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Side Projects Section */}
        <section className="w-full py-20 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 flex items-center gap-3">
              <Code className="w-8 h-8 text-blue-600" />
              Side Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-zinc-900">
                <div className="h-2 bg-blue-600 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">Online Ticket Selling</CardTitle>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded uppercase">Graduation Project</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Mar 2024 - Jul 2024
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    A comprehensive platform allowing event organizers to manage events and sell tickets, 
                    while users can browse, purchase, and rate events.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                      <Globe className="w-3 h-3" /> Tech Stack:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Python Flask', 'Postman', 'REST API', 'JSON'].map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-zinc-900">
                <div className="h-2 bg-emerald-500 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">Meal Planning App</CardTitle>
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded uppercase">Personal Project</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Dec 2025 - Feb 2026
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    An Android application for weekly meal planning, grocery list management, 
                    and inventory tracking using MVVM architecture.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <Smartphone className="w-3 h-3" /> Tech Stack:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Kotlin', 'Jetpack Compose', 'Room', 'Android', 'SQLite'].map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* Education & Skills Section */}
        <section className="w-full py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-16">
            
            {/* Education */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Education
              </h2>
              <div className="space-y-8">
                <div className="border-l-2 border-blue-500 pl-4 py-1">
                  <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Bachelor of IT</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ho Chi Minh City University of Science</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">GPA: 7.78/10</span>
                  </div>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4 py-1">
                  <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    TOEIC 905
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">High proficiency in English communication</p>
                </div>
              </div>
            </div>

            {/* Core Skills */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                Expertise
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Support</h4>
                  <div className="flex flex-col gap-2">
                    {['SLA Management', 'Troubleshooting', 'Documentation'].map(skill => (
                      <div key={skill} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Systems</h4>
                  <div className="flex flex-col gap-2">
                    {['AWS', 'Windows Server', 'SQL', 'Networks'].map(skill => (
                      <div key={skill} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Development</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'React', 'Kotlin', 'SQL', '.NET', 'XML', 'REST API'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold rounded uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Call to Action / Back Home */}
        <div className="flex justify-center py-20 border-t border-zinc-100 dark:border-zinc-800">
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
