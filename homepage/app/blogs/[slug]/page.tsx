

import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'
import { getAllBlogs, getBlogById } from '@/lib/api'

export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs()
    return blogs.map((blog) => ({ slug: String(blog.id) }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

interface BlogPageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetail({ params: { slug } }: BlogPageProps) {
  try {
    const blogId = parseInt(slug, 10)
    if (isNaN(blogId)) {
      throw new Error('Invalid blog ID')
    }
    
    const blog = await getBlogById(blogId)

    if (!blog) {
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

    const contentLines = blog.content?.split('\n').filter((line) => line.trim()) || []

    return (
      <Layout>
        <MainContent>
          <div className="max-w-5xl mx-auto space-y-10">
            <header className="rounded-[2rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 shadow-2xl px-8 py-10">
              <div className="flex flex-col gap-6">
                <Link href="/blogs" className="self-start">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                  >
                    Back to Blog
                  </button>
                </Link>

                <div className="flex flex-col gap-3">
                  <span className="text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Blog</span>
                  <h1 className="text-5xl font-bold text-slate-900 dark:text-white">{blog.title}</h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">{blog.description || 'No description'}</p>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Published {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </header>

            <article className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
              {contentLines.length > 0 ? (
                <>
                  <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Content</h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-300">
                    {contentLines.map((line, idx) => (
                      <p key={idx} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">No content available for this article.</p>
              )}
            </article>
          </div>
        </MainContent>
      </Layout>
    )
  } catch (error) {
    console.error('Error loading blog:', error)
    return (
      <Layout>
        <MainContent>
          <div className="max-w-3xl mx-auto text-center py-24">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Error loading article</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">There was an error loading this article.</p>
            <Link href="/blogs" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Back to Blog
            </Link>
          </div>
        </MainContent>
      </Layout>
    )
  }
}
