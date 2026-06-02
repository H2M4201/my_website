import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'
import { getAllBlogs } from '@/lib/api'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function Blogs() {
  const blogs = await getAllBlogs()

  return (
    <Layout>
      <MainContent>
        <div className="space-y-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Blog Articles</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Read thoughtful essays on frontend design, performance, and accessibility.
            </p>
          </div>

          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{blog.title}</h2>
                    <p className="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mt-2">{blog.description ? blog.description.substring(0, 50) : 'Untitled'}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{blog.description || 'No description available'}</p>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                >
                  Read Article
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
