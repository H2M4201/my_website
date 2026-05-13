'use client'


import { NavBar, NavBrand, NavLinks, NavLinkItem } from '@/components/NavBar'
import { Layout, MainContent } from '@/components/Layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Resume() {
  const pathname = usePathname()

  return (
    <Layout>
      <NavBar>
        <NavBrand>Portfolio</NavBrand>
        <NavLinks>
          <NavLinkItem href="/" label="Home" isActive={pathname === '/'} />
          <NavLinkItem href="/about" label="About Me" isActive={pathname === '/about'} />
          <NavLinkItem href="/resume" label="Resume" isActive={pathname === '/resume'} />
          <NavLinkItem href="/trips" label="Trips" isActive={pathname === '/trips'} />
          <NavLinkItem href="/blogs" label="Blogs" isActive={pathname === '/blogs'} />
          <NavLinkItem href="/recipe" label="Recipe" isActive={pathname === '/recipe'} />
        </NavLinks>
      </NavBar>

      <MainContent>
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="p-8 shadow-lg border-0 bg-gradient-to-br from-blue-50/80 via-white/90 to-zinc-100/80 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
            <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 tracking-tight">Resume</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Senior Frontend Developer passionate about building beautiful, performant, and accessible web experiences.</p>
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M6 9V2h9v7"/><rect x="2" y="9" width="20" height="13" rx="2"/><path d="M9 22V12h6v10"/></svg>
                  Experience
                </h2>
                <div className="space-y-6">
                  <div className="bg-white/80 dark:bg-zinc-800/80 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Senior Frontend Developer</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tech Company | 2020 - Present</p>
                    <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                      <li>Led development of scalable React applications</li>
                      <li>Implemented modern frontend patterns and best practices</li>
                      <li>Mentored junior developers and improved team workflow</li>
                    </ul>
                  </div>
                  <div className="bg-white/80 dark:bg-zinc-800/80 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-zinc-700">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Frontend Engineer</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Digital Agency | 2015 - 2020</p>
                    <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                      <li>Designed and implemented responsive web interfaces</li>
                      <li>Collaborated with cross-functional teams for client projects</li>
                      <li>Optimized sites for accessibility and performance</li>
                    </ul>
                  </div>
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'Web Performance', 'Accessibility'].map((skill) => (
                    <span key={skill} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M4 17v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Education
                </h2>
                <div className="bg-white/80 dark:bg-zinc-800/80 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Bachelor of Science in Computer Science</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">University of Technology</p>
                </div>
              </section>
            </div>
            <div className="flex justify-end mt-10">
              <Link href="/">
                <Button variant="outline" className="px-6 py-2 text-base">
                  ← Back Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </MainContent>
    </Layout>
  )
}
