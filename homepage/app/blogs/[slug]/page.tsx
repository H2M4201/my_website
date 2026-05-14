

import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'

const blogs = [
  {
    slug: 'modern-frontend-patterns',
    title: 'Modern Frontend Patterns',
    date: 'May 2024',
    intro: 'A practical guide to composition, hooks, and maintainable UI architecture in React projects.',
    content: [
      'Use small, reusable components to keep interfaces flexible and maintainable.',
      'Favor composition over inheritance and build UI patterns with clear responsibilities.',
      'Combine animation and accessibility to create polished experiences that feel natural.',
    ],
    takeaway: 'A solid frontend system is built from reusable primitives, clear state flow, and thoughtful UX decisions.',
  },
  {
    slug: 'performance-optimization-tips',
    title: 'Performance Optimization Tips',
    date: 'April 2024',
    intro: 'Best practices for speeding up load times and improving page responsiveness on modern web apps.',
    content: [
      'Measure with real user metrics before optimizing and keep the experience data-driven.',
      'Use lazy loading, code splitting, and optimized assets to reduce initial page weight.',
      'Prioritize visible content and smooth interaction patterns for higher perceived speed.',
    ],
    takeaway: 'Performance is part of design. Fast interactions, clear feedback, and efficient rendering make products feel premium.',
  },
  {
    slug: 'accessibility-in-web-design',
    title: 'Accessibility in Web Design',
    date: 'March 2024',
    intro: 'How to build inclusive interfaces that work for everyone while maintaining strong visual design.',
    content: [
      'Use semantic markup and focus states to support keyboard and screen reader users.',
      'Choose contrast, spacing, and motion responsibly for comfort and clarity.',
      'Design content hierarchies that are easy to scan and understand at a glance.',
    ],
    takeaway: 'Inclusive design improves every experience and makes your interface stronger for all users.',
  },
]

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }))
}

interface BlogPageProps {
  params: {
    slug: string
  }
}

export default function BlogDetail({ params: { slug } }: BlogPageProps) {
  const article = blogs.find((item) => item.slug === slug)

  if (!article) {
    return (
      <Layout>
        <MainContent>
          <div className="max-w-3xl mx-auto text-center py-24">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Article not found</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">The article you are searching for does not exist.</p>
            <Link href="/blogs" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Back to Blog
            </Link>
          </div>
        </MainContent>
      </Layout>
    )
  }

  return (
    <Layout>
      <MainContent>
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="rounded-[2rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 shadow-2xl px-8 py-10">
            <div className="flex flex-col gap-3">
              <span className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Blog</span>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white">{article.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">{article.intro}</p>
              <span className="text-sm text-slate-500 dark:text-slate-400">Published {article.date}</span>
            </div>
          </header>

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <article className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Key ideas</h2>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                {article.content.map((item) => (
                  <li key={item} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">{item}</li>
                ))}
              </ul>
              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <h3 className="text-xl font-semibold mb-3">Main takeaway</h3>
                <p className="leading-relaxed text-slate-100">{article.takeaway}</p>
              </div>
            </article>

            <aside className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Why this matters</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  These patterns ensure that frontend development scales gracefully while remaining usable, delightful, and performant.
                </p>
              </div>
              <Link
                href="/blogs"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
              >
                Back to Blog
              </Link>
            </aside>
          </div>
        </div>
      </MainContent>
    </Layout>
  )
}
