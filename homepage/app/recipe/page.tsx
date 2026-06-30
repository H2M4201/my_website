import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'
import { getAllRecipes } from '@/app/api/endpoints'

export const dynamic = 'force-dynamic'

export default async function Recipe() {
  const recipes = await getAllRecipes()

  return (
    <Layout>
      <MainContent>
        <div className="space-y-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Recipes</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Browse a collection of recipes that blend modern cooking with approachable techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="group bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{recipe.name}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{recipe.description || 'No description available'}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Recipe</span>
                  <Link
                    href={`/recipe/${recipe.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
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
