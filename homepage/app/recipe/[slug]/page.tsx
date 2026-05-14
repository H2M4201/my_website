

import Link from 'next/link'
import { Layout, MainContent } from '@/components/Layout'

const recipes = [
  {
    slug: 'homemade-pasta',
    title: 'Homemade Pasta',
    cuisine: 'Italian',
    prep: '30 mins',
    servings: '4 servings',
    intro: 'Classic pasta made from scratch, featuring a simple sauce and fresh ingredients.',
    ingredients: [
      '250g all-purpose flour',
      '2 large eggs',
      '1 tbsp olive oil',
      '1/2 tsp salt',
      '2 cups tomato sauce',
      'Fresh basil leaves',
    ],
    steps: [
      'Combine flour and salt, then create a well in the center.',
      'Crack eggs into the well, add olive oil, and mix until dough forms.',
      'Knead dough for 10 minutes, then rest for 30 minutes.',
      'Roll out pasta sheets and cut into desired shapes.',
      'Cook pasta in boiling salted water until al dente, then toss with sauce.',
    ],
  },
  {
    slug: 'thai-green-curry',
    title: 'Thai Green Curry',
    cuisine: 'Thai',
    prep: '20 mins',
    servings: '4 servings',
    intro: 'A fragrant and spicy curry with coconut milk, fresh herbs, and bold flavor.',
    ingredients: [
      '2 tbsp green curry paste',
      '1 can coconut milk',
      '300g chicken breast or tofu',
      '1 cup eggplant, chopped',
      '1/2 cup Thai basil',
      '1 tbsp fish sauce',
    ],
    steps: [
      'Sauté curry paste in oil until fragrant.',
      'Add coconut milk and simmer gently.',
      'Stir in protein and vegetables, cook until tender.',
      'Season with fish sauce, sugar, and lime juice.',
      'Garnish with Thai basil and serve with jasmine rice.',
    ],
  },
  {
    slug: 'chocolate-mousse',
    title: 'Chocolate Mousse',
    cuisine: 'French',
    prep: '15 mins',
    servings: '6 servings',
    intro: 'A rich yet airy dessert that is surprisingly simple and elegant.',
    ingredients: [
      '200g dark chocolate',
      '4 eggs, separated',
      '1/4 cup sugar',
      '1 cup heavy cream',
      '1 tsp vanilla extract',
      'Pinch of salt',
    ],
    steps: [
      'Melt chocolate gently over a double boiler.',
      'Whip egg whites to stiff peaks with sugar.',
      'Beat cream until soft peaks form.',
      'Fold egg yolks and vanilla into chocolate, then fold in cream and egg whites.',
      'Chill for at least 2 hours before serving.',
    ],
  },
]

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }))
}

interface RecipePageProps {
  params: {
    slug: string
  }
}

export default function RecipeDetail({ params: { slug } }: RecipePageProps) {
  const recipe = recipes.find((item) => item.slug === slug)

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

  return (
    <Layout>
      <MainContent>
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-600 via-slate-900 to-purple-700 text-white p-10 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200 mb-4">Recipe</p>
            <h1 className="text-5xl font-semibold mb-4">{recipe.title}</h1>
            <p className="text-lg text-slate-200 max-w-3xl">{recipe.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/85">
              <span className="rounded-full bg-white/10 px-4 py-2">{recipe.cuisine}</span>
              <span className="rounded-full bg-white/10 px-4 py-2">{recipe.prep}</span>
              <span className="rounded-full bg-white/10 px-4 py-2">{recipe.servings}</span>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-5">Instructions</h2>
              <ol className="space-y-4 text-slate-600 dark:text-slate-300 list-decimal list-inside">
                {recipe.steps.map((step, index) => (
                  <li key={step} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">Step {index + 1}:</span> {step}
                  </li>
                ))}
              </ol>
            </article>

            <aside className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl dark:border-slate-700/80 dark:bg-zinc-950">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Ingredients</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                {recipe.ingredients.map((item) => (
                  <li key={item} className="rounded-2xl bg-slate-50 dark:bg-zinc-900 p-4 shadow-sm">{item}</li>
                ))}
              </ul>
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
}
