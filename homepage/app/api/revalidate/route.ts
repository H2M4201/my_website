import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook endpoint called by the backend after admin CRUD operations.
 * Revalidates the Next.js ISR cache so homepage reflects changes in real time.
 *
 * Backend sends: POST /api/revalidate with JSON body { secret, tag }
 *   - secret: shared secret (must match REVALIDATION_SECRET env var)
 *   - tag: cache tag to revalidate (e.g. 'sections', 'contacts', 'blogs', 'trips', 'recipes')
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, tag } = body

    // Verify the shared secret
    const expectedSecret = process.env.REVALIDATION_SECRET
    if (!expectedSecret) {
      console.warn('[Revalidate] REVALIDATION_SECRET not configured, skipping check')
    } else if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!tag) {
      return NextResponse.json(
        { error: 'Missing tag parameter' },
        { status: 400 }
      )
    }

    console.log(`[Revalidate] Revalidating tag: "${tag}"`)
    revalidateTag(tag)
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, tag })
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}