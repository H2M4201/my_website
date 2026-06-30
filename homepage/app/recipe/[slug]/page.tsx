import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'
import { getRecipeById } from '@/app/api/endpoints'

export const dynamic = 'force-dynamic'

interface RecipePageProps {
  params: {
    slug: string
  }
}

interface ParsedIngredient {
  name: string
  amount: string
}

export default async function RecipeDetail({ params: { slug } }: RecipePageProps) {
  try {
    const recipeId = parseInt(slug, 10)
    if (isNaN(recipeId)) {
      throw new Error('Invalid recipe ID')
    }

    const recipe = await getRecipeById(recipeId)

    if (!recipe) {
      return (
        <Layout>
          <MainContent>
            <div className="max-w-3xl mx-auto text-center py-24">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Recipe not found</h1>
              <p className="text-slate-600 dark:text-slate-300 mb-6">This recipe does not exist yet.</p>
              <Link href="/recipe" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Back to Recipes
              </Link>
            </div>
          </MainContent>
        </Layout>
      )
    }

    let parsedIngredients: ParsedIngredient[] = []
    if (recipe.ingredients) {
      try {
        parsedIngredients = JSON.parse(recipe.ingredients)
      } catch {
        parsedIngredients = []
      }
    }

    return (
      <Layout>
        <MainContent>
          <div className="max-w-6xl mx-auto space-y-10">
            <section className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-600 via-slate-900 to-purple-700 text-white p-10 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200 mb-4">Recipe</p>
              <h1 className="text-5xl font-semibold mb-4">{recipe.name}</h1>
              <p className="text-lg text-slate-200 max-w-3xl">{recipe.description || ''}</p>
            </section>

            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-5">Instructions</h2>
                {recipe.steps ? (
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none prose-li:marker:text-slate-600 dark:prose-li:marker:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: recipe.steps }}
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">No instructions available for this recipe.</p>
                )}
              </article>

              <aside className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Ingredients</h3>
                {parsedIngredients.length > 0 ? (
                  <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                    {parsedIngredients.map((item, index) => (
                      <li key={index} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">
                        <span className="font-semibold text-slate-900 dark:text-white">{item.amount}</span> {item.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">No ingredients listed.</p>
                )}
                <Link
                  href="/recipe"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                >
                  Back to Recipes
                </Link>
              </aside>
            </div>
          </div>
        </MainContent>
      </Layout>
    )
  } catch (error) {
    console.error('Error loading recipe:', error)
    return (
      <Layout>
        <MainContent>
          <div className="max-w-3xl mx-auto text-center py-24">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Error loading recipe</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">There was an error loading this recipe.</p>
            <Link href="/recipe" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Back to Recipes
            </Link>
          </div>
        </MainContent>
      </Layout>
    )
  }
}
